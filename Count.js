// -----------------------------------------------------------------------------
// An animated counter that can be used to animate between two numbers.
//
// Options
//     element: The DOM element whose text will contain the animated number
//     duration (optional): The length of the animation in milliseconds. Defaults to 500 ms.
//     fpsCap (optional): The maximum frames per second to use for the animation. Less will
//         be used if sufficient. Defaults to 60 fps.
// -----------------------------------------------------------------------------

function Count(options) {
    this.proxyThis();

    this.defaultOptions = {
        duration: 500,
        fpsCap: 60
    };

    options = $.extend(this.defaultOptions, options);

    this.element = $(options.element);
    this.duration = options.duration;
    this.fpsCap = options.fpsCap;
    this.interval;
    this.current;
    this.stop;
    this.step;
}

Count.prototype.proxyThis = function() {
    this.next = $.proxy(this.next, this);
};

Count.prototype.countTo = function(n) {
    this.current = parseInt(this.element.text());
    this.stop = n;

    if (this.current == this.stop) {
        return;
    }

    if (this.interval != null) {
        clearInterval(this.interval);
        this.interval = null;
    }

    this.step = this.current < this.stop ? 1 : -1;
    var steps = Math.ceil((this.stop - this.current) / this.step);

    var intervalDuration;

    // Cap fps
    if (steps / this.duration > this.fpsCap / 1000) {
        steps = this.fpsCap * this.duration / 1000;
        this.step = Math.round((this.stop - this.current) / steps);
        intervalDuration = Math.round(1000 / this.fpsCap);
    } else {
        intervalDuration = Math.round(this.duration / steps);
    }

    this.interval = setInterval(this.next, intervalDuration);
};

Count.prototype.next = function() {
    this.current += this.step;

    if (this.current == this.stop ||
        (this.step > 0 && this.current > this.stop) ||
        (this.step < 0 && this.current < this.stop)) {

        clearInterval(this.interval);
        this.interval = null;
        this.current = this.stop;
    }

    this.element.text(this.current);
};
