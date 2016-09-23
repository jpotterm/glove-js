// -----------------------------------------------------------------------------
// Provides simple tabs with crossfade an adaptive height.
//
// Options
//     tabs: An array of objects {nav: navElement, content: contentElement}
//         where navElement and contentElement are DOM nodes.
//     transition (optional): "crossfade", "overlay", or "none".
//         "overlay" is preferable to "crossfade" if tabs have opaque backgrounds.
//         Defaults to "crossfade".
//     duration (optional): Length of the animation in milliseconds.
//         Defaults to 300.
//     activeClass (optional): The class name to use for the active tab.
//         Defaults to 'tab-active'.
//     initialTab (optional): The index of the tab to start as selected.
//         Defaults to 0.
//
// Dependencies
//     jquery
//     gsap (with CSSPlugin)
//
// Example
//     HTML
//         <div class="tab-content-items">
//             <div class="tab-content-item"></div>
//             <div class="tab-content-item"></div>
//         </div>
//         <div class="tab-nav-items">
//             <div class="tab-nav-item"></div>
//             <div class="tab-nav-item"></div>
//         </div>
//
//     JavaScript
//         function tabObj(nav, content) {
//             return {
//                 nav: nav,
//                 content: content,
//             };
//         }
//
//         new Tabs({
//             tabs: R.zipWith(tabObj, $('.tab-nav-item'), $('.tab-content-item')),
//         });
// -----------------------------------------------------------------------------

function Tabs(options) {
    this.bindThis();

    var defaultOptions = {
        duration: 300,
        activeClass: 'tab-active',
        transition: 'crossfade',
        initialTab: 0,
    };

    options = $.extend(defaultOptions, options);

    this.tabs = options.tabs;
    this.gsapDuration = options.duration / 1000;
    this.activeClass = options.activeClass;
    this.transition = options.transition;
    this.activeTab = this.tabs[options.initialTab];
    this.transitionInProgress = false;
    this.contentParent = this.activeTab.content.parentNode;
    this.applyStyles();

    $(this.activeTab.nav).addClass(this.activeClass);
    $(this.activeTab.content).addClass(this.activeClass);

    for (var i = 0; i < this.tabs.length; ++i) {
        var tab = this.tabs[i];
        $(tab.nav).on('click', {tab: tab}, this.navClick);
    }

    $(window).on('load resize', this.resize);
    this.resize();
}

Tabs.prototype.bindThis = function() {
    this.navClick = this.navClick.bind(this);
    this.resize = this.resize.bind(this);
}

Tabs.prototype.applyStyles = function() {
    this.contentParent.style.position = 'relative';
    this.contentParent.style.overflow = 'hidden';

    for (var i = 0; i < this.tabs.length; ++i) {
        var tab = this.tabs[i];
        tab.content.style.position = 'absolute';

        if (tab !== this.activeTab) {
            TweenLite.set(tab.content, {autoAlpha: 0});
        }
    }
};

Tabs.prototype.navClick = function(e) {
    var newTab = e.data.tab;

    if (newTab === this.activeTab || this.transitionInProgress) return;

    $(this.activeTab.nav).removeClass(this.activeClass);
    $(this.activeTab.content).removeClass(this.activeClass);

    $(newTab.nav).addClass(this.activeClass);
    $(newTab.content).addClass(this.activeClass);

    if (this.transition === 'overlay') {
        this.transitionOverlay(this.activeTab, newTab);
    } else if (this.transition === 'crossfade') {
        this.transitionCrossfade(this.activeTab, newTab);
    } else {
        this.transitionNone(this.activeTab, newTab);
    }

    this.activeTab = newTab;
};

Tabs.prototype.transitionOverlay = function(activeTab, newTab) {
    var complete = function() {
        TweenLite.set(activeTab.content, {autoAlpha: 0});
        newTab.content.style.removeProperty('z-index');
        this.transitionInProgress = false;
    }.bind(this);

    TweenLite.to(this.contentParent, this.gsapDuration, {height: newTab.content.offsetHeight});
    newTab.content.style.zIndex = 1;
    TweenLite.to(newTab.content, this.gsapDuration, {autoAlpha: 1, onComplete: complete});
    this.transitionInProgress = true;
};

Tabs.prototype.transitionCrossfade = function(activeTab, newTab) {
    TweenLite.to(this.contentParent, this.gsapDuration, {height: newTab.content.offsetHeight});
    TweenLite.to(activeTab.content, this.gsapDuration, {autoAlpha: 0});
    TweenLite.to(newTab.content, this.gsapDuration, {autoAlpha: 1});
};

Tabs.prototype.transitionNone = function(activeTab, newTab) {
    TweenLite.set(this.contentParent, {height: newTab.content.offsetHeight});
    TweenLite.set(activeTab.content, {autoAlpha: 0});
    TweenLite.set(newTab.content, {autoAlpha: 1});
};

Tabs.prototype.resize = function() {
    this.contentParent.style.height = this.activeTab.content.offsetHeight + 'px';
};
