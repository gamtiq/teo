"use strict";
/*global chai, describe, it, window*/

// Tests for teo
describe("teo", function() {
    var expect, teo, undef;
    
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
});
