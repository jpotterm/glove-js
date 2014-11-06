function HoverAnimation(options) {
    this.bindThis();

    this.element = $(options.element);
    this.inDuration = options.inDuration;
    this.outDuration = options.outDuration;

    this.animating = false;
    this.mouseOver = false;

    this.element.on('mouseenter', this.mouseEnter);
    this.element.on('mouseleave', this.mouseLeave);
}

HoverAnimation.prototype.bindThis = function() {
    this.mouseEnter = $.proxy(this.mouseEnter, this);
    this.mouseLeave = $.proxy(this.mouseLeave, this);
};

HoverAnimation.prototype.mouseEnter = function(e) {
    this.mouseOver = true;

    if (!this.animating) {
        this.animateToCorrectState();
    }
};

HoverAnimation.prototype.mouseLeave = function(e) {
    this.mouseOver = false;

    if (!this.animating) {
        this.animateToCorrectState();
    }
};

HoverAnimation.prototype.animateToCorrectState = function() {
    var self = this;

    if (this.mouseOver) {
        if (!this.element.hasClass('mouse-enter')) {
            this.element.removeClass('mouse-leave');
            this.element.addClass('mouse-enter');
            this.animating = true;

            setTimeout(function() {
                self.animating = false;
                self.animateToCorrectState();
            }, this.inDuration);
        }
    } else {
        if (!this.element.hasClass('mouse-leave')) {
            this.element.removeClass('mouse-enter');
            this.element.addClass('mouse-leave');
            this.animating = true;

            setTimeout(function() {
                self.animating = false;
                self.animateToCorrectState();
            }, this.outDuration);
        }
    }
};
