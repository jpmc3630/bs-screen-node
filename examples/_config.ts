import {
  GpioMapping,
  LedMatrix,
  LedMatrixUtils,
  MatrixOptions,
  PixelMapperType,
  RuntimeOptions,
} from '../src';


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

export const matrixOptions: MatrixOptions = {
  ...LedMatrix.defaultMatrixOptions(),
  rows: 16,
  cols: 8,
  chainLength: 8,
  multiplexing: 18,
  parallel: 2,
  brightness: 100,
  pixelMapperConfig: "Flipper"

  // hardwareMapping: GpioMapping.Regular,
  // pixelMapperConfig: LedMatrixUtils.encodeMappers(
  //   { type: PixelMapperType.Chainlink }
  // ),
  // pixelMapperConfig: LedMatrixUtils.encodeMappers({ type: PixelMapperType.U }),
};

export const runtimeOptions: RuntimeOptions = {
  ...LedMatrix.defaultRuntimeOptions(),
  gpioSlowdown: 5,
};
