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

};

Draw.saveImageAsPng = function () {
    // Convert the canvas to data
    var image = this._context.canvas.toDataURL();
    // Create a link
    var aDownloadLink = document.createElement('a');
    // Add the name of the file to the link
    aDownloadLink.download = 'image_mesh.png';
    // Attach the data to the link
    aDownloadLink.href = image;
    // Get the code to click the download link
    aDownloadLink.click();
};

Draw._images = function () {
    Labels.init();
    for (var i in ImageMesh.images) {
        var image = ImageMesh.images[i];
        var dimensions = this._processDimensions(i, image.width, image.height);
        this._context.drawImage(image.img, dimensions.cropX, dimensions.cropY, dimensions.cropW, dimensions.cropH, dimensions.x, dimensions.y, dimensions.width, dimensions.height);
        this._captions(dimensions.cellLeft, dimensions.cellTop);
    }
};

Draw._captions = function (x, y) {
    if (ImageMesh.settings.labels.enable) {
        var char = Labels.getNextLabel();

        var font = ImageMesh.settings.labels.fontSize;

        this._context.fillStyle = "white";
        this._context.fillRect(x, y, 1.66 * font, 1.166 * font);
        this._context.fillStyle = "black";
        this._context.font = font + "px Arial";
        this._context.textAlign = 'center';
        this._context.fillText(char, x + 0.833 * font, y + 0.933 * font);
    }
};

Draw._processDimensions = function (num, origWidth, origHeight) {
    var top = 0, left = 0, cropX = 0, cropY = 0, width = origWidth, height = origHeight, cropW = width, cropH = height;
    var cellTop = Math.floor(num / ImageMesh.settings.columns) * ImageMesh.settings.cellHeigth;
    var cellLeft = num % ImageMesh.settings.columns * ImageMesh.settings.cellWidth;
    if (ImageMesh.settings.imageDeformationType === "deform") {
        width = ImageMesh.settings.cellWidth;
        height = ImageMesh.settings.cellHeigth;
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

    } else if (ImageMesh.settings.imageDeformationType === "crop") {
        var newWidth = ImageMesh.settings.cellHeigth * width / height;
        if (newWidth > ImageMesh.settings.cellWidth) {
            var delta = origWidth / newWidth;
            cropX = ((newWidth - ImageMesh.settings.cellWidth) / 2) * delta;
            cropW = ImageMesh.settings.cellWidth * delta;
        } else {
            newWidth = ImageMesh.settings.cellWidth;
            var newHeight = newWidth * height / width;
            var delta = origHeight / newHeight;
            cropY = ((newHeight - ImageMesh.settings.cellHeigth) / 2) * delta;
            cropH = ImageMesh.settings.cellHeigth * delta;
        }
        width = ImageMesh.settings.cellWidth;
        height = ImageMesh.settings.cellHeigth;
    }
    return {
        x: cellLeft + left,
        y: cellTop + top,
        width: width,
        height: height,
        cropY: cropY,
        cropX: cropX,
        cropW: cropW,
        cropH: cropH,
        cellLeft: cellLeft,
        cellTop: cellTop
    };
};