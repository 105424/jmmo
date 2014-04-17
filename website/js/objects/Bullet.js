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
  this.range = 1500;

  this.ownerId = shotee;

  this.intrs['update2'] = setInterval(this.update2.bind(this) ,updateSpeed,this);

};
extend(Bullet, DrawableObject);


Bullet.prototype.update2 = function(){

  if( Math.abs(this.x - this.startX) + Math.abs(this.y, this.startY) > this.range){
    this.quit();
  } 

}