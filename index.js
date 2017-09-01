var CreateStateHandler = function (state, obj = {}){

    var target;

    target = Object.assign({}, obj);

    Object.defineProperty(target, 'STATE', {
        value: state || ''
    });

    return target;
};

var StateStore = function (separator = '->') {

    var states = {};

    var create = function (...args) {
        if (args.length === 3) {
            return createSubState(...args);
        } else if (args.length === 2) {
            if (typeof args[1] === 'string') {
                return createSubState(args[0], args[1], {});
            } else {
                return createState(...args);
            }
        } else if (args.length === 1) {
            return createState(args[0], {});
        }
    };

    var createState = function (name, handlers) {
        return createSubState(name, null, handlers);
    };

    var createSubState = function (name, superstate, handlers) {

        var state = {};
        state.superstate = superstate;

        if (superstate !== null) {

            var ss_handlers,
                ss_name;

            if (typeof superstate === 'string') {

                ss_object = getState(superstate);

                if (typeof ss_object === 'undefined') {
                    throw new Error('Superstate ' + superstate + ' does not exist.')
                }

                ss_handlers = ss_object.handlers;
                ss_name = ss_object.name;
            } else if (typeof superstate === 'object') {
                ss_handlers = superstate.handlers;
                ss_name = superstate.name;
            }

            state.name = ss_name + separator + name;
            state.handlers = Object.assign({}, ss_handlers, handlers);

        } else {
            
            state.name = name;
            state.handlers = Object.assign({}, handlers);

        }

        states[state.name] = state;

        state.handlers = CreateStateHandler(state.name, state.handlers); // this call replaces the "official" api call `Alexa.CreateStateHandler(state.name, state.handlers);` because the library function mutates the handlers object and at this point I am not sure, whether this might potentially cause issues.

        return state;

    };

    var getState = function (name) {

        var matches = Object.keys(states).filter( (state) => state.match(new RegExp(name + '$')) );

        if (matches.length > 1) {
            throw new Error('Multiple states match the search string ' + name + '. Unable to uniquely identify the correct state.');
        } else if (matches.length === 0) {
            throw new Error('No state matching the search string ' + name + '.');
        } else {
            return states[matches[0]];
        }

    };

    var getStates = function () {
        return states;
    };

    var addHandler = function (state, name, handler) {
        
        if (typeof state === 'string') {
            states[state].handlers[name] = handler;
        } else if (typeof state === 'object') {
            if (typeof state.handlers === 'undefined') {
                state.handlers = {};
            }
            state.handlers[name] = handler;
        }

    };

    var getHandlers = function (state) {
        return Object.keys(states).map( (k) => states[k].handlers );
    };

    return {
        create,
        createState,
        createSubState,
        getState,
        getStates,
        getHandlers,
        addHandler
    };

};

module.exports = StateStore;
