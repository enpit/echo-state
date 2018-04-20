var createStateHandler,
    StateStore;

/* this function replaces the "official" api call `Alexa.CreateStateHandler(state.name, state.handlers);` because the library function mutates the handlers object and at this point I am not sure, whether this might potentially cause issues. */
createStateHandler = function (state, obj = {}) {

    var target;

    target = Object.assign({}, obj);

    Object.defineProperty(target, 'STATE', {
        "value": state || ''
    });

    return target;

};

StateStore = function (separator = '->') {

    var addHandler,
        create,
        createState,
        createSubState,
        getHandlers,
        getState,
        getStates,
        states = {};

    create = function (...args) {

        var result;

        if (args.length === 3) {
            result = createSubState(...args);
        } else if (args.length === 2) {
            if (typeof args[1] === 'string') {
                result = createSubState(args[0], args[1], {});
            } else {
                result = createState(...args);
            }
        } else if (args.length === 1) {
            result = createState(args[0], {});
        }

        return result;
    };

    createState = function (name, handlers) {
        return createSubState(name, null, handlers);
    };

    createSubState = function (name, superstate, handlers) {

        var ssHandlers,
            ssName,
            ssObject,
            state = {};

        state.superstate = superstate;

        if (superstate === null) {

            state.name = name;
            state.handlers = Object.assign({}, handlers);

        } else {

            if (typeof superstate === 'string') {

                ssObject = getState(superstate);

                if (typeof ssObject === 'undefined') {
                    throw new Error('Superstate ' + superstate + ' does not exist.');
                }

                ssHandlers = ssObject.handlers;
                ssName = ssObject.name;
            } else if (typeof superstate === 'object') {
                ssHandlers = superstate.handlers;
                ssName = superstate.name;
            }

            state.name = ssName + separator + name;
            state.handlers = Object.assign({}, ssHandlers, handlers);
        
        }

        states[state.name] = state;

        state.handlers = createStateHandler(state.name, state.handlers);

        return state;

    };

    getState = function (name) {

        var matches = Object.keys(states).filter((state) => state.match(new RegExp(name + '$')));

        if (matches.length > 1) {
            throw new Error('Multiple states match the search string '
            + name
            + '. Unable to uniquely identify the correct state.');
        } else if (matches.length === 0) {
            throw new Error('No state matching the search string ' + name + '.');
        } else {
            return states[matches[0]];
        }

    };

    getStates = function () {
        return states;
    };

    addHandler = function (state, name, handler) {
        
        var localState;

        if (typeof state === 'string') {
            localState = states[state];
            localState.handlers[name] = handler;
        } else if (typeof state === 'object') {
            localState = states[state.name];
            if (typeof state.handlers === 'undefined') {
                localState.handlers = {};
            }
            localState.handlers[name] = handler;
        }

    };

    addHandlers = function (state, handlers) {
            
        for (var i in handlers) {
            addHandler(state, i, handlers[i]);
        }

    };

    getHandlers = function () {
        return Object.keys(states).map((key) => states[key].handlers);
    };

    return {
        create,
        createState,
        createSubState,
        getState,
        getStates,
        getHandlers,
        addHandler,
        addHandlers
    };

};

module.exports = StateStore;
