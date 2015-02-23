/// <reference path="../bower_components/dt-jasmine/jasmine.d.ts"/>
/// <reference path="../dist/release/definitions/elements/__package__.d.ts"/>

describe("Point Suite", () => {
  it("Should Initialise with correct start and end point", () => {
    var start = new faux3d.elements.Point(-3,0);
    var end = new faux3d.elements.Point(3,0);
    var line = new faux3d.elements.Line(start, end);
    expect(line.start).toBe(start);
    expect(line.end).toBe(end);
  });

  it("Should Move Correctly (angle 0, distance 10)", () => {
    var start = new faux3d.elements.Point(-3,0);
    var line = new faux3d.elements.Line(start, start.move(0, 10));

    expect(line.start).toBe(start);
    expect(line.end.x).toBe(7);
    expect(line.end.y).toBe(0);
  });

  it("Should Move Correctly (angle 90, distance 10)", () => {
    var start = new faux3d.elements.Point(-3,0);
    var line = new faux3d.elements.Line(start, start.move(90, 10));

    expect(line.start).toBe(start);
    expect(line.end.x).toBeCloseTo(-3,0.00000001);
    expect(line.end.y).toBe(10);
  });

  it("Should Move Correctly (angle 180, distance 10)", () => {
    var start = new faux3d.elements.Point(-3,0);
    var line = new faux3d.elements.Line(start, start.move(180, 10));

    expect(line.start).toBe(start);
    expect(line.end.x).toBe(-13);
    expect(line.end.y).toBeCloseTo(0, 0.00000001);
  });

  it("Should Move Correctly (angle 270, distance 10)", () => {
    var start = new faux3d.elements.Point(-3,0);
    var line = new faux3d.elements.Line(start, start.move(270, 10));

    expect(line.start).toBe(start);
    expect(line.end.x).toBeCloseTo(-3, 0.00000001);
    expect(line.end.y).toBe(-10);
  });

});

