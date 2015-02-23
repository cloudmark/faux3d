/// <reference path="./base.ts" />
/// <reference path="../events/events.ts" />
module faux3d {
  export module elements {
    import KeyboardPressedEvent = faux3d.events.KeyboardPressedEvent;

    export class Path extends Element {

      constructor(color:string, ...points:Point[]) {
        var lines = [];
        if (!points || points.length < 3) throw new Error("Invalid Path Defined");
        for (var i = 0; i < points.length; i++) {
          var start = points[i];
          var end = points[(i + 1) % points.length];
          lines.push(new Line(start,end, color));
          console.log("Creating Line: ", start, end);
        }
        super(lines, color);
      }
    }
  }
}
