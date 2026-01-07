let activeMode = "";

/**
 * 편지 봉투 클릭 시 실행되는 함수
 * 봉투는 아래로 내려가고, 편지지는 위에서 아래로 내려옵니다.
 */
function openPostcard() {
    const mailContainer = document.getElementById('mail-container');
    const postcard = document.getElementById('postcard-container');
    
    // 편지지를 먼저 보이게 설정 (CSS 초기값 transform: translateY(-150%)에 의해 화면 위에 숨어있음)
    postcard.classList.remove('hidden');
    
    // 브라우저 렌더링을 위해 아주 짧은 지연 후 'opened' 클래스 추가
    setTimeout(() => {
        mailContainer.classList.add('opened');
    }, 50);
}

/**
 * 모달창 열기 (메시지 작성 또는 타임 게이트)
 */
function openModal(mode) {
    activeMode = mode;
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');
    const inputArea = document.getElementById('input-area');
    const rankArea = document.getElementById('rank-area');

    rankArea.classList.add('hidden');
    
    if (mode === 'message') {
        title.innerText = "Congratulations";
        desc.innerText = "Leave a birthday message.";
        inputArea.classList.remove('hidden');
    } else if (mode === 'gate') {
        const now = new Date();
        // 1시 28분 체크 (오전/오후 1시 28분)
        const isTime = (now.getHours() % 12 === 1) && (now.getMinutes() === 28);
        if (isTime) {
            title.innerText = "1:28 Time Gate";
            desc.innerText = "Record your visit.";
            inputArea.classList.remove('hidden');
        } else {
            title.innerText = "Gate Locked";
            desc.innerText = "The gate only opens at 1:28.";
            inputArea.classList.add('hidden');
        }
    }
    modal.classList.remove('hidden');
}

/**
 * 메시지 제출 버튼 클릭 시 실행
 * 로컬 스토리지 저장 및 0.01% 확률 가챠 로직 포함
 */
function submitAction() {
    const nameInput = document.getElementById('user-name');
    const messageInput = document.getElementById('user-message');
    const name = nameInput.value.trim();
    const msg = messageInput.value.trim();

    if (!name || !msg) {
        alert("Please enter both your name and message.");
        return;
    }

    // 데이터 저장
    const key = (activeMode === 'gate') ? 'attendance' : 'messages';
    let storage = JSON.parse(localStorage.getItem(key) || '[]');
    storage.push({ date: new Date().toLocaleString(), name, content: msg });
    localStorage.setItem(key, JSON.stringify(storage));

    // 입력창 초기화 및 모달 닫기
    nameInput.value = "";
    messageInput.value = "";
    closeModal();

    // 도장 연출 준비
    const stampImg = document.getElementById('stamp-img');
    stampImg.classList.remove('glitter-effect', 'hidden');

    // --- 0.01% 확률 황금 도장 가챠 로직 ---
    const rand = Math.random() * 100;
    
    // 테스트 시에는 (rand <= 100)으로 바꾸면 100% 확률로 황금 도장이 나옵니다.
    if (rand <= 0.01) { 
        stampImg.src = "images/gold_stamp.png"; 
        stampImg.classList.add('glitter-effect');
        setTimeout(() => alert("✨ MIRACLE! 0.01% 확률의 황금 도장이 찍혔습니다! ✨"), 500);
    } else {
        stampImg.src = "images/stamp.png";
    }

    // --- 토끼 애니메이션 실행 (크기 확대 반영) ---
    // 기존 속도는 유지하되, transform: scale(1.5)를 추가하여 토끼 크기를 약 1.5배 키웠습니다.
    const rabbit = document.getElementById('rabbit-anim');
    rabbit.animate([
        { left: '-200px', transform: 'scale(1.5)' }, // 시작 위치 및 크기
        { left: '110%', transform: 'scale(1.5)' }   // 끝 위치 및 크기 유지
    ], { 
        duration: 3500, // 기존 속도 유지
        easing: 'ease-in-out' 
    });
}

/**
 * 명예의 전당 (랭킹) 보기
 */
function showRanking() {
    const modal = document.getElementById('modal');
    const rankList = document.querySelector('.rank-list');
    document.getElementById('modal-title').innerText = "Honor Board";
    document.getElementById('modal-desc').innerText = "Top Gate Visitors";
    document.getElementById('input-area').classList.add('hidden');
    document.getElementById('rank-area').classList.remove('hidden');

    const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    const counts = {};
    attendance.forEach(item => { if(item.name) counts[item.name] = (counts[item.name] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    rankList.innerHTML = sorted.length > 0 
        ? sorted.map((r, i) => `<li><span>${i+1}st</span> ${r[0]} (${r[1]} times)</li>`).join('')
        : "<li>No records yet.</li>";

    modal.classList.remove('hidden');
}

/**
 * 모달 닫기
 */
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}