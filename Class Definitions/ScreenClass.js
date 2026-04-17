class Screen {
    constructor(tracker, cursor, canvas, mainBg) {
        this.currentScreen = "main";
        this.previousScreen = null;

        this.loadingScreen = createGraphics(width, height);
        this.mainScreen = createGraphics(width, height);
        this.drawingScreen = createGraphics(width, height);

        this.handtracker = tracker;
        this.cursor = cursor;
        this.canvas = canvas;

        this.cameraState = false;

        this.mainBackground = mainBg;

        this.transitionDownStartY = 0 - height;
        this.currentScreenY = this.transitionDownStartY;
    }

    changeCurrentScreen(screen) {
        this.previousScreen = this.currentScreen;
        this.currentScreen = screen;
    }

    displayCurrentScreen() {

        if (!this.handtracker.video.loadedmetadata) {
            this.drawLoadingScreen();
        } else {
            background("black");
            this.cameraState = true;


            if (this.currentScreen == "main" && this.previousScreen == null) {
                this.drawMainScreen("down");
            } else if (this.currentScreen == "drawing mode") {
                this.drawDrawingModeScreen();
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
        
        if (transitionState == "up") {
            
        } else if (transitionState == "down") {
            this.transitionDown(this.mainScreen, 15);
        }
    }

    drawDrawingModeScreen() {
        this.drawingScreen.background(220);
        this.drawingScreen.image(this.handtracker.video, 0, 0, this.handtracker.videoWidth, this.handtracker.videoHeight);
        this.handtracker.drawKeypoints(this.drawingScreen);

        this.cursor.updateCursor(this.handtracker);
        this.cursor.checkClick(this.handtracker);
        this.cursor.checkLocation(this.canvas);


        this.canvas.drawCanvas(this.drawingScreen);
        this.cursor.draw(this.canvas);
        this.cursor.drawCursor(this.drawingScreen);
        image(this.drawingScreen, 0, 0);
    }

    transitionUp() {

    }

    transitionDown(screen, speed) {
        let yVel = speed;
        image(screen, 0, this.currentScreenY);
        if (this.currentScreenY <= 0) {
            this.currentScreenY += yVel;
        }
    }
};