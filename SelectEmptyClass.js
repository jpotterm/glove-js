function SelectEmptyClass(options) {
    this.bindThis();

    var defaults = {
        emptyClass: 'empty'
    };

    options = $.extend(defaults, options);

    this.select = $(options.select);
    this.emptyClass = options.emptyClass;

    this.checkEmpty();
    this.select.on('change', this.change);
}

SelectEmptyClass.prototype.bindThis = function() {
    this.change = $.proxy(this.change, this);
};

SelectEmptyClass.prototype.change = function(e) {
    this.checkEmpty();
};

SelectEmptyClass.prototype.checkEmpty = function() {
    if (this.select[0].value == '') {
        this.select.addClass(this.emptyClass);
    } else {
        this.select.removeClass(this.emptyClass);
    }
};
