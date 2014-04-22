var Rock = function(x,y){

  this.id = getNewId();
  this.image = "rock";

  this.width = 150;
  this.height = 150;
  this.radius = 50;

  Bullet.superclass.constructor.call(this,{
    "id":this.id,
    "x":x,
    "y":y,
    "imageType":"png"
  });
}
extend(Rock, DrawableObject);

Rock.prototype.hasHit = function(objectId){

}

Rock.prototype.update = function(){
  Rock.superclass.update.call(this);

  for(id in objects){
    if(id != this.id && objects[id].ownerId != this.id){ // FOR TESTING ONLY
      if ( Math.abs(objects[id].x - this.x) + Math.abs(objects[id].y - this.y) < objects[id].radius + this.radius ){
        objects[id].hasHit(this.id);
      }
    }
  }
}

Rock.prototype.wasHit = function(objectId){

}