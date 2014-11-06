function Toggle(options) {
    this.proxyThis();

    this.element = $(options.element);
    this.left = this.element.find('.toggle-left');
    this.right = this.element.find('.toggle-right');

    this.element.on('click', this.toggleClick);
}

Toggle.prototype.proxyThis = function() {
    this.toggleClick = $.proxy(this.toggleClick, this);
};


Toggle.prototype.toggleClick = function(e) {
    if (this.element.hasClass('toggle-left-active')) {
        this.element.removeClass('toggle-left-active');
        this.element.addClass('toggle-right-active');
        $(this).trigger('activate-right');
    } else {
        this.element.removeClass('toggle-right-active');
        this.element.addClass('toggle-left-active');
        $(this).trigger('activate-left');
    }
};
