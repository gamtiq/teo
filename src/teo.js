/*
 * teo
 * https://github.com/gamtiq/teo
 *
 * Copyright (c) 2014-2015 Denis Sikuler
 * Licensed under the MIT license.
 */


/**
 * Functions to test/check, filter and find objects.
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
 * @param {Boolean} [ignoreSymbolFields]
 *      Whether fields whose key is a Symbol value should be ignored.
 *      If `true`, the object will not be checked for presence of fields with symbol keys.
 *      `false` by default.
 * @return {Boolean}
 *      `true`, when the object do not contain any fields, otherwise `false`.
 * @alias module:teo.isEmpty
 */
function isEmpty(obj, ignoreSymbolFields) {
    /*jshint unused:false*/
    var getOwnPropertySymbols, getPrototypeOf, sKey;
    for (sKey in obj) {
        return false;
    }
    if (! ignoreSymbolFields && typeof (getOwnPropertySymbols = Object.getOwnPropertySymbols) === "function") {
        getPrototypeOf = Object.getPrototypeOf;
        do {
            if (getOwnPropertySymbols(obj).length) {
                return false;
            }
            obj = getPrototypeOf(obj);
        } while(obj);
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

/**
 * Form new array containing elements from the source array which conform to the given condition (filter)
 * or calculate quantity of such elements.
 * 
 * @param {Array} list
 *      Source array to be processed.
 * @param {Object | Function | Array | String} filter
 *      Check that should be made for each element in the source array (see {@link module:teo.test test} for details).
 * @param {Object} [settings]
 *      Operation settings. Keys are settings names, values are corresponding settings values.
 *     The following settings are supported:
 *     
 *   * `count` (`Boolean`; `false` by default) - if `true`, quantity of elements will be counted and returned as result.
 *   * `transform` (`Function`; `null` by default) - function that should be called to process elements of the source array
 *     that conform to the filter; value returned by the function will be included into the result array instead of source element.
 * @return {Array | Integer}
 *      Elements from the source array that conform to the filter or quantity of such elements.
 * @alias module:teo.filterList
 * @see {@link module:teo.test test}
 */
function filterList(list, filter, settings) {
    if (! settings) {
        settings = {};
    }
    var bCount = Boolean(settings.count),
        result = bCount ? 0 : [],
        transform = settings.transform,
        nI, nL, obj;
    for (nI = 0, nL = list.length; nI < nL; nI++) {
        obj = list[nI];
        if (test(obj, filter)) {
            if (bCount) {
                result++;
            }
            else {
                result.push(transform ? transform(obj) : obj);
            }
        }
    }
    return result;
}

/**
 * Return the index of the first element in the array that conforms to the given condition (filter).
 * 
 * @param {Array} list
 *      Array to be searched.
 * @param {Object | Function | Array | String} filter
 *      Check that should be used to find element (see {@link module:teo.test test} for details).
 * @return {Integer}
 *      The index of the first found element or -1 when the array does not contain any element
 *      that conforms to the given condition.
 * @alias module:teo.findItemIndex
 * @see {@link module:teo.test test}
 */
function findItemIndex(list, filter) {
    var nI = 0,
        nL = list.length;
    while (nI < nL) {
        if (test(list[nI], filter)) {
            return nI;
        }
        nI++;
    }
    return -1;
}

/**
 * Return the first element in the array that conforms to the given condition (filter).
 * 
 * @param {Array} list
 *      Array to be searched.
 * @param {Object | Function | Array | String} filter
 *      Check that should be used to find element (see {@link module:teo.test test} for details).
 * @return {Any}
 *      The first found element or `undefined` when the array does not contain any element
 *      that conforms to the given condition.
 * @alias module:teo.findItem
 * @see {@link module:teo.findItemIndex findItemIndex}
 */
function findItem(list, filter) {
    var nI = findItemIndex(list, filter),
        result;
    return nI > -1 ? list[nI] : result;
}

/**
 * Execute the specified action for fields of the object and return the object containing results of processing.
 * 
 * The object with the following fields is passed as parameter into action and filter functions:
 * 
 * * `data` (any type) - any data that are accessible during filtration or execution of action;
 *      see `data` setting below.
 * * `field` (`String`) - name of object's field that is being processed.
 * * `obj` (`Object`) - reference to the object that is being processed.
 * * `test` (`Boolean`) - specifies whether filtration or action is being executed;
 *      this field can be helpful if the same function is used for filtration and action.
 * * `value` (any type) - value of object's field that is being processed.
 * 
 * Result of the action's execution is used as new value of the processed field.
 * 
 * @param {Object} source
 *      The object that should be processed.
 * @param {Function | Object} action
 *      The action that should be executed for fields of the object.
 *      Can be a function or an object with `execute` method.
 * @param {Object} [settings]
 *     Operation settings. Keys are settings names, values are corresponding settings values.
 *     The following settings are supported:
 *     
 *   * `data` (any type; `undefined` by default) - any data that should be accessible during filtration or execution of action;
 *      value of this setting is used as the 'data' field of the object that is passed into the filtration and action function.
 *   * `destination` (`Object`; newly created object by default) - reference to the object into which results of fields processing
 *      should be saved;
 *   * `filter` (`Object`, `Function`, `Array` or `String`; `null` by default) - specifies which fields should be processed
 *      (see {@link module:teo.test test} for details); only fields for which {@link module:teo.test test} function returns
 *      true value will be processed; if this setting is not specified, all fields will be processed;
 *   * `exclusionFilter` (`Boolean`; `false` by default) - specifies whether fields not conforming to the filter
 *      (see `filter` setting) should be copied into the result object;
 *      true value of the setting specifies that such fields will not be copied into the result object;
 *   * `recursion` (`Boolean`; `false` by default) - specifies whether the function should be recursively applied to the fields
 *      whose values are objects; true value of the setting specifies that for processing of such fields this function is used
 *      instead of action;
 *   * `passValueInRecursion` (`Boolean`; `false` by default) - true value of the setting specifies that the object
 *      that is value of the processed field is used as the destination object (as value of `destination` setting) in recursive call;
 *   * `rename` (`Object`; `null` by default) - specifies which fields should be renamed during processing;
 *      fields are names of fields of the source object, their values are names of corresponding fields of the result object.
 * @return {Object}
 *      Result of source object's processing.
 * @alias module:teo.map
 * @see {@link module:teo.test test}
 */
function map(source, action, settings) {
    var bFuncAction = typeof action === "function",
        bChange, bExclusion, bNewDestin, bPassValueInRecursion, bRecursion, bRename, data, filter,
        param, recursionSettings, renameMap, result, sField, value;
    
    if (! settings) {
        settings = {};
    }
    data = settings.data;
    filter = settings.filter;
    bExclusion = Boolean(settings.exclusionFilter);
    bRecursion = Boolean(settings.recursion);
    bPassValueInRecursion = Boolean(settings.passValueInRecursion);
    if (bRecursion) {
        recursionSettings = {};
        for (sField in settings) {
            if (sField !== "destination") {
                recursionSettings[sField] = settings[sField];
            }
        }
    }
    renameMap = settings.rename || {};
    result = settings.destination || {};
    bNewDestin = source !== result;
    for (sField in source) {
        value = source[sField];
        param = {data: data, field: sField, value: value, obj: source, test: false};
        bChange = true;
        if (filter) {
            param.test = true;
            bChange = test(param, filter);
            param.test = false;
            // Go to the next field if the current field does not pass the filter
            if (! bChange && bExclusion) {
                continue;
            }
        }
        bRename = sField in renameMap;
        if (bChange) {
            if (bRecursion && typeof value === "object" && value !== null) {
                recursionSettings.destination = bPassValueInRecursion ? value : {};
                value = map(value, action, recursionSettings);
                bChange = ! bPassValueInRecursion || bRename;
            }
            else if (action) {
                value = bFuncAction ? action(param) : action.execute(param);
            }
        }
        if (bNewDestin || bChange) {
            result[ bRename ? renameMap[sField] : sField ] = value;
            // Delete the processed field if the field was renamed in the source object
            if (bRename && ! bNewDestin) {
                delete source[sField];
            }
        }
    }
    return result;
}


// Exports

module.exports = {
    filterList: filterList,
    findItem: findItem,
    findItemIndex: findItemIndex,
    isEmpty: isEmpty,
    isObject: isObject,
    map: map,
    test: test
};
