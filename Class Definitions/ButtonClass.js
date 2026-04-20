class Button {
    constructor(image) {
        this.asset = image;

        this.x;
        this.y;

    }

    drawButton(screen, x, y) {
        this.x = x;
        this.y = y;

        screen.image(this.asset, x - (this.asset.width/4), y, this.asset.width/2, this.asset.height/2);
    }

    checkMouseInButton() {
        if (mouseX > this.x - (this.asset.width/4) && mouseX < (this.x + this.asset.width/4) && mouseY > this.y && mouseY < (this.y + this.asset.height/2)) {
            return true;
        }
    
        return false;
    }

    checkClick() {
        if (this.checkMouseInButton() && mouseIsPressed) {
            return true;
        }

        return false;
    }
}

class StartButton extends Button {
    constructor(image) {
        super(image);

        this.inverted = false;
    }

    drawButtonSelected(screen) {
        
        if (!this.inverted) {
            this.asset.filter(INVERT);
            this.inverted = true;
        }

        this.drawButton(screen, this.x, this.y);
    }

    uninvertButton(screen) {
        if (this.inverted) {
            this.asset.filter(INVERT);
            this.inverted = false;
        }

        this.drawButton(screen, this.x, this.y);
    }
}
