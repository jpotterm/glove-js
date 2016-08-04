function EqualizeHeights(options) {
    this.bindThis();

    var defaultOptions = {
        windowMinWidth: 0,
        windowMaxWidth: Infinity,
    };

    options = $.extend(defaultOptions, options);

    this.elements = options.elements;
    this.windowMinWidth = options.windowMinWidth;
    this.windowMaxWidth = options.windowMaxWidth;

    $(window).on('resize load', this.handleResize);
}

EqualizeHeights.prototype.bindThis = function() {
    this.handleResize = this.handleResize.bind(this);
};

EqualizeHeights.prototype.handleResize = function() {
    this.clearHeights();

    if (window.innerWidth >= this.windowMinWidth && window.innerWidth <= this.windowMaxWidth) {
        var maxHeight = this.getMaxHeight();
        this.setHeights(maxHeight);
    }
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
