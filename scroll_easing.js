// From https://github.com/oblador/angular-scroll/
function easing(x) {
    if (x < 0.5) {
        return 2 * Math.pow(x, 2);
    } else {
        return 1 - 2 * Math.pow(1 - x, 2);
    }
}

// Or like FF native scrollIntoView
TweenLite.to(window, 0.65, {scrollTo: {y: scrollAmount1}, ease: Power4.easeOut});
