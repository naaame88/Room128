let activeMode = "";

function openPostcard() {
    document.getElementById('envelope-container').classList.add('hidden');
    document.getElementById('postcard-container').classList.remove('hidden');
}

function openModal(mode) {
    activeMode = mode;
    const modal = document.getElementById('modal');
    const content = modal.querySelector('.modal-content');
    const title = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');
    const inputArea = document.getElementById('input-area');
    const rankArea = document.getElementById('rank-area');

    rankArea.classList.add('hidden');
    content.classList.remove('wide');

    if (mode === 'message') {
        content.classList.add('wide');
        title.innerText = "Congratulations";
        desc.innerText = "Leave a message.";
        inputArea.classList.remove('hidden');
    } else if (mode === 'gate') {
        const now = new Date();
        const isTime = (now.getHours() % 12 === 1) && (now.getMinutes() === 28);

        if (isTime) {
            content.classList.add('wide');
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
    if (!name || !msg) return alert("Fill in both fields.");

    const key = (activeMode === 'gate') ? 'attendance' : 'messages';
    let storage = JSON.parse(localStorage.getItem(key) || '[]');
    storage.push({ date: new Date().toLocaleString(), name, content: msg });
    localStorage.setItem(key, JSON.stringify(storage));

    closeModal();
    document.getElementById('stamp-img').classList.remove('hidden');
    document.getElementById('rabbit-anim').animate([{left: '-150px'}, {left: '110%'}], {duration: 3500});
}

function showRanking() {
    const modal = document.getElementById('modal');
    const rankList = document.querySelector('.rank-list');
    document.getElementById('modal-title').innerText = "Honor Board";
    document.getElementById('modal-desc').innerText = "Top Gate Visitors.";
    document.getElementById('input-area').classList.add('hidden');
    document.getElementById('rank-area').classList.remove('hidden');

    const attendance = JSON.parse(localStorage.getItem('attendance') || '[]');
    const counts = {};
    attendance.forEach(item => { if(item.name) counts[item.name] = (counts[item.name] || 0) + 1; });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    rankList.innerHTML = sorted.length > 0 
        ? sorted.map((r, i) => `<li><span>${i+1}st</span> ${r[0]} (${r[1]})</li>`).join('')
        : "<li>No records.</li>";

    modal.classList.remove('hidden');
}

function closeModal() { document.getElementById('modal').classList.add('hidden'); }