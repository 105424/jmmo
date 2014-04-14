var User = function(id){

  this.id = id;

  this.connection;
  this.intrs = []; // hold all intervals so they can be deleted


}; 

User.prototype.quit = function(){

  for (var i = 0 ; i < this.intrs;i++)
  {
    clearInterval(this.intrs[i]);
  }
  delete users[this.id];
};




























