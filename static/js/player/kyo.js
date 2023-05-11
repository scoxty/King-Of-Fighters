import { Player } from "/static/js/player/base.js";
import { GIF } from "/static/js/utils/gif.js";

class Kyo extends Player {
    constructor(root, info) {
        super(root, info);

        this.init_animations();
    }

    init_animations() {
        let outer = this;
        let offsets = [0, -10, -10, 0, 0, 0, 0];

        for (let i = 0; i < 7; i++) {
            let gif = GIF();
            gif.load(`/static/images/game_character/character_gif/kyo/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0, // 要渲染的总帧数
                frame_rate: 5, //每5帧过渡一次
                offset_y: offsets[i], //y方向偏移量
                loaded: false,
                scale: 2,
            });

            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;

                if (i == 3) {
                    obj.frame_rate = 4;
                }
            }
        }
    }
}

export {
    Kyo
}