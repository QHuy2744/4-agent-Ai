const agentDetails = {
    planner: {
        name: "Planner Agent",
        role: "Kiến trúc sư & Lập kế hoạch hệ thống",
        description: "Planner là bộ óc chiến lược của hệ thống. Agent này nhận các yêu cầu thô từ người dùng, phân tích sâu sắc các khía cạnh kỹ thuật, sau đó lập ra bản kế hoạch chi tiết từng bước (.bangiao/ke-hoach.md). Điều này đảm bảo mọi bước tiếp theo đều có hướng đi rõ ràng, hạn chế tối đa sai sót.",
        responsibilities: [
            "Phân tích yêu cầu gốc từ người dùng",
            "Xác định cấu trúc file cần tạo/sửa",
            "Lập kế hoạch chi tiết từng bước cho Coder",
            "Định hướng kiến trúc và công nghệ sử dụng"
        ],
        tools: ["Markdown", "Phân tích ngữ nghĩa", "Hệ thống Prompting"]
    },
    coder: {
        name: "Coder Agent",
        role: "Lập trình viên & Phát triển mã nguồn",
        description: "Coder là người hiện thực hóa bản vẽ của Planner thành mã nguồn thực tế. Với khả năng viết code chuẩn xác, sạch sẽ và tuân thủ tuyệt đối quy ước codebase, Coder tạo ra các trang web, tính năng hoặc sửa lỗi một cách nhanh chóng.",
        responsibilities: [
            "Đọc và tuân thủ tuyệt đối file kế hoạch",
            "Viết mã nguồn HTML, CSS, JavaScript chuẩn xác",
            "Áp dụng các pattern chuẩn từ codebase",
            "Bàn giao kết quả hoàn thiện cho Tester/Reviewer"
        ],
        tools: ["HTML5", "CSS3 (Flexbox/Grid)", "JavaScript (ES6+)"]
    },
    reviewer: {
        name: "Reviewer Agent",
        role: "Chuyên gia Kiểm định & Soát xét Mã nguồn",
        description: "Reviewer đóng vai trò như một Senior Developer kiểm tra chất lượng code. Agent này soi xét kỹ lưỡng từng dòng code do Coder tạo ra để đảm bảo không có lỗi logic, mã nguồn tối ưu, không thừa thãi và tuân thủ các tiêu chuẩn bảo mật.",
        responsibilities: [
            "Soát xét toàn bộ thay đổi mã nguồn",
            "Phát hiện các lỗ hổng hoặc điểm chưa tối ưu",
            "Kiểm tra việc tuân thủ phạm vi kế hoạch",
            "Đưa ra đánh giá khách quan và đề xuất cải tiến"
        ],
        tools: ["Code Analysis", "Security Scanner", "Best Practices Validator"]
    },
    tester: {
        name: "Tester Agent",
        role: "Kỹ sư Kiểm thử & Đảm bảo Chất lượng (QA)",
        description: "Tester là chốt chặn cuối cùng trước khi sản phẩm đến tay người dùng. Agent này thực hiện kiểm tra giao diện, tính tương thích trên các thiết bị di động/máy tính, thử nghiệm các tính năng tương tác và xác thực mọi thứ hoạt động hoàn hảo.",
        responsibilities: [
            "Kiểm tra giao diện UI/UX trên nhiều kích thước màn hình",
            "Thử nghiệm các tính năng tương tác (Modal, Button, Animation)",
            "Xác nhận sản phẩm đáp ứng đúng yêu cầu gốc",
            "Báo cáo kết quả kiểm thử và nghiệm thu"
        ],
        tools: ["UI Testing", "Responsive Checker", "Interactive Validator"]
    }
};

function openModal(agentKey) {
    const modal = document.getElementById('agentModal');
    const modalBody = document.getElementById('modalBody');
    const data = agentDetails[agentKey];

    if (!data) return;

    modalBody.innerHTML = `
        <div class="modal-body-content">
            <h3>${data.name}</h3>
            <div class="role">${data.role}</div>
            <p>${data.description}</p>
            <h4>Trách nhiệm chính:</h4>
            <ul>
                ${data.responsibilities.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <h4>Công nghệ / Công cụ:</h4>
            <div class="agent-skills">
                ${data.tools.map(tool => `<span>${tool}</span>`).join('')}
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('agentModal');
    modal.style.display = 'none';
}

// Đóng modal khi click ra ngoài vùng nội dung
window.onclick = function(event) {
    const modal = document.getElementById('agentModal');
    if (event.target === modal) {
        closeModal();
    }
}
