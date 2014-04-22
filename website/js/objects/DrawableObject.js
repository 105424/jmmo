var DrawableObject = function(args){
  
  this.spdX = 0;
  this.spdY = 0;

  this.hard = true; // Should it be stored in the objects array
  this.imageType = "svg";

  for( key in args){
    this[key] = args[key];
  }


  this.intrs = [];
  this.img = document.createElement('img');

/*  this.width = $("#"+this.image)[0].getBBox().width;
  this.height = $("#"+this.image)[0].getBBox().height;*/

  this.addToWindow(this,function(){

    if(this.hard){
      objects[this.id] = this;
    }
    
    this.intrs['update'] = setInterval(this.update.bind(this) ,updateSpeed,this);
  
  }.bind(this));
}

DrawableObject.prototype.addToWindow = function(parent, callback) {

  parent.img.src = 'images/'+parent.image+"."+parent.imageType;

  parent.img.onload = function(){
    canvasElements[parent.id] = parent;
    parent.update();
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