// -----------------------------------------------------------------------------
// A simple dropdown for a menu of links. This does not work as a select
// replacement because the options must be simple anchor tags. Element must have
// a child that is a <button> with the class "link-dropdown-button" because
// this uses focus events.
//
// Options
//     element: The DOM element that will be the dropdown.
// -----------------------------------------------------------------------------

function LinkDropdown(options) {
    this.proxyThis();

    this.$element = $(options.element);
    this.$button = this.$element.find('.link-dropdown-button');

    this.$button.on('click', this.handleClick);
    this.$button.on('blur', this.handleBlur);
}

LinkDropdown.prototype.proxyThis = function() {
    this.handleClick = $.proxy(this.handleClick, this);
    this.handleBlur = $.proxy(this.handleBlur, this);
};

LinkDropdown.prototype.handleClick = function(e) {
    if (this.$element.hasClass('link-dropdown-open')) {
        this.$button.trigger('blur');
    } else {
        this.$element.addClass('link-dropdown-open');
        this.$button.trigger('focus');
    }
};

LinkDropdown.prototype.handleBlur = function(e) {
    this.$element.removeClass('link-dropdown-open');
};
