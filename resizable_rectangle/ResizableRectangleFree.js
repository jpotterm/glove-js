function ResizableRectangleFree(options) {
    this.minWidth = options.minWidth;
    this.minHeight = options.minHeight;

    this.maxX = options.maxX;
    this.maxY = options.maxY;

    this.topLeft = options.topLeft;
    this.topRight = options.topRight;
    this.bottomRight = options.bottomRight;
    this.bottomLeft = options.bottomLeft;
}

ResizableRectangleFree.prototype.moveTopLeft = function(x, y) {
    x = this.clampLeftX(x);
    y = this.clampTopY(y);

    this.topLeft.x = x;
    this.topLeft.y = y;

    this.bottomLeft.x = x;
    this.topRight.y = y;
};

ResizableRectangleFree.prototype.moveTopRight = function(x, y) {
    x = this.clampRightX(x);
    y = this.clampTopY(y);

    this.topRight.x = x;
    this.topRight.y = y;

    this.bottomRight.x = x;
    this.topLeft.y = y;
};

ResizableRectangleFree.prototype.moveBottomRight = function(x, y) {
    x = this.clampRightX(x);
    y = this.clampBottomY(y);

    this.bottomRight.x = x;
    this.bottomRight.y = y;

    this.topRight.x = x;
    this.bottomLeft.y = y;
};

ResizableRectangleFree.prototype.moveBottomLeft = function(x, y) {
    x = this.clampLeftX(x);
    y = this.clampBottomY(y);

    this.bottomLeft.x = x;
    this.bottomLeft.y = y;

    this.topLeft.x = x;
    this.bottomRight.y = y;
};

ResizableRectangleFree.prototype.moveBackground = function(x, y) {
    ResizableRectangle.moveBackground(this, x, y);
};

ResizableRectangleFree.prototype.clampLeftX = function(x) {
    if (x < 0) {
        x = 0;
    }

    if (this.bottomRight.x - x < this.minWidth) {
        x = this.bottomRight.x - this.minWidth;
    }

    return x;
};

ResizableRectangleFree.prototype.clampRightX = function(x) {
    if (x > this.maxX) {
        x = this.maxX;
    }

    if (x - this.bottomLeft.x < this.minWidth) {
        x = this.bottomLeft.x + this.minWidth;
    }

    return x;
};

ResizableRectangleFree.prototype.clampTopY = function(y) {
    if (y < 0) {
        y = 0;
    }

    if (this.bottomRight.y - y < this.minHeight) {
        y = this.bottomRight.y - this.minHeight;
    }

    return y;
};

ResizableRectangleFree.prototype.clampBottomY = function(y) {
    if (y > this.maxY) {
        y = this.maxY;
    }

    if (y - this.topLeft.y < this.minHeight) {
        y = this.topLeft.y + this.minHeight;
    }

    return y;
};
