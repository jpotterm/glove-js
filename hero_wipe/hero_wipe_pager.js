function HeroWipePager(options) {
    this.bindThis();

    this.parent = $(options.element)[0];
    this.count = options.count;
    this.activeIndex = 0;
    this.pages = this.createPages();
    this.change = new Rx.Subject();
    this.activeClass = 'hero-wipe__page--active';

    this.nextButton = document.createElement('div');
    this.nextButton.setAttribute('class', 'hero-wipe__next-page');
    this.parent.appendChild(this.nextButton);

    $(this.pages[this.activeIndex]).addClass(this.activeClass);

    $(this.pages).on('click', this.pageClick);
    this.nextButton.addEventListener('click', this.nextClick);
}

HeroWipePager.prototype.bindThis = function() {
    this.pageClick = this.pageClick.bind(this);
    this.nextClick = this.nextClick.bind(this);
};

HeroWipePager.prototype.createPages = function() {
    var pages = [];

    for (var i = 0; i < this.count; ++i) {
        var page = document.createElement('div');
        page.setAttribute('class', 'hero-wipe__page');
        this.parent.appendChild(page);
        pages.push(page);
    }

    return pages;
};

HeroWipePager.prototype.pageClick = function(e) {
    var i = this.pages.indexOf(e.currentTarget);

    if (i !== this.activeIndex) {
        this.goToPage(i);
        this.change.onNext(i);
    }
};

HeroWipePager.prototype.nextClick = function(e) {
    var i = this.activeIndex + 1;

    if (i < this.count) {
        this.goToPage(i);
        this.change.onNext(i);
    }
};

HeroWipePager.prototype.goToPage = function(i) {
    $(this.pages[this.activeIndex]).removeClass(this.activeClass);
    $(this.pages[i]).addClass(this.activeClass);
    this.activeIndex = i;
};
