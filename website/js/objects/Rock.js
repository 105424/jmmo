var Rock = function(x,y){

  this.id = getNewId();
  this.image = "rock";

  Bullet.superclass.constructor.call(this,{
    "id":this.id,
    "x":x,
    "y":y
  });
}
extend(Rock, DrawableObject);