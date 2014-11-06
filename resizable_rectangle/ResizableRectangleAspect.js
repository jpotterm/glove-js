function ResizableRectangleAspect(options) {
    this.epsilon = 0.00001;

    this.minWidth = options.minWidth;
    this.minHeight = options.minHeight;

    this.maxX = options.maxX;
    this.maxY = options.maxY;

    this.topLeft = options.topLeft;
    this.topRight = options.topRight;
    this.bottomRight = options.bottomRight;
    this.bottomLeft = options.bottomLeft;

    var width = options.bottomRight.x - options.topLeft.x;
    var height = options.bottomRight.y - options.topLeft.y;
    this.aspectRatio = width / height;
}

ResizableRectangleAspect.prototype.aspectWidth = function(height) {
    return height * this.aspectRatio;
};

ResizableRectangleAspect.prototype.aspectHeight = function(width) {
    return width / this.aspectRatio;
};

ResizableRectangleAspect.prototype.constrainAspect = function(potentialWidth, potentialHeight) {
    // Try by width
    var width1 = potentialWidth;
    var height1 = this.aspectHeight(potentialWidth);

    // Try by height
    var width2 = this.aspectWidth(potentialHeight);
    var height2 = potentialHeight;

    return {
        width: (width1 + width2) / 2,
        height: (height1 + height2) / 2
    }
};

ResizableRectangleAspect.prototype.constrainAspectTopLeft = function(x, y) {
    var potentialWidth = this.bottomRight.x - x;
    var potentialHeight = this.bottomRight.y - y;

    var constrained = this.constrainAspect(potentialWidth, potentialHeight);

    return {
        x: this.bottomRight.x - constrained.width,
        y: this.bottomRight.y - constrained.height
    }
};

ResizableRectangleAspect.prototype.constrainAspectTopRight = function(x, y) {
    var potentialWidth = x - this.bottomLeft.x;
    var potentialHeight = this.bottomLeft.y - y;

    var constrained = this.constrainAspect(potentialWidth, potentialHeight);

    return {
        x: this.bottomLeft.x + constrained.width,
        y: this.bottomLeft.y - constrained.height
    }
};

ResizableRectangleAspect.prototype.constrainAspectBottomRight = function(x, y) {
    var potentialWidth = x - this.topLeft.x;
    var potentialHeight = y - this.topLeft.y;

    var constrained = this.constrainAspect(potentialWidth, potentialHeight);

    return {
        x: this.topLeft.x + constrained.width,
        y: this.topLeft.y + constrained.height
    }
};

ResizableRectangleAspect.prototype.constrainAspectBottomLeft = function(x, y) {
    var potentialWidth = this.topRight.x - x;
    var potentialHeight = y - this.topRight.y;

    var constrained = this.constrainAspect(potentialWidth, potentialHeight);

    return {
        x: this.topRight.x - constrained.width,
        y: this.topRight.y + constrained.height
    }
};

ResizableRectangleAspect.prototype.moveTopLeft = function(x, y) {
    var a = this.constrainAspectTopLeft(x, y);
    var b = this.clampTopLeft(a.x, a.y);
    x = b.x;
    y = b.y;

    this.topLeft.x = x;
    this.topLeft.y = y;

    this.bottomLeft.x = x;
    this.topRight.y = y;
};

ResizableRectangleAspect.prototype.moveTopRight = function(x, y) {
    var a = this.constrainAspectTopRight(x, y);
    var b = this.clampTopRight(a.x, a.y);
    x = b.x;
    y = b.y;

    this.topRight.x = x;
    this.topRight.y = y;

    this.bottomRight.x = x;
    this.topLeft.y = y;
};

ResizableRectangleAspect.prototype.moveBottomRight = function(x, y) {
    var a = this.constrainAspectBottomRight(x, y);
    var b = this.clampBottomRight(a.x, a.y);
    x = b.x;
    y = b.y;

    this.bottomRight.x = x;
    this.bottomRight.y = y;

    this.topRight.x = x;
    this.bottomLeft.y = y;
};

ResizableRectangleAspect.prototype.moveBottomLeft = function(x, y) {
    var a = this.constrainAspectBottomLeft(x, y);
    var b = this.clampBottomLeft(a.x, a.y);
    x = b.x;
    y = b.y;

    this.bottomLeft.x = x;
    this.bottomLeft.y = y;

    this.topLeft.x = x;
    this.bottomRight.y = y;
};

ResizableRectangleAspect.prototype.moveBackground = function(x, y) {
    ResizableRectangle.moveBackground(this, x, y);
};

ResizableRectangleAspect.prototype.clampTopLeft = function(x, y) {
    if (x < 0) {
        var pX = 0;
        var height = this.aspectHeight(this.bottomRight.x);
        var pY = this.bottomRight.y - height;

        if (this.validTop(pY)) {
            return {x: pX, y: pY};
        }
    }

    if (this.bottomRight.x - x < this.minWidth) {
        var pX = this.bottomRight.x - this.minWidth;
        var height = this.aspectHeight(this.bottomRight.x - pX);
        var pY = this.bottomRight.y - height;

        if (this.validTop(pY)) {
            return {x: pX, y: pY};
        }
    }

    if (y < 0) {
        var pY = 0;
        var width = this.aspectWidth(this.bottomRight.y);
        var pX = this.bottomRight.x - width;

        if (this.validLeft(pX)) {
            return {x: pX, y: pY};
        }
    }

    if (this.bottomRight.y - y < this.minHeight) {
        var pY = this.bottomRight.y - this.minHeight;
        var width = this.aspectWidth(this.bottomRight.y - pY);
        var pX = this.bottomRight.x - width;

        if (this.validLeft(pX)) {
            return {x: pX, y: pY};
        }
    }

    return {x: x, y: y};
};

ResizableRectangleAspect.prototype.clampTopRight = function(x, y) {
    if (x > this.maxX) {
        var pX = this.maxX;
        var height = this.aspectHeight(pX - this.bottomLeft.x);
        var pY = this.bottomLeft.y - height;

        if (this.validTop(pY)) {
            return {x: pX, y: pY};
        }
    }

    if (x - this.bottomLeft.x < this.minWidth) {
        var pX = this.bottomLeft.x + this.minWidth;
        var height = this.aspectHeight(pX - this.bottomLeft.x);
        var pY = this.bottomLeft.y - height;

        if (this.validTop(pY)) {
            return {x: pX, y: pY};
        }
    }

    if (y < 0) {
        var pY = 0;
        var width = this.aspectWidth(this.bottomLeft.y);
        var pX = this.bottomLeft.x + width;

        if (this.validRight(pX)) {
            return {x: pX, y: pY};
        }
    }

    if (this.bottomLeft.y - y < this.minHeight) {
        var pY = this.bottomLeft.y - this.minHeight;
        var width = this.aspectWidth(this.bottomLeft.y - pY);
        var pX = this.bottomLeft.x + width;

        if (this.validRight(pX)) {
            return {x: pX, y: pY};
        }
    }

    return {x: x, y: y};
};

ResizableRectangleAspect.prototype.clampBottomRight = function(x, y) {
    if (x > this.maxX) {
        var pX = this.maxX;
        var height = this.aspectHeight(pX - this.topLeft.x);
        var pY = this.topLeft.y + height;

        if (this.validBottom(pY)) {
            return {x: pX, y: pY};
        }
    }

    if (x - this.topLeft.x < this.minWidth) {
        var pX = this.topLeft.x + this.minWidth;
        var height = this.aspectHeight(pX - this.topLeft.x);
        var pY = this.topLeft.y + height;

        if (this.validBottom(pY)) {
            return {x: pX, y: pY};
        }
    }

    if (y > this.maxY) {
        var pY = this.maxY;
        var width = this.aspectWidth(pY - this.topLeft.y);
        var pX = this.topLeft.x + width;

        if (this.validRight(pX)) {
            return {x: pX, y: pY};
        }
    }

    if (y - this.topLeft.y < this.minHeight) {
        var pY = this.topLeft.y + this.minHeight
        var width = this.aspectWidth(pY - this.topLeft.y);
        var pX = this.topLeft.x + width;

        if (this.validRight(pX)) {
            return {x: pX, y: pY};
        }
    }

    return {x: x, y: y};
};

ResizableRectangleAspect.prototype.clampBottomLeft = function(x, y) {
    if (x < 0) {
        var pX = 0;
        var height = this.aspectHeight(this.topRight.x - pX);
        var pY = this.topRight.y + height;

        if (this.validBottom(pY)) {
            return {x: pX, y: pY};
        }
    }

    if (this.topRight.x - x < this.minWidth) {
        var pX = this.topRight.x - this.minWidth;
        var height = this.aspectHeight(this.topRight.x - pX);
        var pY = this.topRight.y + height;

        if (this.validBottom(pY)) {
            return {x: pX, y: pY};
        }
    }

    if (y > this.maxY) {
        var pY = this.maxY;
        var width = this.aspectWidth(pY - this.topRight.y);
        var pX = this.topRight.x - width;

        if (this.validLeft(pX)) {
            return {x: pX, y: pY};
        }
    }

    if (y - this.topRight.y < this.minHeight) {
        var pY = this.topRight.y + this.minHeight;
        var width = this.aspectWidth(pY - this.topRight.y);
        var pX = this.topRight.x - width;

        if (this.validLeft(pX)) {
            return {x: pX, y: pY};
        }
    }

    return {x: x, y: y};
};

ResizableRectangleAspect.prototype.validLeft = function(x) {
    return x >= 0 && this.bottomRight.x - x >= this.minWidth - this.epsilon;
};

ResizableRectangleAspect.prototype.validRight = function(x) {
    return x <= this.maxX && x - this.topLeft.x >= this.minWidth - this.epsilon;
};

ResizableRectangleAspect.prototype.validTop = function(y) {
    return y >= 0 && this.bottomLeft.y - y >= this.minHeight - this.epsilon;
};

ResizableRectangleAspect.prototype.validBottom = function(y) {
    return y <= this.maxY && y - this.topLeft.y >= this.minHeight - this.epsilon;
};
