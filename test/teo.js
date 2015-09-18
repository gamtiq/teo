"use strict";
/*global chai, describe, it, window*/

// Tests for teo
describe("teo", function() {
    var bSymbol = typeof Symbol === "function",
        smallList = [0, "", true, "ret"],
        numList = [1, 2, 3, 4, 5, 6, 89, 3, 5, 41],
        strList = ["a", "b", "JS", "aa", "cde", "java", "perl", "js", "Python"],
        personList = [
            {name: "Adam", age: 27, married: true, children: 1},
            {name: "Eva", age: 23, married: true, children: 1},
            {name: "Carl", age: 59, married: true, children: 3},
            {name: "Daniel", age: 17, married: false, children: 0},
            {name: "Gloria", age: 28, married: false, children: 1},
            {name: "Viola", age: 35, married: true, children: 4},
            {name: "Leonardo", age: 61, married: false, children: 1},
            {name: "Patricia", age: 44, married: false, children: 2}
        ],
        expect, teo, undef;
    
    // node
    if (typeof chai === "undefined") {
        teo = require("../src/teo.js");
        expect = require("./lib/chai").expect;
    }
    // browser
    else {
        teo = window.teo;
        expect = chai.expect;
    }
    
    
    describe(".isObject(obj)", function() {
        var isObject = teo.isObject;
        it("should return true", function() {
            /*jshint expr:true*/
            expect( isObject({}) )
                .be["true"];
            expect( isObject({a: 1, time: new Date()}) )
                .be["true"];
            /*jshint ignore:start*/
            expect( isObject(new Object()) )
                .be["true"];
            /*jshint ignore:end*/
            expect( isObject(teo) )
                .be["true"];
        });
        it("should return false", function() {
            /*jshint expr:true*/
            expect( isObject(1) )
                .be["false"];
            expect( isObject(true) )
                .be["false"];
            expect( isObject(false) )
                .be["false"];
            expect( isObject("") )
                .be["false"];
            expect( isObject("some chars") )
                .be["false"];
            expect( isObject([]) )
                .be["false"];
            expect( isObject(["a", 1, new Date()]) )
                .be["false"];
            expect( isObject(new Object("string")) )
                .be["false"];
            expect( isObject(new Object(345)) )
                .be["false"];
            expect( isObject(new Object(true)) )
                .be["false"];
            expect( isObject(new Date()) )
                .be["false"];
            expect( isObject(function() {}) )
                .be["false"];
        });
    });

    
    describe(".isEmpty", function() {
        var isEmpty = teo.isEmpty;
        
        describe("isEmpty(obj)", function() {
            /*jshint expr:true*/
            it("should return true", function() {
                expect( isEmpty({}) )
                    .be["true"];
                expect( isEmpty(new Date()) )
                    .be["true"];
            });
            it("should return false", function() {
                var d = new Date(),
                    f = function() {};
                d.created = new Date().getTime();
                f.toString = function() {
                    return "something beautiful";
                };
                
                expect( isEmpty({a: 1}) )
                    .be["false"];
                expect( isEmpty(teo) )
                    .be["false"];
                expect( isEmpty(d) )
                    .be["false"];
                expect( isEmpty(f) )
                    .be["false"];
            });
            
            if (bSymbol) {
                it("should return false for an object with symbol property keys", function() {
                    var obj = {};
                    obj[Symbol("a")] = Symbol("b");
                    
                    expect( isEmpty(obj) )
                        .be["false"];
                });
            }
        });
        
        describe("isEmpty(obj, true)", function() {
            /*jshint expr:true*/
            it("should return true", function() {
                expect( isEmpty({}, true) )
                    .be["true"];
                expect( isEmpty(new Date(), true) )
                    .be["true"];
            });
            
            if (bSymbol) {
                it("should return true for an object with symbol property keys", function() {
                    var obj = {};
                    obj[Symbol("a")] = Symbol("b");
                    
                    expect( isEmpty(obj, true) )
                        .be["true"];
                });
            }
            
            it("should return false", function() {
                expect( isEmpty({some: "value", key: "field", n: null}, true) )
                    .be["false"];
                expect( isEmpty(teo, true) )
                    .be["false"];
            });
        });
    });
    
    
    describe(".test", function() {
        function isEmpty(value) {
            /*jshint laxbreak:true*/
            var sType = typeof value;
            return value && (sType === "object" || sType === "function")
                    ? ("length" in value ? value.length === 0 : teo.isEmpty(value))
                    : true;
        }
        
        function getSize(obj) {
            var nI = 0,
                sKey;
            for (sKey in obj) {
                nI++;
            }
            return nI;
        }
        
        function isSizeMore(obj, num) {
            return getSize(obj) > num;
        }
        
        var test = teo.test,
            testData = {
                a: 1,
                b: {
                    c: 3,
                    d: "hello",
                    e: teo,
                },
                f: null,
                g: test,
                h: false
            };
        
        describe("test(obj, 'true')", function() {
            it("should return true", function() {
                expect( test(1, "true") )
                    .equal(true);
                expect( test("a", "true") )
                    .equal(true);
                expect( test("true", "true") )
                    .equal(true);
                expect( test({}, "true") )
                    .equal(true);
                expect( test(new Date(), "true") )
                    .equal(true);
                expect( test([], "true") )
                    .equal(true);
            });
            
            it("should return false", function() {
                expect( test(0, "true") )
                    .equal(false);
                expect( test(null, "true") )
                    .equal(false);
                expect( test(undef, "true") )
                    .equal(false);
                expect( test("", "true") )
                    .equal(false);
                expect( test(NaN, "true") )
                    .equal(false);
            });
        });
        
        describe("test(obj, 'false')", function() {
            it("should return true", function() {
                expect( test("", "false") )
                    .equal(true);
                expect( test(null, "false") )
                    .equal(true);
                expect( test(undef, "false") )
                    .equal(true);
                expect( test(0, "false") )
                    .equal(true);
                expect( test(NaN, "false") )
                    .equal(true);
            });
            
            it("should return false", function() {
                expect( test(1, "false") )
                    .equal(false);
                expect( test({}, "false") )
                    .equal(false);
                expect( test(testData, "false") )
                    .equal(false);
                expect( test("abc", "false") )
                    .equal(false);
                expect( test("false", "false") )
                    .equal(false);
                expect( test(" ", "false") )
                    .equal(false);
            });
        });
        
        describe("test(obj, 'some string')", function() {
            it("should return true", function() {
                expect( test("", "") )
                    .equal(true);
                expect( test(1, "1") )
                    .equal(true);
                expect( test(" ", " ") )
                    .equal(true);
                expect( test({}, "[object Object]") )
                    .equal(true);
                expect( test({toString: function() {return "abc";}}, "abc") )
                    .equal(true);
                expect( test("-a-", "-a-") )
                    .equal(true);
                expect( test(true, "true") )
                    .equal(true);
                expect( test(false, "false") )
                    .equal(true);
            });
            
            it("should return false", function() {
                expect( test(null, "null") )
                    .equal(false);
                expect( test(undef, "undefined") )
                    .equal(false);
                expect( test(NaN, "NaN") )
                    .equal(false);
                expect( test(" ", "") )
                    .equal(false);
                expect( test("astra", "astro") )
                    .equal(false);
            });
        });
        
        describe("test(obj, function(obj) {...})", function() {
            it("should return true", function() {
                expect( Boolean( test(testData, getSize) ) )
                    .equal(true);
                expect( test({}, teo.isEmpty) )
                    .equal(true);
                expect( test(testData, teo.isObject) )
                    .equal(true);
                expect( test(testData.b, teo.isObject) )
                    .equal(true);
                
                expect( test({}, isEmpty) )
                    .equal(true);
                expect( test({length: 0}, isEmpty) )
                    .equal(true);
                expect( test([], isEmpty) )
                    .equal(true);
                expect( test(null, isEmpty) )
                    .equal(true);
                expect( test(undef, isEmpty) )
                    .equal(true);
                expect( test("", isEmpty) )
                    .equal(true);
                expect( test("abc", isEmpty) )
                    .equal(true);
                expect( test(100, isEmpty) )
                    .equal(true);
                expect( test(true, isEmpty) )
                    .equal(true);
                expect( test(false, isEmpty) )
                    .equal(true);
                expect( test(function() {}, isEmpty) )
                    .equal(true);
            });
            
            it("should return false", function() {
                expect( test(testData, teo.isEmpty) )
                    .equal(false);
                expect( Boolean( test({}, getSize) ) )
                    .equal(false);
                expect( test(testData.a, teo.isObject) )
                    .equal(false);
                expect( test(testData["some unknown field"], teo.isObject) )
                    .equal(false);
                
                expect( test({a: 1}, isEmpty) )
                    .equal(false);
                expect( test({length: 5}, isEmpty) )
                    .equal(false);
                expect( test(["here"], isEmpty) )
                    .equal(false);
                expect( test(teo, isEmpty) )
                    .equal(false);
            });
        });
        
        describe("test(obj, array)", function() {
            var obj = {
                a: 10,
                retTrue: function(obj) {
                    return (obj || this).a > 0;
                },
                retFalse: function(obj) {
                    return (obj || this).a < 1;
                },
                isMore: function(value) {
                    return this.a > value;
                },
                isLess: function(value) {
                    return this.a < value;
                }
            };
            
            it("should return true", function() {
                expect( test({}, [isEmpty]) )
                    .equal(true);
                expect( test(testData, [teo.isObject]) )
                    .equal(true);
                expect( Boolean( test(testData.b, [getSize]) ) )
                    .equal(true);
                expect( test(testData, [isSizeMore, null, 0]) )
                    .equal(true);
                expect( test(obj, [isSizeMore, undef, 4]) )
                    .equal(true);
                
                expect( test(obj, [obj.retTrue, obj]) )
                    .equal(true);
                expect( test(obj, [obj.retTrue, "object"]) )
                    .equal(true);
                expect( test({a: 0}, [obj.retFalse, {a: 0}]) )
                    .equal(true);
                expect( test(obj, [obj.isMore, "obj", 5]) )
                    .equal(true);
                expect( test(obj, [obj.isLess, "self", 123]) )
                    .equal(true);
            });
            
            it("should return false", function() {
                expect( test(obj, [isEmpty]) )
                    .equal(false);
                expect( test(isEmpty, [teo.isObject]) )
                    .equal(false);
                expect( Boolean( test({}, [getSize]) ) )
                    .equal(false);
                expect( test({}, [isSizeMore, null, 0]) )
                    .equal(false);
                expect( test(obj, [isSizeMore, undef, 10]) )
                    .equal(false);
                
                expect( test(obj, [obj.retFalse, obj]) )
                    .equal(false);
                expect( test(obj, [obj.retFalse, "object"]) )
                    .equal(false);
                expect( test({a: -1}, [obj.retTrue, {a: -1}]) )
                    .equal(false);
                expect( test(obj, [obj.isMore, "obj", 123]) )
                    .equal(false);
                expect( test(obj, [obj.isLess, "self", 3]) )
                    .equal(false);
            });
        });
        
        describe("test(obj, objFilter)", function() {
            var obj = {
                a: 1,
                b: "b",
                c: null
            };
            
            it("should return true", function() {
                expect( test({}, {}) )
                    .equal(true);
                expect( test(testData, testData) )
                    .equal(true);
                expect( test(teo, teo) )
                    .equal(true);
                expect( test(testData.b, testData.b) )
                    .equal(true);
                
                expect( test(obj, {c: null, a: 1, b: "b"}) )
                    .equal(true);
                expect( test(obj, {a: 1, b: "b"}) )
                    .equal(true);
                expect( test(obj, {a: 1}) )
                    .equal(true);
                expect( test(obj, {c: null}) )
                    .equal(true);
                expect( test(obj, {}) )
                    .equal(true);
            });
            
            it("should return false", function() {
                expect( test({}, {a: 1}) )
                    .equal(false);
                expect( test(testData, {"unknown": "field"}) )
                    .equal(false);
                expect( test(teo, testData) )
                    .equal(false);
                
                expect( test(obj, {c: undef, a: 1, b: "b"}) )
                    .equal(false);
                expect( test(obj, {a: 1, b: "b", c: null, d: undef}) )
                    .equal(false);
                expect( test(obj, {a: 1, b: ""}) )
                    .equal(false);
                expect( test(obj, {a: 2}) )
                    .equal(false);
                expect( test(obj, {c: null, f: 2}) )
                    .equal(false);
            });
        });
        
        describe("test(value, scalarValue)", function() {
            var obj = {
                valueOf: function() {
                    return "777";
                }
            };
            
            it("should return true", function() {
                expect( test(null, undef) )
                    .equal(true);
                expect( test(undef, null) )
                    .equal(true);
                expect( test(1, 1) )
                    .equal(true);
                expect( test(Number.MAX_VALUE, Number.MAX_VALUE) )
                    .equal(true);
                expect( test(Number.MIN_VALUE, Number.MIN_VALUE) )
                    .equal(true);
                expect( test("", "") )
                    .equal(true);
                expect( test("abc", "abc") )
                    .equal(true);
                expect( test(" a ", " a ") )
                    .equal(true);
                expect( test(true, true) )
                    .equal(true);
                expect( test(false, false) )
                    .equal(true);
                expect( test("0", 0) )
                    .equal(true);
                expect( test(0, "0") )
                    .equal(true);
                expect( test("100", 100) )
                    .equal(true);
                expect( test(100, "100") )
                    .equal(true);
                expect( test(true, 1) )
                    .equal(true);
                expect( test(true, "1") )
                    .equal(true);
                expect( test(1, true) )
                    .equal(true);
                expect( test("1", true) )
                    .equal(true);
                expect( test(false, 0) )
                    .equal(true);
                expect( test(false, "0") )
                    .equal(true);
                expect( test(0, false) )
                    .equal(true);
                expect( test("0", false) )
                    .equal(true);
                expect( test(obj, "777") )
                    .equal(true);
                expect( test(obj, 777) )
                    .equal(true);
            });
            
            it("should return false", function() {
                expect( test({}, false) )
                    .equal(false);
                expect( test({}, true) )
                    .equal(false);
                expect( test(null, false) )
                    .equal(false);
                expect( test(null, true) )
                    .equal(false);
                expect( test(testData, null) )
                    .equal(false);
                expect( test(testData, "abc") )
                    .equal(false);
                expect( test(NaN, NaN) )
                    .equal(false);
                expect( test("a", "ab") )
                    .equal(false);
                expect( test("ab", "a") )
                    .equal(false);
                expect( test(obj, "obj") )
                    .equal(false);
                expect( test(obj, "7") )
                    .equal(false);
                expect( test(obj, 77) )
                    .equal(false);
                expect( test(obj, true) )
                    .equal(false);
                expect( test(obj, false) )
                    .equal(false);
                expect( test("true", true) )
                    .equal(false);
                expect( test("false", false) )
                    .equal(false);
            });
        });
    });
    
    
    describe(".filterList", function() {
        var filterList = teo.filterList,
            Bool = Boolean,
            fls = new Bool(false),
            obj = {ar: numList, s: "range", n: 5, f: null},
            ar = [
                  {a: 1, b: "c", c: "b", f: "", t: 6, n: 5}, 
                  numList, 
                  strList, 
                  fls, 
                  [0, 10, 2], 
                  obj, 
                  "query", 
                  9, 
                  true, 
                  new Date(), 
                  /[+\-]/
                  ];
        
        describe("filterList(list, filter)", function() {
            it("should return empty array", function() {
                expect( filterList(smallList, "a") )
                    .eql([]);
                expect( filterList(strList, "php") )
                    .eql([]);
                expect( filterList(numList, 10) )
                    .eql([]);
                expect( filterList(ar, function() {return false;}) )
                    .eql([]);
            });
            
            it("should return array's shallow copy", function() {
                expect( filterList([1, "a", {}], "true") )
                    .eql([1, "a", {}]);
                expect( filterList(["", null], "false") )
                    .eql(["", null]);
                expect( filterList(smallList, function() {return true;}) )
                    .eql(smallList);
            });
            
            it("should return array fractions", function() {
                expect( filterList(ar, {f: null, n: 5}) )
                    .eql([obj]);
                expect( filterList(ar, false) )
                    .eql([fls]);
                expect( filterList(numList, 5) )
                    .eql([5, 5]);
                expect( filterList(numList, 89) )
                    .eql([89]);
                expect( filterList(numList, function(n) {return n < 5;}) )
                    .eql([1, 2, 3, 4, 3]);
                expect( filterList(strList, "a") )
                    .eql(["a"]);
                expect( filterList(strList, "JS") )
                    .eql(["JS"]);
                expect( filterList(strList, function(s) {return s.length > 3;}) )
                    .eql(["java", "perl", "Python"]);
                expect( filterList(smallList, "true") )
                    .eql([true, "ret"]);
            });
        });
        
        describe("filterList(list, filter, settings)", function() {
            it("should return array of transformed items", function() {
                expect( filterList(strList, 
                                function(s) {return s.charAt(0).toLowerCase() === "p";},
                                {transform: function(s) {return "run " + s;}}) )
                    .eql(["run perl", "run Python"]);
                expect( filterList(numList, function(n) {return n > 10;}, {transform: String}) )
                    .eql(["89", "41"]);
                expect( filterList(numList, 
                                function(n) {return n < 6;}, 
                                {transform: function(n) {return n*n;}}) )
                    .eql([1, 4, 9, 16, 25, 9, 25]);
                expect( filterList(personList, 
                                function(person) {return person.age > 30;},
                                {transform: function(person) {return person.name;}}) )
                    .eql(["Carl", "Viola", "Leonardo", "Patricia"]);
            });
            
            it("should count proper items", function() {
                var settings = {count: true};
                expect( filterList(smallList, "false", settings) )
                    .equal(2);
                expect( filterList(strList, function(s) {return s.charAt(0).toLowerCase() === "j";}, settings) )
                    .equal(3);
                expect( filterList(numList, function(n) {return n >= 5;}, settings) )
                    .equal(5);
                expect( filterList(numList, function(n) {return n % 2 === 0;}, settings) )
                    .equal(3);
                expect( filterList(personList, function(person) {return person.married;}, settings) )
                    .equal(4);
            });
        });
    });
    
    describe(".findItemIndex(list, filter)", function() {
        var findItemIndex = teo.findItemIndex;
        
        it("should return -1", function() {
            expect( findItemIndex(numList, 75) )
                .equal(-1);
            expect( findItemIndex(smallList, new Date()) )
                .equal(-1);
            expect( findItemIndex(strList, "PHP") )
                .equal(-1);
            expect( findItemIndex(personList, {age: 100}) )
                .equal(-1);
            expect( findItemIndex(personList, {married: true, children: 5}) )
                .equal(-1);
            expect( findItemIndex(personList, 
                            function(person) {return person.married && person.age < 21;}) )
                .equal(-1);
        });
        
        it("should return index of the first found item", function() {
            expect( findItemIndex(numList, 5) )
                .equal(4);
            expect( findItemIndex(smallList, "true") )
                .equal(2);
            expect( findItemIndex(strList, function(s) {return s.indexOf("e") > -1;}) )
                .equal(4);
            expect( findItemIndex(personList, {age: 35}) )
                .equal(5);
            expect( findItemIndex(personList, {married: false}) )
                .equal(3);
            expect( findItemIndex(personList, {married: false, children: 1}) )
                .equal(4);
            expect( findItemIndex(personList, function(person) {return person.children > 2;}) )
                .equal(2);
        });
    });
    
    describe(".findItem(list, filter)", function() {
        var findItem = teo.findItem;
        
        it("should return undefined", function() {
            expect( findItem(numList, 100) )
                .equal(undef);
            expect( findItem(smallList, "ret 1") )
                .equal(undef);
            expect( findItem(strList, "lisp") )
                .equal(undef);
            expect( findItem(strList, "c") )
                .equal(undef);
            expect( findItem(strList, function(s) {return s.indexOf("z") >= 0;}) )
                .equal(undef);
            expect( findItem(personList, {name: "Kevin"}) )
                .equal(undef);
            expect( findItem(personList, {married: false, children: 3}) )
                .equal(undef);
            expect( findItem(personList, function(person) {return person.age < 15;}) )
                .equal(undef);
            expect( findItem(personList, function(person) {return person.name.indexOf("x") > -1;}) )
                .equal(undef);
        });
        
        it("should return the found item", function() {
            expect( findItem(numList, 4) )
                .equal(4);
            expect( findItem(numList, function(n) {return n > 10;}) )
                .equal(89);
            expect( findItem(smallList, "true") )
                .equal(true);
            expect( findItem(smallList, "false") )
                .equal(0);
            expect( findItem(strList, function(s) {return s.toLowerCase() === "js";}) )
                .equal("JS");
            expect( findItem(strList, function(s) {return s.length > 3;}) )
                .equal("java");
            expect( findItem(personList, {name: "Daniel"}) )
                .equal(personList[3]);
            expect( findItem(personList, {married: false, children: 1}) )
                .equal(personList[4]);
            expect( findItem(personList, function(person) {return person.age > 30 && ! person.married;}) )
                .equal(personList[6]);
            expect( findItem(personList, function(person) {return person.name.indexOf("ia") > -1;}) )
                .equal(personList[4]);
            expect( findItem(personList, function(person) {return person.children === 0;}) )
                .equal(personList[3]);
        });
    });
    
    
    describe(".map", function() {
        function toString(data) {
            var value = data.value;
            return typeof value === "function" ? "<function>" : String(value);
        }
        
        function change(data, value) {
            /*jshint laxbreak:true*/
            return arguments.length > 1 
                        ? value 
                        : (data.data === undef ? null : data.data);
        }
        
        function objFilter(data) {
            var value = data.value;
            return value === Object(value);
        }
        
        function scalarFilter(data) {
            var value = data.value;
            return value !== Object(value);
        }
        
        function numberFilter(data) {
            return typeof data.value === "number";
        }
        
        function stringFilter(data) {
            return typeof data.value === "string";
        }
        
        function excludeFieldFilter(data, field) {
            /*jshint laxbreak:true*/
            var exclude = arguments.length > 1
                            ? field
                            : data.data;
            if (! Array.isArray(exclude)) {
                exclude = [exclude];
            }
            return exclude.indexOf(data.field) === -1;
        }
        
        var map = teo.map,
            source = {
                a: 1,
                b: 2,
                c: {
                    d: 4,
                    e: ["a", 2],
                    f: {
                        g: null,
                        h: {}
                    }
                },
                s: "str",
                get: function(data) {
                    return this.a + "-" + toString(data);
                }
            },
            sourceGet = function(data) {
                return source.get(data);
            },
            changeToZero = function(data) {
                return change(data, 0);
            },
            changeToEmptyStr = function(data) {
                return change(data, "");
            };
        
        describe("map(source, action)", function() {
            it("should return object containing modified fields of source object", function() {
                expect( map({}, toString) )
                    .eql({});
                expect( map(source, toString) )
                    .eql({a: "1", b: "2", c: "[object Object]", get: "<function>", s: "str"});
                expect( map(source, sourceGet) )
                    .eql({a: "1-1", b: "1-2", c: "1-[object Object]", get: "1-<function>", s: "1-str"});
                expect( map({abc: "abc", next: "value"}, sourceGet) )
                    .eql({abc: "1-abc", next: "1-value"});
                expect( map({a: "delta", b: "pi"}, {a: "delta", execute: source.get}) )
                    .eql({a: "delta-delta", b: "delta-pi"});
                
                expect( map([1, "a", null], toString) )
                    .eql({0: "1", 1: "a", 2: "null"});
                expect( map([], toString) )
                    .eql({});
            });
        });
        
        describe("map(source, action, {data: value})", function() {
            it("should use given data for operation", function() {
                expect( map({f: 0, v: 1}, change, {data: "abc"}) )
                    .eql({f: "abc", v: "abc"});
                
                expect( map({a: {}, b: "---"}, change, {data: changeToZero}) )
                    .eql({a: changeToZero, b: changeToZero});
                
                expect( map(source, change, {data: 1}) )
                    .eql({a: 1, b: 1, c: 1, get: 1, s: 1});
            });
        });
        
        describe("map(source, action, {destination: obj})", function() {
            it("should save fields into destination object", function() {
                var dest;
                
                dest = {x: 8};
                expect( map({}, toString, {destination: dest}) )
                    .equal(dest);
                expect( dest )
                    .eql({x: 8});
                
                dest = {x: 8};
                expect( map({a: null, b: 3}, toString, {destination: dest}) )
                    .equal(dest);
                expect( dest )
                    .eql({x: 8, a: "null", b: "3"});
                
                dest = {x: 8};
                expect( map(source, toString, {destination: dest}) )
                    .equal(dest);
                expect( dest )
                    .eql({x: 8, a: "1", b: "2", c: "[object Object]", get: "<function>", s: "str"});
                
                dest = {x: 8};
                expect( map(source, sourceGet, {destination: dest}) )
                    .equal(dest);
                expect( dest )
                    .eql({x: 8, a: "1-1", b: "1-2", c: "1-[object Object]", get: "1-<function>", s: "1-str"});
            });
        });
        
        describe("map(source, action, {filter: filterValue})", function() {
            it("should change only those fields that satisfy filter", function() {
                expect( map({field: 1}, toString, {filter: stringFilter}) )
                    .eql({field: 1});
                expect( map({field: 1, u: undef}, toString, {filter: numberFilter}) )
                    .eql({field: "1", u: undef});
                
                expect( map(source, toString, {filter: scalarFilter}) )
                    .eql({a: "1", b: "2", c: source.c, get: source.get, s: "str"});
                
                expect( map(source, sourceGet, {filter: numberFilter}) )
                    .eql({a: "1-1", b: "1-2", c: source.c, get: source.get, s: "str"});
                expect( map(source, sourceGet, {filter: stringFilter}) )
                    .eql({a: 1, b: 2, c: source.c, get: source.get, s: "1-str"});
                
                expect( map(source, change, {filter: objFilter}) )
                    .eql({a: 1, b: 2, c: null, get: null, s: "str"});
                expect( map(source, changeToZero, {filter: scalarFilter}) )
                    .eql({a: 0, b: 0, c: source.c, get: source.get, s: 0});
                expect( map(source, changeToEmptyStr, {filter: numberFilter}) )
                    .eql({a: "", b: "", c: source.c, get: source.get, s: "str"});
                
                expect( map(source, sourceGet, {filter: {field: "s"}}) )
                    .eql({a: 1, b: 2, c: source.c, get: source.get, s: "1-str"});
            });
        });
        
        describe("map(source, action, {filter: filterValue, exclusionFilter: true})", function() {
            it("should include in result only those fields that satisfy filter", function() {
                expect( map({field: 1}, toString, {filter: stringFilter, exclusionFilter: true}) )
                    .eql({});
                expect( map({field: 1, date: new Date()}, toString, {filter: numberFilter, exclusionFilter: true}) )
                    .eql({field: "1"});
                
                expect( map(source, toString, {filter: scalarFilter, exclusionFilter: true}) )
                    .eql({a: "1", b: "2", s: "str"});
                
                expect( map(source, sourceGet, {filter: numberFilter, exclusionFilter: true}) )
                    .eql({a: "1-1", b: "1-2"});
                expect( map(source, sourceGet, {filter: stringFilter, exclusionFilter: true}) )
                    .eql({s: "1-str"});
                
                expect( map(source, change, {filter: objFilter, exclusionFilter: true}) )
                    .eql({c: null, get: null});
                expect( map(source, changeToZero, {filter: scalarFilter, exclusionFilter: true}) )
                    .eql({a: 0, b: 0, s: 0});
                expect( map(source, changeToEmptyStr, {filter: numberFilter, exclusionFilter: true}) )
                    .eql({a: "", b: ""});
                
                expect( map(source, change, {filter: stringFilter, exclusionFilter: true, data: change}) )
                    .eql({s: change});
            });
        });
        
        describe("map(source, action, {recursion: true})", function() {
            it("should recursively process fields that have object value", function() {
                expect( map({a: {b: 123}}, toString, {recursion: true}) )
                    .eql({
                            a: {
                                b: "123"
                            }
                        });
                
                expect( map(source, toString, {recursion: true}) )
                    .eql({
                            a: "1", 
                            b: "2", 
                            c: {
                                d: "4",
                                e: {
                                    0: "a", 
                                    1: "2"
                                },
                                f: {
                                    g: "null",
                                    h: {}
                                }
                            }, 
                            get: "<function>", 
                            s: "str"
                        });
                
                expect( map(source, toString, {recursion: true, filter: excludeFieldFilter, data: ["e", "b"]}) )
                    .eql({
                            a: "1", 
                            b: 2, 
                            c: {
                                d: "4",
                                e: ["a", 2],
                                f: {
                                    g: "null",
                                    h: {}
                                }
                            }, 
                            get: "<function>", 
                            s: "str"
                        });
                
                expect( map({a: toString, b: {c: source}, d: 9}, toString, {recursion: true, filter: excludeFieldFilter, data: ["a", "e", "g"]}) )
                    .eql({
                            a: toString,
                            b: {
                                c: {
                                    a: 1, 
                                    b: "2", 
                                    c: {
                                        d: "4",
                                        e: ["a", 2],
                                        f: {
                                            g: null,
                                            h: {}
                                        }
                                    }, 
                                    get: "<function>", 
                                    s: "str"
                                }
                            },
                            d: "9"
                        });
            });
        });
        
        describe("map(source, action, {recursion: true, passValueInRecursion: true})", function() {
            it("should recursively process fields that have object value and modify values of source object", function() {
                var obj1, obj2, result, subObj;
                
                obj1 = {b: ""};
                expect( map({a: obj1}, change, {recursion: true, passValueInRecursion: true, data: 4}) )
                    .eql(result = {a: obj1});
                expect( result.a )
                    .equal(obj1);
                expect( obj1 )
                    .eql({b: 4});
                
                obj1 = {f: null};
                subObj = {
                    d: "extra"
                };
                obj2 = {
                    a: 300,
                    c: "more",
                    obj: subObj
                };
                expect( map({a: obj1, b: obj2}, change, {recursion: true, passValueInRecursion: true, data: change, filter: [excludeFieldFilter, null, "c"]}) )
                    .eql(result = {a: obj1, b: obj2});
                expect( result.a )
                    .equal(obj1);
                expect( obj1 )
                    .eql({f: change});
                expect( result.b )
                    .equal(obj2);
                expect( obj2 )
                    .eql({a: change, c: "more", obj: subObj});
                expect( obj2.obj )
                    .equal(subObj);
                expect( subObj )
                    .eql({d: change});
            });
        });
        
        describe("map(source, action, {rename: renameMap})", function() {
            it("should change names of processed or copied fields in destination object", function() {
                var obj, result;
                
                expect( map({field: 1}, toString, {rename: {field: "result"}}) )
                    .eql({result: "1"});
                
                expect( map(source, toString, {rename: {c: "obj", b: "beta"}}) )
                    .eql({a: "1", beta: "2", obj: "[object Object]", get: "<function>", s: "str"});
                expect( source )
                    .contain.key("b");
                expect( source.b )
                    .equal(2);
                expect( source )
                    .contain.key("c");
                expect( source.c )
                    .a("object");
                
                expect( map(source, change, {recursion: true, rename: {s: "str", c: "complex", e: "ar", h: "last"}, data: "changed"}) )
                    .eql({
                            a: "changed", 
                            b: "changed", 
                            complex: {
                                d: "changed",
                                ar: {
                                    0: "changed",
                                    1: "changed"
                                },
                                f: {
                                    g: "changed",
                                    last: {}
                                }
                            }, 
                            get: "changed", 
                            str: "changed"
                        });
                
                obj = {
                    a: 3,
                    b: {
                        c: "value",
                        d: {
                            e: 2
                        }
                    }
                };
                expect( map(obj, change, {destination: obj, recursion: true, rename: {b: "obj", a: "astra", e: "last"}, filter: [excludeFieldFilter, null, ["e", "a"]]}) )
                    .eql({
                            a: 3,
                            obj: {
                                c: null,
                                d: {
                                    last: 2
                                }
                            }
                        });
                
                obj = {
                    a: 3,
                    b: {
                        c: "value",
                        d: {
                            e: 2
                        }
                    }
                };
                expect( map(obj, change, {recursion: true, passValueInRecursion: true, rename: {b: "obj", e: "last"}, filter: [excludeFieldFilter, null, "e"]}) )
                    .eql({
                            a: null,
                            obj: {
                                c: null,
                                d: {
                                    e: 2
                                }
                            }
                        });
                
                obj = {
                    a: 3,
                    b: {
                        c: "value",
                        d: {
                            e: 2
                        },
                        f: {
                            g: {
                                h: 1,
                                i: "zero"
                            }
                        }
                    }
                };
                result = map(obj,
                                change,
                                {
                                    destination: obj,
                                    recursion: true,
                                    passValueInRecursion: true,
                                    rename: {b: "obj", d: "d1", g: "sub"},
                                    filter: [excludeFieldFilter, null, ["c", "e", "f"]]
                                });
                expect( result )
                    .equal(obj);
                expect( result )
                    .eql({
                            a: null,
                            obj: {
                                c: "value",
                                d1: {
                                    e: 2
                                },
                                f: {
                                    g: {
                                        h: 1,
                                        i: "zero"
                                    }
                                }
                            }
                        });
            });
        });
        
        describe("map(source, action, settings)", function() {
            it("should return object containing processed fields of source object according to settings", function() {
                expect( map(source, changeToEmptyStr, {filter: [excludeFieldFilter, null, "c"], rename: {c: "skipped"}}) )
                    .eql({a: "", b: "", skipped: source.c, get: "", s: ""});
                
                expect( map(source, changeToZero, {recursion: true, filter: [excludeFieldFilter, null, ["e", "f", "d"]], rename: {d: "delta", g: "gamma"}}) )
                    .eql({
                            a: 0, 
                            b: 0, 
                            c: {
                                delta: 4,
                                e: ["a", 2],
                                f: {
                                    g: null,
                                    h: {}
                                }
                            }, 
                            get: 0, 
                            s: 0
                        });
                
                expect( map(source, change, {recursion: true, data: "data", filter: [excludeFieldFilter, null, ["g", "b", "e"]], rename: {b: 0, f: 100}}) )
                    .eql({
                            a: "data", 
                            0: 2, 
                            c: {
                                d: "data",
                                e: ["a", 2],
                                100: {
                                    g: null,
                                    h: {}
                                }
                            }, 
                            get: "data", 
                            s: "data"
                        });
                
                expect( map(source, change, 
                            {
                                recursion: true, 
                                data: sourceGet, 
                                filter: [excludeFieldFilter, null, ["g", "b", "e", "get"]], 
                                exclusionFilter: true, 
                                rename: {b: 0, f: "___", s: "data"}
                            }) )
                    .eql({
                            a: sourceGet, 
                            c: {
                                d: sourceGet,
                                ___: {
                                    h: {}
                                }
                            }, 
                            data: sourceGet
                        });
            });
        });
    });
    
});
