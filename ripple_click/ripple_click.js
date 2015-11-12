// -----------------------------------------------------------------------------
// Adds ripples to elements.
//
// Options
//     element: The DOM element that will have ripples.
//     duration (optional): Duration of the ripple in seconds. Defaults to 0.8.
//     easing (optional): GSAP easing to use. Defaults to Power1.easeOut.
// -----------------------------------------------------------------------------

var RippleClick;

(function() {
    RippleClick = function(options) {
        this.proxyThis();

        var defaultOptions = {
            duration: 0.8,
            easing: Power1.easeOut,
        };

        options = $.extend(defaultOptions, options);

        this.$element = $(options.element);
        this.duration = options.duration;
        this.easing = options.easing;

        this.$element.on('mousedown', this.handleClick);
    };

    RippleClick.prototype.proxyThis = function() {
        this.handleClick = $.proxy(this.handleClick, this);
    };

    RippleClick.prototype.handleClick = function(e) {
        var offset = this.$element.offset();
        var x = e.clientX - offset.left;
        var y = e.clientY - offset.top;

        this.ripple(x, y);
    };

    RippleClick.prototype.ripple = function(x, y) {
        var width = this.$element.innerWidth();
        var height = this.$element.innerHeight();
        var ripplePosition = [x, y];
        var radius = getMaxDistance(ripplePosition, width, height);

        var $ripple = $('<div class="ripple-click-ripple"></div>');
        this.$element.append($ripple);

        $ripple.css({
            left: x,
            top: y,
            width: radius * 2,
            height: radius * 2,
            'margin-left': -radius,
            'margin-top': -radius,
        });

        var tween = TweenLite.set($ripple[0], {scale: 0, opacity: 1});
        TweenLite.to($ripple[0], this.duration, {scale: 1, opacity: 0, ease: this.easing, onComplete: complete});

        function complete() {
            $ripple.remove();
        }
    };

    function getMaxDistance(ripplePosition, width, height) {
        var cornerPositions = [
            [0, 0],
            [width, 0],
            [0, height],
            [width, height],
        ];

        var distances = [];

        for (var i = 0; i < cornerPositions.length; ++i) {
            var cornerPosition = cornerPositions[i];
            distances.push(distance(cornerPosition, ripplePosition));
        }

        return max(distances);
    }

    function distance(p1, p2) {
        var x1 = p1[0];
        var y1 = p1[1];
        var x2 = p2[0];
        var y2 = p2[1];

        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    function max(xs) {
        return Math.max.apply(null, xs);
    }
}());
