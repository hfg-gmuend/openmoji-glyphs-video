const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, Image } = require('canvas');
const chroma = require('chroma-js');
const { groupBy } = require('lodash');

let openmojis = require('./openmoji.json');
const canvas = createCanvas(1920, 1080);
const ctx = canvas.getContext('2d');
const svgFolder = '../openmoji/color/svg';
const framesFolder = './frames';

// background colors for each emoji group (category)
const bgColors = {
  "smileys-emotion": "#61b2e4",
  "people-body": "#ffa7c0",
  "component": "#3f3f3f",
  "animals-nature": "#b1cc33",
  "food-drink": "#ea5a47",
  "travel-places": "#b399c8",
  "activities": "#61b2e4",
  "objects": "#fcea2b",
  "symbols": "#f4aa41",
  "flags": "#9b9b9a",
  "extras-openmoji": "#d0cfce"
};
let bgColorsEnd = {};
for (var key in bgColors) {
  if (bgColors.hasOwnProperty(key)) {
    bgColorsEnd[key] = chroma(bgColors[key]).alpha(0.5);
  }
}

// enhance openmojis with groupIndex and groupLength property
const grouped = groupBy(openmojis, 'group');
let currentGroup = '';
let counter;
openmojis = openmojis.map((om, i) => {
  if (currentGroup !== om.group) {
    counter = 0
    currentGroup = om.group;
  }
  om.groupIndex = counter;
  om.groupLength = grouped[om.group].length;
  counter++;
  return om;
});

// draw frames
openmojis.forEach((om, i) => {
  const progress = Math.round(i/openmojis.length*100);
  console.log(om.emoji, om.hexcode, progress + '%');
  const svgFile = path.join(svgFolder, om.hexcode + '.svg');

  background(ctx, 'white');
  const lerpColor = chroma.scale([bgColors[om.group], bgColorsEnd[om.group]]);
  background(ctx, lerpColor(om.groupIndex/om.groupLength));
  ctx.fillStyle = 'black';
  ctx.font = 'bold 25px Helvetica';

  // emoji
  if (fs.existsSync(svgFile)) {
    drawEmoji(ctx, svgFile);
  } else {
    ctx.fillText('?', 640, 220);
  }

  // text labels
  ctx.fillText('OpenMoji\n' + om.openmoji_author, 56, 960);
  ctx.fillText('U+' + om.hexcode +'\n'+ formatTitle(om.annotation), 676, 960);
  ctx.fillText(formatTitle(om.group) +'\n'+ formatTitle(om.subgroups), 1600, 960);

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
  ctx.drawImage(img, 640, 220 - 16);
}

function formatTitle(str) {
  // replace all '-' with ' '
  str = str.replace(/-/g, ' ');
  // title case
  str = str.toLowerCase().split(' ');
  for (var i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(' ');
}
