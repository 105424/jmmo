var DrawableObject = function(args){
  
  this.spdX = 0;
  this.spdY = 0;

  this.hard = true; // Should it be stored in the objects array
  this.imageType = "svg";

  for( key in args){
    this[key] = args[key];
  }

  this.intrs = [];
  this.intrs["move"] = [];
  this.intrs["shoot"] = [];
  
  this.img = document.createElement('img');

  this.addToWindow(this,function(){

    if(this.hard){
      objects[this.id] = this;
    }
    
    this.intrs['update'] = setInterval(this.update.bind(this) ,updateSpeed,this);
  

  }.bind(this));
}

DrawableObject.prototype.addToWindow = function(parent, callback) {

  if(images[parent.image+"."+parent.imageType] == null){
    images[parent.image+"."+parent.imageType] = document.createElement('img');
    images[parent.image+"."+parent.imageType].src = 'images/'+parent.image+"."+parent.imageType;

    images[parent.image+"."+parent.imageType].onload = function(){
      parent.update();
      canvasElements[parent.id] = parent;
      callback();
    }

    parent.img = images[parent.image+"."+parent.imageType];
  }else{
    parent.img = images[parent.image+"."+parent.imageType];
    parent.update();
    canvasElements[parent.id] = parent;
    callback();
  }

};

DrawableObject.prototype.update = function(){

  this.x = this.x + this.spdX;
  this.y = this.y + this.spdY;
}

DrawableObject.prototype.quit = function(){

  clearIntertvalArray(this.intrs);

  delete canvasElements[this.id];
  delete objects[this.id];
}

DrawableObject.prototype.collisionCheck = function(){

  for(id in objects){
    var obj = objects[id];
    if(id != this.id && obj.faction != "static" && obj.faction != this.faction){

      var xD = Math.abs(obj.x - this.x);
      if(xD < this.width){
        var yD = Math.abs(obj.y - this.y);
        if(yD < this.height){
          if ( xD + yD < obj.radius + this.radius ){
            obj.hasHit(this.id);
            this.wasHit(obj);
          }
        }
      }
    }
  }
}