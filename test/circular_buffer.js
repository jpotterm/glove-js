var CircularBuffer = require('../circular_buffer.js');
var util = require('./util.js');

function testCopy() {
    var x = new CircularBuffer(5);
    x.push(1);

    var y = x.copy();
    y.set(0, 2);

    return ['copy', util.arrayEquals(x.toArray(), [1])];
}

function testNormalizeIndex() {
    var x = new CircularBuffer(5);

    return {
        'normalizeIndex:1': x.normalizeIndex(0, 2) === 0,
        'normalizeIndex:2': x.normalizeIndex(1, 2) === 1,
        'normalizeIndex:3': x.normalizeIndex(2, 2) === 0,
        'normalizeIndex:4': x.normalizeIndex(-1, 2) === 1,
        'normalizeIndex:5': x.normalizeIndex(-2, 2) === 0,
    };
}

function testGet() {
    var result = {};
    var x = new CircularBuffer(5);

    result['get:1'] = x.get(0) === null;

    x.push(1);
    x.push(2);
    x.push(3);

    result['get:2'] = x.get(0) === 1;
    result['get:3'] = x.get(1) === 2;
    result['get:4'] = x.get(3) === 1;
    result['get:5'] = x.get(-1) === 3;

    return result;
}

function testSet() {
    var result = {};
    var x = new CircularBuffer(5);
    x.set(0, 1);

    result['set:1'] = x.get(0) === null;

    x.push(1);
    x.push(2);
    x.push(3);

    x.set(0, 4);
    x.set(4, 5);
    x.set(-1, 6);

    result['set:2'] = x.get(0) === 4;
    result['set:3'] = x.get(1) === 5;
    result['set:4'] = x.get(2) === 6;

    return result;
}

function testPush() {
    var x = new CircularBuffer(5);
    x.push(1);
    x.push(2);
    x.push(3);
    x.push(4);
    x.push(5);
    x.push(6);

    return {
        'push': util.arrayEquals(x.toArray(), [2, 3, 4, 5, 6]),
    };
}

function testPushAll() {
    var x = new CircularBuffer(5);
    x.pushAll([1, 2, 3, 4, 5, 6]);

    return {
        'pushAll': util.arrayEquals(x.toArray(), [2, 3, 4, 5, 6]),
    };
}

function testPushLeft() {
    var x = new CircularBuffer(5);
    x.pushLeft(1);
    x.pushLeft(2);
    x.pushLeft(3);
    x.pushLeft(4);
    x.pushLeft(5);
    x.pushLeft(6);

    return {
        'pushLeft': util.arrayEquals(x.toArray(), [6, 5, 4, 3, 2]),
    };
}

function testPop() {
    var result = {};
    var x = new CircularBuffer(5);

    x.push(1);
    x.push(2);
    x.push(3);
    x.pop();

    result['pop:1'] = util.arrayEquals(x.toArray(), [1, 2]);

    x.pop();
    x.pop();
    x.pop();

    result['pop:2'] = util.arrayEquals(x.toArray(), []);

    return result;
}

function testPopLeft() {
    var result = {};
    var x = new CircularBuffer(5);

    x.push(1);
    x.push(2);
    x.push(3);
    x.popLeft();

    result['popLeft:1'] = util.arrayEquals(x.toArray(), [2, 3]);

    x.popLeft();
    x.popLeft();
    x.popLeft();

    result['popLeft:2'] = util.arrayEquals(x.toArray(), []);

    return result;
}

function testClear() {
    var x = new CircularBuffer(5);
    x.push(1);
    x.push(2);
    x.clear();

    return {
        'clear': util.arrayEquals(x.toArray(), []),
    };
}

function testIndexOf() {
    var x = new CircularBuffer(5);
    x.push(1);
    x.push(2);

    return {
        'indexOf:1': x.indexOf(1) === 0,
        'indexOf:2': x.indexOf(3) === null,
    };
}

function testRotateLeft() {
    var x = new CircularBuffer(5);
    x.push(1);
    x.push(2);
    x.push(3);

    var x1 = x.copy();
    x1.rotateLeft(1);

    var x2 = x.copy();
    x2.rotateLeft(2);

    x.push(4);
    x.push(5);
    x.push(6);

    var x3 = x.copy();
    x3.rotateLeft(2);

    var x4 = x.copy();
    x4.rotateLeft(-2);

    return {
        'rotateLeft:1': util.arrayEquals(x1.toArray(), [2, 3, 1]),
        'rotateLeft:2': util.arrayEquals(x2.toArray(), [3, 1, 2]),
        'rotateLeft:3': util.arrayEquals(x3.toArray(), [4, 5, 6, 2, 3]),
        'rotateLeft:4': util.arrayEquals(x4.toArray(), [5, 6, 2, 3, 4]),
    };
}

function testRotateRight() {
    var x = new CircularBuffer(5);
    x.push(1);
    x.push(2);
    x.push(3);

    var x1 = x.copy();
    x1.rotateRight(1);

    var x2 = x.copy();
    x2.rotateRight(2);

    x.push(4);
    x.push(5);
    x.push(6);

    var x3 = x.copy();
    x3.rotateRight(2);

    var x4 = x.copy();
    x4.rotateRight(-2);

    return {
        'rotateRight:1': util.arrayEquals(x1.toArray(), [3, 1, 2]),
        'rotateRight:2': util.arrayEquals(x2.toArray(), [2, 3, 1]),
        'rotateRight:3': util.arrayEquals(x3.toArray(), [5, 6, 2, 3, 4]),
        'rotateRight:4': util.arrayEquals(x4.toArray(), [4, 5, 6, 2, 3]),
    };
}

function testSlice() {
    var x = new CircularBuffer(5);
    x.push(1);
    x.push(2);
    x.push(3);

    var x1 = x.copy();
    x1.slice();

    var x2 = x.copy();
    x2.slice(1);

    var x3 = x.copy();
    x3.slice(1, 1);

    var x4 = x.copy();
    x4.slice(1, 4);

    var x5 = x.copy();
    x5.slice(-1);

    var x6 = x.copy();
    x6.slice(-2, -1);

    return {
        'slice:1': util.arrayEquals(x1.toArray(), [1, 2, 3]),
        'slice:2': util.arrayEquals(x2.toArray(), [2, 3]),
        'slice:3': util.arrayEquals(x3.toArray(), []),
        'slice:4': util.arrayEquals(x4.toArray(), [2, 3]),
        'slice:5': util.arrayEquals(x5.toArray(), [3]),
        'slice:6': util.arrayEquals(x6.toArray(), [2]),
    };
}

util.runTests([
    testCopy,
    testNormalizeIndex,
    testGet,
    testSet,
    testPush,
    testPushAll,
    testPushLeft,
    testPop,
    testPopLeft,
    testClear,
    testIndexOf,
    testRotateLeft,
    testRotateRight,
    testSlice,
]);

