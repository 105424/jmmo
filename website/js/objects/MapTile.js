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

  parent.img.src = 'images/'+parent.image+"."+parent.imageType;

  parent.img.onload = function(){
    mapTiles[parent.id] = parent;
    parent.update();
    callback();
  }
};

MapTile.prototype.quit = function(){

  clearIntertvalArray(this.intrs);

  delete mapTiles[this.id];
}