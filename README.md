# echo-state

This is a tiny library that contains some useful functionality when dealing with states in an Amazon Alexa skill.

## Installation

Since we did not bother to publish to npm, you have to run 

- `npm install git+https://github.com/enpit/echo-state.git`
- and then you can `require('echo-state')`.

## Usage

```javascript

// create a new instance of the StateStore
var store = new StateStore();

// create a state and define intent handlers
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

That's it basically. You can create a hierarchy of states and by default, states inherit handlers from their parents.

**You still have to register the state handlers by calling `alexa.registerHandlers( ...(store.getHandlers()) );`.**

You can access states using `getState('root->child')` or `getState('child')` if there is only one state with that name. The search string is matched against the longest matching state "path". The `->` notation can be configured to be something else when instantiating the store with something like `new StateStore('.')`.

To add handlers to an existing state, you can call a state's `addHandler` method:

```javascript
store.getState('mystate').addHandler({
	Unhandled: function () {
		// ...
	}
});
```

## Contributing

*If you feel like adding functionality or tests or suggestions to this library, feel free to do so! 🙂*

For your implemented features, send us a PR, for requests and discussions, open up an issue. We are happy to answer questions, listen to feedback and talk about suggestions for additional features.

## License

The MIT License (MIT)
Copyright © 2017 enpit GmbH & Co. KG
