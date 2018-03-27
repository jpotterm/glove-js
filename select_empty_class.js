function SelectEmptyClass(options) {
    this.bindThis();

    var defaults = {
        emptyClass: 'select-empty-class--empty'
    };

    options = R.merge(defaults, options);

    this.select = options.select;
    this.emptyClass = options.emptyClass;

    this.checkEmpty();
    this.select.addEventListener('change', this.change);
}

SelectEmptyClass.prototype.bindThis = function() {
    this.change = this.change.bind(this);
};

SelectEmptyClass.prototype.change = function(e) {
    this.checkEmpty();
};

SelectEmptyClass.prototype.checkEmpty = function() {
    if (this.select.value == '') {
        this.select.classList.add(this.emptyClass);
    } else {
        this.select.classList.remove(this.emptyClass);
    }
};
