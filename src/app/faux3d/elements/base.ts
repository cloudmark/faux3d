/// <reference path="./../events/events.ts" />
/// <reference path="./../utils/__package__.ts" />
module faux3d {
  export module elements {
    import KeyboardPressedEvent = events.KeyboardPressedEvent;
    import MathUtils = faux3d.utils.MathUtils;

    export interface Drawable {
      draw2d(context:CanvasRenderingContext2D, origin:Point);
    }

    export interface Movable {
      move(event:KeyboardPressedEvent);
    }

    export interface Updateable {
      update(current:number, tick:number);
    }

    export class Point implements Drawable {
      constructor(public x:number, public y:number) {
      }

      move(angle:number, distance:number) {
        return new Point(
          this.x + distance * Math.cos(MathUtils.degreesToRadians(angle)),
          this.y + distance * Math.sin(MathUtils.degreesToRadians(angle))
        )
      }

      distance(p:Point) {
        return Math.sqrt(Math.pow(p.x - this.x, 2) + Math.pow(p.y - this.y, 2));
      }

      rotate(angle: number) {
        var radAngle = MathUtils.degreesToRadians(angle);
        return new Point(
          this.x * Math.cos(radAngle) - this.y * Math.sin(radAngle),
          this.x * Math.sin(radAngle) + this.y * Math.cos(radAngle)
        );
      }

      draw2d(context:CanvasRenderingContext2D, origin:Point) {
        var centerX = origin.x + this.x;
        var centerY = origin.y - this.y;
        var radius = 5;
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.fillStyle = 'rgba(00,00,00,0.2)';
        context.fill();
        context.lineWidth = 3;
        context.strokeStyle = 'rgba(00,33,00,0.2)';
        context.stroke();
      }

    }

    export class Line implements Drawable {
      constructor(public start:Point, public end:Point, public color: string) {}

      collision(line:Line): { point: Point; color: string} {
        var collision:Point = null;
        var s1:Point = new Point(this.end.x - this.start.x, this.end.y - this.start.y);
        var s2:Point = new Point(line.end.x - line.start.x, line.end.y - line.start.y);

        var s, t:number;
        s = (-s1.y * (this.start.x - line.start.x) + s1.x * (this.start.y - line.start.y)) / (-s2.x * s1.y + s1.x * s2.y);
        t = ( s2.x * (this.start.y - line.start.y) - s2.y * (this.start.x - line.start.x)) / (-s2.x * s1.y + s1.x * s2.y);

        if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
          collision = new Point(this.start.x + (t * s1.x), this.start.y + (t * s1.y));
        }
        return { point: collision, color: this.color } ;
      }

      draw2d(context:CanvasRenderingContext2D, origin:Point) {
        context.beginPath();
        context.lineWidth = 1;
        context.moveTo(origin.x + this.start.x, origin.y - this.start.y);
        context.lineTo(origin.x + this.end.x, origin.y - this.end.y);
        context.strokeStyle = this.color;
        context.stroke();
      }

    }

    export class Element implements Movable, Updateable, Drawable {
      constructor(public lines:Line[], public color:string) {
      }

      collision(element:Element):Point[] {
        var intersections:Point[] = [];

        this.lines.forEach((p:Line) => {
          element.lines.forEach((o) => {
            var collision = p.collision(o);
            if (collision) intersections.push(collision);
          })
        });
        return intersections;
      }

      move(event:KeyboardPressedEvent) {
      }

      update(current:number, tick:number) {
      }

      draw2d(context:CanvasRenderingContext2D, origin:Point) {
        if (this.lines) {
          this.lines.forEach((l:Line) => {
            l.draw2d(context, origin);
          });
        }
      }
    }
  }
}
