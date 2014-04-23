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

  this.faction = "static";

  this.intrs['collison'] = setInterval(this.collisionCheck.bind(this),collisionCheckSpeed);

}
extend(Rock, DrawableObject);

Rock.prototype.hasHit = function(objectId){

}


Rock.prototype.wasHit = function(objectId){

}