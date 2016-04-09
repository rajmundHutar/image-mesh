var ImageMesh = {
    settings: {
        sizeInput: "",
        width: 800,
        height: 600,
        cellWidth: 300,
        cellHeigth: 200,
        columns: 4,
        rows: 4,
        bgColor: "#D1EBFF",
        imageDeformationType: "fit"
    },
    images: []
};

ImageMesh.Start = function () {
    ImageUpload.listen();
    this.listen();
    Draw.init();
};

ImageMesh.listen = function () {
    document.body.addEventListener("change", function () {
        Draw.all();
    });
};

ImageMesh.addImage = function (image) {
    this.images.push({
        img: image,
        width: image.width,
        height: image.height,
    });
    Draw.all();
};

ImageMesh.makeAlert = function (message) {
    console.log(message);
};

ImageMesh.loadSettings = function () {
    var r = document.getElementsByClassName("imageDeform");
    for (var i = 0; i < r.length; i++) {
        if (r[i].checked) {
            this.settings.imageDeformationType = r[i].value;
            break;
        }
    }
    this.settings.columns = parseFloat(document.getElementById("cols").value);
    this.settings.rows = Math.ceil(this.images.length / this.settings.columns);

    this.settings.bgColor = document.getElementById("color").value;

    this.settings.sizeInput = document.getElementById("singe").checked ? "single" : "all";
    if (this.settings.sizeInput === "single") {
        this.settings.cellWidth = parseFloat(document.getElementById("sizeX").value);
        this.settings.cellHeigth = parseFloat(document.getElementById("sizeY").value);
        this.settings.width = this.settings.columns * this.settings.cellWidth;
        this.settings.height = this.settings.rows * this.settings.cellHeigth;
    } else if (this.settings.sizeInput === "all") {
        this.settings.width = parseFloat(document.getElementById("sizeX").value);
        this.settings.height = parseFloat(document.getElementById("sizeY").value);
        this.settings.cellWidth = this.settings.width / this.settings.columns;
        this.settings.cellHeigth = this.settings.height / this.settings.rows;
    } else {
        throw "IncorrectParameterException";
    }
};

