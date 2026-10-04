document.addEventListener('DOMContentLoaded', () => {
    const proGrid = document.getElementById('pro-players-grid');
    const customGrid = document.getElementById('custom-players-grid');
    const searchInput = document.getElementById('search-input');
    const dpiFilter = document.getElementById('dpi-filter');
    const sensitivityForm = document.getElementById('sensitivity-form');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    let customPlayers = JSON.parse(localStorage.getItem('ff_custom_players')) || [];

    // Render Pro Players
    function renderProPlayers(filterText = '', filterDpi = 'all') {
        proGrid.innerHTML = '';
        
        const filtered = PRO_PLAYERS.filter(player => {
            const matchName = player.name.toLowerCase().includes(filterText.toLowerCase()) || 
                              player.device.toLowerCase().includes(filterText.toLowerCase());
            
            let matchDpi = true;
            if (filterDpi === 'low') matchDpi = player.dpi < 500;
            else if (filterDpi === 'mid') matchDpi = player.dpi >= 500 && player.dpi <= 800;
            else if (filterDpi === 'high') matchDpi = player.dpi > 800;

            return matchName && matchDpi;
        });

        if (filtered.length === 0) {
            proGrid.innerHTML = `
                <div class="col-span-full py-12 text-center text-gray-500">
                    <i class="fa-solid fa-ghost text-4xl mb-3"></i>
                    <p>Không tìm thấy cấu hình phù hợp.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(player => {
            proGrid.appendChild(createPlayerCard(player, false));
        });
    }

    // Render Custom Players
    function renderCustomPlayers() {
        customGrid.innerHTML = '';
        
        if (customPlayers.length === 0) {
            customGrid.innerHTML = `
                <div class="col-span-full py-10 text-center text-gray-500 bg-ffdark-900/50 border border-dashed border-gray-800 rounded-2xl">
                    <i class="fa-solid fa-folder-open text-3xl mb-2 text-gray-600"></i>
                    <p class="text-sm">Bạn chưa lưu độ nhạy nào. Hãy tạo ở form phía trên!</p>
                </div>
            `;
            return;
        }

        customPlayers.forEach((player, index) => {
            customGrid.appendChild(createPlayerCard(player, true, index));
        });
    }

    // Create Card HTML element
    function createPlayerCard(player, isCustom = false, index = null) {
        const card = document.createElement('div');
        card.className = "bg-ffdark-900 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:border-ffred-500/50 transition-all shadow-xl group";
        
        card.innerHTML = `
            <div>
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <div class="flex items-center gap-2">
                            <h3 class="font-black text-lg text-white group-hover:text-ffred-500 transition-colors">${player.name}</h3>
                            ${player.tag ? `<span class="text-[10px] font-bold bg-ffred-500/10 text-ffred-500 px-2 py-0.5 rounded-full border border-ffred-500/20">${player.tag}</span>` : ''}
                            ${isCustom ? `<span class="text-[10px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/20">Cá Nhân</span>` : ''}
                        </div>
                        <p class="text-xs text-gray-400 mt-0.5"><i class="fa-solid fa-mobile-screen mr-1 text-gray-500"></i> ${player.device}</p>
                    </div>
                    <div class="text-right">
                        <span class="text-xs font-semibold text-gray-400">DPI</span>
                        <div class="text-sm font-mono font-bold text-amber-400">${player.dpi}</div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2 text-xs mb-6">
                    <div class="bg-ffdark-950 px-3 py-2 rounded-xl flex justify-between items-center border border-gray-800/80">
                        <span class="text-gray-400">Nhìn Xung Quanh</span>
                        <span class="font-bold font-mono text-white">${player.general}</span>
                    </div>
                    <div class="bg-ffdark-950 px-3 py-2 rounded-xl flex justify-between items-center border border-gray-800/80">
                        <span class="text-gray-400">Red Dot</span>
                        <span class="font-bold font-mono text-white">${player.redDot}</span>
                    </div>
                    <div class="bg-ffdark-950 px-3 py-2 rounded-xl flex justify-between items-center border border-gray-800/80">
                        <span class="text-gray-400">Ống Ngắm 2X</span>
                        <span class="font-bold font-mono text-white">${player.scope2x}</span>
                    </div>
                    <div class="bg-ffdark-950 px-3 py-2 rounded-xl flex justify-between items-center border border-gray-800/80">
                        <span class="text-gray-400">Ống Ngắm 4X</span>
                        <span class="font-bold font-mono text-white">${player.scope4x}</span>
                    </div>
                    <div class="bg-ffdark-950 px-3 py-2 rounded-xl flex justify-between items-center border border-gray-800/80 col-span-2">
                        <span class="text-gray-400">Ống Ngắm AWM</span>
                        <span class="font-bold font-mono text-white">${player.awm}</span>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-2">
                <button class="copy-btn flex-1 bg-ffdark-950 hover:bg-ffred-600 hover:text-white border border-gray-800 text-gray-300 py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2">
                    <i class="fa-regular fa-copy"></i> Sao Chép Cấu Hình
                </button>
                ${isCustom ? `
                    <button class="delete-btn bg-ffdark-950 hover:bg-red-600 hover:text-white border border-gray-800 text-red-400 py-2.5 px-3 rounded-xl font-bold text-xs transition-all" title="Xóa">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        `;

        // Copy button event
        const copyBtn = card.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => {
            const textToCopy = `🎮 Độ Nhạy Free Fire - ${player.name} (${player.device})\n- DPI: ${player.dpi}\n- Nhìn xung quanh: ${player.general}\n- Red Dot: ${player.redDot}\n- 2X: ${player.scope2x}\n- 4X: ${player.scope4x}\n- AWM: ${player.awm}`;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(`Đã sao chép cấu hình của ${player.name}!`);
            }).catch(() => {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = textToCopy;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                showToast(`Đã sao chép cấu hình của ${player.name}!`);
            });
        });

        // Delete button event
        if (isCustom) {
            const deleteBtn = card.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                if (confirm(`Bạn có chắc muốn xóa cấu hình của ${player.name}?`)) {
                    customPlayers.splice(index, 1);
                    localStorage.setItem('ff_custom_players', JSON.stringify(customPlayers));
                    renderCustomPlayers();
                    showToast('Đã xóa cấu hình thành công!');
                }
            });
        }

        return card;
    }

    // Show Toast Notification helper
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.remove('translate-y-24', 'opacity-0');
        setTimeout(() => {
            toast.classList.add('translate-y-24', 'opacity-0');
        }, 3000);
    }

    // Event Listeners for Filters
    searchInput.addEventListener('input', (e) => {
        renderProPlayers(e.target.value, dpiFilter.value);
    });

    dpiFilter.addEventListener('change', (e) => {
        renderProPlayers(searchInput.value, e.target.value);
    });

    // Form Submission
    sensitivityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newPlayer = {
            name: document.getElementById('creator-name').value,
            device: document.getElementById('creator-device').value,
            dpi: parseInt(document.getElementById('val-dpi').value),
            general: parseInt(document.getElementById('val-general').value),
            redDot: parseInt(document.getElementById('val-reddot').value),
            scope2x: parseInt(document.getElementById('val-scope2x').value),
            scope4x: parseInt(document.getElementById('val-scope4x').value),
            awm: parseInt(document.getElementById('val-awm').value)
        };

        customPlayers.unshift(newPlayer);
        localStorage.setItem('ff_custom_players', JSON.stringify(customPlayers));
        
        renderCustomPlayers();
        sensitivityForm.reset();
        
        // Scroll to custom list
        document.getElementById('custom-list').scrollIntoView({ behavior: 'smooth' });
        showToast('Lưu cấu hình thành công!');
    });

    // Initial render
    renderProPlayers();
    renderCustomPlayers();
});