

// var io = require('socket.io-client');
// const quote = require('shell-quote').quote;

import { io } from 'socket.io-client'

const socket = io("wss://bs-pager.herokuapp.com",{
  transports:["polling", "websocket"],
  // forceNew: false,
  reconnection: true,
  reconnectionDelay: 3000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity
});


let timer: NodeJS.Timeout


import { LedMatrix, LedMatrixInstance, Font, LayoutUtils, HorizontalAlignment, VerticalAlignment } from '../src';
import { matrixOptions, runtimeOptions } from './_config';
import * as color from 'color';



// get IP
const { networkInterfaces } = require('os');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

const ip = JSON.parse(JSON.stringify(results)).wlan0[0]



const matrix = new LedMatrix(matrixOptions, runtimeOptions);

const render = async (message: string, color: any, outlineColor: any, bgColor: any, speed: any, spacing: any) => {
  try {

    // whole canvas
    // top left is 0,0
    let canvasWidth = 111
    let canvasHeight = 15

    spacing = (spacing / 2) * -1
    console.log('spacing at start of render:')
    console.log(spacing)


    clearTimeout(timer);

    console.log('Speed: ' + speed)
    let convertedSpeed = (7 - speed) * 18
    console.log('Converted Speed: ' + convertedSpeed)
    // set up the text instance
    const font = new Font('nethack16', `${process.cwd()}/../fonts/nethack16.bdf`);
    // const fontOutline = new Font('nethack16B', `${process.cwd()}/../fonts/nethack16B.bdf`);

    // matrix.font(font);
    const lines = LayoutUtils.textToLines(font, 100000000, message);

    // prepare the colour info
    let colorArrStrings = color.split(',')
    let colorArr = colorArrStrings.map(function (x: string) { 
      return parseInt(x, 10); 
    });
    let bgColorArrStrings = bgColor.split(',')
    let bgColorArr = bgColorArrStrings.map(function (x: string) { 
      return parseInt(x, 10);
    });
    let outlineColorArrStrings = outlineColor.split(',')
    let outlineColorArr = outlineColorArrStrings.map(function (x: string) { 
      return parseInt(x, 10);
    });

    console.log('font height: ' + font.height())
    // console.log('string width: ' + font.stringWidth(message))
    
    console.log('font info:')
    console.log(font.stringWidth(message, -5))
    console.log(font.stringWidth(message, 1))
    console.log(font.stringWidth(message, 5))

    
    // tally up the width of the entire text
    let textWidth = (16 - spacing) * message.split('').length
    
    console.log('string width:')
    console.log(63 - textWidth)
    let x = 112 // start pos 1 pixel off the right of screen
    
    matrix.afterSync((mat, dt, t) => {
      // console.log(x)
      // 63 offset for single second screen only, ytally rough width of text, 20 is a rough bit of spacing
      
      if (x < (63 - textWidth)) {
        // x = 113 // just off the edge of screen
        x = 112 // just on screen
      }
      x = x - 1 // how many pixels we shift at once



      matrix
      .clear()
      .brightness(100) 
      // set color for background  
      .fgColor({ r: bgColorArr[0], g: bgColorArr[1], b: bgColorArr[2] })
      .fill()             // color the entire diplay blue
     

      // set color for text OUTLINE
      .fgColor({ r: outlineColorArr[0], g: outlineColorArr[1], b: outlineColorArr[2] })
      // .drawText(message, x - 1, 0, spacing)
      .font(font)
      

      LayoutUtils.linesToMappedGlyphs(lines, font.height(), 48, 16, HorizontalAlignment.Left, VerticalAlignment.Top)
      .map((glyph, index) => {
        matrix.drawText(glyph.char, glyph.x + x - (index * spacing) - 1, glyph.y, -10);
        matrix.drawText(glyph.char, glyph.x + x - (index * spacing) + 1, glyph.y, -10);
        matrix.drawText(glyph.char, glyph.x + x - (index * spacing), glyph.y - 1, -10);
        matrix.drawText(glyph.char, glyph.x + x - (index * spacing), glyph.y + 1, -10);
      });


          // set main text color
          matrix.fgColor({ r: colorArr[0], g: colorArr[1], b: colorArr[2] })
          // .font(font)

          // .drawText(message, x, 1, spacing)
          LayoutUtils.linesToMappedGlyphs(lines, font.height(), 48, 16, HorizontalAlignment.Left, VerticalAlignment.Top)
          .map((glyph, index) => {
            matrix.drawText(glyph.char, glyph.x + x - (index * spacing), glyph.y, -10);
          });


      // if (go == false) {
      //   return
      // }
        timer = setTimeout(() => matrix.sync(), convertedSpeed);
        // matrix.sync();
      
    });

    matrix.sync();
  }
  catch (error) {
    console.error(error);
  }
};









function startScreen(message: string, color: string, colorOutline: string, bgColor: string, speed: string, spacing: string) {
  // console.log(socket.id)
  // log.warn(socket.id);
  

    // var cmdArgs = [
    //   '../text-scroller',
    //   '-f../../fonts/nethack16.bdf', 
    //   '--led-chain=8', 
    //   '--led-rows=16', 
    //   '--led-cols=8', 
    //   '--led-multiplexing=18', 
    //   '--led-parallel=2', 
    //   '--led-slowdown-gpio=5', 
    //   '--led-brightness=100', 
    //   '--led-pixel-mapper=Flipper', 
    //   '-s' + speed, 
    //   '-C' + color, 
    //   '-O' + colorOutline, 
    //   '-B' + bgColor, 
    //   '-t' + spacing, 
    //   message
    // ];


    // const sanitizedMessage = quote(message);
    
    // run the screen
    render(message, color, colorOutline, bgColor, speed, spacing)

}




startScreen(ip, '180,50,80', '70,100,160', '0,0,0', '.3','1')

socket.on('connect', function(socketId: string) {
  
  // log.warn('connected to server');
  console.log('connected to server')
  socket.emit('screenConnect', 'create');
  // startScreen('init patch', '180,50,80', '70,100,160', '0,0,0', '0.3','-1')



 socket.on('startMessage', function(data: any) {
  // log.info(data[0]);
  console.log('message: ' + data[0])
  console.log('colour: ' + data[1].join())
  console.log('outline: ' + data[2].join())
  console.log('background: ' + data[3].join())
  console.log('speed: ' + data[4])
  console.log('kerning: ' + data[5])

  startScreen(data[0], data[1].join(), data[2].join(), data[3].join(), data[4], data[5])

 })

})

console.log('ip: ' + ip)






