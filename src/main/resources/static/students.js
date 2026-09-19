const API_URL = '/api/students';

// ==================== KHỞI ĐỘNG ====================
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();

    // Nhấn Enter trong ô tìm kiếm → tìm luôn
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchStudents();
    });
});

// ==================== 1. LẤY DANH SÁCH ====================
async function loadStudents(keyword = '') {
    try {
        const url = keyword ? `${API_URL}?keyword=${encodeURIComponent(keyword)}` : API_URL;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Không thể tải danh sách');
        const students = await res.json();
        renderTable(students);
    } catch (err) {
        alert('Lỗi: ' + err.message);
    }
}

// ==================== 2. TÌM KIẾM ====================
function searchStudents() {
    const keyword = document.getElementById('searchInput').value.trim();
    loadStudents(keyword);
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    loadStudents();
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
    tbody.innerHTML = students.map(s => `
        <tr>
            <td><strong>${s.studentCode}</strong></td>
            <td>${s.fullName}</td>
            <td>${s.email}</td>
            <td>${s.phone || ''}</td>
            <td>${s.className || ''}</td>
            <td>
                <button class="btn btn-warning" onclick="openEditModal('${s.id}')">Sửa</button>
                <button class="btn btn-danger" onclick="deleteStudent('${s.id}', '${s.fullName}')">Xóa</button>
            </td>
        </tr>
    `).join('');
}

// ==================== 4. THÊM SINH VIÊN ====================
async function addStudent() {
    const student = {
        studentCode: document.getElementById('studentCode').value.trim(),
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        className: document.getElementById('className').value.trim()
    };

    // Validate
    if (!student.studentCode || !student.fullName || !student.email) {
        alert('Vui lòng nhập Mã SV, Họ tên và Email!');
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student)
        });

        if (!res.ok) throw new Error('Thêm thất bại');

        alert('Thêm sinh viên thành công!');
        resetAddForm();
        loadStudents();
    } catch (err) {
        alert('Lỗi: ' + err.message);
    }
}

function resetAddForm() {
    document.getElementById('studentCode').value = '';
    document.getElementById('fullName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('className').value = '';
}

// ==================== 5. MỞ MODAL SỬA ====================
async function openEditModal(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error('Không tìm thấy sinh viên');

        const s = await res.json();
        document.getElementById('editId').value = s.id;
        document.getElementById('editStudentCode').value = s.studentCode;
        document.getElementById('editFullName').value = s.fullName;
        document.getElementById('editEmail').value = s.email;
        document.getElementById('editPhone').value = s.phone || '';
        document.getElementById('editClassName').value = s.className || '';
        document.getElementById('editModal').classList.add('active', 'show');
    } catch (err) {
        alert('Lỗi: ' + err.message);
    }
}

function closeEditModal() {
    document.getElementById('editModal').classList.remove('active', 'show');
}

// ==================== 6. CẬP NHẬT SINH VIÊN ====================
async function updateStudent() {
    const id = document.getElementById('editId').value;
    const student = {
        studentCode: document.getElementById('editStudentCode').value.trim(),
        fullName: document.getElementById('editFullName').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        className: document.getElementById('editClassName').value.trim()
    };

    if (!student.studentCode || !student.fullName || !student.email) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student)
        });

        if (!res.ok) throw new Error('Cập nhật thất bại');

        alert('Cập nhật thành công!');
        closeEditModal();
        loadStudents();
    } catch (err) {
        alert('Lỗi: ' + err.message);
    }
}

// ==================== 7. XÓA SINH VIÊN ====================
async function deleteStudent(id, name) {
    if (!confirm(`Bạn có chắc muốn xóa sinh viên "${name}"?`)) return;

    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Xóa thất bại');

        alert('Đã xóa thành công!');
        loadStudents();
    } catch (err) {
        alert('Lỗi: ' + err.message);
    }
}