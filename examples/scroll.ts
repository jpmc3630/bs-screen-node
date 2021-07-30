import { LedMatrix, LedMatrixInstance, Font, LayoutUtils, HorizontalAlignment, VerticalAlignment } from '../src';
import { matrixOptions, runtimeOptions } from './_config';
import * as color from 'color';

const Colors = {
  Aquamarine: 0x7FFFD4,
  Black: 0x000000,
  Blue: 0x0000FF,
  Cyan: 0x00FFFF,
  Green: 0x00FF00,
  Magenta: 0xFF00FF,
  Purple: 0x800080,
  Red: 0xFF0000,
  White: 0xFFFFFF,
  Yellow: 0xFFFF00,
};

const rainbow64 = Array.from(Array(64))
  .map((_, i, { length }) => Math.floor(360 * i / length))
  .map(hue => color.hsl(hue, 100, 50).rgbNumber());

const rainbow = (i: number) => rainbow64[Math.min(rainbow64.length - 1, Math.max(i % 64, 0))];
// .drawRect(65, 1, 45, 13) // bounds of panel2

// const nextColor = (f: number, t: number): number => {
//   const brightness = 0xFF & Math.max(0, 255 * Math.sin(f * t / 1000));

//   return (brightness << 16) | (brightness << 8) | brightness;
// };
let go = true;

setTimeout(() => {
  go = true;
  let message = 'Welcome to the matrix o.O'
  let color = Colors.Red
  let bgColor = Colors.Yellow
  let speed = 20
  render(message, color, bgColor, speed)
}, 1000);


// setTimeout(() => {
//   go = false
// }, 15000);

// setTimeout(() => {
//   go = true
//   let color = Colors.Red
//   let bgColor = Colors.Yellow
//   let speed = 20
//   render(color, bgColor, speed)
// }, 20000);

const matrix = new LedMatrix(matrixOptions, runtimeOptions);

const render = async (message: string, color: any, bgColor: any, speed: any) => {
  try {

    // set up the text instance
    const font = new Font('spleen-8x16', `${process.cwd()}/../fonts/spleen-8x16.bdf`);
    matrix.font(font);
    const lines = LayoutUtils.textToLines(font, 100000000, message);


    // const freqs = [...Array(matrix.width() * matrix.height()).keys()].map(i => i / 30);
    let x = 105
    let ytally = 10 * message.split('').length
    // let y = 5
    matrix.afterSync((mat, dt, t) => {
      // console.log(x)
      // 50 offset for single second screen only, ytally rough width of text, 20 is a rough bit of spacing
      if (x < (50 - ytally - 20)) {
        // x = 113 // just off the edge of screen
        x = 50 // just on screen
      }
      // x = x - 1 // how many pixels we shift at once

      matrix.clear()            // clear the display
      .brightness(100)    // set the panel brightness to 100%
      // .fgColor(0x0000FF)  // set the active color to blue
      // .fill()             // color the entire diplay blue
      .fgColor(color)  // set the active color to yellow
      // draw a yellow circle around the display
      // .drawCircle(matrix.width() / 2, matrix.height() / 2, matrix.width() / 2 - 1)
      // draw a yellow rectangle
      .drawRect(65, 1, 45, 13)
      // .fgColor(color)
      // .drawRect(x, 5, 3, 3)

      {

        // console.log('font height:')
        // console.log(font.height())
        // for (const alignmentH of [HorizontalAlignment.Left, HorizontalAlignment.Center, HorizontalAlignment.Right]) {
        //   for (const alignmentV of [VerticalAlignment.Top, VerticalAlignment.Middle, VerticalAlignment.Bottom]) {
            
            LayoutUtils.linesToMappedGlyphs(lines, font.height(), 48, 16, HorizontalAlignment.Left, VerticalAlignment.Top)
              .map(glyph => {
                // matrix.fgColor(rainbow(Math.floor(64 * Math.random()))) // RAINBOW TEXT
                matrix.fgColor(rainbow(Math.floor(19 * Math.random()))) // RAINBOW TEXT
                matrix.drawText(glyph.char, glyph.x + x, glyph.y, 10);
                // console.log('glyph.x')
                // console.log(glyph.x + x)
                // console.log('total width:')
                
                // console.log(ytally)
              });
            // matrix.sync();
            // await wait(400);
        //   }
        // }
      }



      if (go == false) {
        return
      }
        setTimeout(() => matrix.sync(), speed);
        // matrix.sync();
      
    });

    matrix.sync();
  }
  catch (error) {
    console.error(error);
  }
};
