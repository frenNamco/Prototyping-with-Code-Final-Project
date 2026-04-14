class Screen {
    constructor(tracker, cursor, canvas) {
        this.currentScreen = "main";

        this.mainScreen = createGraphics(width, height);
        this.drawingScreen = createGraphics(width, height);

        this.handtracker = tracker;
        this.cursor = cursor;
        this.canvas = canvas;
    }

    changeCurrentScreen(screen) {
        this.currentScreen = screen;
    }

    displayCurrentScreen() {
        if (this.currentScreen == "main") {
            this.drawMainScreen();
        } else if (this.currentScreen == "drawing mode") {
            this.drawDrawingModeScreen();
        } else {
            console.log("No screen displaying right now");
        }
    }

    drawMainScreen() {
        this.mainScreen.background("white");
        this.mainScreen.text("MAIN SCREEN PLACEHOLDER", width/2, height/2);
        image(this.mainScreen, 0, 0);
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

};