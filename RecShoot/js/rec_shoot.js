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

class ImageManager {
    constructor() {
        this.images = {};
    }

    cacheImage(key, value) {
        if (key in this.images) {
            return;
        }

        this.images[key] = value;
    }

    getImage(key) {
        if (key in this.images) {
            return this.images[key];
        }

        return;
    }
}

class StaticObjects extends Transform {
    constructor(pos, scale, color) {
        super(pos, scale);
        this.color = color;
    }

    progress() {

    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.pos.x, this.pos.y, this.scale.x, this.scale.y);
    }
}

class Player extends Transform {
    constructor(pos, scale, hp, weaponType) {
        super(pos, scale);
        this.hp = hp;
        this.damage = hp;
        this.speed = OBJECT_SPEED.PLAYER;
        this.weaponType = weaponType;
        this.weaponDamage = 1;
        this.bombs = [1, 1, 1];
        this.isDead = false;
    }

    progress() {
    }

    draw() {
        if (this.weaponType === WEAPON_TYPE.FIREFOX) {
            const bodyImg = ImgMgr.getImage(IMAGE_TYPE.PLAYER_FIREFOX_TYPE);
            bodyImg.src = IMAGE_PATH.PLAYER_FIREFOX_TYPE;
            context.drawImage(bodyImg, this.pos.x, this.pos.y, this.scale.x, this.scale.y);

            // context.fillStyle = "#333333";
            // context.fillRect(this.pos.x, this.pos.y, this.scale.x, this.scale.y / 3);
        } else if (this.weaponType === WEAPON_TYPE.FLUTTER) {
            const bodyImg = ImgMgr.getImage(IMAGE_TYPE.PLAYER_FLUTTER_TYPE);
            bodyImg.src = IMAGE_PATH.PLAYER_FLUTTER_TYPE;
            context.drawImage(bodyImg, this.pos.x, this.pos.y, this.scale.x, this.scale.y);

            // context.fillStyle = "#D03D3D";
            // context.fillRect(this.pos.x, this.pos.y + 10, this.scale.x, this.scale.y - 85);
            // context.beginPath();
            // context.moveTo(this.pos.x - 10, this.pos.y);
            // context.lineTo(this.pos.x - 15, this.pos.y + 5);
            // context.lineTo(this.pos.x - 5, this.pos.y + 10);
            // context.lineTo(this.pos.x - 15, this.pos.y + 20);
            // context.lineTo(this.pos.x - 5, this.pos.y + 30);
            // context.lineTo(this.pos.x, this.pos.y + 20);
            // context.lineTo(this.pos.x, this.pos.y + 10);
            // context.lineTo(this.pos.x - 10, this.pos.y);
            // context.fill();
        } else if (this.weaponType === WEAPON_TYPE.VUE) {
            const bodyImg = ImgMgr.getImage(IMAGE_TYPE.PLAYER_VUE_TYPE);
            bodyImg.src = IMAGE_PATH.PLAYER_VUE_TYPE;
            context.drawImage(bodyImg, this.pos.x, this.pos.y, this.scale.x, this.scale.y);

            // context.fillStyle = "#B5C2CB"
            // context.beginPath();
            // context.moveTo(this.pos.x + this.scale.x / 2, this.pos.y);
            // context.lineTo(this.pos.x, this.pos.y);
            // context.lineTo(this.pos.x + this.scale.x, this.pos.y + this.scale.y / 2);
            // context.fill();
        }

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
        } else {
            this.damage = this.hp;
        }
    }

    takeItem(item) {
        switch (item.type) {
            // 스탯 타입
            case ITEM_TYPE.NONE:
                break;
            case ITEM_TYPE.HEAL:
                this.hp += item.value;
                ++itemHealCount;
                score += SCORE_TABLE.HEAL;
                break;
            case ITEM_TYPE.POWER:
                this.weaponDamage += item.value;
                ++itemDamageCount;
                score += SCORE_TABLE.POWER;
                break;
            case ITEM_TYPE.BOMB:
                if (this.bombs.length <= 5)
                    this.bombs.push(item.value);
                ++itemBombCount;
                score += SCORE_TABLE.BOMB;
                break;
            // 무기 타입
            case ITEM_TYPE.FIREFOX:
                if (this.weaponType === WEAPON_TYPE.FIREFOX)
                    score += SCORE_TABLE.WEAPON;
                this.weaponType = WEAPON_TYPE.FIREFOX;
                break;
            case ITEM_TYPE.FLUTTER:
                if (this.weaponType === WEAPON_TYPE.FLUTTER)
                    score += SCORE_TABLE.WEAPON;
                this.weaponType = WEAPON_TYPE.FLUTTER;
                break;
            case ITEM_TYPE.VUE:
                if (this.weaponType === WEAPON_TYPE.VUE)
                    score += SCORE_TABLE.WEAPON;
                this.weaponType = WEAPON_TYPE.VUE;
                break;
        }
    }
}

class Weapon extends Transform {
    constructor(pos, scale, speed, damage, type) {
        super(pos, scale);
        this.damage = damage;
        this.isHit = false;
        this.type = type;
        this.speed = speed;
        this.type = type;
    }

    progress() {
        this.pos.y -= this.speed;
        if (this.pos.y <= 0) {
            this.isHit = true;
        }
    }

    draw() {
        if (this.type === WEAPON_TYPE.FIREFOX) {
            const bodyImg = ImgMgr.getImage(IMAGE_TYPE.WEAPON_FIREFOX_TYPE);
            bodyImg.src = IMAGE_PATH.WEAPON_FIREFOX_TYPE;
            context.drawImage(bodyImg, this.pos.x, this.pos.y, this.scale.x, this.scale.y);

            // context.fillStyle = "#333333";
            // context.beginPath();
            // context.arc(this.pos.x, this.pos.y, 10, 0, 360);
            // context.fill();
        } else if (this.type === WEAPON_TYPE.FLUTTER) {
            const bodyImg = ImgMgr.getImage(IMAGE_TYPE.WEAPON_FLUTTER_TYPE);
            bodyImg.src = IMAGE_PATH.WEAPON_FLUTTER_TYPE;
            context.drawImage(bodyImg, this.pos.x, this.pos.y, this.scale.x, this.scale.y);

            // context.fillStyle = "#D03D3D"
            // context.beginPath();
            // context.moveTo(this.pos.x + 5, this.pos.y);
            // context.lineTo(this.pos.x - 5, this.pos.y + 15);
            // context.lineTo(this.pos.x - 5, this.pos.y + 40);
            // context.lineTo(this.pos.x - 15, this.pos.y + 40);
            // context.lineTo(this.pos.x - 15, this.pos.y + 50);
            // context.lineTo(this.pos.x - 5, this.pos.y + 50);
            // context.lineTo(this.pos.x - 5, this.pos.y + 60);
            // context.lineTo(this.pos.x + 5, this.pos.y + 60);
            // context.lineTo(this.pos.x + 5, this.pos.y + 50);
            // context.lineTo(this.pos.x + 15, this.pos.y + 50);
            // context.lineTo(this.pos.x + 15, this.pos.y + 40);
            // context.lineTo(this.pos.x + 5, this.pos.y + 40);
            // context.fill();
        } else if (this.type === WEAPON_TYPE.VUE) {
            const bodyImg = ImgMgr.getImage(IMAGE_TYPE.WEAPON_VUE_TYPE);
            bodyImg.src = IMAGE_PATH.WEAPON_VUE_TYPE;
            context.drawImage(bodyImg, this.pos.x, this.pos.y, this.scale.x, this.scale.y);


            // context.fillStyle = "#B5C2CB"
            // context.beginPath();
            // context.moveTo(this.pos.x - 1, this.pos.y - 20);
            // context.lineTo(this.pos.x + 1, this.pos.y - 20);
            // context.lineTo(this.pos.x + 3, this.pos.y + 30);
            // context.lineTo(this.pos.x - 3, this.pos.y + 30);
            // context.fill();
        }
    }
}

class Enemy extends Transform {
    constructor(pos, scale, hp, speed, knockForce) {
        super(pos, scale);
        this.score = hp;
        this.hp = hp;
        this.damage = hp;
        this.speed = speed;
        this.isDead = false;
        this.isExist = true;
        this.knockForce = knockForce;
        this.bodyImg = ImgMgr.getImage(IMAGE_TYPE.ENEMY);

        this.itemType = pickRandomItem();
    }

    progress() {
        this.pos.y += this.speed;
        if (this.pos.y >= 800) {
            this.isExist = false;
        }
    }

    draw() {
        this.bodyImg.src = IMAGE_PATH.ENEMY;
        context.drawImage(this.bodyImg, this.pos.x, this.pos.y, this.scale.x, this.scale.y);

        context.fillStyle = "#000000";
        context.font = "25px Dotum";
        context.textAlign = "center";
        context.fillText(this.hp, this.pos.x + this.scale.x / 2, this.pos.y + this.scale.y / 2 + 8);
    }

    takeDamage(damage, isKnockBack) {
        this.hp -= damage;
        if (isKnockBack) {
            this.pos.y -= this.knockForce;
            if (this.hp <= 0) {
                this.hp = 0;
                this.isDead = true;
            } else {
                this.damage = this.hp;
            }
        } else {
            if (this.hp <= 0) {
                this.hp = 0;
                this.isExist = false;
            } else {
                this.damage = this.hp;
            }
            return;
        }
    }


}

class Boss extends Enemy {
    constructor(pos, scale, hp, speed, knockForce) {
        super(pos, scale, hp, speed, knockForce);

        this.bodyImg = ImgMgr.getImage(IMAGE_TYPE.BOSS);
    }

    draw() {
        this.bodyImg.src = IMAGE_PATH.BOSS;
        context.drawImage(this.bodyImg, this.pos.x, this.pos.y, this.scale.x, this.scale.y);

        context.fillStyle = "#000000";
        context.font = "25px Dotum";
        context.textAlign = "center";
        context.fillText(this.hp, this.pos.x + this.scale.x / 2, this.pos.y + this.scale.y / 2 + 8);
    }
}

class Item extends Transform {
    constructor(pos, scale, speed, type) {
        super(pos, scale);
        this.speed = speed;
        this.value = 1;
        this.type = type;
        this.isExist = true;
        this.limitTime = 10;

        if (this.type === ITEM_TYPE.HEAL) {
            this.value = Math.floor((Math.random() * 5) + 1);
        }

        setTimeout(
            () => {
                this.isExist = false;
            }
            , this.limitTime * 1000
        );
    }

    progress() {
        this.pos.y += this.speed;
        if (this.pos.y > 700 - this.scale.y || this.pos.y < 0)
            this.speed *= -1;
    }

    draw() {
        let itemName = "";
        switch (this.type) {
            // 스탯 타입
            case ITEM_TYPE.HEAL:
                {
                    const bodyImg = ImgMgr.getImage(IMAGE_TYPE.ITEM_HEAL);
                    bodyImg.src = IMAGE_PATH.ITEM_HEAL;
                    context.drawImage(bodyImg, this.pos.x, this.pos.y, this.scale.x, this.scale.y);
                    itemName = "HEAL";
                }
                break;
            case ITEM_TYPE.POWER:
                {
                    const bodyImg = ImgMgr.getImage(IMAGE_TYPE.ITEM_POWER_UP);
                    bodyImg.src = IMAGE_PATH.ITEM_POWER_UP;
                    context.drawImage(bodyImg, this.pos.x, this.pos.y, this.scale.x, this.scale.y);
                    itemName = "POWER";
                }
                break;
            case ITEM_TYPE.BOMB:
                {
                    const bodyImg = ImgMgr.getImage(IMAGE_TYPE.ITEM_BOMB);
                    bodyImg.src = IMAGE_PATH.ITEM_BOMB;
                    context.drawImage(bodyImg, this.pos.x, this.pos.y, this.scale.x, this.scale.y);
                    itemName = "BOMB";
                }
                break;
            // 무기 타입
            case ITEM_TYPE.FIREFOX:
                {
                    const bodyImg = ImgMgr.getImage(IMAGE_TYPE.WEAPON_FIREFOX_TYPE);
                    bodyImg.src = IMAGE_PATH.WEAPON_FIREFOX_TYPE;
                    context.drawImage(bodyImg, this.pos.x, this.pos.y, this.scale.x, this.scale.y);
                    itemName = "FIREFOX";
                }
                break;
            case ITEM_TYPE.FLUTTER:
                {
                    const bodyImg = ImgMgr.getImage(IMAGE_TYPE.WEAPON_FLUTTER_TYPE);
                    bodyImg.src = IMAGE_PATH.WEAPON_FLUTTER_TYPE;
                    context.drawImage(bodyImg, this.pos.x, this.pos.y, this.scale.x, this.scale.y);
                    itemName = "FLUTTER";
                }
                break;
            case ITEM_TYPE.VUE:
                {
                    const bodyImg = ImgMgr.getImage(IMAGE_TYPE.WEAPON_VUE_TYPE);
                    bodyImg.src = IMAGE_PATH.WEAPON_VUE_TYPE;
                    context.drawImage(bodyImg, this.pos.x, this.pos.y, this.scale.x, this.scale.y);
                    itemName = "VUE";
                }
                break;
        }
    }
}

class Timer {
    constructor() {
        this.hour = 0;
        this.min = 0;
        this.sec = 0;
        this.accSec = 0;
    }

    update() {
        ++this.sec;
        if (this.sec % 60 === 0) {
            ++this.min;
            difficulty *= 3;

            this.sec = 0;
            if (this.min % 60 === 0) {
                ++this.hour;
                this.min = 0;
            }
        }
    }

    getSeconds() {
        return (this.hour * 360) + (this.min * 60) + this.sec;
    }

    toString() {
        let str = "";
        if (this.hour < 10) str = "0" + this.hour + ":";
        else str += this.hour + ":";

        if (this.min < 10) str += "0" + this.min + ":";
        else str += this.min + ":";

        if (this.sec < 10) str += "0" + this.sec;
        else str += this.sec;

        return str;
    }
}
//#endregion

//#region Variable
// Canvas, Context, IntervalId
let canvas;
let context;
let intervalID;

// Manager
const ImgMgr = new ImageManager();

// Objects
let player;
const statics = [];
const bosses = [];
const enemys = [];
const weapons = [];
const items = [];

// UI
let timer;
let isPause = false;
let backImage;

// Others
let dt;
let difficulty = 1;
let isBomb = false;
let isReload = false;
let score = 0;

// Constant, Enum
const ITEM_PROB = {
    // NONE 확률로 먼저 거른다음
    // STAT, FIREFOX 확률로 다시 거르고
    // 그 안에서는 모두 동일한 확률을 가진다.
    NONE: 0.85, STAT: 0.7, WEAPON: 0.3,
};
const ITEM_STAT = {
    HEAL: 0, POWER: 1, BOMB: 2, NONE: 3,
}
const ITEM_WEAPON = {
    FIREFOX: 0, FLUTTER: 1, VUE: 2, NONE: 3,
}
const SCORE_TABLE = {
    HEAL: 30, POWER: 50, BOMB: 60,
    WEAPON: 50,
}
const ITEM_TYPE = {
    // Stat Item
    NONE: 0, HEAL: 1, POWER: 2, BOMB: 3,
    // Weapon Item
    FIREFOX: 10, FLUTTER: 11, VUE: 12,
};
const WEAPON_TYPE = {
    FIREFOX: 0, FLUTTER: 1, VUE: 2, NONE: 3,
};
const OBJECT_SPEED = {
    PLAYER: 100,
    FIREFOX: 8, FLUTTER: 12, VUE: 10,
    ENEMY: 6, BOSS: 5,
    ITEM: 90,
};
const IMAGE_TYPE = {
    PLAYER_FIREFOX_TYPE: "PLT", PLAYER_FLUTTER_TYPE: "PBT", PLAYER_VUE_TYPE: "PNT",
    ENEMY: "ENEMY", BOSS: "BOSS",
    WEAPON_FIREFOX_TYPE: "WB", WEAPON_FLUTTER_TYPE: "WB", WEAPON_VUE_TYPE: "WE",
    ITEM_HEAL: "HEAL", ITEM_POWER_UP: "POWER", ITEM_BOMB: "BOMB",
};
const IMAGE_PATH = {
    PLAYER_FIREFOX_TYPE: "./Images/gitlab.png", PLAYER_FLUTTER_TYPE: "./Images/code.png", PLAYER_VUE_TYPE: "./Images/swift.png",
    ENEMY: "./Images/github.png", BOSS: "./Images/android.png",
    WEAPON_FIREFOX_TYPE: "./Images/firefox.png", WEAPON_FLUTTER_TYPE: "./Images/flutter.png", WEAPON_VUE_TYPE: "./Images/vuejs.png",
    ITEM_HEAL: "./Images/javascript.png", ITEM_POWER_UP: "./Images/bootstrap.png", ITEM_BOMB: "./Images/typescript.png",
};
const DOC_ELEMS = {
    FS: document.getElementById("fs"),
    FPS: document.getElementById("fps"),
    KEC: document.getElementById("kec"),
    KBC: document.getElementById("kbc"),
    IHC: document.getElementById("ihc"),
    IDC: document.getElementById("idc"),
    IBC: document.getElementById("ibc"),
};
// Frame
let prev, now, fps;

// Achievement
let finalScore = 0;
let killedEnemyCount = 0;
let killedBossCount = 0;
let itemHealCount = 0;
let itemDamageCount = 0;
let itemBombCount = 0;
//#endregion

//#region Entry Function
function start() {
    canvas = document.getElementById("mainCanvas");
    context = canvas.getContext("2d");

    // 이미지 캐싱
    LoadImage();

    // 플레이어 생성
    createPlayer();

    // Main Update
    prev = Date.now();
    let mainId = setTimeout(
        function update() {
            now = Date.now();
            fps = Math.round(1000 / (now - prev));
            dt = (now - prev);
            prev = now;

            if (!isPause) {
                // 주기적으로 실행
                GameUpdate();
            } else {
                // 리트라이, 랭킹 등. 작업 처리
                finalScore = score + timer.getSeconds();
            }
            mainId = setTimeout(update, 1000 / 60);
        }
        , 1000 / 60
    );

    // Achievement Update
    let achieveId = setTimeout(
        function update() {
            AchievementUpdate();
            achieveId = setTimeout(update, 200);
        }
    );

    // Time Update
    timer = new Timer();
    let timeId = setTimeout(
        function update() {
            if (!isPause) {
                timer.update();
            } else {

            }
            timeId = setTimeout(update, 1000);
        }
    )
}
//#endregion

//#region Update
function GameUpdate() {
    createEnemy();
    progressAll();
    drawAll();
    collisionAll();
}

function AchievementUpdate() {
    DOC_ELEMS.FPS.innerHTML = "FPS " + fps;
    DOC_ELEMS.FS.innerHTML = "최종 점수 " + finalScore;
    DOC_ELEMS.KEC.innerHTML = "죽인 적 수 " + killedEnemyCount;
    DOC_ELEMS.KBC.innerHTML = "죽인 보스 수 " + killedBossCount;
    DOC_ELEMS.IHC.innerHTML = "획득한 힐 수 " + itemHealCount;
    DOC_ELEMS.IDC.innerHTML = "획득한 파워업 수 " + itemDamageCount;
    DOC_ELEMS.IBC.innerHTML = "획득한 폭탄 수 " + itemBombCount;
}
//#endregion

//#region Function
function LoadImage() {
    // Player Image
    // 1. Firefox Type
    const playerFirefoxType = new Image();
    ImgMgr.cacheImage(IMAGE_TYPE.PLAYER_FIREFOX_TYPE, playerFirefoxType);

    // 2. FLUTTER Type
    const playerFlutterType = new Image();
    ImgMgr.cacheImage(IMAGE_TYPE.PLAYER_FLUTTER_TYPE, playerFlutterType);

    // 3. VUE Type
    const playerVueType = new Image();
    ImgMgr.cacheImage(IMAGE_TYPE.PLAYER_VUE_TYPE, playerVueType);

    // Enemy Image
    const EnemyType = new Image();
    ImgMgr.cacheImage(IMAGE_TYPE.ENEMY, EnemyType);

    // Boss Image
    const BossType = new Image();
    ImgMgr.cacheImage(IMAGE_TYPE.BOSS, BossType);

    // Weapon Image
    // 1. Firefox
    const WeaponFirefoxType = new Image();
    ImgMgr.cacheImage(IMAGE_TYPE.WEAPON_FIREFOX_TYPE, WeaponFirefoxType);

    const WeaponFlutterType = new Image();
    ImgMgr.cacheImage(IMAGE_TYPE.WEAPON_FLUTTER_TYPE, WeaponFlutterType);

    const WeaponVueType = new Image();
    ImgMgr.cacheImage(IMAGE_TYPE.WEAPON_VUE_TYPE, WeaponVueType);

    // Item Image
    // 1. HEAL
    const ItemHeal = new Image();
    ImgMgr.cacheImage(IMAGE_TYPE.ITEM_HEAL, ItemHeal);

    // 2. POWER UP
    const ItemPowerUp = new Image();
    ImgMgr.cacheImage(IMAGE_TYPE.ITEM_POWER_UP, ItemPowerUp);

    // 3. BOMB
    const ItemBomb = new Image();
    ImgMgr.cacheImage(IMAGE_TYPE.ITEM_BOMB, ItemBomb);
}

function pickRandomItem() {
    let resultItemType = ITEM_TYPE.NONE;
    let rand = Math.random();
    if (rand < ITEM_PROB.NONE) return ITEM_TYPE.NONE;
    else {
        rand = Math.random();
        if (rand < ITEM_PROB.STAT) {
            rand = Math.floor(Math.random() * (ITEM_STAT.NONE + 1));
            switch (rand) {
                case ITEM_STAT.HEAL: resultItemType = ITEM_TYPE.HEAL; break;
                case ITEM_STAT.POWER: resultItemType = ITEM_TYPE.POWER; break;
                case ITEM_STAT.BOMB: resultItemType = ITEM_TYPE.BOMB; break;
                case ITEM_STAT.NONE: resultItemType = ITEM_TYPE.NONE; break;
            }
        } else {
            rand = Math.floor(Math.random() * (ITEM_WEAPON.NONE + 1));
            switch (rand) {
                case ITEM_WEAPON.FIREFOX: resultItemType = ITEM_TYPE.FIREFOX; break;
                case ITEM_WEAPON.FLUTTER: resultItemType = ITEM_TYPE.FLUTTER; break;
                case ITEM_WEAPON.VUE: resultItemType = ITEM_TYPE.VUE; break;
                case ITEM_WEAPON.NONE: resultItemType = ITEM_TYPE.NONE; break;
            }
        }
    }

    return resultItemType;
}
//#endregion

//#region Objects
function createPlayer() {
    const playerScale = new Vector2D(100, 100);
    const playerPos = new Vector2D(canvas.width / 2 - playerScale.x / 2, canvas.height - playerScale.y);
    const rand = Math.floor(Math.random() * ITEM_WEAPON.NONE + 1);
    let playerWeapon;
    switch (rand) {
        case 0: playerWeapon = WEAPON_TYPE.FIREFOX; break;
        case 1: playerWeapon = WEAPON_TYPE.FLUTTER; break;
        case 2: playerWeapon = WEAPON_TYPE.VUE; break;
        default: playerWeapon = WEAPON_TYPE.FIREFOX; break;
    }
    player = new Player(playerPos, playerScale, 10, playerWeapon);

    // Control
    document.addEventListener("keydown", (e) => {
        if ((e.key === "Right" || e.key === "ArrowRight")
            && player.pos.x + player.speed < canvas.width) {
            player.pos.x += player.speed;
        }

        if ((e.key === "Left" || e.key === "ArrowLeft")
            && player.pos.x - player.speed >= 0) {
            player.pos.x -= player.speed;
        }

        // 단타로 미사일 발사
        if (e.key === "x" || e.key === "X") {
            fireWeapon();
        }

        // 폭탄 발사
        if (e.key === "z" || e.key === "Z") {
            if (isBomb)
                return;

            if (player.bombs.length <= 0)
                return;

            explodeBomb();
        }
    });
}

function fireWeapon() {
    // 기본 약공격
    const weaponScale = new Vector2D(50, 50);
    const weaponPos = new Vector2D(player.pos.x + weaponScale.x / 2, player.pos.y - weaponScale.y / 2);
    let weaponSpeed;
    switch (player.weaponType) {
        case WEAPON_TYPE.FIREFOX: weaponSpeed = OBJECT_SPEED.FIREFOX; break;
        case WEAPON_TYPE.FLUTTER: weaponSpeed = OBJECT_SPEED.FLUTTER; break;
        case WEAPON_TYPE.VUE: weaponSpeed = OBJECT_SPEED.VUE; break;
    }
    weapons.push(new Weapon(weaponPos, weaponScale, weaponSpeed, player.weaponDamage, player.weaponType));
}

async function explodeBomb() {
    isBomb = true;
    player.bombs.pop();
    const bombWeaponType = player.weaponType;
    const bombPlayerPos = player.pos;

    // 무기 타입마다 다른 설정
    if (bombWeaponType === WEAPON_TYPE.FIREFOX) {
        // 모든 라인에서 총알이 2초간 발사
        const FIREFOX_BOMB = setInterval(() => {
            for (let i = 0; i < 5; ++i) {
                const weaponScale = new Vector2D(50, 50);
                const weaponPos = new Vector2D((i * 100) + weaponScale.x / 2, canvas.height - weaponScale.y);
                weapons.push(new Weapon(weaponPos, weaponScale, OBJECT_SPEED.VUE, player.weaponDamage * 100, player.weaponType));
            }
        }, 1);
        setTimeout(() => { clearInterval(FIREFOX_BOMB); isBomb = false; }, 1);
    } else if (bombWeaponType === WEAPON_TYPE.FLUTTER) {
        // 7초간 빠른 속도로 칼 자동 발사.
        const FLUTTER_BOMB = setInterval(() => {
            const weaponScale = new Vector2D(50, 50);
            const weaponPos = new Vector2D(player.pos.x + weaponScale.x / 2, player.pos.y - weaponScale.y / 2);
            weapons.push(new Weapon(weaponPos, weaponScale, OBJECT_SPEED.FLUTTER, player.weaponDamage, player.weaponType));
        }, 100);
        setTimeout(() => { clearInterval(FLUTTER_BOMB); isBomb = false; }, 7000);
    } else if (bombWeaponType === WEAPON_TYPE.VUE) {
        // 10초간 스킬을 사용한 라인에 터렛을 박아놓는다.
        const turretScale = new Vector2D(50, 50);
        const turretPos = new Vector2D(bombPlayerPos.x + turretScale.x / 2, bombPlayerPos.y + turretScale.y / 2);
        statics.push(new StaticObjects(turretPos, turretScale, "#3E424B"));
        const VUE_BOMB = setInterval(() => {
            const weaponScale = new Vector2D(50, 50);
            const weaponPos = new Vector2D(turretPos.x, turretPos.y - weaponScale.y / 2);
            weapons.push(new Weapon(weaponPos, weaponScale, OBJECT_SPEED.VUE, player.weaponDamage, bombWeaponType));
        }, 150);
        setTimeout(() => {
            clearInterval(VUE_BOMB);
            isBomb = false;
            for (let i = 0; i < statics.length; ++i) {
                if (statics[i].color === "#3E424B") {
                    statics.splice(i, 1);
                }
            }
        }, 10000);
    }
}

function createEnemy() {
    if (enemys.length > 0)
        return;

    if (bosses.length > 0)
        return;

    const enemyCount = Math.floor(Math.random() * 5) + 1;
    if (enemyCount === 1) {
        const bossScale = new Vector2D(500, 500);
        const bossPos = new Vector2D(0, -500);
        const bossHp = Math.floor(Math.random() * 30 * difficulty) + difficulty;
        bosses.push(new Boss(bossPos, bossScale, bossHp, OBJECT_SPEED.BOSS, 15.0));
        return;
    }

    const enemyX = [0, 100, 200, 300, 400];
    for (let i = 0; i < enemyCount; ++i) {
        const randX = Math.floor(Math.random() * enemyX.length);
        const enemyScale = new Vector2D(100, 100);
        const enemyPos = new Vector2D(enemyX[randX], -100);
        const enemyHp = Math.floor(Math.random() * 5 * difficulty) + difficulty;
        enemys.push(new Enemy(enemyPos, enemyScale, enemyHp, OBJECT_SPEED.ENEMY, 10.0));
        enemyX.splice(randX, 1);
    }
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

    // Progress Static Objects
    for (let i = 0; i < statics.length; ++i) {
        statics[i].progress();
    }

    // Progress Firefox
    for (let i = 0; i < weapons.length;) {
        weapons[i].progress();
        if (weapons[i].isHit) {
            weapons.splice(i, 1);
        } else {
            ++i;
        }
    }

    // Progress Boss
    for (let i = 0; i < bosses.length;) {
        bosses[i].progress();
        if (bosses[i].isDead) {
            if (bosses[i].itemType !== ITEM_TYPE.NONE) {
                const item = new Item(new Vector2D(200 + 25, bosses[i].pos.y <= 0 ? 0 : bosses[i].pos.y), new Vector2D(50, 50), bosses[i].speed, bosses[i].itemType);
                items.push(item);
            }
            score += bosses[i].score;
            ++killedBossCount;
            bosses.splice(i, 1);
        } else if (!bosses[i].isExist) {
            bosses.splice(i, 1);
        } else {
            ++i;
        }
    }

    // Progress Enemy
    for (let i = 0; i < enemys.length;) {
        enemys[i].progress();
        if (enemys[i].isDead) {
            if (enemys[i].itemType !== ITEM_TYPE.NONE) {
                const item = new Item(new Vector2D(enemys[i].pos.x + 50 / 2, enemys[i].pos.y <= 0 ? 0 : enemys[i].pos.y), new Vector2D(50, 50), enemys[i].speed, enemys[i].itemType);
                items.push(item);
            }
            score += enemys[i].score;
            ++killedEnemyCount;
            enemys.splice(i, 1);
        } else if (!enemys[i].isExist) {
            enemys.splice(i, 1);
        } else {
            ++i;
        }
    }

    // Progress Item
    for (let i = 0; i < items.length;) {
        items[i].progress();
        if (!items[i].isExist) {
            items.splice(i, 1);
        } else {
            ++i;
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
            enemys[i].takeDamage(player.damage, false);
            player.takeDamage(enemys[i].damage);
        }
    }

    // Firefox, Enemy
    for (let i = 0; i < enemys.length; ++i) {
        for (let j = 0; j < weapons.length; ++j) {
            if (isCollision(enemys[i], weapons[j])
                && !weapons[j].isHit) {
                enemys[i].takeDamage(weapons[j].damage, true);
                weapons[j].isHit = true;
            }
        }
    }

    // Firefox, Boss
    for (let i = 0; i < bosses.length; ++i) {
        for (let j = 0; j < weapons.length; ++j) {
            if (isCollision(bosses[i], weapons[j])
                && !weapons[j].isHit) {
                bosses[i].takeDamage(weapons[j].damage, true);
                weapons[j].isHit = true;
            }
        }
    }

    // Player, Boss
    for (let i = 0; i < bosses.length; ++i) {
        if (isCollision(player, bosses[i])) {
            bosses[i].takeDamage(player.damage, false);
            player.takeDamage(bosses[i].damage);
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

    // Draw Static Objects
    for (let i = 0; i < statics.length; ++i) {
        statics[i].draw();
    }
    // Draw Firefox
    for (let i = 0; i < weapons.length; ++i) {
        weapons[i].draw();
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
    // Draw Time
    context.fillStyle = "#000000";
    context.font = "25px Dotum";
    context.textAlign = "center";
    context.fillText(timer, 250, 25);

    // Draw Score
    context.fillStyle = "#000000";
    context.font = "25px Dotum";
    context.textAlign = "start";
    context.fillText(score, 5, 25);

    // Draw Bombs  
    context.fillStyle = "#000000";
    context.font = "25px Dotum";
    context.textAlign = "end";
    context.fillText(player.bombs.length, canvas.width, canvas.height);

    // Draw Magazine
    // context.fillStyle = "#000000";
    // context.font = "25px Dotum";
    // context.textAlign = "end";
    // context.fillText(curFirefoxCount, 500, 800);
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