
(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory(require, exports, module);
    }
    else if(typeof define === 'function' && define.amd) {
        define(['require', 'exports', 'module'], factory);
    }
    else {
        var req = function(id) {return root[id];},
            exp = root,
            mod = {exports: exp};
        root['teo'] = factory(req, exp, mod);
    }
}(this, function(require, exports, module) {
    /*
     * teo
     * https://github.com/gamtiq/teo
     *
     * Copyright (c) 2014 Denis Sikuler
     * Licensed under the MIT license.
     */


    /**
     * Functions to test/check objects.
     * 
     * @module teo
     */


    "use strict";

    /**
     * Check whether value is real object (not array nor function).
     * 
     * @param {Any} value
     *      The value to check.
     * @return {Boolean}
     *      `true`, when the value is real object, otherwise `false`.
     * @alias module:teo.isObject
     */
    function isObject(value) {
        return Object.prototype.toString.call(value) === "[object Object]";
    }

    /**
     * Check whether object do not contain any fields.
     * 
     * @param {Object} obj
     *      The object to check.
     * @return {Boolean}
     *      `true`, when the object do not contain any fields, otherwise `false`.
     * @alias module:teo.isEmpty
     */
    function isEmpty(obj) {
        /*jshint unused:false*/
        for (var sKey in obj) {
            return false;
        }
        return true;
    }

    /**
     * Check whether object conforms to specified condition/filter.
     * 
     * @param {Object} obj
     *      The object to check.
     * @param {Object | Function | Array | String} filter
     *      Specifies the test that should be executed over the object. Can be:
     *      
     *   * A string. Describes one of the following supported checks:
     *      - `true` - test for true value i.e. value of `Boolean(obj)` will be returned
     *      - `false` - test for false value i.e. value of `! Boolean(obj)` will be returned
     *      - otherwise test for `obj == filter`
     *   * A function. Will be called to check the object which will be passed as the parameter into the function. 
     *     Result of the function call will be returned (i.e. result of `filter(obj)`).
     *   * An array (containing at least two elements). Specifies a function (the first item of the array)
     *     that should be called to test the object, and a context (`this`, the second item of the array) for the function call.
     *     If the context is the string `self`, `obj` or `object`, the test object will be used as the context.
     *     Otherwise the test object will be passed into the function as the first parameter.
     *     When the array contains more than two items the additional elements will be passed into the function
     *     (after the test object).
     *   * An object. Specifies values that fields of the test object should have.
     *     I.e. the test object will be valid only when it has the same fields and values as the filter object.
     *   * Any other value/case. Test for `obj == filter`
     * @return {Any}
     *      `true` when the object conforms to the filter, otherwise `false`.
     *      When the filter corresponds to a function, the function value is returned.
     * @alias module:teo.test
     */
    function test(obj, filter) {
        /*jshint eqeqeq:false*/
        var sFilterType = typeof filter,
            context, value;
        if (sFilterType === "string") {
            switch (filter) {
                case "true":
                    return Boolean(obj);
                case "false":
                    return ! Boolean(obj);
                default:
                    return obj == filter;
            }
        }
        else if (sFilterType === "function") {
            return filter(obj);
        }
        else if (Array.isArray(filter) && typeof filter[0] === "function") {
            context = filter[1];
            if (context === "self" || context === "obj" || context === "object") {
                context = obj;
                value = [];
            }
            else {
                value = [obj];
            }
            return filter[0].apply(context, filter.length > 2 ? value.concat(filter.slice(2)) : value);
        }
        else if (isObject(filter) && obj && typeof obj === "object") {
            for (value in filter) {
                if (! (value in obj) || obj[value] !== filter[value]) {
                    return false;
                }
            }
        }
        else {
            return obj == filter;
        }
        return true;
    }


    // Exports

    module.exports = {
        isEmpty: isEmpty,
        isObject: isObject,
        test: test
    };

    return module.exports;
}));
