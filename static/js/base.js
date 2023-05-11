import { GameMap } from "/static/js/game_map/base.js";
import { Kyo } from "/static/js/player/kyo.js";
import { Huowu } from "/static/js/player/huowu.js";

class KOF {
    constructor(id) {
        this.game_over = false;

        this.$kof = $('#' + id);

        this.game_map = new GameMap(this);
        this.Players = [
            new Kyo(this, {
                id: 0,
                x: 200,
                y: 0,
                width: 120,
                height: 200,
                color: "blue",
            }),
            new Huowu(this, {
                id: 1,
                x: 900,
                y: 0,
                width: 120,
                height: 200,
                color: "red",
            }),
        ];
    }
}

export {
    KOF
}