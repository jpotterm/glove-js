const Easings = {
    linear: function(x) {
        return x;
    },
    inQuad: function(x) {
        return x * x;
    },
    outQuad: function(x) {
        return x * (2 - x);
    },
    inOutQuad: function(x) {
        return x < .5 ? 2 * x * x : -1 + (4 - 2 * x) * x;
    },
    inCubic: function(x) {
        return x * x * x;
    },
    outCubic: function(x) {
        return (--x) * x * x + 1;
    },
    inOutCubic: function(x) {
        return x < .5 ? 4 * x * x * x : (x - 1) * (2 * x - 2) * (2 * x - 2) + 1;
    },
    inQuart: function(x) {
        return x * x * x * x;
    },
    outQuart: function(x) {
        return 1 - (--x) * x * x * x;
    },
    inOutQuart: function(x) {
        return x < .5 ? 8 * x * x * x * x : 1 - 8 * (--x) * x * x * x;
    },
    inQuint: function(x) {
        return x * x * x * x * x;
    },
    outQuint: function(x) {
        return 1 + (--x) * x * x * x * x;
    },
    inOutQuint: function(x) {
        return x < .5 ? 16 * x * x * x * x * x : 1 + 16 * (--x) * x * x * x * x;
    },
    inSine: function(x) {
        return -1 * Math.cos(x / 1 * (Math.PI * 0.5)) + 1;
    },
    outSine: function(x) {
        return Math.sin(x / 1 * (Math.PI * 0.5));
    },
    inOutSine: function(x) {
        return -1 / 2 * (Math.cos(Math.PI * x) - 1);
    },
    inExpo: function(x) {
        return (x == 0) ? 0 : Math.pow(2, 10 * (x - 1));
    },
    outExpo: function(x) {
        return (x == 1) ? 1 : (-Math.pow(2, -10 * x) + 1);
    },
    inOutExpo: function(x) {
        if (x == 0) return 0;
        if (x == 1) return 1;
        if ((x /= 1 / 2) < 1) return 1 / 2 * Math.pow(2, 10 * (x - 1));
        return 1 / 2 * (-Math.pow(2, -10 * --x) + 2);
    },
    inCirc: function(x) {
        return -1 * (Math.sqrt(1 - x * x) - 1);
    },
    outCirc: function(x) {
        return Math.sqrt(1 - (x = x - 1) * x);
    },
    inOutCirc: function(x) {
        if ((x /= 1 / 2) < 1) return -1 / 2 * (Math.sqrt(1 - x * x) - 1);
        return 1 / 2 * (Math.sqrt(1 - (x -= 2) * x) + 1);
    },
};
