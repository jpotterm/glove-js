function OverflowList(options) {
    this.proxyThis();

    this.amount = options.amount;
    this.list = $(options.list);
    this.toggle = $('<li class="overflow-list-toggle"></li>');

    this.list.append(this.toggle);

    this.close();

    this.toggle.on('click', this.toggleClick);
}

OverflowList.prototype.proxyThis = function() {
    this.toggleClick = $.proxy(this.toggleClick, this);
}

OverflowList.prototype.toggleClick = function(e) {
    if (this.isOpen) {
        this.close();
    } else {
        this.open();
    }
};

OverflowList.prototype.open = function() {
    this.list.children().not(this.toggle).removeClass('overflow-list-hide');
    this.list.removeClass('overflow-list-closed');
    this.list.addClass('overflow-list-open');
    this.isOpen = true;
};

OverflowList.prototype.close = function() {
    var overflows = this.list.children().not(this.toggle).slice(this.amount);
    overflows.addClass('overflow-list-hide');
    this.list.removeClass('overflow-list-open');
    this.list.addClass('overflow-list-closed');
    this.isOpen = false;
};
