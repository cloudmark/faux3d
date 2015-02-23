var faux3d;
(function (faux3d) {
    var utils;
    (function (utils) {
        var ColorUtils = (function () {
            function ColorUtils() {
            }
            ColorUtils.WHITE = '#FFFFFF';
            ColorUtils.RED = '#FF0000';
            ColorUtils.GREEN = '#00FF00';
            ColorUtils.BLUE = '#0000FF';
            return ColorUtils;
        })();
        utils.ColorUtils = ColorUtils;
    })(utils = faux3d.utils || (faux3d.utils = {}));
})(faux3d || (faux3d = {}));
var faux3d;
(function (faux3d) {
    var utils;
    (function (utils) {
        var MathUtils = (function () {
            function MathUtils() {
            }
            MathUtils.degreesToRadians = function (degree) {
                return (degree % 360) * (Math.PI / 180.0);
            };
            return MathUtils;
        })();
        utils.MathUtils = MathUtils;
    })(utils = faux3d.utils || (faux3d.utils = {}));
})(faux3d || (faux3d = {}));
/// <reference path="color.ts" />
/// <reference path="math.ts" />
var faux3d;
(function (faux3d) {
    var events;
    (function (events) {
        (function (Direction) {
            Direction[Direction["up"] = 0] = "up";
            Direction[Direction["down"] = 1] = "down";
            Direction[Direction["left"] = 2] = "left";
            Direction[Direction["right"] = 3] = "right";
        })(events.Direction || (events.Direction = {}));
        var Direction = events.Direction;
        var KeyboardPressedEvent = (function () {
            function KeyboardPressedEvent(direction, distance) {
                this.direction = direction;
                this.distance = distance;
            }
            return KeyboardPressedEvent;
        })();
        events.KeyboardPressedEvent = KeyboardPressedEvent;
    })(events = faux3d.events || (faux3d.events = {}));
})(faux3d || (faux3d = {}));
/// <reference path="events.ts" />
/// <reference path="./base.ts" />
/// <reference path="../events/events.ts" />
/// <reference path="../utils/math.ts" />
var faux3d;
(function (faux3d) {
    var elements;
    (function (elements) {
        var MathUtils = faux3d.utils.MathUtils;
        var Point = (function () {
            function Point(x, y) {
                this.x = x;
                this.y = y;
            }
            Point.prototype.move = function (angle, distance) {
                return new Point(this.x + distance * Math.cos(MathUtils.degreesToRadians(angle)), this.y + distance * Math.sin(MathUtils.degreesToRadians(angle)));
            };
            Point.prototype.distance = function (p) {
                return Math.sqrt(Math.pow(p.x - this.x, 2) + Math.pow(p.y - this.y, 2));
            };
            Point.prototype.draw2d = function (context, origin) {
            };
            return Point;
        })();
        elements.Point = Point;
    })(elements = faux3d.elements || (faux3d.elements = {}));
})(faux3d || (faux3d = {}));
/// <reference path="./base.ts" />
/// <reference path="../events/events.ts"/>
var faux3d;
(function (faux3d) {
    var elements;
    (function (elements) {
        var Line = (function () {
            function Line(start, end) {
                this.start = start;
                this.end = end;
                this.start = start;
            }
            Line.prototype.collision = function (line) {
                var collision = null;
                var s1 = new elements.Point(this.end.x - this.start.x, this.end.y - this.start.y);
                var s2 = new elements.Point(line.end.x - line.start.x, line.end.y - line.start.y);
                var s, t;
                s = (-s1.y * (this.start.x - line.start.x) + s1.x * (this.start.y - line.start.y)) / (-s2.x * s1.y + s1.x * s2.y);
                t = (s2.x * (this.start.y - line.start.y) - s2.y * (this.start.x - line.start.x)) / (-s2.x * s1.y + s1.x * s2.y);
                if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
                    collision = new elements.Point(this.start.x + (t * s1.x), this.start.y + (t * s1.y));
                }
                return collision;
            };
            Line.prototype.draw2d = function (context, origin) {
            };
            return Line;
        })();
        elements.Line = Line;
    })(elements = faux3d.elements || (faux3d.elements = {}));
})(faux3d || (faux3d = {}));
/// <reference path="./../events/events.ts" />
/// <reference path="./point.ts" />
/// <reference path="./line.ts" />
var faux3d;
(function (faux3d) {
    var elements;
    (function (elements) {
        var Element = (function () {
            function Element(lines, color) {
                this.lines = lines;
                this.color = color;
            }
            Element.prototype.collision = function (element) {
                var intersections = [];
                this.lines.forEach(function (p) {
                    element.lines.forEach(function (o) {
                        var collision = p.collision(o);
                        if (collision)
                            intersections.push(collision);
                    });
                });
                return intersections;
            };
            Element.prototype.move = function (event) {
            };
            Element.prototype.update = function (current, tick) {
            };
            Element.prototype.draw2d = function (context, origin) {
                this.lines.forEach(function (l) {
                    context.beginPath();
                    context.moveTo(origin.x + l.start.x, origin.y + l.start.y);
                    context.lineTo(origin.x + l.end.x, origin.y + l.end.y);
                    context.strokeStyle = "black";
                    context.stroke();
                });
            };
            return Element;
        })();
        elements.Element = Element;
    })(elements = faux3d.elements || (faux3d.elements = {}));
})(faux3d || (faux3d = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="./base.ts" />
/// <reference path="../events/events.ts" />
var faux3d;
(function (faux3d) {
    var elements;
    (function (elements) {
        var Path = (function (_super) {
            __extends(Path, _super);
            function Path(color) {
                var points = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    points[_i - 1] = arguments[_i];
                }
                var lines = [];
                if (!points || points.length < 3)
                    throw new Error("Invalid Path Defined");
                for (var i = 0; i < points.length; i++) {
                    lines.push(new elements.Line(points[i], points[i + 1 % points.length]));
                }
                _super.call(this, lines, color);
            }
            return Path;
        })(elements.Element);
        elements.Path = Path;
    })(elements = faux3d.elements || (faux3d.elements = {}));
})(faux3d || (faux3d = {}));
/// <reference path="./base.ts" />
/// <reference path="../events/events.ts" />
var faux3d;
(function (faux3d) {
    var Direction = faux3d.events.Direction;
    var elements;
    (function (elements) {
        var Player = (function (_super) {
            __extends(Player, _super);
            function Player(color, origin, angle, rays, fieldOfView, distance) {
                _super.call(this, null, color);
                this.color = color;
                this.origin = origin;
            }
            Player.prototype.move = function (event) {
                switch (event.direction) {
                    case 0 /* up */:
                        {
                            break;
                        }
                    case 1 /* down */:
                        {
                            break;
                        }
                    case 2 /* left */:
                        {
                            break;
                        }
                    case 3 /* right */:
                        {
                            break;
                        }
                }
            };
            return Player;
        })(elements.Element);
        elements.Player = Player;
    })(elements = faux3d.elements || (faux3d.elements = {}));
})(faux3d || (faux3d = {}));
/// <reference path="./base.ts" />
/// <reference path="../events/events.ts" />
var faux3d;
(function (faux3d) {
    var elements;
    (function (elements) {
        var Rectangle = (function (_super) {
            __extends(Rectangle, _super);
            function Rectangle(color, bottomLeft, topRight) {
                _super.call(this, null, color);
                this.lines = [];
            }
            return Rectangle;
        })(elements.Element);
        elements.Rectangle = Rectangle;
    })(elements = faux3d.elements || (faux3d.elements = {}));
})(faux3d || (faux3d = {}));
/// <reference path="./../base.ts" />
/// <reference path="./../base.ts" />
var faux3d;
(function (faux3d) {
    var graph;
    (function (graph) {
        var Graph = (function () {
            function Graph() {
            }
            return Graph;
        })();
        graph.Graph = Graph;
    })(graph = faux3d.graph || (faux3d.graph = {}));
})(faux3d || (faux3d = {}));
/// <reference path="graph.ts" />
/// <reference path="axis.ts" />
/// <reference path="../events/__package__.ts" />
/// <reference path="base.ts" />
/// <reference path="line.ts" />
/// <reference path="path.ts" />
/// <reference path="player.ts" />
/// <reference path="point.ts" />
/// <reference path="rectangle.ts" />
/// <reference path="./graph/__package__.ts" />
/// <reference path="../elements/__package__.ts" />
/// <reference path="../utils/__package__.ts" />
var faux3d;
(function (faux3d) {
    var Path = faux3d.elements.Path;
    var Point = faux3d.elements.Point;
    var ColorUtils = faux3d.utils.ColorUtils;
    var world;
    (function (world) {
        var World = (function () {
            function World(canvas, player, enableUpdate) {
                var _this = this;
                var elements = [];
                for (var _i = 3; _i < arguments.length; _i++) {
                    elements[_i - 3] = arguments[_i];
                }
                this.canvas = canvas;
                this.player = player;
                this.context = canvas.getContext("2d");
                this.origin = new Point(canvas.width / 2, canvas.height / 2);
                this.lastTime = new Date().getTime();
                this.elements = elements;
                // Hook up the key pressed events.
                window.onkeypress = function (e) {
                    console.log(e.keyCode, e.which);
                    _this.updatePlayer();
                    _this.drawWorld();
                };
                // Send an update to our world every 100 milliseconds
                if (enableUpdate) {
                    setInterval(function () {
                        _this.updateWorld();
                        _this.drawWorld();
                    }, 100);
                }
                // Draw the world
            }
            World.prototype.updatePlayer = function () {
                var _this = this;
                this.elements.forEach(function (element) {
                    var points = _this.player.collision(element);
                    points.forEach(function (p) {
                        p.draw2d(_this.context, _this.origin);
                    });
                });
            };
            World.prototype.updateWorld = function () {
                var _this = this;
                var previousTime = this.lastTime;
                this.lastTime = new Date().getTime();
                this.elements.forEach(function (element) {
                    element.update(previousTime, _this.lastTime - previousTime);
                });
            };
            World.prototype.drawWorld = function () {
                var _this = this;
                this.elements.forEach(function (element) {
                    element.draw2d(_this.context, _this.origin);
                });
            };
            return World;
        })();
        world.World = World;
        var WorldUtils = (function () {
            function WorldUtils() {
            }
            WorldUtils.BoxWorld = function (canvas, player, scale) {
                return new World(canvas, player, false, new Path(ColorUtils.WHITE, new Point(1, 1), new Point(1, 15 * scale), new Point(15 * scale, 15 * scale), new Point(15 * scale, 1)));
            };
            return WorldUtils;
        })();
        world.WorldUtils = WorldUtils;
    })(world = faux3d.world || (faux3d.world = {}));
})(faux3d || (faux3d = {}));
/// <reference path="world.ts" />
/// <reference path="./utils/__package__.ts" />
/// <reference path="./elements/__package__.ts" />
/// <reference path="./world/__package__.ts" />
var faux3d;
(function (faux3d) {
    var Player = faux3d.elements.Player;
    var ColorUtils = faux3d.utils.ColorUtils;
    var Point = faux3d.elements.Point;
    // Screen Size
    var screenWidth = 640;
    var screenHeight = 480;
    // Camera Setup
    var pov = 45;
    var depth = 20;
    var lookingAt = 90;
    var distance = 10;
    var scale = 5.0;
    // Create the player
    var player = new Player(ColorUtils.RED, new Point(0, 0), lookingAt, screenWidth, pov, distance);
    // Create the world.
    faux3d.world.WorldUtils.BoxWorld(document.getElementById('2dview'), player, 1.0);
})(faux3d || (faux3d = {}));
