var ImageMesh = {
    settings: {
        sizeInput: "",
        width: 800,
        height: 600,
        cellWidth: 300,
        cellHeigth: 200,
        columns: 4,
        rows: 4,
        bgColor: "#FBFBE7",
        imageDeformationType: "fit",
        labels: {
            enable: false,
            first: 0,
            type: "numbers",
            fontSize: 30
        }
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
    document.getElementById("save").addEventListener("click", function () {
        Draw.saveImageAsPng();
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

    this.settings.bgColor = this.convertHex(document.getElementById("color").value, document.getElementById("alpha").value);

    this.settings.labels.enable = !!document.getElementById("labelsToggle").checked;
    this.settings.labels.fontSize = parseInt(document.getElementById("fontSize").value);
    var types = document.getElementsByClassName("labels");
    for (var i = 0; i < types.length; i++) {
        if (types[i].checked) {
            this.settings.labels.type = types[i].value;
            switch (types[i].value) {
                case "numbers":
                    this.settings.labels.first = document.getElementById("labelsFirstNumber").value;
                    break;
                case "alphabet":
                    this.settings.labels.first = document.getElementById("labelsFirstLetter").value;
                    break;
            }
        }
    }

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

ImageMesh.convertHex = function(hex, opacity){
    hex = hex.replace('#','');
    r = parseInt(hex.substring(0,2), 16);
    g = parseInt(hex.substring(2,4), 16);
    b = parseInt(hex.substring(4,6), 16);

    result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
    return result;
}

