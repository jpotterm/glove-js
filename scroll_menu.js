function ScrollMenu(options) {
    this.proxyThis();

    var defaultOptions = {
        offset: 0,
        easing: 'easeOutQuart',
        duration: 650,
    };

    options = $.extend(defaultOptions, options);

    this.offset = options.offset;
    this.$navs = $('[data-scroll-menu-nav]');
    this.$anchors = $('[data-scroll-menu-anchor]');
    this.activeNav = null;
    this.scrolling = false;

    $(window).on('scroll', this.handleScroll);
    this.$navs.on('click', this.handleNavClick);
}

ScrollMenu.prototype.proxyThis = function() {
    this.handleScroll = $.proxy(this.handleScroll, this);
    this.handleNavClick = $.proxy(this.handleNavClick, this);
};

ScrollMenu.prototype.handleScroll = function() {
    if (this.scrolling) return;

    var activeAnchor = this.activeAnchor();
    var index = $(activeAnchor).data('scroll-menu-anchor');
    var activeNav = this.getNav(index);

    if (activeNav !== this.activeNav) {
        if (this.activeNav !== null) {
            $(this.activeNav).removeClass('active');
        }

        $(activeNav).addClass('active');
        this.activeNav = activeNav;
    }
};

ScrollMenu.prototype.activeAnchor = function() {
    var maximumTop = Number.NEGATIVE_INFINITY;
    var maximumAnchor = null;
    var anchors = this.$anchors.toArray();

    for (var i = 0; i < anchors.length; ++i) {
        var anchor = anchors[i];
        var top = Math.round(anchor.getBoundingClientRect().top - this.offset);

        if (top <= 0 && top > maximumTop) {
            maximumTop = top;
            maximumAnchor = anchor;
        }
    }

    return maximumAnchor;
};

ScrollMenu.prototype.getAnchor = function(index) {
    return this.$anchors.filter('[data-scroll-menu-anchor="' + index + '"]')[0];
};

ScrollMenu.prototype.getNav = function(index) {
    return this.$navs.filter('[data-scroll-menu-nav="' + index + '"]')[0];
};

ScrollMenu.prototype.handleNavClick = function(e) {
    var self = this;
    var $nav = $(e.currentTarget);
    var index = $nav.data('scroll-menu-nav');
    var activeAnchor = this.getAnchor(index);
    var top = Math.round($(activeAnchor).offset().top - this.offset);
    this.scrolling = true;

    $('html, body').stop().animate({scrollTop: top}, this.duration, this.easing, complete);

    function complete() {
        self.scrolling = false;
        self.handleScroll();
    }
};
