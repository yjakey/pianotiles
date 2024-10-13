let score = 0;
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-button');
let gameSpeed = 4; // 게임 속도 초기화
const maxGameSpeed = 20; // 최대 게임 속도 설정
let isGameOver = false;
let speedIncreaseInterval; // 게임 속도 증가 타이머
let gameInterval; // 타일 생성 타이머
const backgroundMusic = document.getElementById('background-music'); // 배경 음악 요소

function createTile() {
    const tile = document.createElement('div');
    tile.classList.add('tile');

    // 배열에 타일 이미지 경로 추가
    const tileImages = ['images/tile.png', 'images/tile2.png', 'images/tile3.png', 'images/tile4.png'];

    const randomImage = tileImages[Math.floor(Math.random() * tileImages.length)];

    // 랜덤 이미지 설정
    tile.style.backgroundImage = `url('${randomImage}')`;

    // 타일의 크기와 위치 설정
    const containerWidth = gameContainer.offsetWidth;
    const tileWidth = containerWidth * 0.22; // 타일 너비는 컨테이너의 22%
    tile.style.width = `${tileWidth}px`;
    tile.style.height = `${tileWidth * (3/2)}px`; // 타일 높이는 너비의 1.5배

    const tilePositions = [
        0,
        containerWidth * 0.25 - tileWidth / 2,
        containerWidth * 0.5 - tileWidth / 2,
        containerWidth * 0.75 - tileWidth / 2
    ];

    const randomPosition = tilePositions[Math.floor(Math.random() * tilePositions.length)];
    tile.style.left = `${randomPosition}px`;

    gameContainer.appendChild(tile);
    dropTile(tile);
}

function dropTile(tile) {
    let tilePosition = -tile.offsetHeight;

    const dropInterval = setInterval(() => {
        if (isGameOver) {
            clearInterval(dropInterval);
            tile.remove();
            return;
        }

        tilePosition += gameSpeed;
        tile.style.top = `${tilePosition}px`;

        if (tilePosition > gameContainer.offsetHeight) {
            clearInterval(dropInterval);
            tile.remove();
            gameOver();
        }
    }, 20);

    // 클릭 및 터치 이벤트 리스너 추가
    tile.addEventListener('click', onTileClick);
    tile.addEventListener('touchstart', onTileClick);

    function onTileClick() {
        score++;
        scoreElement.textContent = `Score: ${score}`;

        // 점수 색상을 파란색으로 변경
        scoreElement.style.color = 'blue';

        // 0.5초 후에 색상을 검정색으로 변경
        setTimeout(() => {
            scoreElement.style.color = 'black';
        }, 500);

        clearInterval(dropInterval);
        tile.remove();

        // 이벤트 리스너 제거
        tile.removeEventListener('click', onTileClick);
        tile.removeEventListener('touchstart', onTileClick);
    }
}

function updateMusicSpeed() {
    // 음악 재생 속도를 게임 속도에 비례하여 설정
    backgroundMusic.playbackRate = Math.min(gameSpeed / 4, 2); // 최대 1.5배속
}

function startGame() {
    // 게임이 시작되면 시작 버튼 숨기기
    startButton.style.display = 'none';
    isGameOver = false;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    gameSpeed = 4; // 게임 속도 초기화
    updateMusicSpeed(); // 음악 속도 초기화

    // 배경 음악 재생
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();

    // 타일 생성 간격 초기화
    let tileCreationInterval = 1000; // 초기 타일 생성 간격 (밀리초)

    // 타일 생성 타이머 설정
    gameInterval = setInterval(() => {
        if (!isGameOver) {
            createTile();
        }
    }, tileCreationInterval);

    // 게임 속도 및 타일 생성 간격 조절
    speedIncreaseInterval = setInterval(() => {
        if (gameSpeed < maxGameSpeed) {
            gameSpeed += 0.3; // 게임 속도 증가 폭을 조절하여 음악이 너무 빨라지지 않도록 함
            if (gameSpeed > maxGameSpeed) {
                gameSpeed = maxGameSpeed;
            }
            updateMusicSpeed();

            // 타일 생성 간격 감소 (최소값 제한)
            if (tileCreationInterval > 500) {
                tileCreationInterval -= 50;
                clearInterval(gameInterval);
                gameInterval = setInterval(() => {
                    if (!isGameOver) {
                        createTile();
                    }
                }, tileCreationInterval);
            }
        }
    }, 5000);
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameInterval);
    clearInterval(speedIncreaseInterval);

    // 배경 음악 정지
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;

    alert('게임 오버! 점수: ' + score);

    // 시작 버튼 다시 표시
    startButton.style.display = 'block';
}

startButton.addEventListener('click', () => {
    startGame();
});
