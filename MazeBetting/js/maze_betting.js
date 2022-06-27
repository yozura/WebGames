// 미로를 가장 빨리 탈출하는 경주마에게 배팅하는 게임
// 1. 미로를 제작한다 (일단은 사이드 와인더)
// 2. 길찾기 알고리즘을 제작한다.
// 2-1. 각 경주마에게 적용되는 알고리즘은 랜덤으로 지정해야하기 때문에
// 2-2. Right Hand, AStar, BFS 등으로 나눈다.
// 3. 1착을 맞춘 플레이어는 건 돈의 2배를 받고
// 4. 나머지 플레이어는 건 돈을 잃는다.
// 5. 그래픽은 일단 네모로 ㅋㅋ

//#region 

function start() {
    canvas = document.getElementById("mainCanvas");
    context = canvas.getContext("2d");

    // Main Update
    const mainId = setTimeout(
        function update() {
            if (!isPause) {

            } else {

            }

            mainId = setTimeout(update, 1);
        }
        , 1
    );
}