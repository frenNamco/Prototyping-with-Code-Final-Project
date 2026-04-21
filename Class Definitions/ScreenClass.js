class Screen {
    constructor(tracker, cursor, canvas) {
        this.currentScreen = "main";
        this.previousScreen = null;

        this.loadingScreen = createGraphics(width, height);
        this.mainScreen = createGraphics(width, height);
        this.drawingScreen = createGraphics(width, height);

        this.handtracker = tracker;
        this.cursor = cursor;
        this.canvas = canvas;

        this.cameraState = false;

        this.mainBackground = null;

        this.transitionDownStartY = 0 - height;
        this.currentScreenY = this.transitionDownStartY;

        this.startButton = null;
    }

    changeCurrentScreen(screen) {
        if (this.currentScreen != screen) {
            this.previousScreen = this.currentScreen;
            this.currentScreen = screen;
        }

    }

    displayCurrentScreen() {

        if (!this.handtracker.video.loadedmetadata) {
            this.drawLoadingScreen();
        } else {
            background("black");
            this.cameraState = true;

            if (this.currentScreen == "main" && this.previousScreen == null) {
                this.drawMainScreen("down");
            } else if (this.currentScreen == "drawing mode" && this.previousScreen == "main") {
                this.drawDrawingModeScreen("main_up");
            } else {
                console.log("No screen displaying right now");
            }
        }
    }

    drawLoadingScreen() {
        this.loadingScreen.background("white")
        this.loadingScreen.textAlign(CENTER);
        this.loadingScreen.textSize(100);
        this.loadingScreen.text("Waiting On Camera", width/2, height/2);

        image(this.loadingScreen, 0, 0);
    }

    drawMainScreen(transitionState) {
        this.mainScreen.image(this.mainBackground, 0, 0, width, height);

        this.startButton.drawButton(this.mainScreen, width/2, height * (3/4));

        if (this.startButton.checkMouseInButton()) {
            this.startButton.drawButtonSelected(this.mainScreen);

            if (this.startButton.checkClick()) {
                this.changeCurrentScreen("drawing mode");
            }

        } else {
            this.startButton.uninvertButton(this.mainScreen);
        }
        
        if (transitionState == "up") {
            
        } else if (transitionState == "down") {
            this.transitionDown(this.mainScreen, 15);
        }
    }

    drawDrawingModeScreen(transitionState) {
        this.drawingScreen.background(220);
        this.drawingScreen.image(this.handtracker.video, (width/2) - (this.handtracker.videoWidth/2), 0, this.handtracker.videoWidth, this.handtracker.videoHeight);
        this.handtracker.drawKeypoints(this.drawingScreen);
        
        this.cursor.updateCursor(this.handtracker);
        this.cursor.checkClick(this.handtracker);
        this.cursor.checkLocation(this.canvas);
        
        
        this.cursor.draw(this.drawingScreen, this.canvas);
        this.canvas.drawCanvas(this.drawingScreen);
        this.cursor.drawCursor(this.drawingScreen, width/20, height/10);
        
        image(this.drawingScreen, 0, 0);    
        
        if (transitionState == "main_up") {
            this.transitionUp(this.mainScreen, 15);
        }
    }

    transitionUp(screen, speed) {
        let yVel = speed;
        image(screen, 0, this.currentScreenY);

        if (this.currentScreenY > 0 - height) {
            this.currentScreenY -= yVel;
        } else if (this.currentScreenY < 0 - height) {
            this.currentScreenY = 0 - height;
        }
    }

    transitionDown(screen, speed) {
        let yVel = speed;
        image(screen, 0, this.currentScreenY);

        if (this.currentScreenY < 0) {
            this.currentScreenY += yVel;
        } else if (this.currentScreenY > 0) {
            this.currentScreenY = 0;
        }
    }

    loadBackgroundImage(bckGndImg) {
        this.mainBackground = bckGndImg;
    }

    loadButtons(start) {
        this.startButton = start;
    }
};