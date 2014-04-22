var Bullet = function(x, y, spdX, spdY, shotee){

  this.id = getNewId();

  this.image = "bullet";
  this.faction = objects[shotee].faction;
  this.color = "#f00";

  Bullet.superclass.constructor.call(this,{
    "id":this.id,
    "x":x,
    "y":y,
    "spdX":spdX,
    "spdY":spdY,
  });

  this.startX = this.x;
  this.startY = this.y;

  this.range = 1000;

  this.ownerId = shotee;

};
extend(Bullet, DrawableObject);

Bullet.prototype.update = function(){
  Bullet.superclass.update.call(this);

  if( Math.abs( this.x - this.startX) + Math.abs(this.y - this.startY)  > this.range){

    this.quit();
  } 

}

Bullet.prototype.hasHit = function(objectId){
  this.quit();
}