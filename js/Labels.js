var Labels = {
    type: "",
    current: 0
};

Labels.init = function(){
    this.type = ImageMesh.settings.labels.type;
    switch (this.type){
        case "numbers":
            this.current = parseInt(ImageMesh.settings.labels.first);
            break;
        case "alphabet":
            this.current = ImageMesh.settings.labels.first.toUpperCase();
            break;
        default:
            throw "IncorrectParameterException";            
    }    
}

Labels.getNextLabel = function(){
    var next;
    switch (this.type){
        case "numbers":
            next = this._getNextNumber(this.current);
            break;
        case "alphabet":
            next = this._getNextLetter(this.current);
            break;
        default:
            throw "IncorrectParameterException";
    }
    var ret = this.current;
    this.current = next;
    return ret;
};

Labels._getNextLetter = function(current){
    var toAdd = 1;
    var string = "";
    for (var i = current.length - 1; i >= 0; i--){
        var char = current.charCodeAt(i);
        if (toAdd === 1){
            char++;
            toAdd = 0;
        }
        if (char === 91){
            char = 65;
            toAdd = 1;
        }
        string = String.fromCharCode(char) + string;
    }
    if (toAdd > 0){
        string = "A" + string;
    }
    return string;
};

Labels._getNextNumber = function(current){
    return ++current;
};