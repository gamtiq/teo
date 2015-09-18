# teo

Functions to test/check, filter, find and process objects.

[![NPM version](https://badge.fury.io/js/teo.png)](http://badge.fury.io/js/teo)
[![Build Status](https://secure.travis-ci.org/gamtiq/teo.png?branch=master)](http://travis-ci.org/gamtiq/teo)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## Installation

### Node

    npm install teo

### [Component](https://github.com/component/component)

    component install gamtiq/teo

### [Jam](http://jamjs.org)

    jam install teo

### [Bower](http://bower.io)

    bower install teo

### [JSPM](http://jspm.io)

    jspm install teo

### [SPM](http://spmjs.io)

    spm install teo

### AMD, &lt;script&gt;

Use `dist/teo.js` or `dist/teo.min.js` (minified version).

## Usage

### Node, Component, JSPM, SPM

```js
var teo = require("teo");
```

### [Duo](http://duojs.org)

```js
var teo = require("gamtiq/teo");
...
```

### Jam

```js
require(["teo"], function(teo) {
    ...
});
```

### JSPM

```js
System.import("teo").then(function(teo) {
    ...
});
```

### AMD

```js
define(["path/to/dist/teo.js"], function(teo) {
    ...
});
```

### Bower, &lt;script&gt;

```html

<!-- Use bower_components/teo/dist/teo.js if the library was installed by Bower -->

<script type="text/javascript" src="path/to/dist/teo.js"></script>
<script type="text/javascript">
    // teo is available via teo field of window object
    ...
</script>
```

### Examples

```js
teo.isObject(teo);   // true
teo.isObject(null);   // false
teo.isObject([]);   // false

teo.isEmpty(teo);   // false
teo.isEmpty([], true);   // true

var obj = {};
obj[Symbol("a")] = null;
teo.isEmpty(obj);   // false
teo.isEmpty(obj, true);   // true

teo.test({}, "true");   // true
teo.test({}, {});   // true
teo.test({a: 1}, {a: 2});   // false
teo.test({a: 1, b: 2, c: 3, d: 4}, {c: 3, a: 1});   // true

teo.test(1, teo.isObject);   // false
teo.test("", false);   // true

var personList = [
    {name: "Adam", age: 27, married: true, children: 1},
    {name: "Eva", age: 23, married: true, children: 1},
    {name: "Carl", age: 59, married: true, children: 3},
    {name: "Daniel", age: 17, married: false, children: 0},
    {name: "Gloria", age: 28, married: false, children: 1},
    {name: "Viola", age: 35, married: true, children: 4},
    {name: "Leonardo", age: 61, married: false, children: 1},
    {name: "Patricia", age: 44, married: false, children: 2}
];

teo.filterList([0, "", true, "ret"], "true");   // [true, "ret"]
teo.filterList([3, -4, 2, 10, 7, -9, 5], function(n) {return n >= 3;}, {count: true});   // 4
teo.filterList(personList,
                function(person) {return person.age > 30;},
                {transform: function(person) {return person.name;}});   // ["Carl", "Viola", "Leonardo", "Patricia"]
                            
teo.findItemIndex(personList, {married: false, children: 1});   // 4
teo.findItem(personList, function(person) {return person.age > 30 && ! person.married;});   // {name: "Leonardo", age: 61, married: false, children: 1}

teo.map({a: 1, b: 2, c: null, d: "delta", e: null, f: undefined},
        function(context) {return false;},
        {filter: {value: null}});          // {a: 1, b: 2, c: false, d: "delta", e: false, f: undefined}


function convert(context) {
    var value = context.value,
        bNoValue = value == null,
        sType = typeof value;
    if (context.test) {
        return bNoValue || sType === "object" || (sType === "string" && /^-?\d+$/.test(value));
    }
    else {
        return bNoValue
                ? 0
                : Number(value);
    }
}

teo.map({
            a: "abc",
            b: "25",
            c: {
                d: null,
                e: "eclipse",
                f: {
                    g: undefined,
                    h: "-59",
                    i: "JS 2015"
                }
            }
        },
        convert,
        {filter: convert, recursion: true});
// returns
// {
//      a: "abc",
//      b: 25,
//      c: {
//          d: 0,
//          e: "eclipse",
//          f: {
//              g: 0,
//              h: -59,
//              i: "JS 2015"
//          }
//      }
//  }
```

See tests for additional examples.

## API

### isObject(value): Boolean

Check whether value is real object (not array nor function).

### isEmpty(obj: Object, [ignoreSymbolFields: Boolean]): Boolean

Check whether object do not contain any fields.

### test(obj: Object, filter: Object | Function | Array | String): Boolean

Check whether object conforms to specified condition/filter.

### filterList(list: Array, filter: Object | Function | Array | String, [settings: Object]): Array | Integer

Form new array containing elements from the source array which conform to the given condition (filter)
or calculate quantity of such elements.

### findItemIndex(list: Array, filter: Object | Function | Array | String): Integer

Return the index of the first element in the array that conforms to the given condition (filter).

### findItem(list: Array, filter: Object | Function | Array | String): Any

Return the first element in the array that conforms to the given condition (filter).

### map(source: Object, action: Function | Object, [settings: Object]): Object

Execute the specified action for fields of the object and return the object containing results of processing.

See `doc` folder for details.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.
Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014-2015 Denis Sikuler  
Licensed under the MIT license.
