let tracker;
let cursor;
let canvas;
let screen;

let mainBackground;
let startButtonImage;
let settingsButtonImage;
let mainMenuButtonImage;
let returnButtonImage;
let tutorialButtonImage;
let nextButtonImage;

let tutorialImage1;
let tutorialImage2;
let tutorialImage3;
let tutorialImage4;

let startButton;
let settingsButton
let mainMenuButton;
let returnButton;
let tutorialButton;
let nextButton;

let canOutline;
let canBackground;

let colorPicker;
let radiusSlider;
let modeSwitchButton;
let saveButton;
let clearButton;

let spraySound;

function preload() {
  	tracker = new HandTracker();
  	tracker.preload();
  
	mainBackground = loadImage("Assets/Main_Screen/Main_Background.png");
	startButtonImage = loadImage("Assets/Main_Screen/Main_Button.png");
	canOutline = loadImage("Assets/Drawing_Screen/Spray_Paint_Can_Outline.png");
	canBackground = loadImage("Assets/Drawing_Screen/Spray_Paint_Can_Background.png");
	paintSplash = loadImage("Assets/Drawing_Screen/Paint_Splash.png");
	settingsButtonImage = loadImage("Assets/Drawing_Screen/Settings.png");
	mainMenuButtonImage = loadImage("Assets/Drawing_Screen/Main_Menu.png");
	returnButtonImage = loadImage("Assets/Settings_Screen/Return.png");
    tutorialButtonImage = loadImage("Assets/Main_Screen/Tutorial.png");
    nextButtonImage = loadImage("Assets/Tutorial_Screen/Next.png");

    tutorialImage1 = loadImage("Assets/Tutorial_Screen/Tutorial1.png");
    tutorialImage2 = loadImage("Assets/Tutorial_Screen/Tutorial2.png");
    tutorialImage3 = loadImage("Assets/Tutorial_Screen/Tutorial3.png");
    tutorialImage4 = loadImage("Assets/Tutorial_Screen/Tutorial4.png");
    tutorialImage5 = loadImage("Assets/Tutorial_Screen/Tutorial5.png");

    spraySound = loadSound("Assets/Drawing_Screen/Spray.mp3");

	cursor = new Cursor(canOutline, canBackground, spraySound, paintSplash);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
	tracker.setup(width, height);
    
	canvas = new Canvas(tracker, width, height);
	screen = new Screen(tracker, cursor, canvas);
    
	startButton = new Button(startButtonImage);
	settingsButton = new Button(settingsButtonImage);
	mainMenuButton = new Button(mainMenuButtonImage);
	returnButton = new Button(returnButtonImage);
    tutorialButton = new Button(tutorialButtonImage);
    nextButton = new Button(nextButtonImage);
    
	screen.loadBackgroundImage(mainBackground);
	screen.loadButtons(startButton, settingsButton, mainMenuButton, returnButton, tutorialButton, nextButton);
    
    colorPicker = createColorPicker();
    radiusSlider = createSlider(5, 255, 20, 1);
    modeSwitchButton = createButton("Switch Modes");
    saveButton = createButton("Save");
    clearButton = createButton("Clear");
    
    screen.loadDOMElements(colorPicker, radiusSlider, modeSwitchButton, saveButton, clearButton);
    screen.loadTutorialImages(tutorialImage1, tutorialImage2, tutorialImage3, tutorialImage4, tutorialImage5);
    
    
}

function draw() {
    screen.displayCurrentScreen();
}

function mouseClicked() {
    if (!screen.transitioning) {
        if (screen.startButton.checkMouseInButton() && screen.currentScreen == "main") {
            screen.changeCurrentScreen("drawing mode");
        }
    
        if (screen.mainMenuButton.checkMouseInButton() && screen.currentScreen == "drawing mode") {
            screen.canvas.clearCanvas();
            screen.changeCurrentScreen("main");
        }
    
        if (screen.settingsButton.checkMouseInButton() && screen.currentScreen == "drawing mode") {
            console.log("settings button clicked")
            screen.changeCurrentScreen("settings");
        }
    
        if (screen.returnButton.checkMouseInButton() && screen.currentScreen == "settings") {
            console.log("return button clicked")
            screen.changeCurrentScreen("drawing mode");
            screen.returnButton.y = -1000;
        }

        if (screen.tutorialButton.checkMouseInButton() && screen.currentScreen == "main") {
            screen.changeCurrentScreen("tutorial");
        }

        if (screen.nextButton.checkMouseInButton() && screen.currentScreen == "tutorial") {
            screen.tutorialCounter++;

            if (screen.tutorialCounter >= screen.tutorialImages.length) {
                screen.changeCurrentScreen("main");
                screen.tutorialCounter = 0;
            }
        }
        
    }
}