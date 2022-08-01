// Class with helper methods for drawing on the HTML canvas

'use strict';

// Mathematical constant tau: Length of unit circle circumference
const tau = Math.PI * 2;

class Draw {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
  }

  centeredCircle({
    x,
    y,
    size, // diameter
    color
  } = {}) {
    const cx = this.context;

    const oldFillStyle = cx.fillStyle;
    cx.fillStyle = color;
    cx.beginPath();
    cx.arc(x, y, size / 2, 0, tau, false);
    cx.closePath();
    cx.fill();
    cx.fillStyle = oldFillStyle;
  }

  centeredSquare({
    x,
    y,
    size,
    color
  } = {}) {
    const cx = this.context;

    const oldFillStyle = cx.fillStyle;
    cx.fillStyle = color;
    cx.fillRect(x - size / 2, y - size / 2, size, size);
    cx.fillStyle = oldFillStyle;
  }

  // Equilateral triangle
  centeredTriangle({
    x,
    y,
    size,
    angle,
    color
  } = {}) {
    const cx = this.context;

    const oldFillStyle = cx.fillStyle;
    cx.fillStyle = color;
  
    cx.save();
    cx.beginPath();
  
    // Move to lower right corner B
    cx.lineTo(x + size / 2, y -size * Math.sqrt(3) / 6)
  
    // Move to top C
    cx.lineTo(x, y + size * Math.sqrt(3) / 3);
  
    // Move to botomm left A
    cx.lineTo(x -size / 2, y -size * Math.sqrt(3) / 6);
  
    cx.closePath();
    cx.stroke();
    cx.fill();
  
    // Move to center again
    cx.restore();
  
    cx.fillStyle = oldFillStyle;
  }

  line({
    startX,
    startY,
    endX,
    endY,
    color,
    width
  } = {}) {
    const cx = this.context;

    const oldStrokeStyle = cx.strokeStyle;
    const oldLineWidth = cx.lineWidth;

    cx.strokeStyle = color
    cx.lineWidth = width

    cx.beginPath()
    cx.moveTo(startX, startY)
    cx.lineTo(endX, endY)
    cx.stroke()

    cx.strokeStyle = oldStrokeStyle;
    cx.lineWidth = oldLineWidth;
  }

  polarDiagram({
    x,
    y,
    radii, // array of distances from the center
    colors // array of colors, should have the same length as radii
  }) {
    const cx = this.context;

    const oldFillStyle = cx.fillStyle;
    
    const amountOfSegments = radii.length;
    const arcAngle = tau / amountOfSegments; // not to be confused with archAngel ;) 
    for (let i = 0; i < amountOfSegments; i++) {
      const radius = radii[i];
      const color = colors[i];

      cx.fillStyle = color;
      cx.beginPath();
      cx.arc(x, y, radius, i * arcAngle, (i + 1) * arcAngle, true);
      cx.closePath();
      cx.fill();
    }

    cx.fillStyle = oldFillStyle;
  }
}
  

export default Draw