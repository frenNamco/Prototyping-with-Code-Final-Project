class Button {
    constructor(image) {
        this.asset = image;

        this.x = null;
        this.y = null;
        this.w = null;
        this.h = null;

        this.inverted = false;
    }

    drawButton(screen, x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        screen.image(this.asset, this.x - this.w/2, this.y, this.w, this.h);
    }

    checkMouseInButton() {
        if (mouseX > this.x - this.w/2 && mouseX < (this.x + this.w/2) && mouseY > this.y && mouseY < (this.y + this.h)) {
            return true;
        }
        return false;
    }

    drawButtonSelected(screen) {
        if (!this.inverted) {
            this.asset.filter(INVERT);
            this.inverted = true;
        }
        this.drawButton(screen, this.x, this.y, this.w, this.h);
    }

    uninvertButton(screen) {
        if (this.inverted) {
            this.asset.filter(INVERT);
            this.inverted = false;
        }
        this.drawButton(screen, this.x, this.y, this.w, this.h);
    }

}
