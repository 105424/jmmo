var MapTile = function(x, y, image){

  this.id = getNewId();

  this.image = image;
  
  this.width = 192;
  this.height = 108;

  MapTile.superclass.constructor.call(this,{
    "id":this.id,
    "x":x,
    "y":y,
    "imageType":"png",
    "hard":false
  });

};
extend(MapTile, DrawableObject);

MapTile.prototype.addToWindow = function(parent, callback) {

  if(images[parent.image+"."+parent.imageType] == null){
    images[parent.image+"."+parent.imageType] = document.createElement('img');
    images[parent.image+"."+parent.imageType].src = 'images/'+parent.image+"."+parent.imageType;

    images[parent.image+"."+parent.imageType].onload = function(){
      parent.update();
      MapTiles[parent.id] = parent;
      callback();
    }

    parent.img = images[parent.image+"."+parent.imageType];
  }else{
    parent.img = images[parent.image+"."+parent.imageType];
    parent.update();
    mapTiles[parent.id] = parent;
    callback();
  }

};

MapTile.prototype.quit = function(){

  clearIntertvalArray(this.intrs);

  delete mapTiles[this.id];
}