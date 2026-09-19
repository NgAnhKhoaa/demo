// Địa chỉ API backend
const API_URL = '/api/students';

// Biến lưu danh sách sinh viên hiện tại (để biết đang sửa hay thêm)
let editingId = null;

// ==================== KHỞI ĐỘNG ====================
// Khi trang load xong → gọi API lấy danh sách sinh viên
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
});

// Bắt sự kiện nhấn Enter trong ô tìm kiếm
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchStudents();
});

// ==================== 1. LẤY DANH SÁCH ====================
async function loadStudents(keyword = '') {
    try {
        const url = keyword ? `${API_URL}?keyword=${encodeURIComponent(keyword)}` : API_URL;
        const response = await fetch(url);

        if (!response.ok) throw new Error('Không thể tải danh sách');

        const students = await response.json();
        renderTable(students);
    } catch (error) {
        showToast('Lỗi: ' + error.message, 'error');
    }
}

// ==================== 2. TÌM KIẾM ====================
function searchStudents() {
    const keyword = document.getElementById('searchInput').value.trim();
    loadStudents(keyword);
}

// ==================== 3. HIỂN THỊ BẢNG ====================
function renderTable(students) {
    const tbody = document.getElementById('studentTable');
    const emptyMsg = document.getElementById('emptyMsg');

    if (!students || students.length === 0) {
        tbody.innerHTML = '';
        emptyMsg.style.display = 'block';
        return;
    }

    emptyMsg.style.display = 'none';
    tbody.innerHTML = students.map((s, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><strong>${s.studentCode}</strong></td>
            <td>${s.fullName}</td>
            <td>${s.email}</td>
            <td>${s.phone || '-'}</td>
            <td>${s.className || '-'}</td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-warning" onclick="openEditModal('${s.id}')">Sửa</button>
                    <button class="btn btn-danger" onclick="deleteStudent('${s.id}', '${s.fullName}')">Xóa</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ==================== 4. MỞ MODAL THÊM ====================
function openAddModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Thêm sinh viên';
    document.getElementById('studentId').value = '';
    document.getElementById('studentCode').value = '';
    document.getElementById('fullName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('className').value = '';
    document.getElementById('studentModal').classList.add('active');
}

// ==================== 5. MỞ MODAL SỬA ====================
async function openEditModal(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Không tìm thấy sinh viên');

        const s = await response.json();
        editingId = s.id;
        document.getElementById('modalTitle').textContent = 'Sửa sinh viên';
        document.getElementById('studentId').value = s.id;
        document.getElementById('studentCode').value = s.studentCode;
        document.getElementById('fullName').value = s.fullName;
        document.getElementById('email').value = s.email;
        document.getElementById('phone').value = s.phone || '';
        document.getElementById('className').value = s.className || '';
        document.getElementById('studentModal').classList.add('active');
    } catch (error) {
        showToast('Lỗi: ' + error.message, 'error');
    }
}

// ==================== 6. ĐÓNG MODAL ====================
function closeModal() {
    document.getElementById('studentModal').classList.remove('active');
    editingId = null;
}

// ==================== 7. LƯU (THÊM HOẶC SỬA) ====================
async function saveStudent() {
    // Lấy dữ liệu từ form
    const student = {
        studentCode: document.getElementById('studentCode').value.trim(),
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        className: document.getElementById('className').value.trim()
    };

    // Validate đơn giản
    if (!student.studentCode || !student.fullName || !student.email) {
        showToast('Vui lòng nhập đầy đủ Mã SV, Họ tên, Email', 'error');
        return;
    }

    try {
        let response;
        if (editingId) {
            // SỬA: PUT /api/students/{id}
            response = await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });
        } else {
            // THÊM: POST /api/students
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(student)
            });
        }

        if (!response.ok) throw new Error('Lưu thất bại');

        showToast(editingId ? 'Cập nhật thành công!' : 'Thêm thành công!', 'success');
        closeModal();
        loadStudents();
    } catch (error) {
        showToast('Lỗi: ' + error.message, 'error');
    }
}

// ==================== 8. XÓA ====================
async function deleteStudent(id, name) {
    if (!confirm(`Bạn có chắc muốn xóa sinh viên "${name}"?`)) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Xóa thất bại');

        showToast('Đã xóa thành công!', 'success');
        loadStudents();
    } catch (error) {
        showToast('Lỗi: ' + error.message, 'error');
    }
}

// ==================== 9. HIỂN THỊ THÔNG BÁO ====================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}