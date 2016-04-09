var ImageUpload = {};

ImageUpload.listen = function () {
    document.getElementById("files").addEventListener("change", ImageUpload.handle);
    //this.fakeImages();
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

ImageUpload.fakeImages = function () {
    var test = [
        "action-activate-active-2330098-o.jpg",
        "alexander-brake-breaks-92694-o.jpg",
        "converge_school_square_14677_o.jpg",
        "india-mumbai-skyline-1669515-o.jpg",
        "round_curved_curve_14742_o.jpg",
    ];
    for (var i in test) {
        var res = test[i];
        var img = new Image();
        img.src = "./img/" + res;
        img.onload = function () {
            ImageMesh.addImage(this);
        };
    }
};