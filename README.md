# echo-state

This is a tiny library that contains some useful functionality when dealing with states in an Amazon Alexa skill.

## Installation

Since we did not bother to publish to npm yet, you have to run `npm install git+https://github.com/enpit/echo-state.git` and then you can `echostate = require('echo-state')`.

## Usage

```javascript

// create a new instance of the StateStore
var store = new StateStore();

// create a state and define an intent handler
var rootState = store.create('root', {

	HelpIntent: function () {
		// ...
	},
	Unhandled: function () {
		// ...
	}

});

// create a child state that inherits all handlers from the parent state
var childState = store.create('child', 'root', {

	// override the HelpIntent handler function
	HelpIntent: function () {
		// ...
	}

});
```

That's it basically. You can create a hierarchy of states and by default, states inherit handlers from their parents. That is useful because then you don't need to redefine basic intents again and again.

You can access states using `getState('root->child')` or `getState('child')` if there is only one state with that name. The search string is matched against the longest matching state "path". The `->` notation can be configured to be something else when instantiating the store with something like `new StateStore('.')`.

You also have to register the state handlers by calling `alexa.registerHandlers( ...(states.getHandlers()) );`.

## Contributing

If you feel like adding functionality or tests or suggestions to this library, feel free to do so!

## License

The MIT License (MIT)
Copyright © 2017 enpit GmbH & Co. KG
