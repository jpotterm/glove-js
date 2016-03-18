function FocusToggle(options) {
    this.bindThis();

    this.$element = $(options.element);
    this.$button = $(options.button);
    this.ignoreBubble = false;

    this.$element.on('mousedown', this.handleElementClick);
    this.$button.on('mousedown', this.handleButtonClick);
    $(document).on('mousedown', this.handleBodyClick);
}

FocusToggle.prototype.bindThis = function() {
    this.handleElementClick = this.handleElementClick.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleBodyClick = this.handleBodyClick.bind(this);
};

FocusToggle.prototype.handleElementClick = function(e) {
    this.ignoreBubble = true;
};

FocusToggle.prototype.handleButtonClick = function(e) {
    this.$element.toggleClass('focus-toggle-open');
    this.ignoreBubble = true;
};

FocusToggle.prototype.handleBodyClick = function(e) {
    if (!this.ignoreBubble) {
        this.$element.removeClass('focus-toggle-open');
    }

    this.ignoreBubble = false;
};
