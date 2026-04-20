let tracker;
let cursor;
let canvas;
let screen;

let mainBackground;
let startButtonImage;

let startButton;

function preload() {
  tracker = new HandTracker();
  cursor = new Cursor();
  tracker.preload();

  mainBackground = loadImage("/Assets/Main Screen/Main_Background.png");
  startButtonImage = loadImage("/Assets/Main Screen/Main_Button.png");
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