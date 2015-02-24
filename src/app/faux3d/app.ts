/// <reference path="./utils/__package__.ts" />
/// <reference path="./elements/__package__.ts" />
/// <reference path="./world/__package__.ts" />

module faux3d {
  import Player = elements.Player;
  import ColorUtils = utils.ColorUtils;
  import Point =  elements.Point;

  // Screen Size
  var screenWidth:number = 640;
  var screenHeight:number = 480;

  // Camera Setup
  var focalLength = 0.8;
  var depth = 20;
  var lookingAt = 90;
  var distance = 480;
  var scale = 2.0;

  // Create the player
  var player = new Player(ColorUtils.RED, new Point(0, 0), lookingAt, screenWidth, focalLength, distance);


  // Create the world.
  world.WorldUtils.BoxWorld(<HTMLCanvasElement>document.getElementById('2dview'),
    <HTMLCanvasElement>document.getElementById('3dview'),
    player,
    scale, distance);

}
