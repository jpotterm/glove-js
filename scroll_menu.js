// -----------------------------------------------------------------------------
// Menu that scrolls to various points on a page.
//
// Options
//     items: An array of objects {nav: navElement, anchor: anchorElement}
//         where navElement and anchorElement are DOM nodes.
//     offset (optional): Extra distance to add between the top of the window and the anchor.
//         Defaults to 0.
//     activeClass (optional): The class name to use for the active tab.
//         Defaults to 'active'.
//
// Dependencies
//     jquery
//     gsap (with ScrollToPlugin)
//
// Example
//     HTML
//         <div class="nav">
//             <div class="nav-item"></div>
//             <div class="nav-item"></div>
//         </div>
//         <div class="anchor"></div>
//         <div class="anchor"></div>
//
//     JavaScript
//         function menuItem(nav, anchor) {
//             return {
//                 nav: nav,
//                 anchor: anchor,
//             };
//         }
//
//         new ScrollMenu({
//             items: R.zipWith(menuItem, $('.nav-item'), $('.anchor')),
//         });
// -----------------------------------------------------------------------------

function ScrollMenu(options) {
    this.bindThis();

    var defaultOptions = {
        offset: 0,
        activeClass: 'active',
    };

    options = $.extend(defaultOptions, options);

    this.offset = options.offset;
    this.items = options.items;
    this.activeClass = options.activeClass;
    this.activeItem = null;
    this.scrolling = false;

    $(window).on('scroll', this.handleScroll);

    for (var i = 0; i < this.items.length; ++i) {
        var item = this.items[i];
        $(item.nav).on('click', {item: item}, this.handleNavClick);
    }
}

ScrollMenu.prototype.bindThis = function() {
    this.handleScroll = this.handleScroll.bind(this);
    this.handleNavClick = this.handleNavClick.bind(this);
};

ScrollMenu.prototype.handleScroll = function() {
    if (this.scrolling) return;

    var newItem = this.findActiveItem(window.pageYOffset);
    this.setActiveItem(newItem);
};

ScrollMenu.prototype.findActiveItem = function(scrollTop) {
    var maximumTop = -Infinity;
    var maximumItem = null;
    var scrollDelta = scrollTop - window.pageYOffset;

    for (var i = 0; i < this.items.length; ++i) {
        var item = this.items[i];
        var top = Math.round(item.anchor.getBoundingClientRect().top - scrollDelta - this.offset);

        if (top <= 0 && top > maximumTop) {
            maximumTop = top;
            maximumItem = item;
        }
    }

    return maximumItem;
};

ScrollMenu.prototype.setActiveItem = function(newItem) {
    if (newItem === this.activeItem) return;

    if (this.activeItem !== null) {
        $(this.activeItem.nav).removeClass(this.activeClass);
    }

    if (newItem !== null) {
        $(newItem.nav).addClass(this.activeClass);
    }

    this.activeItem = newItem;
};

ScrollMenu.prototype.handleNavClick = function(e) {
    var complete = function() {
        this.scrolling = false;
        this.handleScroll();
    }.bind(this);

    var item = e.data.item;
    var top = Math.round($(item.anchor).offset().top - this.offset);
    this.scrolling = true;

    var newItem = this.findActiveItem(top);
    this.setActiveItem(newItem);

    TweenLite.to(window, 0.65, {scrollTo: {y: top, onAutoKill: complete}, ease: Power4.easeOut, onComplete: complete});
};
