function draggable(target) {
    var mouseDown = Rx.Observable.fromEvent(target, 'mousedown');
    var mouseUp = Rx.Observable.fromEvent(window, 'mouseup');
    var mouseMove = Rx.Observable.fromEvent(window, 'mousemove');

    var drag = mouseDown.flatMap(function(downEvent) {
        downEvent.preventDefault();

        var rect = downEvent.currentTarget.getBoundingClientRect();
        var offsetX = downEvent.clientX - rect.left;
        var offsetY = downEvent.clientY - rect.top;

        return mouseMove.map(function(moveEvent) {
            return {
                x: moveEvent.clientX - offsetX,
                y: moveEvent.clientY - offsetY,
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
