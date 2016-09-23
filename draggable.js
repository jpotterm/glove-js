function draggable(target) {
    function clientX(e) {
        if (e.touches) {
            return e.touches[0].clientX;
        } else {
            return e.clientX;
        }
    }

    function clientY(e) {
        if (e.touches) {
            return e.touches[0].clientY;
        } else {
            return e.clientY;
        }
    }

    var mouseDown = Rx.Observable.merge(
        Rx.Observable.fromEvent(target, 'mousedown'),
        Rx.Observable.fromEvent(target, 'touchstart')
    );
    var mouseUp = Rx.Observable.merge(
        Rx.Observable.fromEvent(window, 'mouseup'),
        Rx.Observable.fromEvent(window, 'touchend')
    );
    var mouseMove = Rx.Observable.merge(
        Rx.Observable.fromEvent(window, 'mousemove'),
        Rx.Observable.fromEvent(window, 'touchmove')
    );

    var drag = mouseDown.flatMap(function(downEvent) {
        var offsetX = clientX(downEvent);
        var offsetY = clientY(downEvent);

        return mouseMove.map(function(moveEvent) {
            return {
                x: clientX(moveEvent) - offsetX,
                y: clientY(moveEvent) - offsetY,
                originalEvent: moveEvent,
            }
        })
        .takeUntil(mouseUp);
    });

    var stop = mouseDown.flatMap(function(x) {return mouseUp.take(1)});

    return {
        start: mouseDown,
        drag: drag,
        stop: stop,
    }
}
