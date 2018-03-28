function Animation(duration, easing, callback) {
    this.duration = duration;
    this.easing = easing;
    this.callback = callback;

    this.startTime = undefined;
    this.requestId = undefined;

    this.boundFrame = this.frame.bind(this);
}

Animation.prototype.start = function() {
    this.requestId = window.requestAnimationFrame(this.boundFrame);
};

Animation.prototype.stop = function() {
    window.cancelAnimationFrame(this.requestId);
};

Animation.prototype.frame = function(currentTime) {
    if (this.startTime) {
        const progress = (currentTime - this.startTime) / this.duration;

        if (progress >= 1) {
            this.callback(1);
        } else {
            this.callback(this.easing(progress));
            this.requestId = window.requestAnimationFrame(this.boundFrame);
        }
    } else {
        this.startTime = currentTime;
        this.callback(0);
        this.requestId = window.requestAnimationFrame(this.boundFrame);
    }
};
