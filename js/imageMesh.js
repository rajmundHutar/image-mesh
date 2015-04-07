function ImageMesh(){
    this.settings = {};
    this.images = [];
}    

ImageMesh.prototype.draw = function(){
    for(i in this.images){
        var img = this.images[i];
        $(".page").append("<img src=" + img.src + " style='width:100px;height:100px;'>");
    }
};

ImageMesh.prototype.loadSettings = function(){
    
};

ImageMesh.prototype.loadImages = function(images){
    this.images = images;
    this.draw();
};

ImageMesh.prototype.makeAlert = function(message){
    console.log(message);
};
