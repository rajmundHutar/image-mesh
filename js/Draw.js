var Draw = {
    _context: null
};

Draw.init = function () {
    var canvas = document.createElement("canvas");

    this._context = canvas.getContext("2d");

    document.getElementById("page").appendChild(canvas);

    this.all();
};

Draw.all = function () {
    ImageMesh.loadSettings();
    this._context.canvas.width = ImageMesh.settings.width;
    this._context.canvas.height = ImageMesh.settings.height;

    this._context.fillStyle = ImageMesh.settings.bgColor;

    var w = this._context.canvas.width;
    var h = this._context.canvas.height;
    this._context.fillRect(0, 0, w, h);

    this._images();
    this._captions();
};

Draw._images = function () {
    for (var i in ImageMesh.images) {
        var image = ImageMesh.images[i];
        var dimensions = this._processDimensions(i, image.width, image.height);
        this._context.drawImage(image.img, dimensions.cropY, dimensions.cropX, dimensions.cropW, dimensions.cropH, dimensions.y, dimensions.x, dimensions.width, dimensions.height);
    }
};

Draw._captions = function () {
    /**
     * @todo
     */
};

Draw._processDimensions = function (num, origWidth, origHeight) {
    var top = 0, left = 0, cropX = 0, cropY = 0, width = origWidth, height = origHeight, cropW = width, cropH = height;
    var cellTop = Math.floor(num / ImageMesh.settings.columns) * ImageMesh.settings.cellHeigth;
    var cellLeft = num % ImageMesh.settings.columns * ImageMesh.settings.cellWidth;
    if (ImageMesh.settings.imageDeformationType === "deform") {
        return {
            x: cellTop,
            y: cellLeft,
            width: ImageMesh.settings.cellWidth,
            height: ImageMesh.settings.cellHeigth,
            cropY: cropY,
            cropX: cropX,
            cropW: cropW,
            cropH: cropH
        };
    } else if (ImageMesh.settings.imageDeformationType === "fit") {
        if (width >= ImageMesh.settings.cellWidth) {
            var newWidth = Math.min(width, ImageMesh.settings.cellWidth);
            var newHeight = Math.round(newWidth * height / width);
            width = newWidth;
            height = newHeight;
        }
        if (height >= ImageMesh.settings.cellHeigth) {
            var newHeight = Math.min(height, ImageMesh.settings.cellHeigth);
            var newWidth = Math.round(newHeight * width / height);
            width = newWidth;
            height = newHeight;
        }
        top = Math.round((ImageMesh.settings.cellHeigth - height) / 2);
        left = Math.round((ImageMesh.settings.cellWidth - width) / 2);
        return {
            x: cellTop + top,
            y: cellLeft + left,
            width: width,
            height: height,
            cropY: cropY,
            cropX: cropX,
            cropW: cropW,
            cropH: cropH
        };
    } else if (ImageMesh.settings.imageDeformationType === "crop") {
        var newWidth = ImageMesh.settings.cellWidth;
        var newHeight = Math.round(newWidth * height / width);
        var workWidth = newWidth;
        var workHeight = newHeight;

        /**
         * @todo
         */

        return {
            x: cellTop + top,
            y: cellLeft + left,
            width: width,
            height: height,
            cropY: cropY,
            cropX: cropX,
            cropW: cropW,
            cropH: cropH
        };
    }
};