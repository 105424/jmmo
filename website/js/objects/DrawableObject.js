var DrawableObject = function(args){
  
  this.spdX = 0;
  this.spdY = 0;

  this.hard = true; // Should it be stored in the objects array
  this.imageType = "svg";

  this.hp = 0;

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

  if(this.hard){
    var chunk = lowerTo(this.x, chunkSize) + "," + lowerTo(this.y, chunkSize);

    if(this.chunk != chunk){

      if(collisionMap[chunk] == null){
        collisionMap[chunk] = {};
      }

      if(collisionMap[this.chunk]){
        if(collisionMap[this.chunk][this.id]){
          delete collisionMap[this.chunk][this.id];
        }
      }

      collisionMap[chunk][this.id] = this;

      this.chunk = chunk;
    }
  }

}


DrawableObject.prototype.die = function(){
  this.quit();
}

DrawableObject.prototype.quit = function(){

  clearIntertvalArray(this.intrs);
/*
  if(this.type == "enemy"){
    if(canvasElements[this.id]){
      console.log(this.id+" found in canvasElements");
    }else{
        console.log(this.id+" NOT found in canvasElements");
    }

    if(objects[this.id]){
      console.log(this.id+" found in objects");
    }else{
        console.log(this.id+" NOT found in objects");
    }
  }*/

  delete canvasElements[this.id];
  delete objects[this.id];

  if(this.hard){
    
/*    if(this.type == "enemy"){
      if(collisionMap[this.chunk][this.id]){
        console.log(this.id+" found in collisionMap");
      }else{
        console.log(this.id+" NOT found in collisionMap");
      }
    }
*/
    delete collisionMap[this.chunk][this.id];
  }

}

DrawableObject.prototype.collisionCheck = function(){

  for(id in collisionMap[this.chunk]){
    var obj = collisionMap[this.chunk][id];
    if(id != this.id && obj.faction != "static" && obj.faction != this.faction){
      if ( Math.abs(obj.x - this.x) + Math.abs(obj.y - this.y) < obj.radius + this.radius ){
        obj.hasHit(this);
        this.wasHit(obj);
      }
    }
  }
}