"use strict";

const BoardImage = (() => {
  const colors = {camera: "#ffb85e", subject: "#72d8ff"};

  function drawArrow(context, x, y, width, height, arrow) {
    const start = {
      right: [.18, .5], left: [.82, .5], up: [.5, .84], down: [.5, .16],
      forward: [.19, .8], backward: [.81, .2], clockwise: [.26, .75], counterclockwise: [.74, .75]
    };
    const end = {
      right: [.82, .5], left: [.18, .5], up: [.5, .16], down: [.5, .84],
      forward: [.81, .2], backward: [.19, .8], clockwise: [.74, .75], counterclockwise: [.26, .75]
    };
    const [sx, sy] = start[arrow.direction];
    const [ex, ey] = end[arrow.direction];
    const x1 = x + sx * width;
    const y1 = y + sy * height;
    const x2 = x + ex * width;
    const y2 = y + ey * height;
    const arc = /clockwise$/.test(arrow.direction);
    const cx = x + .5 * width;
    const cy = y - .2 * height;
    const angle = Math.atan2(y2 - (arc ? cy : y1), x2 - (arc ? cx : x1));
    const tip = Math.min(width, height) * .28;
    context.save();
    context.beginPath();
    context.moveTo(x1, y1);
    if (arc) context.quadraticCurveTo(cx, cy, x2, y2);
    else context.lineTo(x2, y2);
    context.moveTo(x2 - tip * Math.cos(angle - .55), y2 - tip * Math.sin(angle - .55));
    context.lineTo(x2, y2);
    context.lineTo(x2 - tip * Math.cos(angle + .55), y2 - tip * Math.sin(angle + .55));
    context.lineWidth = Math.max(4, height * .075);
    context.strokeStyle = colors[arrow.kind];
    context.lineCap = "round";
    context.lineJoin = "round";
    context.shadowColor = "#100d15";
    context.shadowBlur = 5;
    context.stroke();
    context.restore();
  }

  function linesFor(context, text, width) {
    return text.split("\n").flatMap(paragraph => {
      const lines = [];
      let line = "";
      for (const word of paragraph.split(/\s+/).filter(Boolean)) {
        const candidate = line ? line + " " + word : word;
        if (line && context.measureText(candidate).width > width) {
          lines.push(line);
          line = "";
        }
        line = line ? line + " " + word : word;
        while (context.measureText(line).width > width) {
          let end = 1;
          while (end < line.length && context.measureText(line.slice(0, end + 1)).width <= width) end += 1;
          lines.push(line.slice(0, end));
          line = line.slice(end);
        }
      }
      lines.push(line);
      return lines;
    });
  }

  function loadImage(src) {
    if (!src) return Promise.resolve(null);
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => resolve(null);
      image.src = src;
    });
  }

  function drawFrame(context, image, x, y, width, height) {
    context.fillStyle = "#221a2d";
    context.fillRect(x, y, width, height);
    if (image) {
      const scale = Math.max(width / image.width, height / image.height);
      const croppedWidth = width / scale;
      const croppedHeight = height / scale;
      context.drawImage(image, (image.width - croppedWidth) / 2, (image.height - croppedHeight) / 2, croppedWidth, croppedHeight, x, y, width, height);
    } else {
      context.strokeStyle = "#4c3c60";
      context.strokeRect(x + 12, y + 12, width - 24, height - 24);
      context.fillStyle = "#cfbddc";
      context.font = "18px sans-serif";
      context.textAlign = "center";
      context.fillText("Image à illustrer", x + width / 2, y + height / 2);
      context.textAlign = "left";
    }
  }

  async function render(project, board) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const cardWidth = 410;
    const frameHeight = 204;
    const lineHeight = 22;
    const gap = 18;
    const margin = 36;
    const header = 104;
    const captionFont = "16px sans-serif";
    context.font = captionFont;
    const cards = board.cells.map(entry => {
      const shot = entry.shot;
      const captions = [
        ["#f3eaf8", shot.description || shot.action || shot.detail || ""],
        ["#dfcff4", shot.voiceOver && "Voix off · " + shot.voiceOver]
      ].filter(([, value]) => value).flatMap(([color, value]) => linesFor(context, value, cardWidth - 30).map(line => [color, line]));
      return {entry, captions, arrows: Storyboard.movementArrows(shot)};
    });
    const rowHeights = Array.from({length: board.rows}, (_, index) => {
      const row = cards.slice(index * board.columns, (index + 1) * board.columns);
      return frameHeight + 62 + lineHeight * Math.max(1, ...row.map(card => card.captions.length));
    });
    const totalWidth = 2 * margin + board.columns * cardWidth + (board.columns - 1) * gap;
    const totalHeight = header + margin + rowHeights.reduce((sum, value) => sum + value, 0) + (board.rows - 1) * gap;
    const scale = Math.min(1, 12000 / Math.max(totalWidth, totalHeight), Math.sqrt(36_000_000 / (totalWidth * totalHeight)));
    canvas.width = Math.ceil(totalWidth * scale);
    canvas.height = Math.ceil(totalHeight * scale);
    context.scale(scale, scale);
    context.fillStyle = "#15111d";
    context.fillRect(0, 0, totalWidth, totalHeight);
    context.fillStyle = "#e1c8ff";
    context.font = "bold 24px sans-serif";
    context.fillText("Open StoryBoard Studio", margin, 43);
    context.font = "18px sans-serif";
    context.fillStyle = "#eee1f4";
    context.fillText((project.name || "Projet sans titre") + "  ·  Planche " + board.number, margin, 73, totalWidth - 2 * margin);
    const images = await Promise.all(cards.map(({entry}) => loadImage(entry.shot.image)));
    let y = header;
    for (const [row, height] of rowHeights.entries()) {
      for (let column = 0; column < board.columns; column += 1) {
        const index = row * board.columns + column;
        const card = cards[index];
        if (!card) break;
        const {entry: {shot, sceneNumber, shotNumber}, captions, arrows} = card;
        const x = margin + column * (cardWidth + gap);
        context.fillStyle = "#30253d";
        context.fillRect(x, y, cardWidth, height);
        drawFrame(context, images[index], x, y, cardWidth, frameHeight);
        for (const arrow of arrows) {
          const camera = arrow.kind === "camera";
          const laneX = x + (camera ? 18 : cardWidth - 122);
          const laneY = y + frameHeight - 61;
          context.fillStyle = "#14101cdd";
          context.fillRect(laneX, laneY, 104, 48);
          drawArrow(context, laneX + 14, laneY, 76, 29, arrow);
          context.fillStyle = colors[arrow.kind];
          context.font = "bold 12px sans-serif";
          context.fillText(arrow.label, laneX + 10, laneY + 41);
        }
        context.fillStyle = "#ead4ff";
        context.font = "bold 17px sans-serif";
        context.fillText("Sc. " + sceneNumber + " · Pl. " + shotNumber + " — " + (shot.title || "Plan sans titre"), x + 15, y + frameHeight + 29, cardWidth - 30);
        context.font = captionFont;
        captions.forEach(([color, line], lineIndex) => {
          context.fillStyle = color;
          context.fillText(line, x + 15, y + frameHeight + 55 + lineIndex * lineHeight);
        });
      }
      y += height + gap;
    }
    return new Promise(resolve => canvas.toBlob(resolve, "image/png"));
  }

  return {render};
})();
