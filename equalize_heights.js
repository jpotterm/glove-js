// -----------------------------------------------------------------------------
// Tie elements' heights together so that each element is the height of the
// tallest one.
//
// Options
//     elements: An array DOM nodes.
//
// Dependencies
//     jquery
//
// Example
//     HTML
//         <div></div>
//         <div></div>
//         <div></div>
//
//     JavaScript
//         new EqualizeHeights({
//             elements: $('div'),
//         });
// -----------------------------------------------------------------------------
function EqualizeHeights(options) {
    this.bindThis();

    var defaultOptions = {};

    options = $.extend(defaultOptions, options);

    this.elements = options.elements;
    this.applyStyles();

    $(window).on('load resize', this.resize);
    this.resize();
}

EqualizeHeights.prototype.bindThis = function() {
    this.resize = this.resize.bind(this);
};

EqualizeHeights.prototype.applyStyles = function() {
    for (var i = 0; i < this.elements.length; ++i) {
        var element = this.elements[i];
        element.style.boxSizing = 'border-box';
    }
};

EqualizeHeights.prototype.resize = function() {
    this.clearHeights();
    var maxHeight = this.getMaxHeight();
    this.setHeights(maxHeight);
};

EqualizeHeights.prototype.getMaxHeight = function() {
	var maxHeight = 0;

    for (var i = 0; i < this.elements.length; ++i) {
        var x = this.elements[i];
        var height = x.offsetHeight;
        if (height > maxHeight) {
            maxHeight = height;
        }
    }

    return maxHeight;
};

EqualizeHeights.prototype.clearHeights = function() {
    for (var i = 0; i < this.elements.length; ++i) {
        var x = this.elements[i];
        x.style.removeProperty('height');
    }
};

EqualizeHeights.prototype.setHeights = function(height) {
    for (var i = 0; i < this.elements.length; ++i) {
        var x = this.elements[i];
        x.style.height = height + 'px';
    }
};
