/// <reference path="./base.ts" />
/// <reference path="../events/events.ts" />
/// <reference path="../utils/__package__.ts" />

module faux3d {
  import KeyboardPressedEvent = events.KeyboardPressedEvent;
  import Direction = events.Direction;

  export module elements {
    export class Player extends Element {
      public skewMatrix: number[] = [];
      constructor(public color:string, public origin:Point, public angle:number, public rays:number, public fieldOfView:number, public distance:number) {
        super([], color);
        this.lines = this.getRays();
        var halfPov = this.fieldOfView / 2;
        var step = this.fieldOfView / this.rays;
        var startAngle = 0 - halfPov;
        //for (var i = 0; i < this.rays; i++) {
        //  var opp = this.distance * Math.tan(faux3d.utils.MathUtils.degreesToRadians(startAngle));
        //  this.skewMatrix.push(
        //    Math.sqrt(
        //      (this.distance * this.distance) + (opp * opp)
        //    ) / this.distance
        //  );
        //  startAngle += step;
        //}
        for (var i = 0; i < this.rays; i++) {
          var opp = faux3d.utils.MathUtils.degreesToRadians(startAngle);
          this.skewMatrix.push(
            Math.cos(opp)
          );
          startAngle += step;
        }
      }

      getRays() {
        var rays = [];
        var halfPov = this.fieldOfView / 2;
        var step = this.fieldOfView / this.rays;
        var startAngle = this.angle + halfPov;
        for (var i = 0; i < this.rays; i++) {
          rays.push(new Line(this.origin.move(startAngle, 0), this.origin.move(startAngle, this.distance),'rgba(0,0,0,0.2)'));
          startAngle -= step;
        }
        return rays;
      }

      move(event:KeyboardPressedEvent) {
        switch (event.direction) {
          case Direction.up:
          {
            this.origin = this.origin.move(this.angle, 2);
            this.lines = this.getRays();
            break;
          }
          case Direction.down:
          {
            this.origin = this.origin.move(this.angle, -2);
            this.lines = this.getRays();
            break;
          }
          case Direction.left:
          {
            this.angle += 2;
            this.lines = this.getRays();
            break;
          }
          case Direction.right:
          {
            this.angle -= 2;
            this.lines = this.getRays();
            break;
          }
        }
      }

      draw2d(context:CanvasRenderingContext2D, origin:Point) {
        var centerX = origin.x + this.origin.x;
        var centerY = origin.y - this.origin.y;
        var radius = 5;
        context.strokeStyle = 'rgba(255,0,0,.4)';
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();
        context.lineWidth = 5;
        context.stroke();


        if (this.lines) {
          this.lines.forEach((l)=> {
            context.lineWidth = 1;
            context.strokeStyle = '#FF0000';
            l.draw2d(context, origin);
          });
        }

      }

      collision(element:Element):Point[] {
        var collisions = [];
        // For each of the rays we will detect the lines.
        this.lines.forEach((ray, i)=> {
          var localCollisions = [];
          element.lines.forEach((l)=> {
            localCollisions.push(l.collision(ray));
          });

          var minimalCollision = localCollisions.filter((collision) => {
            return collision.point !== null;
          }).map((collision)=>{
              return {
                point: collision.point,
                color: collision.color,
                distance: this.origin.distance(collision.point)
              }
          }).sort((a,b) => {
            return a.distance - b.distance
          });

          if (minimalCollision.length != 0){
            collisions.push(minimalCollision.shift());
          } else {
            collisions.push( {
                point: undefined,
                color: undefined,
                distance: Infinity
            });
          }

        });
        return collisions;
      }

      update(current:number, tick:number) {

      }

    }

  }
}
