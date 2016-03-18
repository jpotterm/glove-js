function ParallaxList(options) {
    this.proxyThis();

    var defaultOptions = {
        items: []
    };

    options = $.extend(defaultOptions, options);

    this.items = options.items;

    window.addEventListener('scroll', this.scroll);
}

ParallaxList.prototype.proxyThis = function() {
    this.scroll = $.proxy(this.scroll, this);
};

ParallaxList.prototype.scroll = function(e) {
    for (var i = 0; i < this.items.length; ++i) {
        this.items[i].position();
    }
};

ParallaxList.prototype.refresh = function(e) {
    for (var i = 0; i < this.items.length; ++i) {
        this.items[i].toAbsolute();
    }
};


// Options:
//     element: DOM Node to be animated
//     vars: GSAP values to be animated
//     anchor: DOM Node to which startOffset and endOffset are relative
//     startAnchorOffsetPixel: Start animation when reaching this point
//     startAnchorOffsetPercent: Start animation when reaching this point
//     startWindowOffsetPercent: Start animation when reaching this point
//     endAnchorOffsetPixel: End animation when reaching this point
//     endAnchorOffsetPercent: End animation when reaching this point
//     endWindowOffsetPercent: End animation when reaching this point
//     reverseDirection: Animate from vars instead of to them
//     tweenProgress: Whether to animate between parallax states (useful to smooth mouse wheel)
//     cacheLayout: Only calculate window and anchor dimensions once versus every frame
function ParallaxItem(options) {
    var defaultOptions = {
        tweenProgress: true,
        reverseDirection: false,
        cacheLayout: true,
        startAnchorOffsetPixel: 0,
        startAnchorOffsetPercent: 0,
        startWindowOffsetPercent: 0,
        endAnchorOffsetPixel: 0,
        endAnchorOffsetPercent: 0,
        endWindowOffsetPercent: 0,
    }

    options = $.extend(defaultOptions, options);

    var defaultVars = {
        ease: Linear.easeNone
    }

    var vars = $.extend(defaultVars, options.vars);

    this.anchor = options.anchor;
    this.reverseDirection = options.reverseDirection;

    this.startAnchorOffsetPixel = options.startAnchorOffsetPixel;
    this.startAnchorOffsetPercent = options.startAnchorOffsetPercent;
    this.startWindowOffsetPercent = options.startWindowOffsetPercent;
    this.endAnchorOffsetPixel = options.endAnchorOffsetPixel;
    this.endAnchorOffsetPercent = options.endAnchorOffsetPercent;
    this.endWindowOffsetPercent = options.endWindowOffsetPercent;

    this.toAbsolute();

    this.tweenProgress = options.tweenProgress;
    this.timeline = new TimelineLite();

    if (this.reverseDirection) {
        this.timeline.from(options.element, 1, vars);
    } else {
        this.timeline.to(options.element, 1, vars);
    }
    this.timeline.pause();
    this.timeline.progress(this.getProgress());
}

ParallaxItem.prototype.toAbsolute = function() {
    var rect = this.anchor.getBoundingClientRect();

    var startAnchorOffset = calcOffset(rect.top, rect.bottom, this.startAnchorOffsetPixel, this.startAnchorOffsetPercent);
    var startWindowOffset = window.innerHeight * this.startWindowOffsetPercent;
    this.absoluteStart = startAnchorOffset - startWindowOffset + window.pageYOffset;

    var endAnchorOffset = calcOffset(rect.top, rect.bottom, this.endAnchorOffsetPixel, this.endAnchorOffsetPercent);
    var endWindowOffset = window.innerHeight * this.endWindowOffsetPercent;
    this.absoluteEnd = endAnchorOffset - endWindowOffset + window.pageYOffset;
}

ParallaxItem.prototype.getProgress = function() {
    if (!this.cacheLayout) {
        this.toAbsolute();
    }

    var scrollY = window.pageYOffset;

    // Garbage in, garbage out
    if (this.absoluteEnd < this.absoluteStart) return;

    if (scrollY < this.absoluteStart) {
        var progress = 0;
    } else if (scrollY > this.absoluteEnd) {
        var progress = 1;
    } else {
        var progress = (scrollY - this.absoluteStart) / (this.absoluteEnd - this.absoluteStart);
    }

    return progress;
};

ParallaxItem.prototype.position = function() {
    var progress = this.getProgress();

    if (this.tweenProgress) {
        TweenLite.to(this.timeline, 0.2, {progress: progress, ease: Circ.easeOut});
    } else {
        this.timeline.progress(progress);
    }
}


function calcOffset(top_, bottom, offsetPixel, offsetPercent) {
    return (bottom - top_) * offsetPercent + top_ + offsetPixel;
}
