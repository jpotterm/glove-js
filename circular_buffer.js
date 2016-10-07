// -----------------------------------------------------------------------------
// A circular buffer implementation that works as described
// here: http://en.wikipedia.org/wiki/Circular_buffer
// -----------------------------------------------------------------------------

function CircularBuffer(limit) {
    this.array = [];
    this.limit = limit;
    this.length = 0;
    this.start = 0;
}

CircularBuffer.prototype.copy = function() {
    var result = new CircularBuffer(this.limit);
    result.array = this.array.slice();
    result.length = this.length;
    result.start = this.start;
    return result;
};

CircularBuffer.prototype.normalizeIndex = function(i, n) {
    return ((i % n) + n) % n;
};

CircularBuffer.prototype.realIndexLimit = function(i) {
    return this.normalizeIndex(this.start + i, this.limit);
};

CircularBuffer.prototype.realIndexLength = function(i) {
    return this.normalizeIndex(this.start + this.normalizeIndex(i, this.length), this.limit);
};

CircularBuffer.prototype.get = function(i) {
    if (this.length === 0) return null;

    return this.array[this.realIndexLength(i)];
};

CircularBuffer.prototype.set = function(i, value) {
    if (this.length === 0) return;

    this.array[this.realIndexLength(i)] = value;
};

CircularBuffer.prototype.push = function(x) {
    this.array[this.realIndexLimit(this.length)] = x;

    if (this.length === this.limit) {
        this.start = this.realIndexLimit(1);
    } else {
        this.length += 1;
    }
};

CircularBuffer.prototype.pushAll = function(xs) {
    for (var i = 0; i < xs.length; ++i) {
        this.push(xs[i]);
    }
};

CircularBuffer.prototype.pushLeft = function(x) {
    this.start = this.realIndexLimit(-1);

    if (this.length != this.limit) {
        this.length += 1;
    }

    this.array[this.start] = x;
};

CircularBuffer.prototype.pop = function() {
    if (this.length === 0) return null;

    var element = this.array[this.realIndexLength(-1)];

    this.length -= 1;

    return element;
};

CircularBuffer.prototype.popLeft = function() {
    if (this.length === 0) return null;

    var element = this.array[this.start];

    this.start = this.realIndexLimit(1);

    this.length -= 1;

    return element;
};

CircularBuffer.prototype.clear = function() {
    this.length = 0;
};

CircularBuffer.prototype.toArray = function() {
    var result = [];

    for (var i = 0; i < this.length; ++i) {
        result.push(this.get(i));
    }

    return result;
};

CircularBuffer.prototype.indexOf = function(x) {
    for (var i = 0; i < this.length; ++i) {
        if (this.get(i) === x) {
            return i;
        }
    }

    return null;
};

CircularBuffer.prototype.rotateLeft = function(n) {
    if (n === undefined) {
        n = 1;
    }

    if (n < 0) {
        return this.rotateRight(-n);
    }

    if (this.length === this.limit) {
        this.start = this.realIndexLength(n);
    } else {
        for (var i = 0; i < n; ++i) {
            this.push(this.popLeft());
        }
    }
};

CircularBuffer.prototype.rotateRight = function(n) {
    if (n === undefined) {
        n = 1;
    }

    if (n < 0) {
        return this.rotateLeft(-n);
    }

    if (this.length === this.limit) {
        this.start = this.realIndexLength(-n);
    } else {
        for (var i = 0; i < n; ++i) {
            this.pushLeft(this.pop());
        }
    }
};

CircularBuffer.prototype.slice = function(begin, end) {
    function normalizeIndex(index, length) {
        if (index < 0) {
            return Math.max(length + index, 0);
        } else if (index > length) {
            return length;
        } else {
            return index;
        }
    }

    if (begin === undefined) return;

    if (end === undefined) {
        end = this.length;
    }

    begin = normalizeIndex(begin, this.length);
    end = normalizeIndex(end, this.length);

    this.start = this.realIndexLimit(begin);
    this.length = end - begin;
};

if (typeof module === 'object' && module.exports) module.exports = CircularBuffer;
