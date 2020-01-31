
const express = require('express');
const app = express();
const ColorThief = require('color-thief');

let colorThief = new ColorThief();

async function getDominantColor() {
    const img = 'public/img/seed/big-waves-2193828__340.webp';
    const dominantColor = await colorThief.getColor(img);
    console.log(dominantColor);
}

getDominantColor();