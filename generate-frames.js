const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, Image } = require('canvas');

let openmojis = require('./openmoji-emoji12.json');
const canvas = createCanvas(1920, 1080);
const ctx = canvas.getContext('2d');
const svgFolder = '../openmoji/color/svg';
const framesFolder = './frames';

const bgColors = {
  "smileys-emotion": "#e67a94",
  "people-body": "#61b2e4",
  "component": "#d0cfce",
  "animals-nature": "#5c9e31",
  "food-drink": "#ea5a47",
  "travel-places": "#92d3f5",
  "activities": "#d22f27",
  "objects": "#b399c8",
  "symbols": "#ffa7c0",
  "flags": "#9b9b9a"
};

// openmojis = [openmojis[0]];

openmojis.forEach((om, i) => {
  console.log(om.emoji, om.hexcode);
  const svgFile = path.join(svgFolder, om.hexcode + '.svg');

  background(ctx, bgColors[om.group]);
  ctx.fillStyle = 'black';
  ctx.font = 'bold 25px Helvetica';

  // emoji
  if (fs.existsSync(svgFile)) {
    drawEmoji(ctx, svgFile);
  } else {
    ctx.fillText('?', 640, 220);
  }

  // text labels
  ctx.fillText('U+' + om.hexcode +'\n'+ om.openmoji_author, 56, 960);
  ctx.fillText('OpenMoji' +'\n'+ om.annotation, 960, 960);
  ctx.fillText(om.group +'\n'+ om.subgroups, 1600, 960);

  // save frame
  const frameName = String(i).padStart(5, '0') + '.png';
  saveFrame(path.join(framesFolder, frameName));
});
console.log("✅ Done");


function background(ctx, color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1920, 1080);
}

function saveFrame(filepath) {
  const buf = canvas.toBuffer();
  fs.writeFileSync(filepath, buf);
}

function drawEmoji(ctx, filepath) {
  const img = new Image();
  img.src = filepath;
  img.width = 640;
  img.height = 640;
  ctx.drawImage(img, 640, 220);

}
