let activeMode = "";

function openPostcard() {
    const mailContainer = document.getElementById('mail-container');
    const postcard = document.getElementById('postcard-container');
    
    postcard.classList.remove('hidden');
    // 브라우저 렌더링을 위해 아주 짧은 시간차를 두고 클래스 추가
    setTimeout(() => {
        mailContainer.classList.add('opened');
    }, 50);
}

function submitAction() {
    const name = document.getElementById('user-name').value.trim();
    const msg = document.getElementById('user-message').value.trim();
    if (!name || !msg) return alert("내용을 입력해주세요.");

    const key = (activeMode === 'gate') ? 'attendance' : 'messages';
    let storage = JSON.parse(localStorage.getItem(key) || '[]');
    storage.push({ date: new Date().toLocaleString(), name, content: msg });
    localStorage.setItem(key, JSON.stringify(storage));

    closeModal();

    const stampImg = document.getElementById('stamp-img');
    stampImg.classList.remove('glitter-effect', 'hidden');

    const rand = Math.random() * 100;
    if (rand <= 0.01) { 
        stampImg.src = "images/gold_stamp.png"; 
        stampImg.classList.add('glitter-effect');
        setTimeout(() => alert("✨ 0.01% 확률의 황금 도장이 찍혔습니다! ✨"), 500);
    } else {
        stampImg.src = "images/stamp.png";
    }

    // 토끼 애니메이션 시간도 우아한 속도에 맞춰 4초로 변경
    document.getElementById('rabbit-anim').animate([
        { left: '-150px' }, { left: '110%' }
    ], { duration: 4000, easing: 'ease-in-out' });
}

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
        ? sorted.map((r, i) => `<li><span>${i+1}st</span> ${r[0]} (${r[1]})</li>`).join('')
        : "<li>No records yet.</li>";

    modal.classList.remove('hidden');
}

function closeModal() { document.getElementById('modal').classList.add('hidden'); }