
// const ColorThief = require('color-thief');
// const colorConvert = require('color-convert');

// let colorThief = new ColorThief();

// async function getDominantColor() {
//     const img = 'public/img/seed/10804819745_192d9c74d1_m.jpg';
//     const dominantColor = await colorThief.getColor(img);
//     console.log(dominantColor);
//     const hwbColor = colorConvert.rgb.hwb(dominantColor);
//     console.log(hwbColor);
// }

// getDominantColor();


function isOdd(num) { return (num % 2) == 1;};


function generatePalette(hsv,howMany) {
    const breaks = [60,120,180,240,300];
    const first = hsv[0];
    let palette = [hsv];
    for(let i = 0;i<howMany;i++) {
        let currentColor = [];
        //if current count is odd, generate a darker hue
        if(isOdd(i)) {
            switch (first) {
                case first<60:
                    console.log('value is less than 60');
                case first> 120 && first < 180:
                    console.log('value is greater than 120 but less than 180');
                case first> 240:
                    console.log('value is more than 240');
                    currentColor.push(first-5);
                    console.log(' this color is darker and the first value is '+first-5);
                    break
                case first>60 && first < 120:
                case first > 180 && first < 240:
                    currentColor.push(first+5);
                    console.log(' this color is darker and the first value is '+first+5);
                    break
            }
            currentColor.push(hsv[1]+15);
            currentColor.push(hsv[2]-30);
        //if current count is even, generate a brighter hue
        } else {
            switch (first) {
                case first<60:
                    console.log('value is less than 60');
                case first> 120 && first < 180:
                    console.log('value is greater than 120 but less than 180');
                case first> 240:
                    console.log('value is more than 240');
                    currentColor.push(first+5);
                    console.log(' this color is lighter and the first value is '+first+5);
                    break
                case first>60 && first < 120:
                case first > 180 && first < 240:
                    currentColor.push(first-5);
                    console.log(' this color is lighter and the first value is '+first-5);
                    break
            }
            currentColor.push(hsv[1]-15);
            currentColor.push(hsv[2]+30);
        }
        console.log(currentColor);
        palette.push(currentColor);
    } 
    console.log(palette);
}

generatePalette([55,30,30],3);