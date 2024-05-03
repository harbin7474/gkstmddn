const airplane = document.getElementById("airplane");
const airplaneImage = document.querySelector("#airplane img");
const airplaneWidth = 20; // 비행기 이미지의 너비
const airplaneHeight = 20; // 비행기 이미지의 높이
const redCircleContainer = document.querySelector(".red-circle-container");
let isGameOver = false;

// 빨간 원을 10개씩 생성하여 추가
for (let i = 0; i < 30; i++) {
    const redCircle = document.createElement("div");
    redCircle.classList.add("red-circle");
    redCircle.style.left = Math.random() * window.innerWidth + "px"; // 무작위 x값 설정
    redCircle.style.animationDelay = (i / 5) + "s"; // 각 원의 애니메이션 지연 설정
    redCircleContainer.appendChild(redCircle);
}

document.addEventListener("mousemove", (event) => {
    const x = event.clientX;
    const y = event.clientY;

    const adjustedX = x - (airplaneWidth / 2);
    const adjustedY = y - (airplaneHeight / 2);

    airplane.style.left = adjustedX + "px";
    airplane.style.top = adjustedY + "px";

    // 충돌 감지
    if (!isGameOver) {
        const airplaneRect = airplane.getBoundingClientRect();
        const redCircles = document.querySelectorAll(".red-circle");
        for (const redCircle of redCircles) {
            const redCircleRect = redCircle.getBoundingClientRect();
            
            // 비행기 이미지의 안쪽 부분과 원 간의 충돌 감지
            if (
                airplaneRect.left + 5 < redCircleRect.right &&
                airplaneRect.right - 5 > redCircleRect.left &&
                airplaneRect.top + 5 < redCircleRect.bottom &&
                airplaneRect.bottom - 5 > redCircleRect.top
            ) {
                isGameOver = true;
                setTimeout(() => {
                    alert("게임 종료!");
                    location.reload(); // 게임 재시작
                }, 300);
                break;
            }
        }
    }
});