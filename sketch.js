let tracker;
let cursor;
let canvas;
let screen;

function preload() {
  tracker = new HandTracker();
  cursor = new Cursor();
  tracker.preload();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  tracker.setup(width, height);

  canvas = new Canvas(tracker, width, height);
  screen = new Screen(tracker, cursor, canvas);
}

function draw() {
  screen.displayCurrentScreen();
  
  if (mouseIsPressed) {
    screen.currentScreen = "drawing mode";
  }


  // background(220);
  // image(tracker.video, 0, 0, tracker.videoWidth, tracker.videoHeight);
  // tracker.drawKeypoints();

  // cursor.updateCursor(tracker);
  // cursor.checkClick(tracker);
  // cursor.checkLocation(canvas);

  
  // canvas.drawCanvas();
  // cursor.draw(canvas);
  // cursor.drawCursor();

}