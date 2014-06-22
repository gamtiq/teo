# teo

Functions to test/check objects.

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

### AMD, &lt;script&gt;

Use `dist/teo.js` or `dist/teo.min.js` (minified version).

## Usage

### Node, Component

```js
var teo = require("teo");
```

### Jam

```js
require(["teo"], function(teo) {
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
teo.isEmpty([]);   // true

teo.test({}, "true");   // true
teo.test({}, {});   // true
teo.test({a: 1}, {a: 2});   // false
teo.test({a: 1, b: 2, c: 3, d: 4}, {c: 3, a: 1});   // true

teo.test(1, teo.isObject);   // false
teo.test("", false);   // true
```

See tests for additional examples.

## API

### isObject(value): Boolean

Check whether value is real object (not array nor function).

### isEmpty(obj: Object): Boolean

Check whether object do not contain any fields.

### test(obj: Object, filter: Object | Function | Array | String): Boolean

Check whether object conforms to specified condition/filter.

See `doc` folder for details.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality.
Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 Denis Sikuler  
Licensed under the MIT license.
