
const express = require('express');
const app = express();
const ColorThief = require('color-thief');

let colorThief = new ColorThief();

async function getDominantColor() {
    const img = 'public/img/seed/10804819745_192d9c74d1_m.jpg';
    const dominantColor = await colorThief.getColor(img);
    console.log(dominantColor);
}

getDominantColor();