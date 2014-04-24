var port = 2000;
var addres = "localhost";

var connection;

var canvas;
var mapTiles = {};
var canvasElements = {};
var drawSpeed = 20;

var drawHitBox = false;

var objects = {};

var standartWidth = 1920;
var standartHeight = 1080;
var widthRatio;
var heightRatio;

var standartPlayerMaxSpeed = 10;
var standartPlayerBulletSpeed = 15;
var standartPlayerAccSpeed = 2;
var standartPlayerShootSpeed = 100;


var updateSpeed = 20;
var collisionCheckSpeed = 20;

var playerId;
var commandMap;

var useTimeStamps = false;

var offsetX = 0;
var offestY = 0;

var mapState = {
  "loaded":{},
  "current":""
}

var images = {};

var messageStack = [];
var stackSpeed = 50;

var chunkSize = 500;
var collisionMap = {};

var drawExtraSpaceX = 192;
var drawExtraSpaceY = 108;

var lagging;
