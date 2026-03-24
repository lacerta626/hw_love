const TRPG_LOCKS = {
    remember: {
        locked: true,
        password: '0105'
    },
    love: {
        locked: true,
        password: '0105'
    },
    open: {
        locked: true,
        password: '0105'
    },
    highbuilding: {
        locked: true,
        password: '0105'
    }
};

const params = new URLSearchParams(location.search);
const id = params.get('id');

const contentEl = document.getElementById('trpg-content');
const pwBox = document.getElementById('password-box');
const pwInput = document.getElementById('passwordInput');
const pwBtn = document.getElementById('passwordBtn');
const pwError = document.getElementById('passwordError');

const config = TRPG_LOCKS[id];

function loadTRPG() {
    fetch(`data/${id}.html`)
        .then(res => {
            if (!res.ok) throw new Error();
            return res.text();
        })
        .then(html => {
            contentEl.innerHTML = html;
            contentEl.style.display = 'block';
            pwBox.style.display = 'none';
        })
        .catch(() => {
            contentEl.textContent = '내용을 불러올 수 없습니다.';
            contentEl.style.display = 'block';
        });
}

if (!id) {
    contentEl.textContent = '잘못된 접근입니다.';
    contentEl.style.display = 'block';

} else if (config?.locked) {
    // 🔒 잠긴 TRPG
    pwBox.style.display = 'block';

    pwBtn.addEventListener('click', () => {
        if (pwInput.value === config.password) {
            loadTRPG();
        } else {
            pwError.textContent = '비밀번호가 틀렸습니다.';
        }
    });

} else {
    // 🔓 공개 TRPG
    loadTRPG();
}
pwInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') pwBtn.click();
});

