// -----------------------------------------------------------------------------
// A filter circle as seen on the ILI microsite.
//
// Dependencies
//     glove.CircularBuffer
//
// Options
//     parent: The DOM element of the parent.
// -----------------------------------------------------------------------------

function FilterCircle(options) {
    this.parent = options.parent;
    this.spinner = this.parent.find('.ring-items');
    this.children = this.parent.find('.ring-item');

    this.buffer = new CircularBuffer(4);
    this.buffer.appendAll([0, 1, 2, 3]);

    var startingTab = 1;

    this.children.eq(startingTab).addClass('active');
    for (var i = 0; i < this.children.length; ++i) {
        if (i == startingTab) continue;

        var child = this.children.eq(i);
        var target = child.attr('data-target');
        var middle = child.attr('data-middle');
        $(target).css({
            'display': 'none',
            'opacity': 0
        });
    }

    if (Modernizr.touch) {
        this.children.on('touchend', tap(this.click.bind(this)));
    } else {
        this.children.on('click', this.click.bind(this));
    }
}

FilterCircle.prototype.bufferToShift = [1, 0, -1, -2];

FilterCircle.prototype.click = function (e) {
    var target = $(e.target);
    var index = this.getIndex(e.target);
    var bufferIndex = this.buffer.indexOf(index);
    var shift = this.bufferToShift[bufferIndex];
    var rotation = shift * 90;

    this.buffer.rotateRight(shift);

    this.spinner.transition({
        'rotate': '+=' + rotation + 'deg'
    });

    for (var i = 0; i < this.children.length; ++i) {
        var child = this.children.eq(i);

        child.transition({
            'rotate': '-=' + rotation + 'deg'
        });
    }

    var active = this.spinner.find('.active');
    var activeTab = $(active.attr('data-target'));
    var activeMiddle = $(active.attr('data-middle'));
    var targetTab = $(target.attr('data-target'));
    var targetMiddle = $(target.attr('data-middle'));

    active.removeClass('active');
    activeMiddle.removeClass('active');
    target.addClass('active');
    targetMiddle.addClass('active');

    Utilities.crossFade(activeTab, targetTab);
};

FilterCircle.prototype.getIndex = function (child) {
    for (var i = 0; i < this.children.length; ++i) {
        if (this.children[i] == child) {
            return i;
        }
    }

    return null;
};
