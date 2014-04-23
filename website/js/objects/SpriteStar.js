var SpriteStar = function(x, y, spdX, spdY, shotee){

  this.id = getNewId();

  this.image = "spriteStar";

  this.faction = shotee.faction;

  this.width = 100;
  this.height = 100;
  this.radius = 40;

  SpriteStar.superclass.constructor.call(this,{
    "id":this.id,
    "x":x,
    "y":y,
    "spdX":spdX,
    "spdY":spdY,
    "imageType":"png"
  });

  this.startX = this.x;
  this.startY = this.y;

  this.range = 1000;
  this.ownerId = shotee;

  

};
extend(SpriteStar, DrawableObject);

SpriteStar.prototype.update = function(){
  Bullet.superclass.update.call(this);

  if( Math.abs( this.x - this.startX) + Math.abs(this.y - this.startY)  > this.range){
    this.quit();
  }

}

SpriteStar.prototype.hasHit = function(objectId){
  this.quit();
}