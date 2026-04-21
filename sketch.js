let tracker;
let cursor;
let canvas;
let screen;

let mainBackground;
let startButtonImage;

let startButton;

let canOutline;
let canBackground;

function preload() {
  tracker = new HandTracker();
  tracker.preload();
  
  mainBackground = loadImage("/Assets/Main Screen/Main_Background.png");
  startButtonImage = loadImage("/Assets/Main Screen/Main_Button.png");
  canOutline = loadImage("Assets/Drawing Screen/Spray_Paint_Can_Outline.png");
  canBackground = loadImage("Assets/Drawing Screen/Spray_Paint_Can_Background.png");
  paintSplash = loadImage("Assets/Drawing Screen/Paint_Splash.png");

  cursor = new Cursor(canOutline, canBackground, paintSplash);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  tracker.setup(width, height);

  canvas = new Canvas(tracker, width, height);
  screen = new Screen(tracker, cursor, canvas);

  startButton = new StartButton(startButtonImage);

  screen.loadBackgroundImage(mainBackground);
  screen.loadButtons(startButton);

}

function draw() {
  screen.displayCurrentScreen();
}