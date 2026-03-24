// 1. TRPG 비밀번호 데이터 (전역 설정)
const TRPG_CONFIG = {
    remember: '0105',
    love: '0105',
    open: '0105',
    highbuilding: '0105'
};

// --- [전역 함수] 팝업 제어 (HTML onclick에서 호출 가능하도록) ---
window.openTRPG = function(id) {
    const popup = document.getElementById('trpg-popup');
    const contentArea = document.getElementById('popup-content');
    
    if (!popup || !contentArea) return;

    // 1. 비밀번호 확인
    const pw = prompt("비밀번호를 입력하세요.");
    if (pw !== TRPG_CONFIG[id]) {
        alert("Wrong Password.");
        return;
    }

    // 2. iframe 생성 (스타일 충돌 원천 봉쇄)
    contentArea.innerHTML = ""; // 기존 내용 비우기
    const iframe = document.createElement('iframe');
    iframe.src = `../trpg/data/${id}.html`; // 경로 확인 필요
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    
    contentArea.appendChild(iframe);
    popup.style.display = 'flex'; // 팝업 표시

    // 등장 애니메이션
    gsap.fromTo(".popup-window", 
        { scale: 0.8, opacity: 0 }, 
        { duration: 0.4, scale: 1, opacity: 1, ease: "back.out(1.7)" }
    );
};

window.closeTRPGPopup = function() {
    const popup = document.getElementById('trpg-popup');
    if (popup) {
        popup.style.display = 'none';
        document.getElementById('popup-content').innerHTML = ""; // 메모리 정리
    }
};

// --- [메인 로직] 페이지 로드 시 실행 ---
document.addEventListener('DOMContentLoaded', () => {
    const mainDisplay = document.getElementById("main-display");
    const navItems = document.querySelectorAll(".nav-item");

    // 2. 초기 등장 애니메이션 (기둥 효과)
    if (document.querySelector(".column")) {
        gsap.to(".column", {
            duration: 0.8,
            y: "100%",
            stagger: 0.1,
            ease: "power4.inOut",
            onComplete: () => {
                const layer = document.getElementById("transition-layer");
                if (layer) layer.style.display = "none";
            }
        });
    }

    // 3. 페이지 전환 시스템 (Template 기반)
    function loadPage(pageId) {
        const temp = document.getElementById(`temp-${pageId}`);
        if (!temp || !mainDisplay) return;

        mainDisplay.innerHTML = "";
        mainDisplay.appendChild(temp.content.cloneNode(true));

        // 페이지별 특수 기능 실행
        if (pageId === 'home') {
            startHomeFunctions();
        }

        // 전환 애니메이션
        gsap.fromTo(mainDisplay, 
            { opacity: 0, x: 20 }, 
            { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
        );
    }

    // 사이드바 메뉴 클릭 이벤트
    navItems.forEach(item => {
        item.addEventListener("click", () => {
            navItems.forEach(n => n.classList.remove("active"));
            item.classList.add("active");
            
            const pageId = item.getAttribute("data-page");
            loadPage(pageId);
        });
    });

    // 초기 화면(Home) 로드
    loadPage("home");
});

// --- [홈 기능] 시계 및 달력 ---
function startHomeFunctions() {
    updateClock();
    // 기존에 돌아가던 타이머가 있을 수 있으므로 정리 후 재설정 권장
    if (window.clockTimer) clearInterval(window.clockTimer);
    window.clockTimer = setInterval(updateClock, 1000);
    
    renderCalendar();
}

function updateClock() {
    const clockElement = document.getElementById('clock');
    const dateElement = document.getElementById('date');
    if (!clockElement) return;

    const now = new Date();
    
    // 시계 업데이트
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    clockElement.innerText = now.toLocaleTimeString('ko-KR', timeOptions);

    // 날짜 업데이트 (있을 경우)
    if (dateElement) {
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const dayList = ['일', '월', '화', '수', '목', '금', '토'];
        const day = dayList[now.getDay()];
        dateElement.innerText = `${year}-${month < 10 ? '0' + month : month}-${date < 10 ? '0' + date : date} ${day}`;
    }
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    if (!grid) return;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    // 요일 헤더 생성
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    grid.innerHTML = days.map(day => `<div class="day-name">${day}</div>`).join('');

    // 이번 달의 마지막 날짜와 시작 요일 계산
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    // 시작 요일 전까지 빈 칸 채우기
    for (let i = 0; i < firstDay; i++) {
        grid.innerHTML += `<div class="day empty"></div>`;
    }

    // 날짜 채우기
    for (let i = 1; i <= lastDate; i++) {
        const isToday = (i === currentDay) ? 'today' : '';
        grid.innerHTML += `<div class="day ${isToday}">${i}</div>`;
    }
}