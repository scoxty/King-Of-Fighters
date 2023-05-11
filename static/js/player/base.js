import { GameObject } from "/static/js/game_object/base.js";

class Player extends GameObject {
    constructor(root, info) {
        super();

        this.root = root;

        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        this.color = info.color;

        this.direction = 1;

        this.vx = 0;
        this.vy = 0;

        this.speedx = 400; // 水平速度
        this.speedy = 1200; // 跳起的初始速度

        this.gravity = 50;

        this.ctx = this.root.game_map.ctx;
        this.pressed_keys = this.root.game_map.controller.pressed_keys;

        this.status = 3; // 0: 停在原地，1：向右移动，2：向左移动，3：跳跃，4：攻击，5：被打，6：死亡 

        this.animations = new Map();
        this.frame_current_cnt = 0;
        this.frame_rate = 5;

        this.hp = 100;
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div>div`);
        this.$hp_out = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);
    }

    start() {

    }

    update_control() {
        let w, a, d, space;
        if (this.id === 0) {
            w = this.pressed_keys.has("w");
            a = this.pressed_keys.has("a");
            d = this.pressed_keys.has("d");
            space = this.pressed_keys.has(" ");
        } else {
            w = this.pressed_keys.has("ArrowUp");
            a = this.pressed_keys.has("ArrowLeft");
            d = this.pressed_keys.has("ArrowRight");
            space = this.pressed_keys.has("Enter");
        }

        if (this.status === 0 || this.status === 1 || this.status === 2) {
            if (w) {
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }

                this.vy = -this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
            } else if (d) {
                this.vx = this.speedx;
                this.status = 1;
            } else if (a) {
                this.vx = -this.speedx;
                this.status = 2;
            } else if (space) {
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            }
            else {
                this.vx = 0;
                this.status = 0;
            }
        }
    }

    update_move() {
        this.vy += this.gravity;

        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;

        if (this.y > 450) {
            this.y = 450;
            this.vy = 0;

            if (this.status === 3)
                this.status = 0;
        }

        if (this.x < 0) {
            this.x = 0;
        } else if (this.x + this.width > this.root.game_map.$canvas.width()) {
            this.x = this.root.game_map.$canvas.width() - this.width;
        }
    }

    update_direction() {
        let players = this.root.Players;
        if (players[0] && players[1]) {
            let player1 = this, player2 = players[1 - this.id];
            if (player1.x <= player2.x) {
                player1.direction = 1;
                player2.direction = -1;
            }
            else {
                player1.direction = -1;
                player2.direction = 1;
            }
        }
    }

    is_attacked() {
        this.status = 5;
        this.frame_current_cnt = 0;
        this.hp = Math.max(0, this.hp - 10);

        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 300);

        this.$hp_out.animate({
            width: this.$hp.parent().width() * this.hp / 100
        }, 600);

        if (this.hp <= 0 && this.root.game_over !== true) {
            this.status = 6;
            this.frame_current_cnt = 0;
            this.vx = 0;

            if (this.id === 0) {
                this.root.game_map.$tip.text("The Winner is Mai Shiranui !");
            } else {
                this.root.game_map.$tip.text("The Winner is Kyo Kusanagi !");
            }

            this.root.game_over = true;
        }
    }

    check_intersection(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;
        return true;
    }

    update_attack() {
        if (this.status === 4 && this.frame_current_cnt === 15) {
            let player1 = this, player2 = this.root.Players[1 - this.id];
            let r1;
            if (player1.id === 0) {
                if (player1.direction > 0) {
                    r1 = {
                        x1: player1.x + player1.width,
                        y1: player1.y + 25,
                        x2: player1.x + player1.width + 60,
                        y2: player1.y + 25 + 20,
                    };
                } else {
                    r1 = {
                        x1: player1.x - 60,
                        y1: player1.y + 25,
                        x2: player1.x,
                        y2: player1.y + 25 + 20,
                    };
                }
            } else {
                if (player1.direction > 0) {
                    r1 = {
                        x1: player1.x + player1.width,
                        y1: player1.y,
                        x2: player1.x + player1.width + 180,
                        y2: player1.y + 200,
                    }
                } else {
                    r1 = {
                        x1: player1.x - 180,
                        y1: player1.y,
                        x2: player1.x,
                        y2: player1.y + 200,
                    }
                }
            }

            let r2 = {
                x1: player2.x,
                y1: player2.y,
                x2: player2.x + player2.width,
                y2: player2.y + player2.height,
            }

            if (this.check_intersection(r1, r2) && player2.hp > 0) {
                player2.is_attacked();
            }
        }
    }

    update() {
        this.update_direction();
        this.update_control();
        this.update_move();
        this.update_attack();

        this.render();
    }

    render() {

        // this.ctx.fillStyle = "blue";
        // this.ctx.fillRect(this.x, this.y, this.width, this.height);
        // this.ctx.fillStyle = "green";
        // if (this.id === 0) {
        //     if (this.direction > 0) {
        //         this.ctx.fillRect(this.x + this.width, this.y + 25, 60, 20);
        //     } else {
        //         this.ctx.fillRect(this.x - 60, this.y + 25, 60, 20);
        //     }
        // } else {
        //     if (this.direction > 0) {
        //         this.ctx.fillRect(this.x + this.width, this.y, 180, 200);
        //     } else {
        //         this.ctx.fillRect(this.x - 180, this.y, 180, 200);
        //     }
        // }


        let status = this.status;

        let obj = this.animations.get(status);

        if (obj && obj.loaded) {
            if (this.direction > 0 || this.status === 6) {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            } else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
                this.ctx.restore();
            }
        }

        if (status === 6 && this.id === 1) {
            console.log(obj.frame_cnt);
        }

        if (status === 4 || status === 5 || status === 6) {
            if (status === 6) {
                if (this.id === 0) {
                    if (this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 1)) {
                        this.frame_current_cnt--;
                    }
                } else {
                    if (this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 7)) {
                        this.frame_current_cnt--;
                    }
                }
            } else {
                if (this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 1)) {
                    this.status = 0;
                }
            }

        }

        this.frame_current_cnt++;

    }
}

export {
    Player
}