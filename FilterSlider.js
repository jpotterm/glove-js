function FilterSlider(parent) {
    this.parent = parent;
    this.sliderPaddingLeft = null;
    this.leftConstraint = null;
    this.rightConstraint = null;
    this.dragging = false;
    this.mouseDownBound = this.mouseDown.bind(this);
    this.mouseUpBound = this.mouseUp.bind(this);
    this.mouseMoveBound = this.mouseMove.bind(this);
    this.currentVideo;
    this.mouseX = 0;

    this.slider = $('<div class="slide-navigation-active"></div>');
    this.slider.append('<div class="slide-navigation-left"></div>')
    this.slider.append('<div class="slide-navigation-right"></div>');
    this.sliderText = $('<div class="slide-navigation-text"></div>');
    this.slider.append(this.sliderText);
    // $(document.body).append(this.slider);
    $('.global-wrapper').append(this.slider);

    this.children = this.parent.children();

    for (var i = 1; i < this.children.length; ++i) {
        var child = this.children.eq(i);

        var target = child.attr('data-target');
        $(target).css({
            'display': 'none',
            'opacity': 0
        });
    }

    this.activeNode = this.children.eq(0);
    this.activeTab = this.activeNode.attr('data-target');
    this.currentVideo = $(this.activeTab).find('video')[0];
    this.sliderText.text(this.activeNode.text());
    this.realign();

    if (Modernizr.touch) {
        $(document).on('touchend', this.mouseUpBound);
        this.slider.on('touchstart', this.mouseDownBound);
        this.parent.on('touchstart', this.mouseDownBound);
    } else {
        $(document).on('mouseup', this.mouseUpBound);
        this.slider.on('mousedown', this.mouseDownBound);
        this.parent.on('mousedown', this.mouseDownBound);
    }
}

FilterSlider.prototype.realign = function() {
    var activeOffset = this.activeNode.offset();

    var top = activeOffset.top
        - parseInt(this.slider.css('padding-top'))
        - parseInt(this.slider.css('border-top-width'))
        + parseInt(this.activeNode.css('padding-top'));

    var left = activeOffset.left
        - parseInt(this.slider.css('padding-left'))
        - parseInt(this.slider.css('border-left-width'))
        + parseInt(this.activeNode.css('padding-left'));

    this.slider.offset({
        top: top,
        left: left
    });

    this.slider.css('width', this.activeNode.width());
    this.activeNode = this.activeNode;
}

FilterSlider.prototype.mouseDown = function(e) {
    e.preventDefault();
    this.dragging = true;
    this.slider.addClass('dragging');
    this.mouseX = Modernizr.touch ? e.originalEvent.touches[0].clientX : e.clientX;
    var offset = this.slider.offset();

    try {
        if (!Modernizr.touch) {
            this.currentVideo.play();
        }
    } catch (error) {}

    // caching
    this.sliderPaddingLeft = parseInt(this.slider.css('padding-left')) + parseInt(this.slider.css('border-left-width'));
    this.children = this.parent.children();
    var firstChild = this.children.eq(0);
    var lastChild = this.children.eq(this.children.length - 1);
    this.leftConstraint = firstChild.offset().left + parseInt(firstChild.css('padding-left')) - this.sliderPaddingLeft;
    this.rightConstraint = lastChild.offset().left + parseInt(lastChild.css('padding-left')) - this.sliderPaddingLeft;

    if (Modernizr.touch) {
        $(document).on('touchmove', this.mouseMoveBound);
    } else {
        $(document).on('mousemove', this.mouseMoveBound);
    }
}

FilterSlider.prototype.mouseUp = function(e) {
    if (!this.dragging) return;

    try {
        if (!Modernizr.touch) {
            this.currentVideo.pause();
        }
    } catch (error) {}

    this.dragging = false;
    this.slider.removeClass('dragging');

    if (!Modernizr.touch) {
        this.mouseX = e.clientX;
    }

    var offset = this.slider.offset();

    if (Modernizr.touch) {
        $(document).off('touchmove', this.mouseMoveBound);
    } else {
        $(document).off('mousemove', this.mouseMoveBound);
    }

    var active = this.closestChild(this.mouseX);
    var left = active.offset().left + parseInt(active.css('padding-left')) - this.sliderPaddingLeft;

    this.slider.css('width', active.width());
    this.sliderText.text(active.text());
    this.activeNode = active;

    var target = this.activeNode.attr('data-target');

    if (target != this.activeTab) {
        var duration = 200;

        var $sliderActiveTab = $(this.activeTab);
        $target = $(target);

        $sliderActiveTab.stop().animate({
            'opacity': 0
        }, duration, function () {
            $sliderActiveTab.css({
                'display': 'none'
            });

            $target.css({
                'display': 'block'
            }).stop().animate({
                'opacity': 1
            }, duration);
        });

        this.activeTab = target;
        this.currentVideo = $(this.activeTab).find('video')[0];
    }

    this.slider.animate({
        left: left
    }, 200);
}

FilterSlider.prototype.mouseMove = function(e) {
    e.preventDefault();
    this.mouseX = Modernizr.touch ? e.originalEvent.touches[0].clientX : e.clientX;

    var left = this.mouseX - this.slider.outerWidth()/2;

    if (left < this.leftConstraint) {
        left = this.leftConstraint;
    } else if (left > this.rightConstraint) {
        left = this.rightConstraint;
    }

    this.slider.css('left', left);

    var active = this.closestChild(this.mouseX);

    if (active != this.activeNode) {
        this.activeNode = active;
        this.sliderText.text(active.text());
        var activeWidth = active.width();
        var sliderWidth = this.slider.width();
        var deltaLeft = (activeWidth - sliderWidth) / 2;
        this.slider.css('width', activeWidth);
        this.slider.stop().animate({
            'left': left - deltaLeft
        }, 200, 'linear');
    }
}

FilterSlider.prototype.closestChild = function(x) {
    var children = this.parent.children();
    var closestChild;
    var closestDistance = Infinity;
    for (var i = 0; i < children.length; ++i) {
        var child = children.eq(i);
        var center = child.offset().left + parseInt(child.css('padding-left')) + child.width()/2;
        var distance = Math.abs(x - center);

        if (distance < closestDistance) {
            closestChild = child;
            closestDistance = distance;
        }
    }

    return closestChild;
}
