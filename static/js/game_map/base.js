import { GameObject } from "/static/js/game_object/base.js";
import { Controller } from "/static/js/controller/base.js";

class GameMap extends GameObject {
    constructor(root) {
        super();

        this.root = root;

        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        this.$canvas.focus();

        this.controller = new Controller(this.$canvas);

        // this.root.$kof.append($(``))
        this.time_left = 60000; // 毫秒
        this.$timer = this.root.$kof.find(".kof-head-timer");

        this.$tip = this.root.$kof.find(".tip");
    }

    start() {

    }

    update() {
        this.time_left -= this.timedelta;
        if (this.time_left <= 0) {
            this.time_left = 0;

            let [a, b] = this.root.Players;
            if (a.status !== 6 && b.status !== 6) {
                a.vx = b.vx = 0;

                this.$tip.text("Draw");
                this.root.game_over = true;
            }

        }

        this.$timer.text(parseInt(this.time_left / 1000));

        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}

export {
    GameMap
}