// 미로를 가장 빨리 탈출하는 경주마에게 배팅하는 게임
// 1. 미로를 제작한다 (일단은 사이드 와인더)
// 2. 길찾기 알고리즘을 제작한다.
// 2-1. 각 경주마에게 적용되는 알고리즘은 랜덤으로 지정해야하기 때문에
// 2-2. Right Hand, AStar, BFS 등으로 나눈다.
// 3. 1착을 맞춘 플레이어는 건 돈의 2배를 받고
// 4. 나머지 플레이어는 건 돈을 잃는다.
// 5. 그래픽은 일단 네모로 ㅋㅋ

//#region Classes
class Queue {
    constructor() {
        this._arr = [];
    }

    enqueue(item) {
        this._arr.push(item);
    }

    dequeue() {
        return this._arr.shift();
    }

    size() {
        return this._arr.length;
    }
}

class Pos {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Maze {
    constructor(size, mazeType, tileSize, botCount) {
        this.size = size;
        this.mazeType = mazeType;
        this.destPos = new Pos(this.size - 2, this.size - 2);
        this.tileSize = tileSize;
        this.botCount = botCount;
        if (this.size % 2 == 0) this.size += 1;
        this.tiles = new Array(this.size).fill(TILE_TYPE.EMPTY).map(() => new Array(this.size));
        this.bots = [];
    }

    initialize() {
        this.bots.splice(0, this.bots.length);
        this.tiles.splice(0, this.tiles.length);
        this.tiles = new Array(this.size).fill(TILE_TYPE.EMPTY).map(() => new Array(this.size));
        switch (this.mazeType) {
            case MAZE_TYPE.BINARY_TREE: this.generateByBinaryTree(); break;
            case MAZE_TYPE.SIDE_WINDER: this.generateBySideWinder(); break;
        }
    }

    changeMaze(mazeType) {
        this.mazeType = mazeType;
        this.initialize();
    }

    reset() {
        this.initialize();
    }

    progress() {
        let stopBot = 1;
        for (let i = 0; i < this.botCount; ++i) {
            if (this.bots[i].isStop) {
                ++stopBot;
            }
        }

        if (stopBot == this.botCount) {
            stopBot = 1;
            this.reset();
        }
    }

    draw() {
        let botIdx = this.botCount;
        for (let y = 0; y < this.size; ++y) {
            for (let x = 0; x < this.size; ++x) {
                if (y === this.destPos.y && x === this.destPos.x) {
                    // 목적지 색상
                    context.fillStyle = "#E05EF0";
                } else {
                    if (this.tiles[y][x] === TILE_TYPE.WALL) {
                        // 벽 색상
                        context.fillStyle = "#000000";
                    } else if (this.tiles[y][x] === TILE_TYPE.BOT) {
                        // 봇 색상
                        context.fillStyle = BOT_COLOR[botIdx--];
                    } else {
                        // 길 색상
                        context.fillStyle = "#FFFFFF";
                    }
                }
                context.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        }
    }

    generateByBinaryTree() {
        // 1. 사전 작업(벽 만들기)
        for (let y = 0; y < this.size; ++y) {
            for (let x = 0; x < this.size; ++x) {
                if (y === 0 || y === this.size - 1 || x === 0 || x === this.size - 1) {
                    this.tiles[y][x] = TILE_TYPE.WALL;
                }

                if (y % 2 === 0 || x % 2 === 0) {
                    this.tiles[y][x] = TILE_TYPE.WALL;
                }
            }
        }

        // 2. 미로 알고리즘
        for (let y = 0; y < this.size; ++y) {
            for (let x = 0; x < this.size; ++x) {
                if (y % 2 === 0 || x % 2 === 0) {
                    continue;
                }

                if (y === this.size - 2 && x === this.size - 2) {
                    continue;
                }

                if (x === this.size - 2) {
                    this.tiles[y + 1][x] = TILE_TYPE.EMPTY;
                    continue;
                }

                if (y === this.size - 2) {
                    this.tiles[y][x + 1] = TILE_TYPE.EMPTY;
                    continue;
                }

                let random = Math.floor(Math.random() * 2);
                if (random === 0) {
                    this.tiles[y + 1][x] = TILE_TYPE.EMPTY;
                } else {
                    this.tiles[y][x + 1] = TILE_TYPE.EMPTY;
                }
            }
        }

        this.createBot();
    }

    generateBySideWinder() {
        // 1. 사전 작업(벽 만들기)
        for (let y = 0; y < this.size; ++y) {
            for (let x = 0; x < this.size; ++x) {
                if (y === 0 || y === this.size - 1 || x === 0 || x === this.size - 1) {
                    this.tiles[y][x] = TILE_TYPE.WALL;
                }

                if (y % 2 === 0 || x % 2 === 0) {
                    this.tiles[y][x] = TILE_TYPE.WALL;
                }
            }
        }

        // 2. 미로 알고리즘
        for (let y = 0; y < this.size; ++y) {
            let count = 1;
            for (let x = 0; x < this.size; ++x) {
                if (y % 2 === 0 || x % 2 === 0) {
                    continue;
                }

                if (y === this.size - 2 && x === this.size - 2) {
                    continue;
                }

                if (x === this.size - 2) {
                    this.tiles[y + 1][x] = TILE_TYPE.EMPTY;
                    continue;
                }

                if (y === this.size - 2) {
                    this.tiles[y][x + 1] = TILE_TYPE.EMPTY;
                    continue;
                }

                let random = Math.floor(Math.random() * 2);
                if (random === 0) {
                    this.tiles[y + 1][x - random * 2] = TILE_TYPE.EMPTY;
                    count = 1;
                } else {
                    this.tiles[y][x + 1] = TILE_TYPE.EMPTY;
                    ++count;
                }
            }
        }

        this.createBot();
    }

    createBot() {
        while (this.bots.length < this.botCount) {
            let randY = Math.floor(Math.random() * this.size / 2) + 1;
            let randX = Math.floor(Math.random() * this.size / 2) + 1;

            if (randY <= 0 || randY >= this.size - 2 || randX <= 0 || randY >= this.size - 2) {
                continue;
            }

            if (this.destPos.y === randY && this.destPos.x === randX) {
                continue;
            }

            if (this.tiles[randY][randX] === TILE_TYPE.WALL) {
                continue;
            }

            if (this.tiles[randY][randX] === TILE_TYPE.BOT) {
                continue;
            }

            this.bots.push(new Bot(new Pos(randY, randX), PATH_FINDER.RIGHT_HAND, this));
            this.tiles[randY][randX] = TILE_TYPE.BOT;
        }

        for (let i = 0; i < this.bots.length; ++i) {
            this.bots[i].initialize();
        }
    }

    clearBot() {
        this.bots.splice(0, length);
    }
}

class Bot {
    constructor(pos, pathFinder, maze) {
        this.pos = pos;
        this.pathFinder = pathFinder;
        this.maze = maze;
        this.dir = DIR.UP;
        this.isStop = false;
        this.path = [];
        this.accTick = 0;
    }

    initialize() {
        this.path.splice(0, this.path.length);
        switch (this.pathFinder) {
            case PATH_FINDER.RIGHT_HAND: this.pathFindByRightHand(); break;
            case PATH_FINDER.BFS: this.pathFindByBFS(); break;
            case PATH_FINDER.DIJKSTRA: this.pathFindByDijkstra(); break;
            case PATH_FINDER.ASTAR: this.pathFindByAStar(); break;
        }
    }

    progress() {
        this.accTick += deltaTick;
        if (this.accTick < 100) {
            return;
        }

        if (this.path.length > 0 && !this.isStop) {
            let prevPos = this.pos;
            this.maze.tiles[prevPos.y][prevPos.x] = TILE_TYPE.EMPTY;
            this.pos = this.path.pop();
            this.maze.tiles[this.pos.y][this.pos.x] = TILE_TYPE.BOT;
        }

        if (this.path.length <= 0) {
            this.isStop = true;
        }
    }

    pathFindByRightHand() {
        // 바라보고 있는 방향으로 가려면 필요한 값
        // up, left, down, right 순서
        const frontY = [-1, 0, 1, 0];
        const frontX = [0, -1, 0, 1];

        // 바라보고 있는 방향의 오른쪽으로 가려면 필요한 값
        const rightY = [0, -1, 0, 1];
        const rightX = [1, 0, -1, 0];

        // 현재 봇의 위치가 목적지 위치가 아님.
        while (this.pos.y !== this.maze.destPos.y || this.pos.x !== this.maze.destPos.x) {
            // 현재 바라보고 있는 방향의 오른쪽이 비어있다면...
            if (this.maze.tiles[this.pos.y + rightY[this.dir]][this.pos.x + rightX[this.dir]] !== TILE_TYPE.WALL) {
                // 오른쪽으로 90도 회전
                this.dir = (this.dir - 1 + 4) % 4;

                // 전진
                this.pos.y = this.pos.y + frontY[this.dir];
                this.pos.x = this.pos.x + frontX[this.dir];

                // 경로 저장
                this.path.push(this.pos);
            } else if (this.maze.tiles[this.pos.y + frontY[this.dir]][this.pos.x + frontX[this.dir]] !== TILE_TYPE.WALL) {
                // 전진
                this.pos.y = this.pos.y + frontY[this.dir];
                this.pos.x = this.pos.x + frontX[this.dir];

                // 경로 저장
                this.path.push(this.pos);
            }
            else {
                // 왼쪽으로 90도 회전
                this.dir = (this.dir + 1 + 4) % 4;
            }
        }
    }

    pathFindByBFS() {
        const deltaY = [-1, 0, 1, 0];
        const deltaX = [0, -1, 0, 1];

        let found = new Array(this.maze.size).fill(false).map(() => new Array(this.maze.size));
        let parent = new Array(this.maze.size).fill().map(() => new Array(this.maze.size));

        let q = new Queue();
        q.enqueue(this.pos);
        found[this.pos.y][this.pos.x] = true;
        parent[this.pos.y][this.pos.x] = this.pos;

        while (q.size() > 0) {
            let nowPos = q.dequeue();

            for (let i = 0; i < 4; ++i) {
                let nextY = nowPos.y + deltaY[i];
                let nextX = nowPos.x + deltaX[i];

                if (nextY < 0 || nextY >= this.maze.size || nextX < 0 || nextX >= this.maze.size) {
                    continue;
                }

                if (this.maze.tiles[nextY][nextX] === TILE_TYPE.WALL) {
                    continue;
                }

                if (found[nextY][nextX] === true) {
                    continue;
                }

                q.enqueue(new Pos(nextY, nextX));
                found[nextY][nextX] = true;
                parent[nextY][nextX] = nowPos;
            }
        }

        this.calcPathFromParent(parent);
    }

    pathFindByDijkstra() {

    }

    pathFindByAStar() {

    }

    calcPathFromParent(parent) {
        let pY = this.maze.destPos.y;
        let pX = this.maze.destPos.x;
        while (parent[pY][pX].y !== pY || parent[pY][pX].x !== pX) {
            this.path.push(new Pos(pY, pX));
            pY = parent[pY][pX].y;
            pX = parent[pY][pX].x;
        }
        this.path.push(new Pos(pY, pX));
    }
}
//#endregion

let canvas;
let context;
let isPause = false;

let maze;
let deltaTick;

const TILE_TYPE = {
    EMPTY: 0, WALL: 1, BOT: 2
}
const MAZE_TYPE = {
    BINARY_TREE: 0, SIDE_WINDER: 1,
};
const PATH_FINDER = {
    RIGHT_HAND: 0, BFS: 1,
    DIJKSTRA: 2, ASTAR: 3
};
const BOT_COLOR = {
    0: "#FF0000", 1: "#FFFF00",
    2: "#00FFFF", 3: "#0000FF"
};
const DIR = {
    UP: 0, LEFT: 1, DOWN: 2, RIGHT: 3
};

function start() {
    canvas = document.getElementById("mainCanvas");
    context = canvas.getContext("2d");

    maze = new Maze(45, MAZE_TYPE.SIDE_WINDER, 15, 1);
    maze.initialize();

    let lastTick = Date.now();
    let waitTick = 1000 / 60;
    let mainId = setTimeout(
        function update() {
            let curTick = Date.now();
            if (curTick - lastTick > waitTick) {
                deltaTick = curTick - lastTick;
                lastTick = curTick;

                if (!isPause) {
                    game();
                } else {

                }
            }


            mainId = setTimeout(update, 1);
        }
        , 1
    );
}

function title() {
    // 메인 타이틀 그리기
    // 로고, 버튼있음

}

function game() {
    progressAll();
    drawAll();
}

function progressAll() {
    maze.progress();

    if (maze !== null && maze.bots.length > 0) {
        for (let i = 0; i < maze.bots.length; ++i) {
            maze.bots[i].progress();
        }
    }
}

function drawAll() {
    drawBackground();

    maze.draw();
}

function drawBackground() {
    // Clear Canvas
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeRect(0, 0, canvas.width, canvas.height);
}