document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const icon = darkModeToggle ? darkModeToggle.querySelector('i') : null;

    const updateIcon = (isDark) => {
        if (!icon) return;
        if (isDark) {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        body.classList.add('dark-mode');
        updateIcon(true);
    } else {
        updateIcon(false);
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateIcon(isDark);
        });
    }

    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const deviceType = document.getElementById('deviceType').value;
            const resultArea = document.getElementById('resultArea');
            let sensitivityText = '';

            if (deviceType === 'ios') {
                sensitivityText = 'Gợi ý iPhone: General: 97 | Red Dot: 94 | 2x Scope: 90 | DPI: Mặc định';
            } else if (deviceType === 'gaming') {
                sensitivityText = 'Gợi ý Gaming Phone: General: 99 | Red Dot: 96 | 2x Scope: 95 | DPI: 600';
            } else {
                sensitivityText = 'Gợi ý Android: General: 92 | Red Dot: 88 | 2x Scope: 85 | DPI: 500';
            }

            resultArea.innerHTML = `<div style="padding: 15px; background: var(--bg-color); border: 1px solid var(--card-border); border-radius: 6px;">${sensitivityText}</div>`;
        });
    }
});
