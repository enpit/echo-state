const assert = require('assert');
const StateStore = require('../index.js');

describe('Constructor function', function () {
	it('should return an object', function () {
		var store = StateStore();
		assert.equal(typeof store, 'object')
	});

	it('should return an object with a `create` method', function () {
		var store = StateStore();
		assert.equal(typeof store.create, 'function')
	});
});
