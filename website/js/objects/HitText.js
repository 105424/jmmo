var HitText = function(x,y,dmg){

  this.id = getNewId();
  this.image = "hitText";

  Bullet.superclass.constructor.call(this,{
    "id":this.id,
    "x":x,
    "y":y,
    "spdY":-5,
    "hard":false
  });


  //console.log("update");

  this.creation = new Date().getTime();

}
extend(HitText, DrawableObject);

HitText.prototype.update = function(){
  HitText.superclass.update.call(this);

  if(this.creation < new Date().getTime() - 300 ){
    this.quit();
  }

}