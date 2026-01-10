let activeMode = "";

/**
 * 편지 봉투 클릭 시 실행되는 함수
 */
function openPostcard() {
    const mailContainer = document.getElementById('mail-container');
    const postcard = document.getElementById('postcard-container');
    postcard.classList.remove('hidden');
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
    const inputArea = document.getElementById('input-area');
    const rankArea = document.getElementById('rank-area');
    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');

    rankArea.classList.add('hidden');
    
    if (mode === 'message') {
        title.innerText = "Congratulations";
        desc.innerText = "Share your heartfelt thoughts.";
        inputArea.classList.remove('hidden');
    } else if (mode === 'gate') {
        const now = new Date();
        const isTime = (now.getHours() % 12 === 1) && (now.getMinutes() === 28);
        if (isTime) {
            title.innerText = "Time Gate";
            desc.innerText = "The stars have aligned. Leave your mark.";
            inputArea.classList.remove('hidden');
        } else {
            title.innerText = "Locked";
            desc.innerText = "The gate only opens at the sacred time of 1:28.";
            inputArea.classList.add('hidden');
        }
    }
    modal.classList.remove('hidden');
}

/**
 * 메시지 제출 시 실행되는 함수
 */
function submitAction() {
    const nameInput = document.getElementById('user-name');
    const msgInput = document.getElementById('user-message');
    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();

    if (!name || !msg) return alert("Please fill in the grace of your words.");

    // 로컬 스토리지 데이터 저장
    const key = (activeMode === 'gate') ? 'attendance' : 'messages';
    let storage = JSON.parse(localStorage.getItem(key) || '[]');
    storage.push({ date: new Date().toLocaleString(), name, content: msg });
    localStorage.setItem(key, JSON.stringify(storage));

    nameInput.value = "";
    msgInput.value = "";
    closeModal();

    // [수정] 토끼 애니메이션을 삭제하고 반짝이 효과 실행
    createSparkleEffect();
}

/**
 * 반짝이가 회오리치며 도장 위치로 모이는 효과
 */
function createSparkleEffect() {
    const container = document.querySelector('.postcard-relative');
    const stampImg = document.getElementById('stamp-img');
    const particleCount = 25; // 입자 수를 조금 늘려 풍성하게 연출

    // 도장 안착 목표 지점 (style.css와 일치)
    const targetTop = 72; 
    const targetRight = 6;
    const destX = 100 - targetRight - 7; 
    const destY = targetTop + 5;

    for (let i = 0; i < particleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle-particle';
        container.appendChild(sparkle);

        // 랜덤한 시작 위치
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        
        // 각 입자마다 고유한 회전 반경과 각도 부여
        const angle = Math.random() * Math.PI * 2;
        const radius = 10 + Math.random() * 15; // 회오리 치는 반경

        const anim = sparkle.animate([
            { 
                left: startX + '%', 
                top: startY + '%', 
                opacity: 0, 
                transform: 'scale(0)' 
            },
            { 
                // 중간 지점: 도장 주변에서 회오리 시작
                left: (destX + Math.cos(angle) * radius) + '%',
                top: (destY + Math.sin(angle) * radius) + '%',
                opacity: 1,
                transform: 'scale(1.2)'
            },
            { 
                // 최종 지점: 도장 중심으로 정착
                left: destX + '%', 
                top: destY + '%', 
                opacity: 0, 
                transform: 'scale(0)' 
            }
        ], {
            // [수정] 속도를 늦춰(4~5.5초) 더 부드럽고 천천히 움직이게 설정
            duration: 4000 + (Math.random() * 1500), 
            easing: 'ease-in-out',
            delay: i * 50 // 입자들이 순차적으로 생성되어 흐르는 느낌 유도
        });

        anim.onfinish = () => {
            sparkle.remove();
            if (i === particleCount - 1) {
                applyStampLogic(stampImg);
            }
        };
    }
}

/**
 * [추가] 반짝이 효과 종료 후 도장을 표시하는 로직
 */
function applyStampLogic(stampImg) {
    stampImg.classList.remove('glitter-effect', 'hidden');

    const rand = Math.random() * 100;
    if (rand <= 0.01) { 
        stampImg.src = "images/gold_stamp.png"; 
        stampImg.classList.add('glitter-effect');
        setTimeout(() => alert("✨ A miracle has occurred. The Gold Stamp is yours. ✨"), 500);
    } else {
        stampImg.src = "images/stamp.png";
    }
}

/**
 * 명예의 전당 보기
 */
function showRanking() {
    const modal = document.getElementById('modal');
    const rankList = document.querySelector('.rank-list');
    document.getElementById('modal-title').innerText = "Honor Board";
    document.getElementById('modal-desc').innerText = "The most frequent travelers.";
    document.getElementById('input-area').classList.add('hidden');
    document.getElementById('rank-area').classList.remove('hidden');

    const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    const counts = {};
    attendance.forEach(item => { if(item.name) counts[item.name] = (counts[item.name] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    rankList.innerHTML = sorted.length > 0 
        ? sorted.map((r, i) => `<li><span style="font-family:Cinzel">${i+1}st</span> — ${r[0]} (${r[1]})</li>`).join('')
        : "<li>The board is currently empty.</li>";

    modal.classList.remove('hidden');
}

/**
 * 모달 닫기
 */
function closeModal() { document.getElementById('modal').classList.add('hidden'); }