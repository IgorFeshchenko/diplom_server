"use strict";
/*!
 * not-type-of - not.js
 * Copyright(c) 2016 LnsooXD <LnsooXD@gmail.com>
 * MIT Licensed
 */

var is = require('is-type-of');
var apis = [
	'array',
	'boolean',
	'null',
	'nullOrUndefined',
	'number',
	'string',
	'symbol',
	'undefined',
	'regExp',
	'object',
	'date',
	'error',
	'function',
	'primitive',
	'buffer',
	'stream',
	'readableStream',
	'writableStream',
	'duplexStream',
	'class',
	'finite',
	'NaN',
	'generator',
	'generatorFunction',
	'promise',
	'int',
	'double',
	'int32',
	'long',
	'Long'
];

exports = module.exports = {};

var len = apis.length;
var api;
for (var i = 0; i < len; i++) {
	api = apis[i];
	exports[api] = not(is[api]);
}

function not(fn) {
	return function () {
		return !fn.apply(is, arguments);
	}
}
