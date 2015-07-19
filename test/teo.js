"use strict";
/*global chai, describe, it, window*/

// Tests for teo
describe("teo", function() {
    var smallList = [0, "", true, "ret"],
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

    
    describe(".isEmpty(obj)", function() {
        /*jshint expr:true*/
        var isEmpty = teo.isEmpty;
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
    
});
