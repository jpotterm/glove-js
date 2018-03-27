function rafThrottle(f) {
    var ticking = false;

    function wrappedF() {
        f();
        ticking = false;
    }

    return function() {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(wrappedF);
        }
    }
}
