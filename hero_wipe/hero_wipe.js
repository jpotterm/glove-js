function HeroWipe(options) {
    this.bindThis();

    var defaultOptions = {
        dragThreshold: 0.15,
    };

    options = $.extend(defaultOptions, options);

    this.DIRECTION_NEXT = 1;
    this.DIRECTION_PREVIOUS = 2;

    this.parent = $(options.element)[0];
    this.$slides = $(this.parent).find('.hero-wipe__slide');
    this.duration = options.duration;
    this.dragThreshold = options.dragThreshold;

    this.parentHeight = this.parent.offsetHeight;
    this.activeIndex = 0;
    this.transitionInProgress = false;
    this.dragState = {
        inProgress: false,
        percent: 0,
        direction: this.DIRECTION_NEXT,
    };

    this.$slides[this.activeIndex].style.zIndex = 2;

    this.pager = new HeroWipePager({
        element: $(this.parent).find('.hero-wipe__pager'),
        count: this.$slides.length,
    });

    this.parent.addEventListener('wheel', this.wheel);
    this.drag = draggable(this.parent);
    this.drag.drag.subscribe(this.dragMove);
    this.drag.stop.subscribe(this.dragStop);
    this.pager.change.subscribe(this.goToSlide);
}

HeroWipe.prototype.bindThis = function() {
    this.wheel = this.wheel.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToSlide = this.goToSlide.bind(this);
    this.transitionComplete = this.transitionComplete.bind(this);
    this.recedeComplete = this.recedeComplete.bind(this);
    this.dragMove = this.dragMove.bind(this);
    this.dragStop = this.dragStop.bind(this);
};

HeroWipe.prototype.gsapDuration = function(pixels) {
    var ms = this.duration.m * pixels + this.duration.b;
    return ms / 1000;
};

HeroWipe.prototype.activeSlide = function() {
    return this.$slides[this.activeIndex];
};

HeroWipe.prototype.getSlide = function(i) {
    return this.$slides[i];
};

HeroWipe.prototype.hasSlide = function(i) {
    return i >= 0 && i < this.$slides.length;
};

HeroWipe.prototype.queueNext = function(i) {
    this.getSlide(i).style.zIndex = 1;
};

HeroWipe.prototype.queuePrevious = function(i) {
    var slide = this.getSlide(i);
    slide.style.zIndex = 3;
    slide.style.height = '0%';
};

HeroWipe.prototype.dequeueSlide = function(i) {
    var slide = this.getSlide(i);
    slide.style.removeProperty('z-index');
    slide.style.removeProperty('height');
    this.activeSlide().style.removeProperty('height');
};

HeroWipe.prototype.transitionNext = function(i) {
    this.transitionInProgress = true;
    var activeSlide = this.activeSlide();
    var duration = this.gsapDuration(activeSlide.offsetHeight);

    TweenLite.to(activeSlide, duration, {
        height: '0%',
        onComplete: this.transitionComplete,
        onCompleteParams: [this.getSlide(i), activeSlide, i],
    });
};

HeroWipe.prototype.transitionPrevious = function(i) {
    this.transitionInProgress = true;
    var previousSlide = this.getSlide(i);
    var duration = this.gsapDuration(this.parentHeight - previousSlide.offsetHeight);

    TweenLite.to(previousSlide, duration, {
        height: '100%',
        onComplete: this.transitionComplete,
        onCompleteParams: [previousSlide, this.activeSlide(), i],
    });
};

HeroWipe.prototype.recedeNext = function(i) {
    this.transitionInProgress = true;
    var activeSlide = this.activeSlide();
    var duration = this.gsapDuration(this.parentHeight - activeSlide.offsetHeight);

    TweenLite.to(activeSlide, duration, {
        height: '100%',
        onComplete: this.recedeComplete,
        onCompleteParams: [this.getSlide(i)],
    });
};

HeroWipe.prototype.recedePrevious = function(i) {
    this.transitionInProgress = true;
    var previousSlide = this.getSlide(i);
    var duration = this.gsapDuration(previousSlide.offsetHeight);

    TweenLite.to(previousSlide, duration, {
        height: '0%',
        onComplete: this.recedeComplete,
        onCompleteParams: [previousSlide],
    });
};

HeroWipe.prototype.recedeComplete = function(slide) {
    slide.style.removeProperty('z-index');
    slide.style.removeProperty('height');
    this.transitionInProgress = false;
};

HeroWipe.prototype.transitionComplete = function(newSlide, activeSlide, newIndex) {
    newSlide.style.zIndex = 2;

    activeSlide.style.removeProperty('z-index');
    activeSlide.style.removeProperty('height');

    this.activeIndex = newIndex;
    this.pager.goToPage(newIndex);
    this.transitionInProgress = false;
};

HeroWipe.prototype.wheel = function(e) {
    if (e.deltaY > 0) {
        if (this.hasSlide(this.activeIndex + 1)) {
            e.preventDefault();

            if (!this.transitionInProgress) {
                this.next();
            }
        }
    } else if (e.deltaY < 0) {
        if (window.scrollY === 0) {
            e.preventDefault();

            if (!this.transitionInProgress) {
                this.previous();
            }
        }
    }
};

HeroWipe.prototype.next = function() {
    if (!this.hasSlide(this.activeIndex + 1)) return;

    this.goToSlide(this.activeIndex + 1);
};

HeroWipe.prototype.previous = function() {
    if (!this.hasSlide(this.activeIndex - 1)) return;

    this.goToSlide(this.activeIndex - 1);
};

HeroWipe.prototype.goToSlide = function(i) {
    if (i === this.activeIndex) return;

    if (i > this.activeIndex) {
        this.queueNext(i);
        this.transitionNext(i);
    } else {
        this.queuePrevious(i);
        this.transitionPrevious(i);
    }
};

HeroWipe.prototype.dragMove = function(e) {
    if (e.y < 0) {
        if (this.hasSlide(this.activeIndex + 1)) {
            e.originalEvent.preventDefault();

            if (!this.transitionInProgress) {
                this.dragNext(Math.abs(e.y));
            }
        }
    } else {
        if (window.scrollY === 0) {
            e.originalEvent.preventDefault();

            if (!this.transitionInProgress) {
                this.dragPrevious(Math.abs(e.y));
            }
        }
    }
};

HeroWipe.prototype.dragNext = function(offset) {
    if (!this.hasSlide(this.activeIndex + 1)) return;

    if (this.dragState.inProgress && this.dragState.direction === this.DIRECTION_PREVIOUS) {
        this.dequeueSlide(this.activeIndex - 1);
    }

    if (!this.dragState.inProgress || this.dragState.direction === this.DIRECTION_PREVIOUS) {
        this.queueNext(this.activeIndex + 1);
    }

    var heightPercent = offset / this.parentHeight;

    this.dragState.inProgress = true;
    this.dragState.direction = this.DIRECTION_NEXT;
    this.dragState.percent = heightPercent;

    this.activeSlide().style.height = ((1 - heightPercent) * 100) + '%';
};

HeroWipe.prototype.dragPrevious = function(offset) {
    if (!this.hasSlide(this.activeIndex - 1)) return;

    if (this.dragState.inProgress && this.dragState.direction === this.DIRECTION_NEXT) {
        this.dequeueSlide(this.activeIndex + 1);
    }

    if (!this.dragState.inProgress || this.dragState.direction === this.DIRECTION_NEXT) {
        this.queuePrevious(this.activeIndex - 1);
    }

    var heightPercent = offset / this.parentHeight;

    this.dragState.inProgress = true;
    this.dragState.direction = this.DIRECTION_PREVIOUS;
    this.dragState.percent = heightPercent;

    this.getSlide(this.activeIndex - 1).style.height = (heightPercent * 100) + '%';
};

HeroWipe.prototype.dragStop = function() {
    if (!this.dragState.inProgress) return;

    if (this.dragState.direction === this.DIRECTION_NEXT) {
        this.dragStopNext();
    } else {
        this.dragStopPrevious();
    }

    this.dragState.inProgress = false;
};

HeroWipe.prototype.dragStopNext = function() {
    if (this.dragState.percent > this.dragThreshold) {
        this.transitionNext(this.activeIndex + 1);
    } else {
        this.recedeNext(this.activeIndex + 1);
    }
};

HeroWipe.prototype.dragStopPrevious = function() {
    if (this.dragState.percent > this.dragThreshold) {
        this.transitionPrevious(this.activeIndex - 1);
    } else {
        this.recedePrevious(this.activeIndex - 1);
    }
};
