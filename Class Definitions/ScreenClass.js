class Screen {
    constructor(tracker, cursor, canvas) {
        this.currentScreen = "main";
        this.previousScreen = null;

        this.loadingScreen = createGraphics(width, height);
        this.mainScreen = createGraphics(width, height);
        this.drawingScreen = createGraphics(width, height);
        this.settingsScreen = createGraphics(width, height);
        this.tutorialScreen = createGraphics(width, height);

        this.handtracker = tracker;
        this.cursor = cursor;
        this.canvas = canvas;

        this.cameraState = false;

        this.mainBackground = null;

        this.transitionDownStartY = 0 - height;
        this.currentScreenY = this.transitionDownStartY;
        this.transitionSpeed = 25;

        this.startButton = null;
        this.settingsButton = null;
        this.mainMenuButton = null;
        this.returnButton = null;
        this.tutorialButton = null;

        this.transitioning = true;

        this.colorPicker = null;
        this.colorPickerDisplayW = width * 0.2;
        this.colorPickerDisplayX = (width * 3/4) - this.colorPickerDisplayW/2 + 50;
        this.colorPickerDisplayY = height * 1/3;

        this.radiusSlider = null;
        this.radiusSliderSize = width * 0.15;
        this.radiusSliderX = width/2 - this.radiusSliderSize/2;
        this.radiusSliderY = height * 2/3;

        this.modeSwitchButton = null;
        this.modeSwitchButtonW = 100;
        this.modeSwitchButtonH = this.modeSwitchButtonW/2
        this.modeSwitchButtonX = width * 1/5 - this.modeSwitchButtonW/2;
        this.modeSwitchButtonY = this.colorPickerDisplayY;
    
        this.saveButton = null;

        this.clearButton = null;
        
        this.tutorialImages = null;
        this.tutorialCounter = 0;

        this.nextButton = null;

        this.backgroundMusic = null;
        
    }

    changeCurrentScreen(screen) {
        if (this.currentScreen != screen) {
            this.previousScreen = this.currentScreen;
            this.currentScreen = screen;
            this.transitioning = true;
        }

    }

    displayCurrentScreen() {
        this.handleDOMElements();

        if (!this.handtracker.video.loadedmetadata) {
            this.drawLoadingScreen();
        } else {
            this.backgroundMusic.playMode('untilDone');
            this.backgroundMusic.play();
            this.cameraState = true;

            if (this.currentScreen == "main" && this.previousScreen == null) {
                this.drawMainScreen("down");
            } else if (this.currentScreen == "drawing mode" && this.previousScreen == "main") {
                this.drawDrawingModeScreen("main_up");
            } else if (this.currentScreen == "main" && this.previousScreen == "drawing mode"){
                this.drawMainScreen("down");
            } else if (this.currentScreen == "main" && this.previousScreen == "tutorial"){
                this.drawMainScreen("down");
                   
            } else if (this.currentScreen == "settings" && this.previousScreen == "drawing mode") {
                this.drawSettingsScreen();
            } else if (this.currentScreen == "drawing mode" && this.previousScreen == "settings"){
                this.drawDrawingModeScreen("settings_up")
            } else if (this.currentScreen == "tutorial" && this.previousScreen == "main") {
                this.drawTutorialScreen();
            } else {
                console.log("No screen displaying right now");
            }
        }
    }

    drawLoadingScreen() {
        this.loadingScreen.background("white")
        this.loadingScreen.textFont("Verdana");
        this.loadingScreen.textAlign(CENTER);
        this.loadingScreen.textSize(100);
        this.loadingScreen.text("Waiting On Camera", width/2, height/2);

        image(this.loadingScreen, 0, 0);
    }

    drawMainScreen(transitionState) {
        this.mainScreen.image(this.mainBackground, 0, 0, width, height);

        this.startButton.drawButton(this.mainScreen, width/2, height * (2/3), this.startButton.asset.width/2, this.startButton.asset.height/2);
        this.tutorialButton.drawButton(this.mainScreen, width/2, height * (5/6), this.tutorialButton.asset.width/3, this.tutorialButton.asset.height/3);


        if (!this.transitioning && this.startButton.checkMouseInButton()) {
            this.startButton.drawButtonSelected(this.mainScreen);
        } else {
            this.startButton.uninvertButton(this.mainScreen);
        }

        if (!this.transitioning && this.tutorialButton.checkMouseInButton()) {
            this.tutorialButton.drawButtonSelected(this.mainScreen);
        } else {
            this.tutorialButton.uninvertButton(this.mainScreen);
        }
        
        if (transitionState == "down") {
            if (this.previousScreen == "drawing mode") image(this.drawingScreen, 0, 0);
            if (this.previousScreen == "tutorial") image(this.tutorialScreen, 0, 0);

            this.transitionDown(this.mainScreen, this.transitionSpeed);
        }
    }

    drawDrawingModeScreen(transitionState) {
        this.drawingScreen.background("#b7fbb7");
        
        this.cursor.updateCursor(this.handtracker);
        this.cursor.checkClick(this.handtracker);
        this.cursor.checkLocation(this.canvas);
        
        if (!this.transitioning && this.settingsButton.checkMouseInButton()) {
            this.settingsButton.drawButtonSelected(this.drawingScreen);
        } else {
            this.settingsButton.uninvertButton(this.drawingScreen);
        }
        
        if (!this.transitioning && this.mainMenuButton.checkMouseInButton()) {
            this.mainMenuButton.drawButtonSelected(this.drawingScreen);
        } else {
            this.mainMenuButton.uninvertButton(this.drawingScreen);
        }
        
        this.cursor.draw(this.drawingScreen, this.canvas);
        this.canvas.drawCanvas(this.drawingScreen);
        this.cursor.drawCursor(this.drawingScreen, width/20, height/10);

        this.drawingScreen.push();
        this.drawingScreen.noStroke();
        this.drawingScreen.fill("#b7fbb7");
        this.drawingScreen.rect(0, 0, width, this.handtracker.videoHeight);
        this.drawingScreen.rect(0, 0, this.canvas.x, height);
        this.drawingScreen.rect(this.canvas.x + this.canvas.width, 0, width, height);
        this.drawingScreen.rect(0, this.canvas.y + this.canvas.height, width, height);
        this.drawingScreen.pop();
        
        this.drawingScreen.image(this.handtracker.video, (width/2) - (this.handtracker.videoWidth/2), 0, this.handtracker.videoWidth, this.handtracker.videoHeight);
        this.handtracker.drawKeypoints(this.drawingScreen);

        this.settingsButton.drawButton(this.drawingScreen, (this.canvas.x + this.canvas.width) - this.settingsButton.asset.width/8, this.handtracker.video.height/2 - this.settingsButton.asset.height/16, this.settingsButton.asset.width/4, this.settingsButton.asset.height/4);
        this.mainMenuButton.drawButton(this.drawingScreen, this.canvas.x + this.settingsButton.asset.width/8, this.handtracker.video.height/2 - this.mainMenuButton.asset.height/16, this.mainMenuButton.asset.width/4, this.mainMenuButton.asset.height/4);

        image(this.drawingScreen, 0, 0);    
        
        if (transitionState == "main_up") {
            this.transitionUp(this.mainScreen, this.transitionSpeed);
        } else if (transitionState == "settings_up") {
            this.transitionUp(this.settingsScreen, this.transitionSpeed);
        }
    }

    drawSettingsScreen() {
        this.settingsScreen.background("#ddeefe");
        
        this.settingsButton.drawButton(this.settingsScreen, width/2, 0, this.settingsButton.asset.width/2, this.settingsButton.asset.height/2);
        this.settingsButton.uninvertButton(this.settingsScreen);

        if (!this.transitioning && this.returnButton.checkMouseInButton()) {
            this.returnButton.drawButtonSelected(this.settingsScreen);
        } else {
            this.returnButton.uninvertButton(this.settingsScreen);
        }

        this.cursor.drawColor = this.colorPicker.value();
        this.cursor.drawRadius = this.radiusSlider.value();

        this.settingsScreen.push();
        this.settingsScreen.textFont("Verdana");
        this.settingsScreen.textStyle(BOLD);
        this.settingsScreen.textSize(width * 0.015);
        this.settingsScreen.push();
        this.settingsScreen.textAlign(CENTER);
        this.settingsScreen.text("Drawing Mode: " + this.cursor.mode, width * 1/5, this.colorPickerDisplayY - 10);
        this.settingsScreen.text("Save Drawing", width * 1/5, height/2);
        this.settingsScreen.text("Clear Drawing", width * 1/5, height * (2/3));
        this.settingsScreen.text("Current Radius", width/2, this.colorPickerDisplayY - 10);
        this.settingsScreen.pop();
        this.settingsScreen.push();
        this.settingsScreen.noStroke();
        this.settingsScreen.fill("black");
        this.settingsScreen.circle(width/2, height/2, this.cursor.drawRadius);
        this.settingsScreen.pop();
        this.settingsScreen.text("Current Color", this.colorPickerDisplayX, this.colorPickerDisplayY - 10);
        this.settingsScreen.text("Change Color ➡️",this.colorPickerDisplayX, this.colorPickerDisplayY + this.colorPickerDisplayW + 35);
        this.settingsScreen.push();
        this.settingsScreen.strokeWeight(10);
        this.settingsScreen.fill(this.cursor.drawColor);
        this.settingsScreen.rect(this.colorPickerDisplayX, this.colorPickerDisplayY, this.colorPickerDisplayW, this.colorPickerDisplayW);
        this.settingsScreen.pop();
        this.settingsScreen.pop();

        this.returnButton.drawButton(this.settingsScreen, (this.canvas.x + this.canvas.width) - this.settingsButton.asset.width/8, this.handtracker.video.height/2- this.settingsButton.asset.height/16, this.returnButton.asset.width/4, this.returnButton.asset.height/4);

        this.transitionDown(this.settingsScreen, this.transitionSpeed);
    }

    drawTutorialScreen() {
        this.tutorialScreen.image(this.tutorialImages[this.tutorialCounter], 0, 0, width, height);

        this.nextButton.drawButton(this.tutorialScreen, this.canvas.x + this.canvas.width - this.nextButton.asset.width/8, this.canvas.y + this.canvas.height - this.nextButton.asset.height/4, this.nextButton.asset.width/4, this.nextButton.asset.height/4);

        if (!this.transitioning && this.nextButton.checkMouseInButton()) {
            this.nextButton.drawButtonSelected(this.drawingScreen);
        } else {
            this.nextButton.uninvertButton(this.drawingScreen);
        }

        image(this.tutorialScreen, 0, 0);

        this.transitionUp(this.mainScreen, this.transitionSpeed);
    }

    transitionUp(screen, speed) {
        let yVel = speed;
        image(screen, 0, this.currentScreenY);

        if (this.currentScreenY > 0 - height) {
            this.currentScreenY -= yVel;
            this.transitioning = true;
        } else {
            this.currentScreenY = 0 - height;
            this.transitioning = false;
        }
    }

    transitionDown(screen, speed) {
        let yVel = speed;
        image(screen, 0, this.currentScreenY);

        if (this.currentScreenY < 0) {
            this.currentScreenY += yVel;
            this.transitioning = true;
        } else {
            this.currentScreenY = 0;
            this.transitioning = false;
        }
    }

    loadBackgroundImage(bckGndImg) {
        this.mainBackground = bckGndImg;
    }

    loadButtons(start, settings, mainMenu, returnB, tutorialButton, nextButton) {
        this.startButton = start;
        this.settingsButton = settings;
        this.mainMenuButton = mainMenu;
        this.returnButton = returnB;
        this.tutorialButton = tutorialButton;
        this.nextButton = nextButton;
    }

    loadDOMElements(colorPicker, radiusSlider, modeSwitchButton, saveButton, clearButton) {
        this.colorPicker = colorPicker;
        this.radiusSlider = radiusSlider;
        this.modeSwitchButton = modeSwitchButton;
        this.saveButton = saveButton;
        this.clearButton = clearButton;
    }

    handleDOMElements() {
        if (this.currentScreen == "settings" || (this.previousScreen == "settings" && this.transitioning)){
            this.colorPicker.position(this.colorPickerDisplayX + this.colorPickerDisplayW - 55, 5 + this.currentScreenY + (this.colorPickerDisplayY + this.colorPickerDisplayW));

            this.radiusSlider.size(this.radiusSliderSize);
            this.radiusSlider.position(this.radiusSliderX, this.currentScreenY + this.radiusSliderY);

            this.modeSwitchButton.size(this.modeSwitchButtonW, this.modeSwitchButtonH);
            this.modeSwitchButton.position(this.modeSwitchButtonX, this.currentScreenY + this.modeSwitchButtonY);
            this.modeSwitchButton.mousePressed(() => {
                if (this.cursor.mode == "hand") {
                    this.cursor.mode = "mouse";
                } else if (this.cursor.mode == "mouse") {
                    this.cursor.mode = "hand";
                }
            });

            this.saveButton.size(this.modeSwitchButtonW, this.modeSwitchButtonH);
            this.saveButton.position(this.modeSwitchButtonX, this.currentScreenY + height/2 + 10);
            this.saveButton.mousePressed(() => {
                let drawing = createGraphics(this.canvas.width, this.canvas.height);
                drawing.background(this.canvas.color);
                drawing.copy(this.canvas.painting, this.canvas.x, this.canvas.y, this.canvas.width, this.canvas.height, 0, 0, this.canvas.width, this.canvas.height);
                saveCanvas(drawing, "drawing.jpg");
                drawing.remove();
            })

            this.clearButton.size(this.modeSwitchButtonW, this.modeSwitchButtonH);
            this.clearButton.position(this.modeSwitchButtonX, this.currentScreenY + height * (2/3) + 10);
            this.clearButton.mousePressed(() => {
                this.canvas.clearCanvas();
            })
        } else {
            this.colorPicker.position(-1000, -1000);
            this.radiusSlider.position(-1000, -1000);
            this.modeSwitchButton.position(-1000, -1000);
            this.saveButton.position(-1000, -1000);
            this.clearButton.position(-1000, -1000);
        }
    }

    loadTutorialImages(t1, t2, t3, t4, t5) {
        this.tutorialImages = [t1, t2, t3, t4, t5];
    }

    loadMusic(m) {
        this.backgroundMusic = m;
    }
};