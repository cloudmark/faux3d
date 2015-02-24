/// <reference path="../elements/__package__.ts" />
/// <reference path="../utils/__package__.ts" />
/// <reference path="../events/__package__.ts" />
module faux3d {

  import Player = elements.Player;
  import Element = elements.Element;
  import Path = elements.Path;
  import Point = elements.Point;
  import ColorUtils = utils.ColorUtils;
  import KeyboardPressedEvent = events.KeyboardPressedEvent;
  import Direction = events.Direction;

  interface Window {
    keypress
  }

  export module world {
    export class World {
      public elements:Element[];
      public lastTime:number;
      public context:CanvasRenderingContext2D;
      public context3d:CanvasRenderingContext2D;
      public origin:Point;




      constructor(public canvas:HTMLCanvasElement, public canvas3d: HTMLCanvasElement,  public distance: number, public player:Player, enableUpdate:boolean, ...elements:Element[]) {
        this.context = canvas.getContext("2d");
        this.context3d = canvas3d.getContext("2d");
        this.origin = new Point(canvas.width / 2, canvas.height / 2);

        this.lastTime = new Date().getTime();
        this.elements = elements;

        // Hook up the key pressed events.
        if (window.keypress.Listener) {
          var listener = new window.keypress.Listener();
        }

        listener.simple_combo("up", () => {
          console.log("Going up!");
          this.player.move(new KeyboardPressedEvent(Direction.up, 10));
          this.clearWorld();
          this.updatePlayer();
          this.drawWorld();
        });

        listener.simple_combo("down", () => {
          console.log("Going down!");
          this.player.move(new KeyboardPressedEvent(Direction.down, 10));
          this.clearWorld();
          this.updatePlayer();
          this.drawWorld();
        });

        listener.simple_combo("left", () => {
          console.log("Going left!");
          this.player.move(new KeyboardPressedEvent(Direction.left, 10));
          this.clearWorld();
          this.updatePlayer();
          this.drawWorld();
        });

        listener.simple_combo("right", () => {
          console.log("Going right!");
          this.player.move(new KeyboardPressedEvent(Direction.right, 10));
          this.clearWorld();
          this.updatePlayer();
          this.drawWorld();
        });

        // Send an update to our world every 100 milliseconds
        if (enableUpdate) {
          setInterval(()=> {
            this.clearWorld();
            this.updateWorld();
            this.drawWorld();
          }, 100);
        }

        // Draw the world
        this.drawWorld();
      }

      updatePlayer() {
        var points = [];
        this.elements.forEach((element, index) => {
          var localPoints = this.player.collision(element);
          // Perform a linear merge.
          if (index != 0) {
            localPoints.forEach((point, li) => {
              if (points[li].distance > point.distance) {
                points[li] = point;
              }
            });
          } else {
            points = localPoints;
          }
        });

        this.context3d.clearRect(0,0,this.canvas3d.width, this.canvas3d.height);
        points.forEach((p, index) => {
          if(p.distance != Infinity){
            p.point.draw2d(this.context, this.origin);
            p.distance *= this.player.skewMatrix[index];

            var height = Math.round(this.distance/ (p.distance + 1));
            // var height = Math.round(((this.distance - p.distance)/ this.distance) * (this.canvas3d.height/2));
            var c = (this.distance - p.distance) / this.distance;
            c = Math.pow(c,10);
            var rgb = ColorUtils.hexToRgb(p.color);

            var line = new faux3d.elements.Line(new Point(index - this.origin.x,-(height)),
                                                new Point(index- this.origin.x, +(height)),
                                                'rgba('+rgb.r+','+rgb.g+','+rgb.b+',' + c + ')');
            line.draw2d(this.context3d, this.origin);

            var line2 = new faux3d.elements.Line(new Point(index- this.origin.x, -height),
              new Point(index- this.origin.x, -1000),'rgba(0,0,0,1)');
            line2.draw2d(this.context3d, this.origin);

            line2 = new faux3d.elements.Line(new Point(index- this.origin.x, height),
              new Point(index- this.origin.x, +1000),'#DDDDDD');
            line2.draw2d(this.context3d, this.origin);


          } else {
            var line2 = new faux3d.elements.Line(new Point(index- this.origin.x, 0),
              new Point(index- this.origin.x, -1000),'rgba(0,0,0,1)');
            line2.draw2d(this.context3d, this.origin);

            line2 = new faux3d.elements.Line(new Point(index- this.origin.x, 0),
              new Point(index- this.origin.x, +1000),'#DDDDDD');
            line2.draw2d(this.context3d, this.origin);

          }



        });
      }


      clearWorld() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      updateWorld() {
        var previousTime = this.lastTime;
        this.lastTime = new Date().getTime();

        this.elements.forEach((element) => {
          element.update(previousTime, this.lastTime - previousTime);
        });
      }

      drawWorld() {
        this.player.draw2d(this.context, this.origin);
        this.elements.forEach((element) => {
          element.draw2d(this.context, this.origin);
        });
      }

    }

    export class WorldUtils {
      public static BoxWorld(canvas:HTMLCanvasElement, canvas3d: HTMLCanvasElement, player:Player, scale:number, distance: number) {
        return new World(canvas, canvas3d, distance, player, false,
          new Path(ColorUtils.RED,
            new Point(10, 10),
            new Point(10, 15 * scale),
            new Point(15 * scale, 15 * scale),
            new Point(15 * scale, 10)
          ),
          new Path(ColorUtils.GREEN,
            new Point(-10, 10),
            new Point(-10, 15 * scale),
            new Point(-15 * scale, 15 * scale),
            new Point(-15 * scale, 10)
          ),
          new Path(ColorUtils.RED,
            new Point(-10, -10),
            new Point(-10, -15 * scale),
            new Point(-15 * scale, -15 * scale),
            new Point(-15 * scale, -10)
          ),
          new Path(ColorUtils.GREEN,
            new Point(10, -10),
            new Point(10, -15 * scale),
            new Point(15 * scale, -15 * scale),
            new Point(15 * scale, -10)
          ));
      }

      public static CheckPerspective(canvas:HTMLCanvasElement, canvas3d: HTMLCanvasElement, player:Player, scale:number, distance: number) {
        return new World(canvas, canvas3d, distance, player, false,
          new Path(ColorUtils.RED,
            new Point(-5*scale, -5*scale),
            new Point(-5*scale, 5*scale),
            new Point(5*scale, 5*scale),
            new Point(5*scale, -5*scale)
          ));
      }
    }
  }

}
