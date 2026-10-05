/* ==================================================
   AI THÁM TỬ — DETECTIVE CASE GAME ENGINE
   ================================================== */

const CASES_DATA = [
    {
        caseId: "CASE-001",
        title: "ÁN MẠNG TRONG PHÒNG KHÓA KÍN",
        difficulty: "EASY",
        victim: {
            name: "Arthur Pendelton",
            age: 52,
            occupation: "Doanh nhân / Chủ tiệm đồ cổ",
            location: "Biệt thự Pendelton, Phòng trưng bày tầng 2",
            timeOfDeath: "21:30 - 22:00",
            initialReport: "Nạn nhân được phát hiện gục trên bàn làm việc trong căn phòng khóa kín từ bên trong. Không có dấu hiệu cạy phá cửa sổ hay cửa chính. Nguyên nhân tử vong: Trúng độc Xyanua trong ly rượu vang."
        },
        suspects: [
            {
                id: "s1",
                name: "Victoria Pendelton",
                age: 48,
                occupation: "Vợ nạn nhân",
                relation: "Vợ hợp pháp",
                avatar: "👩",
                description: "Người vợ lạnh lùng, đang đứng trước nguy cơ ly hôn tài sản lớn.",
                alibi: "Tôi ở phòng khách đọc sách từ 20:00 đến 22:30, không hề bước lên lầu.",
                suspicionScore: 20,
                statements: [
                    { id: "st1_1", question: "Bạn ở đâu lúc xảy ra vụ án?", text: "Tôi ở phòng khách đọc sách từ 20:00 đến 22:30, không hề bước lên lầu.", isLie: true, contradictionId: "clue_c3" },
                    { id: "st1_2", question: "Bạn biết nạn nhân từ khi nào?", text: "Chúng tôi kết hôn đã 20 năm, nhưng gần đây ông ấy rất lạnh nhạt.", isLie: false },
                    { id: "st1_3", question: "Bạn có nhìn thấy ai không?", text: "Tôi thấy quản gia mang ly rượu vang lên lầu vào khoảng 21:10.", isLie: false }
                ]
            },
            {
                id: "s2",
                name: "Thomas Blake",
                age: 35,
                occupation: "Quản gia",
                relation: "Người làm lâu năm",
                avatar: "🤵",
                description: "Quản gia tận tụy nhưng mang nhiều khoản nợ cá cược ngầm.",
                alibi: "Tôi chuẩn bị trà ở dưới nhà bếp và dọn dẹp phòng khách suốt cả tối.",
                suspicionScore: 40,
                statements: [
                    { id: "st2_1", question: "Bạn ở đâu lúc xảy ra vụ án?", text: "Tôi chuẩn bị trà ở dưới nhà bếp và dọn dẹp phòng khách suốt cả tối.", isLie: true, contradictionId: "clue_c2" },
                    { id: "st2_2", question: "Quan hệ của bạn với nạn nhân?", text: "Ông chủ đối xử với tôi rất công bằng, dẫu có hơi nghiêm khắc.", isLie: false },
                    { id: "st2_3", question: "Bạn có nhìn thấy ai không?", text: "Không có ai lạ bén mảng quanh khu vực phòng làm việc cả.", isLie: false }
                ]
            },
            {
                id: "s3",
                name: "Dr. Evelyn Vance",
                age: 41,
                occupation: "Bác sĩ / Bạn thân nạn nhân",
                relation: "Đối tác làm ăn cũ",
                avatar: "👨‍⚕️",
                description: "Bác sĩ tâm thần có chuyên môn sâu về độc dược học.",
                alibi: "Tôi có cuộc hẹn ở phòng khám riêng tại trung tâm thành phố đến tận 23:00.",
                suspicionScore: 10,
                statements: [
                    { id: "st3_1", question: "Bạn ở đâu lúc xảy ra vụ án?", text: "Tôi có cuộc hẹn ở phòng khám riêng tại trung tâm thành phố đến tận 23:00.", isLie: false },
                    { id: "st3_2", question: "Quan hệ của bạn với nạn nhân?", text: "Chúng tôi là bạn thân và thường xuyên bàn bạc về đồ cổ.", isLie: false },
                    { id: "st3_3", question: "Bạn có nhìn thấy ai không?", text: "Tôi không ghé qua biệt thự của Arthur vào tối hôm đó.", isLie: false }
                ]
            }
        ],
        clues: [
            {
                id: "clue_c1",
                title: "Ly rượu vang độc",
                description: "Chứa hàm lượng Xyanua cực cao. Dấu vân tay trên ly đã bị lau sạch một cách cẩn thận.",
                location: "Bàn làm việc nạn nhân",
                importance: "CRITICAL",
                discovered: true,
                relatedSuspects: ["s1", "s2"]
            },
            {
                id: "clue_c2",
                title: "Dấu giày ở ban công",
                description: "Dấu giày cỡ 42 dính bùn đất ngoài ban công phòng làm việc - trùng với cỡ giày của quản gia Thomas.",
                location: "Ban công tầng 2",
                importance: "CRITICAL",
                discovered: false,
                relatedSuspects: ["s2"]
            },
            {
                id: "clue_c3",
                title: "Camera hành lang tầng 2",
                description: "Ghi lại hình ảnh Victoria bước ra từ phòng nạn nhân lúc 21:15 với đôi găng tay nhung.",
                location: "Hành lang tầng 2",
                importance: "CRITICAL",
                discovered: false,
                relatedSuspects: ["s1"]
            },
            {
                id: "clue_c4",
                title: "Đơn thuốc Xyanua giả mạo",
                description: "Tìm thấy trong ngăn kéo của Victoria chữ ký đơn mua hóa chất độc hại.",
                location: "Phòng ngủ chính",
                importance: "IMPORTANT",
                discovered: false,
                relatedSuspects: ["s1"]
            }
        ],
        timeline: [
            {
                time: "20:00",
                event: "Arthur Pendelton dùng bữa tối một mình trong phòng ăn."
            },
            {
                time: "21:10",
                event: "Quản gia Thomas mang ly rượu vang lên phòng làm việc theo yêu cầu."
            },
            {
                time: "21:15",
                event: "Camera hành lang ghi nhận Victoria xuất hiện ở khu vực phòng làm việc."
            },
            {
                time: "21:45",
                event: "Đèn phòng làm việc đột ngột tắt."
            },
            {
                time: "22:17",
                event: "Phát hiện vụ án khi người hầu mang nước sáng vào phòng."
            }
        ],
        solution: {
            killer: "Victoria Pendelton",
            motive: "Tranh chấp tài sản và ly hôn",
            method: "Đầu độc Xyanua vào ly rượu vang và ngụy trang phòng khóa kín",
            keyEvidence: "Camera hành lang tầng 2 (clue_c3)"
        }
    },
    {
        caseId: "CASE-002",
        title: "CHIẾC ĐIỆN THOẠI BIẾN MẤT",
        difficulty: "MEDIUM",
        victim: {
            name: "Jessica Miller",
            age: 28,
            occupation: "Nhà báo điều tra",
            location: "Căn hộ 402, Chung cư Sunrise",
            timeOfDeath: "01:15 - 01:45",
            initialReport: "Nạn nhân bị tấn công trọng thương tại căn hộ riêng. Chiếc điện thoại chứa tài liệu điều tra tham nhũng đã biến mất không dấu vết."
        },
        suspects: [
            {
                id: "s2_1",
                name: "Mark Sterling",
                age: 34,
                occupation: "Giám đốc tài chính công ty TechCorp",
                relation: "Đối tượng bị điều tra",
                avatar: "👨‍💼",
                description: "Doanh nhân thành đạt nhưng có quá khứ bất hảo.",
                alibi: "Tôi đang dự tiệc công ty cùng 50 nhân chứng đến tận 03:00 sáng.",
                suspicionScore: 35,
                statements: [
                    { id: "st2_1_1", question: "Bạn ở đâu lúc xảy ra vụ án?", text: "Tôi đang dự tiệc công ty cùng 50 nhân chứng đến tận 03:00 sáng.", isLie: false },
                    { id: "st2_1_2", question: "Bạn có biết Jessica Miller không?", text: "Cô ta là nhà báo hay quấy rối tôi bằng mấy câu hỏi nhảm nhí.", isLie: false },
                    { id: "st2_1_3", question: "Bạn có đến gần khu chung cư không?", text: "Tôi chưa từng đặt chân đến khu Sunrise đó bao giờ.", isLie: true, contradictionId: "clue_2c2" }
                ]
            },
            {
                id: "s2_2",
                name: "Chloe Bennett",
                age: 26,
                occupation: "Đồng nghiệp / Phóng viên tập sự",
                relation: "Đồng nghiệp thân thiết",
                avatar: "👩‍💻",
                description: "Người luôn ghen tị với những bài báo độc quyền của Jessica.",
                alibi: "Tôi ở nhà biên tập bản thảo bài viết cho số báo tuần tới.",
                suspicionScore: 25,
                statements: [
                    { id: "st2_2_1", question: "Bạn ở đâu lúc xảy ra vụ án?", text: "Tôi ở nhà biên tập bản thảo bài viết cho số báo tuần tới.", isLie: true, contradictionId: "clue_2c3" },
                    { id: "st2_2_2", question: "Quan hệ với nạn nhân?", text: "Chúng tôi là bạn tốt, luôn hỗ trợ nhau trong nghề.", isLie: false }
                ]
            }
        ],
        clues: [
            {
                id: "clue_2c1",
                title: "Bản thảo bài báo dở dang",
                description: "Tố cáo sai phạm tài chính của Mark Sterling tại TechCorp.",
                location: "Bàn làm việc nạn nhân",
                importance: "CRITICAL",
                discovered: true,
                relatedSuspects: ["s2_1"]
            },
            {
                id: "clue_2c2",
                title: "Hóa đơn gửi xe tòa nhà Sunrise",
                description: "Xe hơi của Mark Sterling đỗ ở hầm gửi xe lúc 01:00 đêm.",
                location: "Bãi gửi xe chung cư",
                importance: "CRITICAL",
                discovered: false,
                relatedSuspects: ["s2_1"]
            },
            {
                id: "clue_2c3",
                title: "Tin nhắn đe dọa",
                description: "Gửi từ tài khoản ẩn danh của Chloe Bennett đòi mua lại tài liệu với giá cao.",
                location: "Laptop nạn nhân",
                importance: "IMPORTANT",
                discovered: false,
                relatedSuspects: ["s2_2"]
            }
        ],
        timeline: [
            {
                time: "23:30",
                event: "Jessica gọi điện cho tổng biên tập thông báo đã có bằng chứng thép."
            },
            {
                time: "01:00",
                event: "Xe của Mark Sterling xuất hiện tại hầm chung cư."
            },
            {
                time: "01:30",
                event: "Tiếng vật va đập mạnh phát ra từ căn hộ 402."
            },
            {
                time: "02:00",
                event: "Hàng xóm phát hiện cửa mở hé và báo cảnh sát."
            }
        ],
        solution: {
            killer: "Mark Sterling",
            motive: "Ngăn chặn bài báo vạch tội tham nhũng",
            method: "Đột nhập căn hộ trộm điện thoại và hành hung nạn nhân",
            keyEvidence: "Hóa đơn gửi xe tòa nhà Sunrise (clue_2c2)"
        }
    },
    {
        caseId: "CASE-003",
        title: "BÓNG NGƯỜI LÚC 02:13",
        difficulty: "HARD",
        victim: {
            name: "Professor Robert Vance",
            age: 65,
            occupation: "Nhà nghiên cứu khảo cổ học",
            location: "Phòng nghiên cứu viện bảo tàng lịch sử",
            timeOfDeath: "02:00 - 02:30",
            initialReport: "Nạn nhân bị sát hại bằng cổ vật dao găm đồng. Cổ vật vô giá trong tủ trưng bày đã biến mất."
        },
        suspects: [
            {
                id: "s3_1",
                name: "Daniel Vance",
                age: 38,
                occupation: "Con trai nuôi / Trợ lý bảo tàng",
                relation: "Con nuôi nạn nhân",
                avatar: "🧑",
                description: "Đang ngập trong nợ nần do cờ bạc và bất mãn vì không được thừa kế bộ sưu tập.",
                alibi: "Tôi ngủ lại phòng kho bảo tàng để kiểm kê cổ vật đến sáng.",
                suspicionScore: 50,
                statements: [
                    { id: "st3_1_1", question: "Bạn ở đâu lúc xảy ra vụ án?", text: "Tôi ngủ lại phòng kho bảo tàng để kiểm kê cổ vật đến sáng.", isLie: true, contradictionId: "clue_3c2" },
                    { id: "st3_1_2", question: "Quan hệ với nạn nhân?", text: "Cha nuôi luôn xem trọng công việc hơn tôi, nhưng tôi rất kính trọng ông.", isLie: false }
                ]
            },
            {
                id: "s3_2",
                name: "Elena Rostova",
                age: 32,
                occupation: "Nhà buôn cổ vật chợ đen",
                relation: "Đối tác bí mật của Daniel",
                avatar: "🕵️‍♀️",
                description: "Nữ thương gia quốc tế chuyên mua bán cổ vật trộm cắp.",
                alibi: "Tôi lưu trú tại khách sạn Grand Hotel trung tâm thành phố.",
                suspicionScore: 30,
                statements: [
                    { id: "st3_2_1", question: "Bạn ở đâu lúc xảy ra vụ án?", text: "Tôi lưu trú tại khách sạn Grand Hotel trung tâm thành phố.", isLie: false },
                    { id: "st3_2_2", question: "Bạn có gặp Daniel vào đêm đó không?", text: "Tôi không hề quen biết ai tên Daniel cả.", isLie: true, contradictionId: "clue_3c3" }
                ]
            }
        ],
        clues: [
            {
                id: "clue_3c1",
                title: "Con dao găm đồng dính máu",
                description: "Vũ khí gây án mang dấu vân tay bị nhòe một phần.",
                location: "Cạnh thi thể nạn nhân",
                importance: "CRITICAL",
                discovered: true,
                relatedSuspects: ["s3_1"]
            },
            {
                id: "clue_3c2",
                title: "Thẻ ra vào bảo tàng lúc 02:10",
                description: "Thẻ từ của Daniel Vance quét mở cửa phòng nghiên cứu lúc 02:10.",
                location: "Cổng điện tử bảo tàng",
                importance: "CRITICAL",
                discovered: false,
                relatedSuspects: ["s3_1"]
            },
            {
                id: "clue_3c3",
                title: "Hợp đồng mua bán cổ vật",
                description: "Thỏa thuận ngầm chuyển nhượng bảo vật giữa Daniel Vance và Elena Rostova.",
                location: "Tủ khóa cá nhân của Daniel",
                importance: "IMPORTANT",
                discovered: false,
                relatedSuspects: ["s3_1", "s3_2"]
            }
        ],
        timeline: [
            {
                time: "01:45",
                event: "Bảo vệ đi tuần tra tầng 1, mọi thứ bình thường."
            },
            {
                time: "02:10",
                event: "Hệ thống ghi nhận thẻ từ của Daniel Vance mở cửa phòng nghiên cứu."
            },
            {
                time: "02:15",
                event: "Tiếng động kính vỡ nhẹ phát ra từ khu trưng bày cổ vật."
            },
            {
                time: "02:40",
                event: "Bảo vệ phát hiện thi thể giáo sư Robert Vance."
            }
        ],
        solution: {
            killer: "Daniel Vance",
            motive: "Trộm cổ vật bán trả nợ và thù hận cá nhân",
            method: "Dùng thẻ từ đột nhập sát hại cha nuôi và ngụy vụ cướp",
            keyEvidence: "Thẻ ra vào bảo tàng lúc 02:10 (clue_3c2)"
        }
    }
];

const ACHIEVEMENTS_DATA = [
    { id: "ach_1", title: "🔍 MANH MỐI ĐẦU TIÊN", desc: "Khám phá ra manh mối đầu tiên trong vụ án.", unlocked: false },
    { id: "ach_2", title: "🧠 BẬC THẦY LOGIC", desc: "Phát hiện thành công 3 mâu thuẫn trong lời khai.", unlocked: false },
    { id: "ach_3", title: "🕵️ THÁM TỬ HOÀN HẢO", desc: "Phá án thành công với số điểm trên 900.", unlocked: false },
    { id: "ach_4", title: "⚡ PHÁ ÁN TỐC ĐỘ", desc: "Hoàn thành vụ án trong thời gian ngắn dưới 3 phút.", unlocked: false },
    { id: "ach_5", title: "👁️ ĐÔI MẮT DIỀU HÂU", desc: "Thu thập toàn bộ manh mối của một vụ án.", unlocked: false }
];

/* ==================================================
   GAME STATE MANAGEMENT
   ================================================== */
let gameState = {
    currentCaseIndex: 0,
    currentCase: null,
    discoveredClues: [],
    evidenceBoard: [],
    notes: [],
    suspectScores: {},
    timerSeconds: 0,
    timerInterval: null,
    gameCompleted: false,
    score: 0,
    completedCases: 0,
    successCases: 0,
    highScore: 0,
    achievements: ACHIEVEMENTS_DATA,
    settings: {
        sound: true,
        animation: true
    }
};

/* ==================================================
   WEB AUDIO API (SOUND SYSTEM)
   ================================================== */
const SoundSystem = {
    ctx: null,
    init() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        } catch(e) {
            console.log("Web Audio API not supported");
        }
    },
    play(type) {
        if (!gameState.settings.sound) return;
        if (!this.ctx) this.init();
        if (!this.ctx) return;

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        const now = this.ctx.currentTime;

        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else if (type === 'clue') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        } else if (type === 'success') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        } else if (type === 'error') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.setValueAtTime(150, now + 0.15);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    }
};

/* ==================================================
   INITIALIZATION & STORAGE
   ================================================== */
document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    initEventListeners();
    updateGlobalStatsUI();
    renderAchievements();
});

function saveGame() {
    localStorage.setItem('ai_tham_tu_save', JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem('ai_tham_tu_save');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            gameState = { ...gameState, ...data };
        } catch(e) {
            console.error("Lỗi load save data:", e);
        }
    }
}

function resetAllData() {
    if (confirm("Bạn có chắc muốn xóa toàn bộ tiến trình và thành tích?")) {
        localStorage.removeItem('ai_tham_tu_save');
        location.reload();
    }
}

/* ==================================================
   NAVIGATION & UI CONTROLLER
   ================================================== */
function initEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.nav-btn, .b-nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            SoundSystem.play('click');
            const targetId = btn.getAttribute('data-target');
            switchScreen(targetId);
        });
    });

    // Home menu buttons
    document.getElementById('btn-new-case').addEventListener('click', () => {
        SoundSystem.play('click');
        startNewCase(gameState.currentCaseIndex);
    });

    document.getElementById('btn-continue').addEventListener('click', () => {
        SoundSystem.play('click');
        if (!gameState.currentCase) {
            startNewCase(0);
        } else {
            switchScreen('screen-case');
            renderCurrentCase();
        }
    });

    document.getElementById('btn-random-case').addEventListener('click', () => {
        SoundSystem.play('click');
        const randomIdx = Math.floor(Math.random() * CASES_DATA.length);
        gameState.currentCaseIndex = randomIdx;
        startNewCase(randomIdx);
    });

    document.getElementById('btn-how-to-play').addEventListener('click', () => {
        SoundSystem.play('click');
        switchScreen('screen-howto');
    });

    document.getElementById('btn-achievements').addEventListener('click', () => {
        SoundSystem.play('click');
        switchScreen('screen-achievements');
    });

    document.getElementById('btn-settings').addEventListener('click', () => {
        SoundSystem.play('click');
        switchScreen('screen-settings');
    });

    document.getElementById('btn-back-home').addEventListener('click', () => {
        SoundSystem.play('click');
        switchScreen('screen-home');
    });

    document.getElementById('btn-close-howto').addEventListener('click', () => {
        SoundSystem.play('click');
        switchScreen('screen-home');
    });

    document.getElementById('btn-close-achievements').addEventListener('click', () => {
        SoundSystem.play('click');
        switchScreen('screen-home');
    });

    document.getElementById('btn-close-settings').addEventListener('click', () => {
        SoundSystem.play('click');
        switchScreen('screen-home');
    });

    // Settings toggles
    document.getElementById('setting-sound').addEventListener('change', (e) => {
        gameState.settings.sound = e.target.checked;
        saveGame();
    });

    document.getElementById('setting-animation').addEventListener('change', (e) => {
        gameState.settings.animation = e.target.checked;
        saveGame();
    });

    document.getElementById('btn-save-game-manual').addEventListener('click', () => {
        SoundSystem.play('click');
        saveGame();
        alert("Đã lưu tiến trình thành công!");
    });

    document.getElementById('btn-reset-case').addEventListener('click', () => {
        SoundSystem.play('click');
        if (confirm("Bạn muốn reset lại vụ án hiện tại?")) {
            startNewCase(gameState.currentCaseIndex);
        }
    });

    document.getElementById('btn-reset-all').addEventListener('click', () => {
        SoundSystem.play('click');
        resetAllData();
    });

    // Notes button
    document.getElementById('btn-add-note').addEventListener('click', () => {
        SoundSystem.play('click');
        addNewNote();
    });

    // Clue filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            SoundSystem.play('click');
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderClues(btn.getAttribute('data-filter'));
        });
    });

    // Modal close
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') closeModal();
    });
}

function switchScreen(screenId) {
    document.querySelectorAll('.game-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');

    // Render specific screen data
    if (screenId === 'screen-case') renderCurrentCase();
    if (screenId === 'screen-clues') renderClues('all');
    if (screenId === 'screen-suspects') renderSuspects();
    if (screenId === 'screen-timeline') renderTimeline();
    if (screenId === 'screen-interrogation') renderInterrogationList();
    if (screenId === 'screen-evidence') renderEvidenceBoard();
    if (screenId === 'screen-notes') renderNotes();
    if (screenId === 'screen-deduction') renderDeductionForm();

    window.scrollTo(0, 0);
}

function showMainNavigation(show) {
    const nav = document.getElementById('main-nav');
    const bNav = document.getElementById('bottom-nav');
    if (show) {
        nav.classList.remove('hidden');
        bNav.classList.remove('hidden');
    } else {
        nav.classList.add('hidden');
        bNav.classList.add('hidden');
    }
}

/* ==================================================
   GAME LOGIC & CASE ENGINE
   ================================================== */
function startNewCase(index) {
    gameState.currentCaseIndex = index;
    gameState.currentCase = JSON.parse(JSON.stringify(CASES_DATA[index]));
    gameState.discoveredClues = gameState.currentCase.clues.filter(c => c.discovered).map(c => c.id);
    gameState.evidenceBoard = [...gameState.discoveredClues];
    gameState.notes = [
        { id: 1, text: `Bắt đầu điều tra vụ: ${gameState.currentCase.title}` }
    ];
    gameState.suspectScores = {};
    gameState.currentCase.suspects.forEach(s => {
        gameState.suspectScores[s.id] = s.suspicionScore;
    });
    gameState.timerSeconds = 0;
    gameState.gameCompleted = false;

    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        if (!gameState.gameCompleted) {
            gameState.timerSeconds++;
            updateTimerDisplay();
        }
    }, 1000);

    showMainNavigation(true);
    switchScreen('screen-case');
    saveGame();
}

function updateTimerDisplay() {
    const mins = String(Math.floor(gameState.timerSeconds / 60)).padStart(2, '0');
    const secs = String(gameState.timerSeconds % 60).padStart(2, '0');
    const timerEl = document.getElementById('header-timer');
    if (timerEl) timerEl.textContent = `⏱️ ${mins}:${secs}`;
    
    const scoreEl = document.getElementById('header-score');
    if (scoreEl) scoreEl.textContent = `⭐ Điểm: ${gameState.score}`;
}

function updateGlobalStatsUI() {
    document.getElementById('stat-completed').textContent = gameState.completedCases;
    document.getElementById('stat-success').textContent = gameState.successCases;
    const rate = gameState.completedCases > 0 ? Math.round((gameState.successCases / gameState.completedCases) * 100) : 0;
    document.getElementById('stat-rate').textContent = `${rate}%`;
    document.getElementById('stat-highscore').textContent = gameState.highScore;
}

/* ==================================================
   RENDER: CASE SCREEN
   ================================================== */
function renderCurrentCase() {
    const c = gameState.currentCase;
    if (!c) return;

    const container = document.getElementById('case-details-content');
    let badgeClass = 'badge-easy';
    if (c.difficulty === 'MEDIUM') badgeClass = 'badge-medium';
    if (c.difficulty === 'HARD') badgeClass = 'badge-hard';

    container.innerHTML = `
        <div class="case-card">
            <span class="case-badge ${badgeClass}">${c.difficulty}</span>
            <h3>${c.caseId}: ${c.title}</h3>
            <p class="screen-desc">${c.victim.initialReport}</p>
            
            <div class="case-meta-grid">
                <div class="case-meta-item"><strong>Nạn nhân:</strong> ${c.victim.name} (${c.victim.age} tuổi)</div>
                <div class="case-meta-item"><strong>Nghề nghiệp:</strong> ${c.victim.occupation}</div>
                <div class="case-meta-item"><strong>Địa điểm:</strong> ${c.victim.location}</div>
                <div class="case-meta-item"><strong>Thời gian tử vong:</strong> ${c.victim.timeOfDeath}</div>
            </div>

            <div style="margin-top: 20px; display: flex; gap: 10px;">
                <button class="btn btn-primary" onclick="switchScreen('screen-clues')">🔍 Khám Phá Manh Mối</button>
                <button class="btn btn-secondary" onclick="switchScreen('screen-suspects')">👥 Thẩm Vấn Nghi Phạm</button>
            </div>
        </div>
    `;
}

/* ==================================================
   RENDER: CLUES SCREEN
   ================================================== */
function renderClues(filter = 'all') {
    const c = gameState.currentCase;
    if (!c) return;

    const container = document.getElementById('clues-grid-content');
    container.innerHTML = '';

    const filtered = c.clues.filter(clue => {
        if (filter === 'all') return true;
        return clue.importance.toLowerCase() === filter;
    });

    filtered.forEach(clue => {
        const isDiscovered = gameState.discoveredClues.includes(clue.id);
        const card = document.createElement('div');
        card.className = `clue-card ${!isDiscovered ? 'locked' : ''}`;
        
        let impColor = 'var(--accent-blue)';
        if (clue.importance === 'CRITICAL') impColor = 'var(--accent-red)';
        if (clue.importance === 'IMPORTANT') impColor = 'var(--accent-yellow)';

        card.innerHTML = `
            <div>
                <span class="importance-tag" style="color: ${impColor}">${clue.importance}</span>
                <h3 style="margin-bottom: 8px; font-size: 1.1rem;">${isDiscovered ? clue.title : '🔒 Manh mối ẩn'}</h3>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 10px;">
                    📍 Địa điểm: ${clue.location}
                </p>
                <p style="font-size: 0.9rem;">
                    ${isDiscovered ? clue.description : 'Bạn chưa khám phá ra manh mối này. Hãy tìm kiếm xung quanh hoặc từ lời khai nghi phạm.'}
                </p>
            </div>
            <div style="margin-top: 15px;">
                ${!isDiscovered ? 
                    `<button class="btn btn-sm btn-primary" onclick="discoverClueAction('${clue.id}')">[KHÁM PHÁ]</button>` :
                    `<span style="font-size: 0.8rem; color: var(--accent-green);">✔ Đã thu thập</span>`
                }
            </div>
        `;
        container.appendChild(card);
    });
}

function discoverClueAction(id) {
    SoundSystem.play('clue');
    if (!gameState.discoveredClues.includes(id)) {
        gameState.discoveredClues.push(id);
        if (!gameState.evidenceBoard.includes(id)) {
            gameState.evidenceBoard.push(id);
        }

        // Unlock achievement 1
        unlockAchievement('ach_1');
        
        // Check achievement 5
        if (gameState.discoveredClues.length === gameState.currentCase.clues.length) {
            unlockAchievement('ach_5');
        }

        saveGame();
        renderClues('all');
    }
}

/* ==================================================
   RENDER: SUSPECTS SCREEN
   ================================================== */
function renderSuspects() {
    const c = gameState.currentCase;
    if (!c) return;

    const container = document.getElementById('suspects-grid-content');
    container.innerHTML = '';

    c.suspects.forEach(suspect => {
        const score = gameState.suspectScores[suspect.id] || suspect.suspicionScore;
        let level = 'LOW';
        let color = 'var(--accent-green)';
        if (score > 25 && score <= 50) { level = 'MEDIUM'; color = 'var(--accent-yellow)'; }
        else if (score > 50 && score <= 75) { level = 'HIGH'; color = '#f97316'; }
        else if (score > 75) { level = 'CRITICAL'; color = 'var(--accent-red)'; }

        const card = document.createElement('div');
        card.className = 'suspect-card';
        card.innerHTML = `
            <div>
                <div class="suspect-header">
                    <div class="suspect-avatar">${suspect.avatar}</div>
                    <div class="suspect-info">
                        <h3>${suspect.name}</h3>
                        <p>${suspect.age} tuổi — ${suspect.occupation}</p>
                    </div>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 10px;">
                    Quan hệ: ${suspect.relation}
                </p>
                <p style="font-size: 0.9rem; margin-bottom: 10px;">
                    ${suspect.description}
                </p>
                <div class="suspicion-meter">
                    <div class="meter-label">
                        <span>Độ đáng ngờ:</span>
                        <span style="color: ${color}; font-weight: bold;">${score}% (${level})</span>
                    </div>
                    <div class="meter-bar">
                        <div class="meter-fill" style="width: ${score}%; background-color: ${color};"></div>
                    </div>
                </div>
            </div>
            <div style="margin-top: 15px;">
                <button class="btn btn-sm btn-secondary" style="width: 100%;" onclick="openSuspectModal('${suspect.id}')">[XEM HỒ SƠ]</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function openSuspectModal(suspectId) {
    SoundSystem.play('click');
    const suspect = gameState.currentCase.suspects.find(s => s.id === suspectId);
    if (!suspect) return;

    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 15px;">
            <div class="suspect-avatar" style="font-size: 2.5rem;">${suspect.avatar}</div>
            <div>
                <h3>${suspect.name}</h3>
                <p style="color: var(--text-secondary);">${suspect.occupation} (${suspect.age} tuổi)</p>
            </div>
        </div>
        <div style="margin-bottom: 15px;">
            <strong>Quan hệ với nạn nhân:</strong> ${suspect.relation}
        </div>
        <div style="margin-bottom: 15px;">
            <strong>Mô tả:</strong> ${suspect.description}
        </div>
        <div style="background-color: var(--bg-primary); padding: 12px; border-radius: 8px; margin-bottom: 15px;">
            <strong style="color: var(--accent-yellow);">Alibi (Lời khai ngoại phạm):</strong>
            <p style="font-style: italic; margin-top: 5px;">"${suspect.alibi}"</p>
        </div>
    `;
    document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
}

/* ==================================================
   RENDER: TIMELINE SCREEN
   ================================================== */
function renderTimeline() {
    const c = gameState.currentCase;
    if (!c) return;

    const container = document.getElementById('timeline-content');
    container.innerHTML = '';

    c.timeline.forEach((item, index) => {
        const ev = document.createElement('div');
        ev.className = 'timeline-event';
        ev.innerHTML = `
            <div class="timeline-time">⏰ ${item.time}</div>
            <div style="font-size: 0.95rem;">${item.event}</div>
        `;
        container.appendChild(ev);
    });
}

/* ==================================================
   RENDER: INTERROGATION SCREEN
   ================================================== */
function renderInterrogationList() {
    const c = gameState.currentCase;
    if (!c) return;

    const container = document.getElementById('interrogation-suspects-list');
    container.innerHTML = '';

    c.suspects.forEach(suspect => {
        const btn = document.createElement('button');
        btn.className = 'interrogate-select-btn';
        btn.innerHTML = `
            <span style="font-size: 1.5rem;">${suspect.avatar}</span>
            <div>
                <div style="font-weight: bold;">${suspect.name}</div>
                <small style="color: var(--text-secondary);">${suspect.relation}</small>
            </div>
        `;
        btn.onclick = () => {
            SoundSystem.play('click');
            document.querySelectorAll('.interrogate-select-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            startInterrogation(suspect.id);
        };
        container.appendChild(btn);
    });
}

function startInterrogation(suspectId) {
    const suspect = gameState.currentCase.suspects.find(s => s.id === suspectId);
    const room = document.getElementById('interrogation-room');

    room.innerHTML = `
        <div style="display: flex; gap: 10px; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; margin-bottom: 12px;">
            <span style="font-size: 2rem;">${suspect.avatar}</span>
            <div>
                <h3>Đang thẩm vấn: ${suspect.name}</h3>
                <p style="font-size: 0.8rem; color: var(--text-secondary);">Alibi: ${suspect.alibi}</p>
            </div>
        </div>
        <div class="dialogue-box" id="dialogue-box">
            <div class="dialogue-bubble suspect">
                Tôi đã nói mọi chuyện rồi. Các ông còn muốn hỏi gì nữa?
            </div>
        </div>
        <div class="dialogue-options" id="dialogue-options">
            <!-- Options will load here -->
        </div>
    `;

    renderDialogueOptions(suspect);
}

function renderDialogueOptions(suspect) {
    const optionsContainer = document.getElementById('dialogue-options');
    optionsContainer.innerHTML = '';

    suspect.statements.forEach(stmt => {
        const btn = document.createElement('button');
        btn.className = 'dialogue-option-btn';
        btn.textContent = `❓ ${stmt.question}`;
        btn.onclick = () => {
            SoundSystem.play('click');
            appendDialogue('detective', stmt.question);
            setTimeout(() => {
                appendDialogue('suspect', stmt.text);
                checkContradictionOpportunity(suspect, stmt);
            }, 400);
        };
        optionsContainer.appendChild(btn);
    });
}

function appendDialogue(sender, text) {
    const box = document.getElementById('dialogue-box');
    if (!box) return;
    const bubble = document.createElement('div');
    bubble.className = `dialogue-bubble ${sender}`;
    bubble.textContent = text;
    box.appendChild(bubble);
    box.scrollTop = box.scrollHeight;
}

function checkContradictionOpportunity(suspect, stmt) {
    const box = document.getElementById('dialogue-box');
    if (stmt.isLie) {
        const btn = document.createElement('button');
        btn.className = 'btn btn-warning btn-sm';
        btn.style.marginTop = '10px';
        btn.textContent = '[🔥 ĐỐI CHIẾU MANH MỐI / PHÁT HIỆN MÂU THUẪN]';
        btn.onclick = () => {
            SoundSystem.play('success');
            appendDialogue('detective', 'Lời khai của bạn mâu thuẫn với bằng chứng chúng tôi đang nắm giữ!');
            setTimeout(() => {
                appendDialogue('suspect', 'Được rồi... Chuyện đó... tôi không cố ý giấu giếm!');
                gameState.suspectScores[suspect.id] = Math.min(100, (gameState.suspectScores[suspect.id] || 20) + 30);
                gameState.score += 50;
                updateTimerDisplay();
                saveGame();
                btn.remove();

                // Discover related clue automatically
                if (stmt.contradictionId) {
                    discoverClueAction(stmt.contradictionId);
                }

                // Check achievement 2
                unlockAchievement('ach_2');
            }, 500);
        };
        box.appendChild(btn);
        box.scrollTop = box.scrollHeight;
    }
}

/* ==================================================
   RENDER: EVIDENCE BOARD SCREEN
   ================================================== */
function renderEvidenceBoard() {
    const c = gameState.currentCase;
    if (!c) return;

    const container = document.getElementById('evidence-board-content');
    container.innerHTML = '';

    gameState.evidenceBoard.forEach(id => {
        const clue = c.clues.find(cl => cl.id === id);
        if (!clue) return;

        const card = document.createElement('div');
        card.className = 'evidence-item-card';
        card.innerHTML = `
            <h3 style="font-size: 1rem; margin-bottom: 6px;">📌 ${clue.title}</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">📍 ${clue.location}</p>
            <p style="font-size: 0.9rem;">${clue.description}</p>
        `;
        container.appendChild(card);
    });
}

/* ==================================================
   RENDER: NOTES SCREEN
   ================================================== */
function renderNotes() {
    const container = document.getElementById('notes-container');
    container.innerHTML = '';

    gameState.notes.forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = `
            <textarea oninput="updateNoteText(${note.id}, this.value)">${note.text}</textarea>
            <div class="note-footer">
                <button class="btn btn-sm btn-danger" onclick="deleteNote(${note.id})">🗑️ Xóa</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function addNewNote() {
    const newId = Date.now();
    gameState.notes.push({ id: newId, text: "Ghi chú mới..." });
    saveGame();
    renderNotes();
}

function updateNoteText(id, text) {
    const note = gameState.notes.find(n => n.id === id);
    if (note) {
        note.text = text;
        saveGame();
    }
}

function deleteNote(id) {
    SoundSystem.play('click');
    gameState.notes = gameState.notes.filter(n => n.id !== id);
    saveGame();
    renderNotes();
}

/* ==================================================
   RENDER: FINAL DEDUCTION SCREEN & SCORING
   ================================================== */
function renderDeductionForm() {
    const c = gameState.currentCase;
    if (!c) return;

    const container = document.getElementById('deduction-form-container');
    
    if (gameState.gameCompleted) {
        container.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3 style="color: var(--accent-green); font-size: 1.8rem; margin-bottom: 10px;">🎉 VỤ ÁN ĐÃ HOÀN TẤT</h3>
                <p style="font-size: 1.1rem; margin-bottom: 20px;">${c.solution.killer} đã bị bắt giữ!</p>
                <div style="background-color: var(--bg-primary); padding: 15px; border-radius: 8px; text-align: left; max-width: 400px; margin: 0 auto 20px auto;">
                    <p><strong>Hung thủ:</strong> ${c.solution.killer}</p>
                    <p><strong>Động cơ:</strong> ${c.solution.motive}</p>
                    <p><strong>Phương thức:</strong> ${c.solution.method}</p>
                    <p><strong>Bằng chứng then chốt:</strong> ${c.solution.keyEvidence}</p>
                </div>
                <button class="btn btn-primary" onclick="startNewCase((gameState.currentCaseIndex + 1) % CASES_DATA.length)">Chuyển Vụ Án Tiếp Theo ➡</button>
            </div>
        `;
        return;
    }

    let suspectOptions = c.suspects.map(s => `<option value="${s.name}">${s.name} (${s.occupation})</option>`).join('');

    container.innerHTML = `
        <form id="deduction-form" onsubmit="submitDeduction(event)">
            <div class="form-group">
                <label>1. Chọn Hung Thủ Thực Sự:</label>
                <select class="form-control" id="deduce-killer" required>
                    <option value="">-- Chọn nghi phạm --</option>
                    ${suspectOptions}
                </select>
            </div>
            <div class="form-group">
                <label>2. Động Cơ Gây Án:</label>
                <input type="text" class="form-control" id="deduce-motive" placeholder="Nhập động cơ chính..." required>
            </div>
            <div class="form-group">
                <label>3. Phương Thức / Hung Khí:</label>
                <input type="text" class="form-control" id="deduce-method" placeholder="Phương thức thực hiện..." required>
            </div>
            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 10px;">[ĐƯA RA KẾT LUẬN VÀ PHÁ ÁN]</button>
        </form>
    `;
}

function submitDeduction(e) {
    e.preventDefault();
    const killer = document.getElementById('deduce-killer').value;
    const motive = document.getElementById('deduce-motive').value;
    const method = document.getElementById('deduce-method').value;

    const c = gameState.currentCase;
    const isCorrect = killer.toLowerCase() === c.solution.killer.toLowerCase();

    gameState.completedCases++;

    if (isCorrect) {
        SoundSystem.play('success');
        gameState.successCases++;
        gameState.gameCompleted = true;

        // Calculate score
        let baseScore = 800;
        let timePenalty = Math.min(300, gameState.timerSeconds * 2);
        let finalScore = Math.max(400, baseScore - timePenalty + (gameState.discoveredClues.length * 50));
        gameState.score = finalScore;

        if (gameState.score > gameState.highScore) {
            gameState.highScore = gameState.score;
        }

        unlockAchievement('ach_3');
        if (gameState.timerSeconds < 180) {
            unlockAchievement('ach_4');
        }

        alert(`🎯 KẾT LUẬN CHÍNH XÁC! Bạn đã phá án thành công với ${finalScore} điểm.`);
    } else {
        SoundSystem.play('error');
        gameState.gameCompleted = true;
        gameState.score = 200;
        alert(`❌ KẾT LUẬN SAI! Thủ phạm thực sự không phải là ${killer}. Vụ án khép lại với thất bại.`);
    }

    updateGlobalStatsUI();
    saveGame();
    renderDeductionForm();
}

/* ==================================================
   ACHIEVEMENTS SYSTEM
   ================================================== */
function unlockAchievement(id) {
    const ach = gameState.achievements.find(a => a.id === id);
    if (ach && !ach.unlocked) {
        ach.unlocked = true;
        saveGame();
        renderAchievements();
    }
}

function renderAchievements() {
    const container = document.getElementById('achievements-grid-content');
    if (!container) return;
    container.innerHTML = '';

    gameState.achievements.forEach(ach => {
        const card = document.createElement('div');
        card.className = `achievement-card ${ach.unlocked ? 'unlocked' : ''}`;
        card.innerHTML = `
            <div class="ach-icon">${ach.unlocked ? '🏆' : '🔒'}</div>
            <div>
                <h3 style="font-size: 1rem; margin-bottom: 4px;">${ach.title}</h3>
                <p style="font-size: 0.8rem; color: var(--text-secondary);">${ach.desc}</p>
            </div>
        `;
        container.appendChild(card);
    });
}