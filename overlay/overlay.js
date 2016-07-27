function Overlay(options) {
    this.bindThis();

    this.$element = $(options.element);
}

Overlay.prototype.bindThis = function() {
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
};

Overlay.prototype.open = function() {
    this.$element.addClass('js-overlay--open');
    $(document.body).addClass('js-overlay--open');
};

Overlay.prototype.close = function() {
    this.$element.removeClass('js-overlay--open');
    $(document.body).removeClass('js-overlay--open');
};
