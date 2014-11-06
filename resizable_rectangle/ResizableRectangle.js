var ResizableRectangle = {};

ResizableRectangle.moveBackground = function(self, x, y) {
    x = ResizableRectangle.clampBackgroundX(self, x);
    y = ResizableRectangle.clampBackgroundY(self, y);

    var dimensions = Point.subtract(self.bottomRight, self.topLeft);

    self.topLeft.x = x;
    self.topLeft.y = y;

    self.topRight.x = x + dimensions.x;
    self.topRight.y = y;

    self.bottomRight.x = x + dimensions.x;
    self.bottomRight.y = y + dimensions.y;

    self.bottomLeft.x = x;
    self.bottomLeft.y = y + dimensions.y;
};

ResizableRectangle.clampBackgroundX = function(self, x) {
    var width = self.bottomRight.x - self.topLeft.x;

    if (x < 0) {
        x = 0;
    }

    if (x + width > self.maxX) {
        x = self.maxX - width;
    }

    return x;
};

ResizableRectangle.clampBackgroundY = function(self, y) {
    var height = self.bottomRight.y - self.topLeft.y;

    if (y < 0) {
        y = 0;
    }

    if (y + height > self.maxY) {
        y = self.maxY - height;
    }

    return y;
};
