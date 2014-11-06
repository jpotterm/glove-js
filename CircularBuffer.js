// -----------------------------------------------------------------------------
// A circular buffer implementation that works as described here: http://en.wikipedia.org/wiki/Circular_buffer
// -----------------------------------------------------------------------------

function CircularBuffer(limit) {
    this.array = [];
    this.limit = limit;
    this.length = 0;
    this.start = 0;
}

CircularBuffer.prototype.increment = function(x) {
    return (x + 1) % this.limit;
}

CircularBuffer.prototype.decrement = function(x) {
    if (x == 0) return this.limit;
    else return x - 1;
}

CircularBuffer.prototype.get = function(i) {
    return this.array[(this.start + i) % this.limit];
};

CircularBuffer.prototype.appendAll = function(xs) {
    for (var i = 0; i < xs.length; ++i) {
        this.append(xs[i]);
    }
};

CircularBuffer.prototype.append = function(x) {
    this.array[(this.start + this.length) % this.limit] = x;

    if (this.length == this.limit) {
        this.start = this.increment(this.start);
    } else {
        this.length += 1;
    }
};

CircularBuffer.prototype.appendleft = function(x) {
    this.start = this.decrement(this.start);

    if (this.length != this.limit) {
        this.length += 1;
    }

    this.array[this.start] = x;
};

CircularBuffer.prototype.pop = function() {
    if (this.length == 0) return;

    var element = this.array[(this.start + this.length - 1) % this.limit];

    this.length -= 1;

    return element;
};

CircularBuffer.prototype.popleft = function() {
    if (this.length == 0) return;

    var element = this.array[this.start];

    this.start = this.increment(this.start);

    this.length -= 1;

    return element;
};

CircularBuffer.prototype.clear = function() {
    this.length = 0;
};

CircularBuffer.prototype.toString = function() {
    var s = '[';

    for (var i = 0; i < this.length; ++i) {
        if (i != 0) {
            s += ',';
        }

        s += this.get(i);
    }

    s += ']';

    return s;
};


CircularBuffer.prototype.indexOf = function(x) {
    for (var i = 0; i < this.length; ++i) {
        if (this.get(i) == x) {
            return i;
        }
    }

    return null;
};

CircularBuffer.prototype.rotateLeft = function(n) {
    if (n == undefined) {
        n = 1;
    }

    this.start = (this.start + n) % this.limit;
};

CircularBuffer.prototype.rotateRight = function(n) {
    if (n == undefined) {
        n = 1;
    }

    this.start = (this.start + this.length - (n % this.limit)) % this.limit;
};

