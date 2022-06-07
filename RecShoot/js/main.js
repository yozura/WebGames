//#region Class
class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Transform {
    constructor(pos, scale) {
        this.pos = pos;
        this.scale = scale;
    }
}

class Player extends Transform {
    constructor(pos, scale, maxHp, speed) {
        super(pos, scale);
        this.maxHp = maxHp;
        this.hp = maxHp;
        this.speed = speed;
        this.damage = maxHp;
        this.bulletDamage = 1;
        this.bombs = [];
        this.isDead = false;
    }

    progress() {
        this.damage = this.hp;
    }

    draw() {
        context.fillStyle = "#0000FF";
        context.fillRect(this.pos.x, this.pos.y, this.scale.x, this.scale.y);

        context.fillStyle = "#000000";
        context.font = "25px Dotum";
        context.textAlign = "center";
        context.fillText(this.hp, this.pos.x + this.scale.x / 2, this.pos.y + this.scale.y / 2 + 8);
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.isDead = true;
        }
    }

    takeItem(item) {
        switch (item.type) {
            case "HEAL":
                this.hp += item.value;
                if (this.hp > this.maxHp) {
                    this.hp = this.maxHp;
                }
                break;
            case "DAMAGE":
                this.bulletDamage += item.value;
                break;
            case "BOMB":
                if (this.bombs.length <= 5)
                    this.bombs.push(item.value);
                break;
            case "NONE":
                break;
        }
    }
}

class Bullet extends Transform {
    constructor(pos, scale, speed, damage) {
        super(pos, scale);
        this.speed = speed;
        this.damage = damage;
        this.isHit = false;
    }

    progress() {
        this.pos.y -= this.speed;
        if (this.pos.y <= 0) {
            this.isHit = true;
        }
    }

    draw() {
        if (this.isHit) {
            context.clearRect(this.pos.x, this.pos.y, this.scale.x, this.scale.y);
            return;
        }

        context.fillStyle = "#000000";
        context.beginPath();
        context.moveTo(this.pos.x, this.pos.y);
        context.lineTo(this.pos.x - this.scale.x / 2, this.pos.y + this.scale.y / 2);
        context.lineTo(this.pos.x + this.scale.x / 2, this.pos.y + this.scale.y / 2);
        context.fill();
    }
}

class Enemy extends Transform {
    constructor(pos, scale, maxHp, speed) {
        super(pos, scale);
        this.maxHp = maxHp;
        this.hp = maxHp;
        this.damage = maxHp;
        this.speed = speed;
        this.isDead = false;
        this.isExist = true;

        this.itemType = itemType[pickRandomItem()];
    }

    progress() {
        this.damage = this.hp;
        this.pos.y += this.speed;
        if (this.pos.y >= 800) {
            this.isExist = false;
        }
    }

    draw() {
        if (this.isDead || !this.isExist) {
            context.clearRect(this.pos.x, this.pos.y, this.scale.x, this.scale.y);
            return;
        }

        context.fillStyle = "#FF0000";
        context.fillRect(this.pos.x, this.pos.y, this.scale.x, this.scale.y);

        context.fillStyle = "#000000";
        context.font = "25px Dotum";
        context.textAlign = "center";
        context.fillText(this.hp, this.pos.x + this.scale.x / 2, this.pos.y + this.scale.y / 2 + 8);
    }

    takeDamage(damage) {
        // TODO :: 넉백 효과 조금 넣기?
        this.hp -= damage;
        this.damage = this.hp;
        if (this.hp <= 0) {
            this.hp = 0;
            this.isDead = true;
        }
    }
}

class Boss extends Enemy {
    constructor(pos, scale, maxHp, speed) {
        super(pos, scale, maxHp, speed);
    }
}

class Item extends Transform {
    constructor(pos, scale, speed, value, type) {
        super(pos, scale);
        this.speed = speed;
        this.value = value;
        this.type = type;
        this.isExist = true;
    }

    progress() {
        this.pos.y += this.speed;
        if (this.pos.y > 800 - this.scale.y || this.pos.y < 0)
            this.speed *= -1;
    }

    draw() {
        if (!this.isExist) {
            context.clearRect(this.pos.x, this.pos.y, this.scale.x, this.scale.y);
            return;
        }

        switch (this.type) {
            case "HEAL": context.fillStyle = "#7AE995"; break;
            case "DAMAGE": context.fillStyle = "#967AE9"; break;
            case "BOMB": context.fillStyle = "#E9967A"; break;
        }
        context.fillRect(this.pos.x, this.pos.y, this.scale.x, this.scale.y);

        context.fillStyle = "#000000";
        context.font = "25px Dotum";
        context.textAlign = "center";
        context.fillText(this.type, this.pos.x + this.scale.x / 2, this.pos.y + this.scale.y / 2 + 8);
    }
}
//#endregion

//#region Variable
// Canvas, Context, IntervalId
let canvas;
let context;
let intervalID;

// Objects
let player;
const bosses = [];
const enemys = [];
const bullets = [];
const items = [];

// UI
let isPause = false;
let backImage;

// Others
let difficulty = 1.0;
const maxBulletCount = 14;
let curBulletCount = maxBulletCount;
const itemProb = { "NONE": 0.8, "HEAL": 0.1, "DAMAGE": 0.05, "BOMB": 0.05 };
const itemType = ["NONE", "HEAL", "DAMAGE", "BOMB"];
let isBomb = false;
let isReload = false;
let score = 0;

// Frame
let prev, now, fps;

// Archivement
let killedEnemyCount = 0;
let killedBossCount = 0;

//#endregion

// 참고 자료 https://heekim0719.tistory.com/58

//#region Entry Function
function start() {
    canvas = document.getElementById("mainCanvas");
    context = canvas.getContext("2d");

    let fpsElem = document.getElementById("fps");
    let kecElem = document.getElementById("kec");
    let kbcElem = document.getElementById("kbc");

    // 백그라운드 이미지 로딩
    backImage = new Image();
    backImage = "images/background.png";

    // 플레이어 생성
    createPlayer();

    // Update
    prev = Date.now();
    intervalID = setInterval(
        () => {
            now = Date.now();
            fps = Math.round(1000 / (now - prev));
            prev = now;

            if (!isPause) {
                // 주기적으로 실행
                createEnemy();
                progressAll();
                collisionAll();
                drawAll();
            }
        }
        , 17
    );

    setInterval(
        () => {
            // Frame Update
            fpsElem.innerHTML = "FPS " + fps;
            kecElem.innerHTML = "죽인 적 수 " + killedEnemyCount;
            kbcElem.innerHTML = "죽인 보스 수 " + killedBossCount;
        }
        , 200
    )
}
//#endregion

//#region Objects
function createPlayer() {
    const playerScale = new Vector2D(100, 100);
    const playerPos = new Vector2D(canvas.width / 2 - playerScale.x / 2, canvas.height - playerScale.y);
    player = new Player(playerPos, playerScale, 10, 100);

    // Control
    document.addEventListener("keydown", (e) => {
        if ((e.key === "Right" || e.key === "ArrowRight")
            && player.pos.x + player.speed < canvas.width) {
            player.pos.x += player.speed;
        }
        else if ((e.key === "Left" || e.key === "ArrowLeft")
            && player.pos.x - player.speed >= 0) {
            player.pos.x -= player.speed;
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "x" || e.key === "X") {
            createBullet();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "z" || e.key === "Z") {
            if (isBomb)
                return;

            if (player.bombs.length <= 0)
                return;

            isBomb = true;
            const explode = new Promise(() => {
                setTimeout(explodeBomb, 800);
            });
        }
    });

    // document.addEventListener("keydown", (e) => {
    //     if (e.key === "c" || e.key === "C") {
    //         if (isReload) {
    //             return;
    //         }

    //         if (curBulletCount == maxBulletCount) {
    //             return;
    //         }

    //         isReload = true;
    //         const reload = new Promise(() => {
    //             setTimeout(reloadBullet, 800);
    //         });
    //     }
    // });
}

async function explodeBomb() {
    isBomb = false;
    player.bombs.pop();

    for (let i = 0; i < enemys.length; ++i) {
        score += enemys[i].maxHp * difficulty;
    }

    for (let i = 0; i < bosses.length; ++i) {
        score += bosses[i].maxHp * difficulty;
    }

    enemys.splice(0, enemys.length);
    bosses.splice(0, bosses.length);
}

async function reloadBullet() {
    isReload = false;
    curBulletCount = maxBulletCount;
}

function createEnemy() {
    if (enemys.length > 0)
        return;

    if (bosses.length > 0)
        return;

    const enemyCount = Math.floor(Math.random() * 5) + 1;
    if (enemyCount == 1) {
        const bossScale = new Vector2D(500, 500);
        const bossPos = new Vector2D(0, -500);
        const bossHp = Math.floor(Math.random() * 50 * difficulty) + 1;
        const boss = new Boss(bossPos, bossScale, bossHp, 3 * difficulty);
        bosses.push(boss);
        return;
    }

    const enemyX = [0, 100, 200, 300, 400];
    for (let i = 0; i < enemyCount; ++i) {
        const randX = Math.floor(Math.random() * 5);
        const enemyScale = new Vector2D(100, 100);
        const enemyPos = new Vector2D(enemyX[randX], -50);
        const enemyHp = Math.floor(Math.random() * 5) + 1;
        const enemy = new Enemy(enemyPos, enemyScale, enemyHp, 5 * difficulty);
        enemys.push(enemy);
        enemyX.splice(randX, 1);
    }
}

function createBullet() {
    // if (curBulletCount <= 0) {
    //     curBulletCount = 0;
    //     return;
    // }

    const bulletScale = new Vector2D(50, 50);
    const bulletPos = new Vector2D(player.pos.x + bulletScale.x, player.pos.y - bulletScale.y / 2);
    const bullet = new Bullet(bulletPos, bulletScale, 10, player.bulletDamage);
    bullets.push(bullet);
    // --curBulletCount;
}
//#endregion

//#region Function
function pickRandomItem() {
    let rand = Math.random();
    if (rand < 0.05) return 3;
    else if (rand < 0.1) return 2;
    else if (rand < 0.2) return 1;
    else return 0;
}
//#endregion

//#region Progress
function progressAll() {
    progressObject();
}

function progressObject() {
    // Progress Player
    if (player !== null)
        player.progress();

    // Progress Bullet
    for (let i = 0; i < bullets.length; ++i) {
        bullets[i].progress();
        if (bullets[i].isHit) {
            bullets.splice(i, 1);
        }
    }

    // Progress Boss
    for (let i = 0; i < bosses.length; ++i) {
        bosses[i].progress();
        if (bosses[i].isDead) {
            if (bosses[i].itemType !== itemType[0]) {
                const item = new Item(new Vector2D(200, bosses[i].pos.y <= 0 ? 0 : bosses[i].pos.y), new Vector2D(100, 100), bosses[i].speed, 1, bosses[i].itemType);
                items.push(item);
            }

            score += bosses[i].maxHp * difficulty;
            ++killedBossCount;
            bosses.splice(i, 1);
        } else if (!bosses[i].isExist) {
            bosses.splice(i, 1);
        }
    }

    // Progress Enemy
    for (let i = 0; i < enemys.length; ++i) {
        enemys[i].progress();
        if (enemys[i].isDead) {
            if (enemys[i].itemType !== itemType[0]) {
                const item = new Item(new Vector2D(enemys[i].pos.x, enemys[i].pos.y <= 0 ? 0 : enemys[i].pos.y), new Vector2D(100, 100), enemys[i].speed, 1, enemys[i].itemType);
                items.push(item);
            }

            score += enemys[i].maxHp * difficulty;
            ++killedEnemyCount;
            enemys.splice(i, 1);
        } else if (!enemys[i].isExist) {
            enemys.splice(i, 1);
        }
    }

    // Progress Item
    for (let i = 0; i < items.length; ++i) {
        items[i].progress();
        if (!items[i].isExist) {
            items.splice(i, 1);
        }
    }

    if (player.isDead) {
        isPause = true;
    }
}
//#endregion

//#region Collision
function collisionAll() {
    // Player, Enemy
    for (let i = 0; i < enemys.length; ++i) {
        if (isCollision(player, enemys[i])) {
            player.takeDamage(enemys[i].damage);
            enemys[i].takeDamage(player.damage);
        }
    }

    // Bullet, Enemy
    for (let i = 0; i < enemys.length; ++i) {
        for (let j = 0; j < bullets.length; ++j) {
            if (isCollision(enemys[i], bullets[j])
                && !bullets[j].isHit) {
                enemys[i].takeDamage(bullets[j].damage);
                bullets[j].isHit = true;
            }
        }
    }

    // Bullet, Boss
    for (let i = 0; i < bosses.length; ++i) {
        for (let j = 0; j < bullets.length; ++j) {
            if (isCollision(bosses[i], bullets[j])
                && !bullets[j].isHit) {
                bosses[i].takeDamage(bullets[j].damage);
                bullets[j].isHit = true;
            }
        }
    }

    // Player, Boss
    for (let i = 0; i < bosses.length; ++i) {
        if (isCollision(player, bosses[i])) {
            player.takeDamage(bosses[i].damage);
            bosses[i].takeDamage(player.damage);
        }
    }

    // Player, Item
    for (let i = 0; i < items.length; ++i) {
        if (isCollision(player, items[i])) {
            player.takeItem(items[i]);
            items[i].isExist = false;
        }
    }
}

function isCollision(left, right) {
    if (left.pos.x < right.pos.x + right.scale.x
        && left.pos.x + left.scale.x > right.pos.x
        && left.pos.y < right.pos.y + right.scale.y
        && left.pos.y + left.scale.y > right.pos.y) {
        return true;
    }
    return false;
}
//#endregion

//#region Draw
function drawAll() {
    drawBackground();
    drawObject();
    drawUI();

    // Debug
    // drawGizmo();
}

function drawBackground() {
    // Clear Canvas
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawObject() {
    // Draw Player
    if (player !== null)
        player.draw();

    // Draw Bullet
    for (let i = 0; i < bullets.length; ++i) {
        bullets[i].draw();
    }

    // Draw Boss
    for (let i = 0; i < bosses.length; ++i) {
        bosses[i].draw();
    }

    // Draw Enemy
    for (let i = 0; i < enemys.length; ++i) {
        enemys[i].draw();
    }

    // Draw Item
    for (let i = 0; i < items.length; ++i) {
        items[i].draw();
    }
}

function drawUI() {
    // Draw Score
    context.fillStyle = "#000000";
    context.font = "25px Dotum";
    context.textAlign = "start";
    context.fillText(score, 5, 25);

    // Draw Bombs  
    context.fillStyle = "#000000";
    context.font = "25px Dotum";
    context.textAlign = "end";
    context.fillText(player.bombs.length, 500, 800);

    // Draw Magazine
    // context.fillStyle = "#000000";
    // context.font = "25px Dotum";
    // context.textAlign = "end";
    // context.fillText(curBulletCount, 500, 800);
}

function drawGizmo() {
    // 몬스터 출력 라인
    for (let i = 100; i <= 500; i += 100) {
        context.moveTo(i, 0);
        context.lineTo(i, canvas.height);
        context.stroke();
    }

    // 중앙선
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, canvas.height);
    context.closePath();
    context.stroke();
}
//#endregion