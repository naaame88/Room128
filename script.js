let activeMode = "";

/**
 * 편지 개봉: 봉투 하강 & 편지지 위에서 하강
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
 * 모달 제어: 세련된 영문 메시지 적용
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
 * 제출 및 토끼 질주 (더 큰 토끼 적용)
 */
function submitAction() {
    const nameInput = document.getElementById('user-name');
    const msgInput = document.getElementById('user-message');
    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();

    if (!name || !msg) return alert("Please fill in the grace of your words.");

    const key = (activeMode === 'gate') ? 'attendance' : 'messages';
    let storage = JSON.parse(localStorage.getItem(key) || '[]');
    storage.push({ date: new Date().toLocaleString(), name, content: msg });
    localStorage.setItem(key, JSON.stringify(storage));

    nameInput.value = "";
    msgInput.value = "";
    closeModal();

    const stampImg = document.getElementById('stamp-img');
    stampImg.classList.remove('glitter-effect', 'hidden');

    const rand = Math.random() * 100;
    if (rand <= 0.01) { 
        stampImg.src = "images/gold_stamp.png"; 
        stampImg.classList.add('glitter-effect');
        setTimeout(() => alert("✨ A miracle has occurred. The Gold Stamp is yours. ✨"), 500);
    } else {
        stampImg.src = "images/stamp.png";
    }

    // 토끼 애니메이션 (기존 속도 유지, 크기는 scale 1.7로 대폭 확대)
    const rabbit = document.getElementById('rabbit-anim');
    rabbit.animate([
        { left: '-250px', transform: 'scale(1.7)' },
        { left: '115%', transform: 'scale(1.7)' }
    ], { 
        duration: 3800, 
        easing: 'ease-in-out' 
    });
}

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

function closeModal() { document.getElementById('modal').classList.add('hidden'); }