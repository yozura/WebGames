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
        this.isDead = false;
    }

    progress() {
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
            // 게임 종료
        }
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
    }

    progress() {
        this.pos.y += this.speed;
        if (this.pos.y >= 900) {
            this.isDead = true;
        }
    }

    draw() {
        if (this.isDead == true) {
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
        this.hp -= damage;
        this.damage = this.hp;
        if (this.hp <= 0) {
            this.hp = 0;
            this.isDead = true;
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
        // Triangle
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
//#endregion

//#region Variable
// Canvas, Context, IntervalId
let canvas;
let context;
let intervalID;

// Objects
let player;
let enemys = [];
let bullets = [];

// UI
let isPause = false;
let backImage;

// Others
let difficulty = 1.0;
let maxBulletCount = 14;
let curBulletCount = 0;
let score = 0;
//#endregion

// 참고 자료 https://heekim0719.tistory.com/58

//#region Entry Function
function start() {
    canvas = document.getElementById("mainCanvas");
    context = canvas.getContext("2d");

    // 백그라운드 이미지 로딩
    backImage = new Image();
    backImage = "images/background.png";

    // 플레이어 생성
    createPlayer();
    createEnemy();

    // Update
    intervalID = setInterval(
        () => {
            if (!isPause) {
                // 주기적으로 실행
                createEnemy();
                progressAll();
                collisionAll();
                drawAll();
            }
        }
        , 20
    );
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
}

function createEnemy() {
    if (enemys.length > 0) {
        return;
    }

    const enemyCount = Math.floor(Math.random() * 5) + 1;
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
    if (bullets.length >= maxBulletCount) {
        return;
    }

    const bulletScale = new Vector2D(50, 50);
    const bulletPos = new Vector2D(player.pos.x + bulletScale.x, player.pos.y - bulletScale.y / 2);
    const bullet = new Bullet(bulletPos, bulletScale, 10, 1);
    bullets.push(bullet);
}
//#endregion

//#region Progress
function progressAll() {
    progressGame();
    progressObject();
}

function progressObject() {
    // Progress Player
    player.progress();

    // Progress Bullet
    for (let i = 0; i < bullets.length; ++i) {
        bullets[i].progress();

        if (bullets[i].isHit) {
            bullets.splice(i, 1);
        }
    }

    // Progress Enemy
    for (let i = 0; i < enemys.length; ++i) {
        enemys[i].progress();

        if (enemys[i].isDead) {
            enemys.splice(i, 1);
        }
    }

    if (player.isDead) {
        isPause = true;
    }
}

function progressGame() {
    // 난이도 조정
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
                score += enemys[i].maxHp * difficulty;
            }
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
    player.draw();

    // Draw Bullet
    for (let i = 0; i < bullets.length; ++i) {
        bullets[i].draw();
    }

    // Draw Enemy
    for (let i = 0; i < enemys.length; ++i) {
        enemys[i].draw();
    }
}

function drawUI() {
    // Draw Score
    context.fillStyle = "#000000";
    context.font = "25px Dotum";
    context.textAlign = "start";
    context.fillText(score, 5, 25);

    // Draw Magazine
    context.fillStyle = "#000000";
    context.font = "25px Dotum";
    context.textAlign = "end";
    context.fillText((maxBulletCount - bullets.length), 500, 800);
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