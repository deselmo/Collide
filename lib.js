var __extends = (this && this.__extends) || function(d, b) {
  for (var p in b)
    if (b.hasOwnProperty(p)) d[p] = b[p];

  function __() {
    this.constructor = d;
  }
  d.prototype = b === undefined ? Object.create(b) : (__.prototype = b.prototype, new __());
};

var Cookie = function() {

  this.write = function(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  };

  this.read = function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  this.erase = function(name) {
    createCookie(name, "", -1);
  };

  return this;
}();

var Vector = (function() {
  function Vector(X, Y) {
    if (X) this.X = X;
    else this.X = 0;
    if (Y) this.Y = Y;
    else this.Y = 0;
  }
  Vector.prototype.set = function(X, Y) {
    this.X = X;
    this.Y = Y;
    this.saveMagnitude = undefined;
    this.saveNormalize = undefined;
    this.saveString = undefined;
  };

  Vector.prototype.magnitude = function() {
    if (!this.saveMagnitude)
      this.saveMagnitude = Math.sqrt(this.X * this.X + this.Y * this.Y);
    return this.saveMagnitude;
  };
  Vector.prototype.add = function(vector) {
    return new Vector(this.X + vector.X, this.Y + vector.Y);
  };
  Vector.prototype.subtract = function(vector) {
    return new Vector(this.X - vector.X, this.Y - vector.Y);
  };
  Vector.prototype.multiply = function(scalar) {
    return new Vector(this.X * scalar, this.Y * scalar);
  };
  Vector.prototype.divide = function(scalar) {
    return new Vector(this.X / scalar, this.Y / scalar);
  };
  Vector.prototype.perp = function(vector) {
    return new Vector(-this.Y, this.X);
  };
  Vector.prototype.dot = function(vector) {
    return this.X * vector.X + this.Y * vector.Y;
  };
  Vector.prototype.normalize = function() {
    if (!this.saveNormalize) {
      var magnitude = this.magnitude();
      this.saveNormalize = (magnitude) ? this.divide(magnitude) : new Vector();
    }
    return this.saveNormalize;
  };
  Vector.prototype.rotate = function(alpha) {
    return new Vector(
      this.X * Math.cos(alpha) - this.Y * Math.sin(alpha),
      this.X * Math.sin(alpha) + this.Y * Math.cos(alpha));
  };

  Vector.prototype.overlap = function(vector) {
    if (vector.X > this.Y || this.X > vector.Y)
      return false;
    return true;
  };
  Vector.prototype.containment = function(vector) {
    if (this.X < vector.X && vector.Y < this.Y)
      return true;
    return false;
  };
  Vector.prototype.getOverlap = function(vector) {
    return Math.min(this.Y, vector.Y) - Math.max(this.X, vector.X);
  };


  Vector.prototype.toString = function() {
    if (!this.saveString)
      this.saveString = "(" + this.X + "," + this.Y + ")";
    return this.saveString;
  };

  return Vector;
}());


var Transform = (function() {

  function Transform(context) {
    this.matrix = [1, 0, 0, 1, 0, 0];
    this.stack = [];
    this.context = context;
  }


  Transform.prototype.setContext = function(context) {
    this.context = context;
  };

  Transform.prototype.getMatrix = function() {
    return this.matrix;
  };

  Transform.prototype.setMatrix = function(m) {
    this.matrix = [m[0], m[1], m[2], m[3], m[4], m[5]];

    this.setTransform();
  };

  Transform.prototype.resetMatrix = function() {
    this.matrix = [1, 0, 0, 1, 0, 0];

    this.setTransform();
  };

  Transform.prototype.cloneMatrix = function(m) {
    return [m[0], m[1], m[2], m[3], m[4], m[5]];
  };


  Transform.prototype.save = function() {
    var matrix = this.cloneMatrix(this.getMatrix());
    this.stack.push(matrix);

    if (this.context) this.context.save();
  };

  Transform.prototype.restore = function() {
    if (this.stack.length > 0) {
      var matrix = this.stack.pop();
      this.setMatrix(matrix);
    }

    if (this.context) this.context.restore();
  };


  Transform.prototype.setTransform = function() {
    if (this.context) {
      this.context.setTransform(
        this.matrix[0],
        this.matrix[1],
        this.matrix[2],
        this.matrix[3],
        this.matrix[4],
        this.matrix[5]
      );
    }
  };

  Transform.prototype.translate = function(point) {
    this.matrix[4] += this.matrix[0] * point.X + this.matrix[2] * point.Y;
    this.matrix[5] += this.matrix[1] * point.X + this.matrix[3] * point.Y;

    this.setTransform();
  };

  Transform.prototype.scale = function(size) {
    this.matrix[0] *= size.X;
    this.matrix[1] *= size.X;
    this.matrix[2] *= size.Y;
    this.matrix[3] *= size.Y;

    this.setTransform();
  };
  Transform.prototype.scaleAt = function(size, point) {
    this.translate(point);
    this.scale(size);
    this.translate(new Vector(-point.X, -point.Y));

    this.setTransform();
  };

  Transform.prototype.rotateRad = function(rad) {
    var c = Math.cos(rad);
    var s = Math.sin(rad);
    var m11 = this.matrix[0] * c + this.matrix[2] * s;
    var m12 = this.matrix[1] * c + this.matrix[3] * s;
    var m21 = this.matrix[0] * -s + this.matrix[2] * c;
    var m22 = this.matrix[1] * -s + this.matrix[3] * c;
    this.matrix[0] = m11;
    this.matrix[1] = m12;
    this.matrix[2] = m21;
    this.matrix[3] = m22;

    this.setTransform();
  };
  Transform.prototype.rotateRadAt = function(rad, point) {
    this.translate(point);
    this.rotateRad(rad);
    this.translate(new Vector(-point.X, -point.Y));

    this.setTransform();
  };
  Transform.prototype.getRotateRad = function() {
    return Math.atan(-this.matrix[2] / this.matrix[0]);
  };
  Transform.prototype.rotateDeg = function(deg) {
    this.rotateRad(deg * Math.PI / 180);
  };
  Transform.prototype.rotateDegAt = function(deg, point) {
    this.rotateRadAt(deg * Math.PI / 180, point);
  };
  Transform.prototype.getRotateDeg = function() {
    return this.getRotateRad() * 180 / Math.PI;
  };

  Transform.prototype.transformPoint = function(point) {
    return new Vector(
      point.X * this.matrix[0] + point.Y * this.matrix[2] + this.matrix[4],
      point.X * this.matrix[1] + point.Y * this.matrix[3] + this.matrix[5]);
  };
  Transform.prototype.transformPointRev = function(point) {
    this.save();
    this.invert();
    var result = this.transformPoint(point);
    this.restore();
    return result;
  };

  Transform.prototype.multiply = function(transform) {
    var matrix = transform.getMatrix();
    var m0 = this.matrix[0] * matrix[0] + this.matrix[2] * matrix[1];
    var m1 = this.matrix[1] * matrix[0] + this.matrix[3] * matrix[1];

    var m2 = this.matrix[0] * matrix[2] + this.matrix[2] * matrix[3];
    var m3 = this.matrix[1] * matrix[2] + this.matrix[3] * matrix[3];

    var m4 = this.matrix[0] * matrix[4] + this.matrix[2] * matrix[5] + this.matrix[4];
    var m5 = this.matrix[1] * matrix[4] + this.matrix[3] * matrix[5] + this.matrix[5];

    this.matrix[0] = m0;
    this.matrix[1] = m1;
    this.matrix[2] = m2;
    this.matrix[3] = m3;
    this.matrix[4] = m4;
    this.matrix[5] = m5;

    this.setTransform();
  };

  Transform.prototype.invert = function() {
    var detrminat = 1 / (this.matrix[0] * this.matrix[3] - this.matrix[1] * this.matrix[2]);

    var m0 = this.matrix[3] * detrminat;
    var m1 = -this.matrix[1] * detrminat;

    var m2 = -this.matrix[2] * detrminat;
    var m3 = this.matrix[0] * detrminat;

    var m4 = detrminat * (this.matrix[2] * this.matrix[5] - this.matrix[3] * this.matrix[4]);
    var m5 = detrminat * (this.matrix[1] * this.matrix[4] - this.matrix[0] * this.matrix[5]);

    this.matrix[0] = m0;
    this.matrix[1] = m1;
    this.matrix[2] = m2;
    this.matrix[3] = m3;
    this.matrix[4] = m4;
    this.matrix[5] = m5;

    this.setTransform();
  };

  return Transform;
}());


var Panel = (function() {
  function Panel(parent, type, location, size, fillStyle) {
    this.parent = parent;
    if (parent) parent.addPanel(this);
    this.type = type;
    this.trueType = type;
    this.transform = new Transform();
    this.fillStyle = (fillStyle) ? fillStyle : "transparent";
    this.contentPanels = [];
    this.theta = 0;
    this.speed = new Vector();
    this.acceleration = 0;
    this.mass = 0;
    this.manageCollision = [];
    this.managedCollisions = [];
    this.toClip = true;
    if (location) this.setLocation(location);
    if (size) this.setSize(size);
  }

  Panel.prototype.centroid = function() {
    if (this.type == Panel.Rectangle) {
      return new Vector(this.size.X / 2, this.size.Y / 2);
    } else if (this.type == Panel.Circle) {
      return new Vector(this.radius, this.radius);
    } else {
      var centroid = new Vector();
      var totalArea = 0;

      for (var i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++) {
        var x0 = this.vertices[i].X;
        var y0 = this.vertices[i].Y;
        var x1 = this.vertices[j].X;
        var y1 = this.vertices[j].Y;
        var area = x0 * y1 - x1 * y0;
        totalArea += area;
        centroid.X += (x0 + x1) * area;
        centroid.Y += (y0 + y1) * area;
      }
      totalArea = totalArea / 2;
      centroid.X /= (6.0 * totalArea);
      centroid.Y /= (6.0 * totalArea);

      return centroid;
    }
  };
  Panel.prototype.area = function() {
    if (this.type == Panel.Rectangle) {
      return this.size.X * this.size.Y;
    } else if (this.type == Panel.Circle) {
      return Math.PI * this.radius * this.radius;
    } else {
      var area = 0;
      for (var i = 0, j = this.vertices.length - 1; i < this.vertices.length; j = i++)
        area += this.vertices[i].X * this.vertices[j].Y - this.vertices[j].X * this.vertices[i].Y;
      return Math.abs(area) / 2;
    }
  };
  Panel.prototype.setSize = function(size) {
    if (this.trueType == Panel.Rectangle) {
      this.size = size;
      this.vertices = [
        new Vector(0, 0),
        new Vector(this.size.X, 0),
        new Vector(this.size.X, this.size.Y),
        new Vector(0, this.size.Y)
      ];

    } else if (this.trueType == Panel.Circle) {
      this.diameter = size;
      this.radius = this.diameter / 2;
      this.size = new Vector(this.diameter, this.diameter);
    } else if (this.trueType == Panel.RectangleTriangle) {
      this.type = Panel.Convex;
      this.size = size[0];
      this.emptyAngleID = size[1];
      this.vertices = [];
      if (this.emptyAngleID != 0)
        this.vertices.push(new Vector());
      if (this.emptyAngleID != 1)
        this.vertices.push(new Vector(this.size.X, 0));
      if (this.emptyAngleID != 2)
        this.vertices.push(new Vector(this.size.X, this.size.Y));
      if (this.emptyAngleID != 3)
        this.vertices.push(new Vector(0, this.size.Y));
    } else if (this.trueType == Panel.RegularPolygon) {
      this.type = Panel.Convex;
      this.radius = size[0];
      var n_vertices = size[1];
      var angle = (size[2]) ? size[2] : Math.PI / 2;
      this.vertices = [];
      var angleDiff = Math.PI * 2 / n_vertices;
      for (var i = 0; i < n_vertices; i++) {
        this.vertices[i] = new Vector(
          Math.round(this.radius + this.radius * Math.cos(angle)),
          Math.round(this.radius - this.radius * Math.sin(angle))
        );
        angle += angleDiff;
      }
      var diameter = this.radius * 2;
      this.size = new Vector(diameter, diameter);
    } else if (this.trueType == Panel.Convex) {
      this.vertices = size;
      var
        maxX = Number.MIN_SAFE_INTEGER,
        minX = Number.MAX_SAFE_INTEGER,
        maxY = Number.MIN_SAFE_INTEGER,
        minY = Number.MAX_SAFE_INTEGER;

      this.vertices.forEach(function(point) {
        if (minX > point.X) minX = point.X;
        if (maxX < point.X) maxX = point.X;
        if (minY > point.Y) minY = point.Y;
        if (maxY < point.Y) maxY = point.Y;
      });
      var translateLocation = new Vector(minX, minY);
      this.translate(translateLocation);
      this.vertices.forEach(function(point) {
        point.X -= minX;
        point.Y -= minY;
      });
      this.size = new Vector(maxX - minX, maxY - minY);
    } else {
      throw "Panel type error";
    }
    this.center = this.centroid();
    this.mass = this.area();
  };
  Panel.prototype.getSize = function() {
    return this.transform.transformPoint(this.size);
  };
  Panel.prototype.getLocation = function() {
    return this.transform.transformPoint(new Vector(0, 0));
  };
  Panel.prototype.setLocation = function(location) {
    this.transform.matrix[4] = 0;
    this.transform.matrix[5] = 0;
    this.translate(location);
  };
  Panel.prototype.getCenter = function() {
    return this.transform.transformPoint(this.center);
  };

  Panel.prototype.freeze = function() {
    this.mass = Number.MAX_SAFE_INTEGER;
    this.speed.set(0, 0);
  };

  Panel.prototype.setFillStyle = function(fillStyle) {
    this.fillStyle = fillStyle;
  };
  Panel.prototype.setStrokeStyle = function(strokeStyle, lineWidth) {
    this.strokeStyle = strokeStyle;
    this.lineWidth = lineWidth;
  };
  Panel.prototype.setString = function(string, fillStyle, bold, size, font) {
    this.string = string;
    if (!string) return;
    this.fontFillStyle = fillStyle ? fillStyle : this.fontFillStyle ? this.fontFillStyle : "black";
    this.fontSize = size ? size : this.size.Y / 3;
    this.font = (bold ? "bold " : "") + this.fontSize + "px " + (font ? font : "Arial");
  };
  Panel.prototype.setFontStyle = function(fontStyle) {
    this.fontFillStyle = fontStyle ? fontStyle : "black";
  };
  Panel.prototype.setToClip = function(toClip) {
    this.toClip = toClip;
  };

  Panel.prototype.addCheckCollision = function(panel) {
    if (this.manageCollision.indexOf(panel) == -1 && panel != this) {
      this.manageCollision.push(panel);
      return true;
    }
    return false;
  };
  Panel.prototype.removeCheckCollision = function(panel) {
    var index = this.manageCollision.indexOf(panel);
    if (index != -1)
      this.manageCollision.splice(index, 1);
    return index;
  };

  Panel.prototype.setPath = function() {
    Panel.ctx.beginPath();
    if (this.type == Panel.Rectangle) {
      Panel.ctx.rect(0, 0, this.size.X, this.size.Y);
    } else
    if (this.type == Panel.Circle) {
      Panel.ctx.arc(this.center.X, this.center.Y, this.radius, 0, 2 * Math.PI);
    } else {
      var firstPoint = this.vertices[0];
      Panel.ctx.moveTo(firstPoint.X, firstPoint.Y);
      for (var i = 1; i < this.vertices.length; i++) {
        var point = this.vertices[i];
        Panel.ctx.lineTo(point.X, point.Y);
      }
      Panel.ctx.lineTo(firstPoint.X, firstPoint.Y);
    }
  };
  Panel.prototype.setClippedPath = function() {
    this.setPath();
    if (this.toClip)
      Panel.ctx.clip();
  };
  Panel.prototype.hitTest = function(x, y) {
    Panel.ctx.transform.save();
    Panel.ctx.transform.multiply(this.transform);

    this.setPath();
    var result = Panel.ctx.isPointInPath(x, y);

    Panel.ctx.transform.restore();

    return result;
  };
  Panel.prototype.correlate = function(x, y) {
    Panel.ctx.transform.multiply(this.transform);

    for (var i = this.contentPanels.length - 1; i >= 0; i--) {
      var panel = this.contentPanels[i];
      if (!panel.ignoremouse && panel.hitTest(x, y))
        return panel;
    }
    return undefined;
  };


  Panel.prototype.newMouseEvent = function(event) {
    var parent = this;
    var point = new Vector(event.offsetX, event.offsetY);
    var test = [];
    while (parent) {
      test.push(parent);
      parent = parent.parent;
    }
    while (test.length)
      point = test.pop().transform.transformPointRev(point);
    return new MouseEvent("MouseEvent", { clientX: point.X, clientY: point.Y });
  };

  Panel.prototype.mousedown = function(event) {
    Panel.ctx.transform.save();
    var panel = this.correlate(event.offsetX, event.offsetY);
    if (panel) {
      panel.mousedown(event);
    } else {
      Panel.capturePanel = this;
      Panel.lastcapturePanel = this;
      this.onmousedown(this.newMouseEvent(event));
    }
    Panel.ctx.transform.restore();
  };
  Panel.prototype.mouseup = function(event) {
    Panel.ctx.transform.save();
    var panel = this.correlate(event.offsetX, event.offsetY);
    if (panel) {
      panel.mouseup(event);
    } else {
      this.onmouseup(this.newMouseEvent(event));
      if (Panel.capturePanel) {
        Panel.capturePanel.onmouseout(Panel.capturePanel.newMouseEvent(event));
        Panel.capturePanel = undefined;
      }
    }
    Panel.ctx.transform.restore();
  };
  Panel.prototype.mousemove = function(event) {
    Panel.ctx.transform.save();
    if (Panel.capturePanel) {
      Panel.capturePanel.onmousemove(Panel.capturePanel.newMouseEvent(event));
    } else {
      var panel = this.correlate(event.offsetX, event.offsetY);
      if (panel) {
        panel.mousemove(event);
      } else {
        this.onmousemove(this.newMouseEvent(event));
        if (this != Panel.overPanel) {
          if (Panel.overPanel) {
            if (Panel.capturePanel) {
              Panel.capturePanel.onmouseup(Panel.capturePanel.newMouseEvent(event));
              Panel.capturePanel = undefined;
            }
            Panel.overPanel.onmouseout(Panel.overPanel.newMouseEvent(event));
          }
          Panel.overPanel = this;
          Panel.overPanel.onmouseover(Panel.overPanel.newMouseEvent(event));
        }
      }
    }
    Panel.ctx.transform.restore();
  };
  Panel.prototype.mouseout = function(event) {
    this.mouseup(event);
    if (Panel.overPanel)
      Panel.overPanel.onmouseout(Panel.overPanel.newMouseEvent(event));
  };
  Panel.prototype.keydown = function(event) {
    this.onkeydown(event);
  };
  Panel.prototype.resize = function(event) {
    this.onresize();
    this.contentPanels.forEach(function(panel) { panel.resize(); })
  };

  Panel.prototype.onmousedown = function(event) {};
  Panel.prototype.onmouseup = function(event) {};
  Panel.prototype.onmousemove = function(event) {};
  Panel.prototype.onmouseover = function(event) {};
  Panel.prototype.onmouseout = function(event) {};
  Panel.prototype.onkeydown = function(event) {};
  Panel.prototype.onresize = function(event) {};
  Panel.prototype.ontick = function(event) {};
  Panel.prototype.onprecollision = function(event) {};
  Panel.prototype.onpostcollision = function(event) {};
  Panel.prototype.onpaint = function() {};

  Panel.prototype.setIgnoremouse = function(ignoremouse) {
    this.ignoremouse = ignoremouse;
  };

  Panel.prototype.paintPanel = function() {
    this.setClippedPath();

    if (this.strokeStyle) {
      Panel.ctx.lineWidth = this.lineWidth;
      Panel.ctx.strokeStyle = this.strokeStyle;
      Panel.ctx.stroke();
    }
    if (this.fillStyle) {
      Panel.ctx.fillStyle = this.fillStyle;
      Panel.ctx.fill();
    }
    if (this.string) {
      Panel.ctx.fillStyle = this.fontFillStyle;
      Panel.ctx.font = this.font;
      Panel.ctx.textAlign = "center";
      Panel.ctx.fillText(this.string, this.center.X, this.center.Y + this.fontSize / 2.5, this.size.X);
    }
    this.onpaint();
  };

  Panel.prototype.invalidate = function() {
    // Panel.ctx.globalCompositeOperation = 'source-in';
    // Panel.ctx.fillStyle = 'transparent';
    // Panel.ctx.fillRect(0, 0, Panel.container.size.X, Panel.container.size.Y);
    // Panel.ctx.globalCompositeOperation = 'source-over';
    Panel.ctx.clearRect(0, 0, Panel.container.size.X, Panel.container.size.Y);

    Panel.ctx.transform.save();
    Panel.ctx.transform.resetMatrix();

    var toInvalidate = this;
    var toInvalidate = Panel.container;
    if (toInvalidate.parent) {
      var toMultiply = [];
      var temp = toInvalidate.parent;
      while (temp) {
        toMultiply.push(temp);
        temp = temp.parent;
      }
      while (toMultiply.length) {
        temp = toMultiply.pop();
        Panel.ctx.transform.multiply(temp.transform);
        temp.setPath();
      }
    }
    toInvalidate.paint();
    Panel.ctx.transform.restore();
  };
  Panel.prototype.paint = function() {
    Panel.ctx.transform.save();
    Panel.ctx.transform.multiply(this.transform);
    this.paintPanel();
    this.contentPanels.forEach(function(p) { p.paint(); });
    Panel.ctx.transform.restore();
  };

  Panel.prototype.addPanel = function(panel) {
    if (this.contentPanels.indexOf(panel) == -1) {
      this.contentPanels.push(panel);
      return true;
    }
    return false;
  };
  Panel.prototype.removePanel = function(panel) {
    var index = this.contentPanels.indexOf(panel);
    if (index != -1)
      this.contentPanels.splice(index, 1);
    return index;
  };


  Panel.prototype.scale = function(size, size2) {
    if (!size2) size2 = size;
    this.transform.scaleAt(new Vector(size, size2), this.center);
    this.mass *= (size * size2);
    this.speed.X /= (size * size2);
    this.speed.Y /= (size * size2);
  };
  Panel.prototype.scaleOrigin = function(size, size2) {
    if (!size2) size2 = size;
    this.transform.scale(new Vector(size, size2));
    this.mass *= (size * size2);
    this.speed.X /= (size * size2);
    this.speed.Y /= (size * size2);
  };
  Panel.prototype.rotate = function(degrees) {
    this.rotateRad(degrees * Math.PI / 180);
  };
  Panel.prototype.rotateRad = function(rad) {
    this.theta += rad;
    this.transform.rotateRadAt(rad, this.center);
  };
  Panel.prototype.translate = function(point) {
    this.transform.translate(point);
  };
  Panel.prototype.translateAbsolute = function(point) {
    Panel.ctx.transform.save();
    Panel.ctx.transform.resetMatrix();

    var temp = this.parent;
    var toMultiply = [];
    while (temp) {
      toMultiply.push(temp);
      temp = temp.parent;
    }
    while (toMultiply.length) {
      temp = toMultiply.pop();
      Panel.ctx.transform.multiply(temp.transform);
    }
    Panel.ctx.transform.multiply(this.transform);

    Panel.ctx.transform.invert();
    this.transform.multiply(Panel.ctx.transform);
    this.transform.translate(point);

    Panel.ctx.transform.invert();
    this.transform.multiply(Panel.ctx.transform);

    Panel.ctx.transform.restore();
  };

  Panel.prototype.getAxes = function(panel, sel) {
    var axes = [];

    if (this.type != Panel.Circle) {
      var j = this.vertices.length - 1;
      for (var i = 0; i < this.vertices.length; i++) {
        var vertex1 = this.transform.transformPoint(this.vertices[j]);
        var vertex2 = this.transform.transformPoint(this.vertices[i]);
        j = i;
        if (sel == 2) {
          vertex1 = panel.transform.transformPoint(vertex1);
          vertex2 = panel.transform.transformPoint(vertex2);
        }
        var edge = vertex1.subtract(vertex2);
        var normal = edge.perp();
        axes.push(normal.normalize());
      }
    } else {
      var thisCenter = this.transform.transformPoint(this.center);
      if (sel == 2) {
        thisCenter = panel.transform.transformPoint(thisCenter);
      }
      if (panel.type != Panel.Circle) {
        for (var k = 0; k < panel.vertices.length; k++) {
          var panelCorner = panel.transform.transformPoint(panel.vertices[k]);
          if (sel == 1) {
            panelCorner = this.transform.transformPoint(panelCorner);
          }
          var axis = panelCorner.subtract(thisCenter);
          axes.push(axis.normalize());

        }
      } else {
        var panelCenter = panel.transform.transformPoint(panel.center);
        if (sel == 1) {
          panelCenter = this.transform.transformPoint(panelCenter);
        }
        axes.push(panelCenter.subtract(thisCenter).normalize());
      }
    }

    return axes;
  };
  Panel.prototype.project = function(axis, parent) {
    var min = Number.MAX_SAFE_INTEGER;
    var max = Number.MIN_SAFE_INTEGER;
    if (this.type != Panel.Circle) {
      for (var i = 0; i < this.vertices.length; i++) {
        var p = this.transform.transformPoint(this.vertices[i]);
        if (parent) {
          p = parent.transform.transformPoint(p);
        }
        p = axis.dot(p);
        min = Math.min(min, p);
        max = Math.max(max, p);
      }
    } else {
      var thisCenter = this.transform.transformPoint(this.center);
      if (parent) {
        thisCenter = parent.transform.transformPoint(thisCenter);
      }
      var circleCenterProject = axis.dot(thisCenter);

      var thisRadius = this.transform.transformPoint(new Vector(0, this.center.Y));
      if (parent) {
        thisRadius = parent.transform.transformPoint(thisRadius);
      }
      thisRadius = thisCenter.subtract(thisRadius).magnitude();

      min = circleCenterProject - thisRadius;
      max = circleCenterProject + thisRadius;
    }
    return new Vector(min, max);
  };
  Panel.prototype.sat = function(panel, fromParent) {
    var overlap = Number.MAX_SAFE_INTEGER;
    var smallest;

    var axeses;
    if (!fromParent) {
      axeses = [this.getAxes(panel), panel.getAxes(this)];
    } else {
      axeses = [this.getAxes(panel, 1), panel.getAxes(this, 2)];
    }
    for (var j = 0; j < axeses.length; j++) {
      var axes = axeses[j];
      for (var i = 0; i < axes.length; i++) {
        var axis = axes[i];
        var thisProject = this.project(axis);
        var panelProject = panel.project(axis, (fromParent) ? this : undefined);

        if (!fromParent) {
          if (!thisProject.overlap(panelProject)) {
            return false;
          } else {
            var o = thisProject.getOverlap(panelProject);
            if (o < overlap) {
              overlap = o;
              smallest = axis;
            }
          }
        } else if (fromParent) {
          if (!thisProject.containment(panelProject)) {
            return { axis: axis, overlap: thisProject.getOverlap(panelProject) };
          }
        }
      }
    }
    return (!fromParent) ? { axis: smallest, overlap: overlap } : false;
  };
  Panel.prototype.collision = function() {
    var parent = this.parent;
    if (!parent || !this.manageCollision.length) return false;

    var collidedPanel = [];
    for (var i = 0; i < this.manageCollision.length; i++) {
      var panel = this.manageCollision[i];
      if (panel == this) continue;

      var result;
      if (panel != parent) {
        result = this.sat(panel);
        if (result)
          collidedPanel.push({ panel: panel, axis: result.axis, overlap: result.overlap });
      } else {
        result = parent.sat(this, true);
        if (result)
          return [{ panel: panel, axis: result.axis, overlap: result.overlap }];
      }
    }
    return collidedPanel;
  };
  Panel.prototype.animate = function(deltaTime) {
    var speedMovement = this.speed.multiply(deltaTime);
    this.translate(speedMovement);
    var collidedPanel = this.collision();

    var panel;
    var axis;
    var overlap = Number.MAX_SAFE_INTEGER;
    for (var i = 0; i < collidedPanel.length; i++) {
      // if (collidedPanel[i].panel.managedCollisions.indexOf(this) != -1) continue;
      if (collidedPanel[i].overlap < overlap) {
        panel = collidedPanel[i].panel;
        axis = collidedPanel[i].axis;
        overlap = collidedPanel[i].overlap;
      }
    }
    if (panel) {
      if (this.onprecollision(panel) || panel.onprecollision(this)) return;

      this.translate(speedMovement.multiply(-1));

      if (panel != this.parent)
        axis = this.getCenter().subtract(panel.getCenter()).normalize();

      this.managedCollisions.push(panel);

      if (this.theta)
        this.speed = this.speed.rotate(2 * this.theta);
      if (panel != this.parent)
        this.speed = this.speed.rotate(-this.theta);
      else if (panel.theta)
        this.speed = this.speed.rotate(panel.theta * 2);

      var panelSpeed = (panel == this.parent) ? new Vector(0, 0) : panel.speed;
      var panelMass = (panel == this.parent) ? Number.MAX_SAFE_INTEGER : panel.mass;
      var newSpeed = this.speed.multiply(this.mass).add(panelSpeed.multiply(panelMass)).divide(this.mass + panelMass);

      this.speed = this.speed.subtract(axis.multiply(2 * axis.dot(this.speed.subtract(newSpeed))));

      if (panel != this.parent) {
        panel.speed = panelSpeed.subtract(axis.multiply(2 * axis.dot(panelSpeed.subtract(newSpeed))));
      }
      if (panel.theta)
        panelSpeed = panelSpeed.rotate(-panel.theta);
      this.speed = this.speed.rotate(-this.theta);


      this.onpostcollision();
      panel.onpostcollision();
    } else {
      this.lastCollided = undefined;
    }

    if (this.speed.X || this.speed.Y) {
      var difference = this.speed.normalize().multiply(this.acceleration * deltaTime);
      var newSpeedDec = this.speed.add(difference);
      this.speed = (this.speed.dot(newSpeedDec) < 0) ? new Vector() : newSpeedDec;
    }

  };
  Panel.prototype.startAnimationPhysics = function() {
    if (this.animationFrame) return;

    var currentTime = Date.now();
    var dt = 1000 / 60;

    var this_ = this;

    this.deltaTime = 0;

    var functionTick = function(panel) {
      panel.ontick();
      panel.animate(this.deltaTime);
      panel.contentPanels.forEach(functionTick);
    };
    var cleanManagedCollisions = function(panel) {
      panel.managedCollisions = [];
      panel.contentPanels.forEach(cleanManagedCollisions);
    };

    var tick = function(newTime) {
      var frameTime = newTime - currentTime;
      currentTime = newTime;
      if (frameTime) {
        while (frameTime > 0) {
          this.deltaTime = Math.min(frameTime, dt);
          frameTime -= this.deltaTime;

          functionTick(this_);
          cleanManagedCollisions(this_);
        }
        this_.invalidate();
      }
      this_.animationFrame = window.requestAnimationFrame(tick);
    };

    tick();
    Panel.tick = tick;
  };

  Panel.prototype.startAnimation = function() {
    if (this.animationFrame) return;

    var currentTime = Date.now();
    var dt = 1000 / 60;

    var this_ = this;

    this.deltaTime = 0;

    var functionTick = function(panel) {
      panel.ontick(this.deltaTime);
      panel.contentPanels.forEach(functionTick);
    };
    var tick = function(newTime) {
      var frameTime = newTime - currentTime;
      currentTime = newTime;
      if (frameTime) {
        while (frameTime > 0) {
          this.deltaTime = Math.min(frameTime, dt);
          frameTime -= this.deltaTime;
          functionTick(this_);
        }
        this_.invalidate();
      }
      this_.animationFrame = window.requestAnimationFrame(tick);
    };

    tick();
    Panel.tick = tick;
  };
  Panel.prototype.stopAnimation = function() {
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = undefined;
    }
  };

  Panel.invalidate = function() {
    this.container.invalidate();
  };
  Panel.startAnimationPhysics = function() {
    this.container.startAnimationPhysics();
  };
  Panel.initialize = function(backgroundColor) {
    var canvas = document.createElement("canvas");

    Panel.canvas = canvas

    // var viewport = document.createElement("meta");
    // viewport.name = "viewport";
    // viewport.content = "width=device-width, minimum-scale=1.0, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";

    // document.head.appendChild(viewport);
    document.body.onload = "Panel.initialize()";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";

    document.body.appendChild(canvas);
    canvas.style.visibility = "visible";
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    // canvas.style.background = backgroundColor;

    Panel.ctx = canvas.getContext("2d");
    Panel.ctx.transform = new Transform(Panel.ctx);


    canvas.fullScreen = function() {
      canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    };
    canvas.fullScreen();


    Panel.container = new Panel(undefined, Panel.Rectangle, new Vector(), new Vector(canvas.width, canvas.height), backgroundColor);



    window.addEventListener("resize", function(event) {
      canvas.fullScreen();
      Panel.container.setSize(new Vector(canvas.width, canvas.height));
      Panel.container.resize(event);
      Panel.container.invalidate();
    }, false);

    canvas.addEventListener("mousedown", function(event) {
      Panel.container.mousedown(event);
    }, false);
    canvas.addEventListener("mouseup", function(event) {
      Panel.container.mouseup(event);
    }, false);
    canvas.addEventListener("mousemove", function(event) {
      Panel.container.mousemove(event);
    }, false);
    canvas.addEventListener("mouseout", function(event) {
      Panel.container.mouseout(event);
    }, false);

    document.addEventListener('keydown', function(event) {
      Panel.container.keydown(event);
    }, false);


    var onTouch = function(event) {
      event.preventDefault();
      if (event.touches.length > 1 || (event.type == "touchend" && event.touches.length > 0))
        return;

      var newEvent = document.createEvent("MouseEvents");
      var type = null;
      var touch = null;

      switch (event.type) {
        case "touchstart":
          type = "mousedown";
          touch = event.changedTouches[0];
          break;
        case "touchmove":
          type = "mousemove";
          touch = event.changedTouches[0];
          break;
        case "touchend":
          type = "mouseup";
          touch = event.changedTouches[0];
          break;
      }

      newEvent.initMouseEvent(type, true, true, null, 0,
        touch.screenX, touch.screenY, touch.clientX, touch.clientY,
        event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, 0, null);
      return newEvent;
    };

    document.addEventListener('touchstart', function(event) {
      Panel.container.mousedown(onTouch(event));
    }, false);
    document.addEventListener('touchmove', function(event) {
      Panel.container.mousemove(onTouch(event));
    }, false);
    document.addEventListener('touchend', function(event) {
      Panel.container.mouseup(onTouch(event));
    }, false);



    Panel.invalidate();
  };

  Panel.Rectangle = 0;
  Panel.Circle = 1;
  Panel.RectangleTriangle = 2;
  Panel.RegularPolygon = 3;
  Panel.Convex = 4;

  return Panel;
}());

var Animation = (function() {

  function Animation(startValue, endValue, duration, startTime, onChange) {
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.startTime = startTime;
    this.onChange = onChange;

    this.absoluteTime = 0;
  }

  Animation.prototype.update = function update(delta) {

    this.absoluteTime += delta;

    var t = this.absoluteTime - this.startTime;
    var newValue;

    if (t < 0) {
      newValue = this.startValue;
    } else if (t > this.duration) {
      newValue = this.endValue;
    } else {
      var normalizedTime = t / this.duration;
      newValue = this.startValue + normalizedTime * (this.endValue - this.startValue);
    }

    this.onChange(newValue);

  };

  return Animation;

})();

var Timeline = (function() {

  function Timeline() {
    this.animations = [];
  }

  Timeline.prototype.add = function(a) {
    this.animations.push(a);
    return this;
  };

  Timeline.prototype.update = function(delta) {
    for (var i = 0; i < this.animations.length; i++) {
      this.animations[i].update(delta);
    }
  };

  return Timeline;

})();