let activeMode = "";

function openPostcard() {
    const mailContainer = document.getElementById('mail-container');
    const postcard = document.getElementById('postcard-container');
    
    // 편지 요소 표시 후 애니메이션 클래스 부여
    postcard.classList.remove('hidden');
    setTimeout(() => {
        mailContainer.classList.add('opened');
    }, 20);
}

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
        const isTime = (now.getHours() % 12 === 1) && (now.getMinutes() === 28);
        if (isTime) {
            title.innerText = "1:28 Time Gate";
            desc.innerText = "Record your visit.";
            inputArea.classList.remove('hidden');
        } else {
            title.innerText = "Gate Locked";
            desc.innerText = "Opens at 1:28.";
            inputArea.classList.add('hidden');
        }
    }
    modal.classList.remove('hidden');
}

function submitAction() {
    const name = document.getElementById('user-name').value.trim();
    const msg = document.getElementById('user-message').value.trim();
    if (!name || !msg) return alert("Please fill in all fields.");

    const key = (activeMode === 'gate') ? 'attendance' : 'messages';
    let storage = JSON.parse(localStorage.getItem(key) || '[]');
    storage.push({ date: new Date().toLocaleString(), name, content: msg });
    localStorage.setItem(key, JSON.stringify(storage));

    closeModal();

    const stampImg = document.getElementById('stamp-img');
    stampImg.classList.remove('glitter-effect', 'hidden');

    // --- 0.01% 확률 가챠 (테스트 시에는 rand <= 100으로 변경해 보세요) ---
    const rand = Math.random() * 100;
    if (rand <= 0.01) { 
        stampImg.src = "images/gold_stamp.png"; 
        stampImg.classList.add('glitter-effect');
        setTimeout(() => alert("✨ [SUPER RARE] 0.01% 확률의 황금 도장을 획득했습니다!"), 500);
    } else {
        stampImg.src = "images/stamp.png";
    }

    // 토끼 애니메이션
    document.getElementById('rabbit-anim').animate([
        { left: '-150px' }, { left: '110%' }
    ], { duration: 3500, easing: 'ease-in-out' });
}

function showRanking() {
    const modal = document.getElementById('modal');
    const rankList = document.querySelector('.rank-list');
    document.getElementById('modal-title').innerText = "Honor Board";
    document.getElementById('modal-desc').innerText = "Top Visitors";
    document.getElementById('input-area').classList.add('hidden');
    document.getElementById('rank-area').classList.remove('hidden');

    const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    const counts = {};
    attendance.forEach(item => { if(item.name) counts[item.name] = (counts[item.name] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    rankList.innerHTML = sorted.length > 0 
        ? sorted.map((r, i) => `<li><span>${i+1}st</span> ${r[0]} (${r[1]})</li>`).join('')
        : "<li>No records yet.</li>";

    modal.classList.remove('hidden');
}

function closeModal() { document.getElementById('modal').classList.add('hidden'); }