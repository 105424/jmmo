var Bullet = function(x, y, spdX, spdY, shotee){

  this.id = 42;

  var isUniquId = false;
  while(isUniquId == false)
  {
    this.id = Math.floor((Math.random()*1000000)+1);
    if(objects[this.id] != false){
      isUniquId = true;
    }
  }

  this.image = "bullet";
  this.faction = objects[shotee].faction;

  Bullet.superclass.constructor.call(this,{
    "id":this.id,
    "x":x,
    "y":y,
    "spdX":spdX,
    "spdY":spdY,
  });


  this.startX = this.x;
  this.startY = this.y;

  this.radius = 10;
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