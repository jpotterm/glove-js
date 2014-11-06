// -----------------------------------------------------------------------------
// Solves the problem of needing to animate an element and needing to remove it
// from the document flow (display: none) after animating. You can't
// animate the display property in CSS, so this pluging adds an animate-in class
// while the animation is going in and a display-none class when the animation
// is finished.
//
// Options
//     element: The DOM element that will be animating.
//     duration: Length of the animation in milliseconds.
//     className (optional): The class name to use while animating in.
//         Defaults to 'animate-in'.
//     initiallyIn (optional): Whether the element is shown when this plugin
//         is initiallized. Defaults to false.
// -----------------------------------------------------------------------------

function DisplayAnimation(options) {
    var defaultOptions = {
        className: 'animate-in',
        initiallyIn: false
    };

    options = $.extend(defaultOptions, options);

    this.element = $(options.element);
    this.className = options.className;
    this.duration = options.duration;
    this.stateIsIn = options.initiallyIn;
    this.timeout = null;

    if (this.stateIsIn) {
        this.element.addClass(this.className);
    } else {
        this.element.addClass('display-none');
    }
}

DisplayAnimation.prototype.isIn = function() {
    return this.stateIsIn;
}

DisplayAnimation.prototype.goIn = function() {
    if (this.stateIsIn) return;

    this.stateIsIn = true;
    clearTimeout(this.timeout);
    this.timeout = null;

    this.element.removeClass('display-none');
    this.element.width();
    this.element.addClass(this.className);
};

DisplayAnimation.prototype.goOut = function() {
    if (!this.stateIsIn) return;

    var self = this;
    this.stateIsIn = false;
    this.element.removeClass(this.className);

    if (this.timeout == null) {
        this.timeout = setTimeout(function() {
            self.element.addClass('display-none');
        }, this.duration);
    }
};
