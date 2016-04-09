var ImageUpload = {};

ImageUpload.listen = function () {
    document.getElementById("files").addEventListener("change", ImageUpload.handle);
};

ImageUpload.handle = function (evt) {
    var files = evt.target.files; // FileList object
    for (var i in files) {
        var f = files[i];
        // Only process image files.
        if (f.type !== undefined && f.type.match('image.*')) {
            var reader = new FileReader();
            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    var img = new Image();
                    img.src = e.target.result;
                    img.onload = function () {
                        ImageMesh.addImage(this);
                    };
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    }
};
