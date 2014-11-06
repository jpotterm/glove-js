function Tab(options) {
    this.proxyThis();

    this.navWrapper = $(options.navWrapper);
    this.navWrapper.find('.tab-nav-item').on('click', this.navClick);
    this.animateOutDuration = this.navWrapper.data('tab-animate-out-duration');

    var activeTabNav = this.navWrapper.find('.tab-active');
    var activePane = $(activeTabNav.data('tab-target'));
    var paneWrapper = activePane.closest('.tab-content');

    paneWrapper.height(activePane.outerHeight());
}

Tab.prototype.proxyThis = function() {
    this.navClick = $.proxy(this.navClick, this);
}

Tab.prototype.navClick = function(e) {
    var instance = this;

    var newNav = $(e.currentTarget);

    if (newNav.hasClass('tab-active')) {
        return;
    }

    var oldNav = this.navWrapper.find('.tab-nav-item.tab-active');

    $(this).trigger('before-change', [oldNav, newNav]);

    var newPane = $(newNav.data('tab-target'));
    var oldPane = $(oldNav.data('tab-target'));
    var paneWrapper = newPane.closest('.tab-content');

    oldNav.removeClass('tab-active');
    newNav.addClass('tab-active');

    newPane.addClass('tab-active');
    newPane.height();
    newPane.addClass('tab-animate-in');

    oldPane.removeClass('tab-animate-in');
    setTimeout(function() {
        oldPane.removeClass('tab-active');
        $(instance).trigger('after-change', [oldNav, newNav]);
    }, this.animateOutDuration);

    setTimeout(function() {
        paneWrapper.height(newPane.outerHeight());
        $(instance).trigger('middle-change', [oldNav, newNav]);
    }, Math.floor(this.animateOutDuration / 2));
};
