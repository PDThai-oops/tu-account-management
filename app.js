// ==========================================
// CONFIGURATION & SETUP
// ==========================================

// Supabase Credentials
// Đổi các thông số bên dưới thành URL & ANON_KEY từ dự án Supabase thực tế của bạn
const SUPABASE_URL = "https://PDThai-oops's Project.supabase.co";
const SUPABASE_ANON_KEY = "bzyzhsobkctmwqoohrkw";

// Administrative Security Key (Khóa truy cập quản trị secret)
const ADMIN_SECRET_KEY = "CTU2026AdminSecret"; 

// Local Fallback Mock Data (Dùng khi chưa kết nối Supabase thực tế)
let mockAccounts = [
    {
        id: "1",
        mssv: "B2605470",
        fullName: "Phạm Minh Thông",
        email: "thongb2605470@student.ctu.edu.vn",
        class_name: "Công nghệ thông tin K48",
        status: "Đã phê duyệt",
        created_at: "2026-10-01"
    },
    {
        id: "2",
        mssv: "B2605464",
        fullName: "Phạm Duy Thái",
        email: "thaib2605464@student.ctu.edu.vn",
        class_name: "Kỹ thuật Phần mềm K48",
        status: "Đã phê duyệt",
        created_at: "2026-10-02"
    },
    {
        id: "3",
        mssv: "B2601234",
        fullName: "Nguyen Van A",
        email: "nguyenb2601234@student.ctu.edu.vn",
        class_name: "Hệ thống thông tin K48",
        status: "Chờ xử lý",
        created_at: "2026-10-10"
    }
];

// Initialize Supabase Client if configured
let supabase = null;
try {
    if (SUPABASE_URL && !SUPABASE_URL.includes("YOUR_SUPABASE")) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase client initialized.");
    } else {
        console.warn("Đang chạy ở chế độ Mock Local Data. Hãy cấu hình SUPABASE_URL & SUPABASE_ANON_KEY.");
    }
} catch (e) {
    console.error("Lỗi khởi tạo Supabase:", e);
}

// State
let isAdminAuthenticated = false;

// ==========================================
// PUBLIC SEARCH LOGIC
// ==========================================

async function handleSearch() {
    const emailInput = document.getElementById('studentEmail').value.trim().toLowerCase();
    const resultBox = document.getElementById('searchResult');
    resultBox.classList.remove('hidden');

    // Email Domain Validation (@student.ctu.edu.vn)
    if (!emailInput.endsWith('@student.ctu.edu.vn')) {
        resultBox.innerHTML = `
            <div class="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start space-x-3 fade-in">
                <i class="fa-solid fa-circle-exclamation text-lg mt-0.5"></i>
                <div>
                    <p class="font-semibold">Email không hợp lệ!</p>
                    <p class="text-xs mt-0.5">Vui lòng nhập đúng định dạng Gmail sinh viên Đại học Cần Thơ (kết thúc bằng <code class="bg-red-100 px-1 rounded">@student.ctu.edu.vn</code>).</p>
                </div>
            </div>
        `;
        return;
    }

    resultBox.innerHTML = `
        <div class="p-4 text-center text-slate-500 text-sm">
            <i class="fa-solid fa-spinner fa-spin text-blue-600 mr-2"></i> Đang truy vấn dữ liệu đám mây...
        </div>
    `;

    let student = null;

    // Fetch from Supabase or Fallback Mock Data
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('accounts')
                .select('*')
                .eq('email', emailInput)
                .single();
            if (!error && data) student = data;
        } catch (err) {
            console.error("Supabase Query Error:", err);
        }
    } else {
        // Mock query
        student = mockAccounts.find(acc => acc.email.toLowerCase() === emailInput);
    }

    // Render result
    if (student) {
        let badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
        let statusIcon = "fa-circle-check text-emerald-600";

        if (student.status !== "Đã phê duyệt") {
            badgeColor = "bg-amber-100 text-amber-800 border-amber-200";
            statusIcon = "fa-clock text-amber-600";
        }

        resultBox.innerHTML = `
            <div class="p-5 bg-blue-50/60 border border-blue-200 rounded-2xl fade-in space-y-3">
                <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold px-3 py-1 rounded-full border ${badgeColor}">
                        <i class="fa-solid ${statusIcon} mr-1"></i> ${student.status}
                    </span>
                    <span class="text-xs text-slate-400 font-mono">MSSV: ${student.mssv || 'N/A'}</span>
                </div>
                <div>
                    <h4 class="text-lg font-bold text-slate-900">${student.fullName || student.full_name}</h4>
                    <p class="text-sm text-slate-600"><i class="fa-regular fa-envelope mr-1 text-slate-400"></i> ${student.email}</p>
                    ${student.class_name ? `<p class="text-xs text-slate-500 mt-1"><i class="fa-solid fa-graduation-cap mr-1 text-slate-400"></i> Lớp/Ngành: ${student.class_name}</p>` : ''}
                </div>
                <div class="pt-2 border-t border-blue-100 text-[11px] text-slate-500 flex justify-between">
                    <span>Xác thực hệ thống CTU Online</span>
                    <span>Cập nhật mới nhất</span>
                </div>
            </div>
        `;
    } else {
        resultBox.innerHTML = `
            <div class="p-5 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-sm fade-in space-y-2">
                <div class="flex items-center gap-2 font-semibold">
                    <i class="fa-solid fa-triangle-exclamation text-amber-600"></i> Chưa tìm thấy dữ liệu tài khoản
                </div>
                <p class="text-xs text-amber-700">Email <span class="font-mono font-bold">${emailInput}</span> chưa được cấp quyền hoặc đang trong quá trình phê duyệt bởi ban quản trị.</p>
            </div>
        `;
    }
}

// ==========================================
// ADMIN AUTHENTICATION & CONTROL
// ==========================================

document.getElementById('adminAccessBtn').addEventListener('click', () => {
    if (isAdminAuthenticated) {
        showAdminSection();
    } else {
        document.getElementById('authModal').classList.remove('hidden');
        document.getElementById('authModal').classList.add('flex');
    }
});

function closeAuthModal() {
    document.getElementById('authModal').classList.add('hidden');
    document.getElementById('authModal').classList.remove('flex');
    document.getElementById('authError').classList.add('hidden');
    document.getElementById('adminKeyInput').value = '';
}

function verifyAdminKey() {
    const inputKey = document.getElementById('adminKeyInput').value.trim();
    const errorEl = document.getElementById('authError');

    if (inputKey === ADMIN_SECRET_KEY) {
        isAdminAuthenticated = true;
        closeAuthModal();
        showAdminSection();
    } else {
        errorEl.textContent = "Khóa quản trị (Admin Key) không chính xác!";
        errorEl.classList.remove('hidden');
    }
}

function showAdminSection() {
    document.getElementById('searchSection').classList.add('hidden');
    document.getElementById('adminSection').classList.remove('hidden');
    loadAccounts();
}

function logoutAdmin() {
    isAdminAuthenticated = false;
    document.getElementById('adminSection').classList.add('hidden');
    document.getElementById('searchSection').classList.remove('hidden');
}

// ==========================================
// ADMIN DASHBOARD CRUD OPERATIONS
// ==========================================

async function loadAccounts() {
    const tbody = document.getElementById('accountsTableBody');
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-400"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Đang tải danh sách...</td></tr>`;

    let dataList = [];

    if (supabase) {
        try {
            const { data, error } = await supabase.from('accounts').select('*').order('created_at', { ascending: false });
            if (!error && data) {
                dataList = data;
            }
        } catch (e) {
            console.error("Lỗi kết nối Supabase:", e);
        }
    }

    if (dataList.length === 0) {
        dataList = mockAccounts; // Sử dụng mock data nếu Supabase chưa có dữ liệu
    }

    renderTable(dataList);
    updateStats(dataList);
}

function renderTable(list) {
    const tbody = document.getElementById('accountsTableBody');
    tbody.innerHTML = '';

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-400">Chưa có dữ liệu sinh viên nào.</td></tr>`;
        return;
    }

    list.forEach(item => {
        const id = item.id;
        const mssv = item.mssv || '---';
        const name = item.fullName || item.full_name || 'N/A';
        const email = item.email;
        const className = item.class_name || 'Chưa cập nhật';
        const status = item.status || 'Chờ xử lý';

        let badgeStyle = "bg-emerald-100 text-emerald-800";
        if (status === "Chờ xử lý") badgeStyle = "bg-amber-100 text-amber-800";
        if (status === "Tạm khóa") badgeStyle = "bg-red-100 text-red-800";

        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50 transition border-b border-slate-100";
        tr.innerHTML = `
            <td class="py-3 px-4 font-mono font-medium text-slate-800">${mssv}</td>
            <td class="py-3 px-4 font-medium text-slate-900">${name}</td>
            <td class="py-3 px-4 text-xs font-mono text-slate-600">${email}</td>
            <td class="py-3 px-4 text-xs">${className}</td>
            <td class="py-3 px-4">
                <span class="text-[11px] font-semibold px-2.5 py-1 rounded-full ${badgeStyle}">${status}</span>
            </td>
            <td class="py-3 px-4 text-center space-x-1">
                <button onclick="editAccount('${id}')" class="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition" title="Chỉnh sửa">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button onclick="deleteAccount('${id}')" class="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition" title="Xóa">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateStats(list) {
    document.getElementById('statTotal').textContent = list.length;
    document.getElementById('statActive').textContent = list.filter(a => a.status === 'Đã phê duyệt').length;
    document.getElementById('statPending').textContent = list.filter(a => a.status !== 'Đã phê duyệt').length;
}

function filterAdminTable() {
    const query = document.getElementById('adminSearchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#accountsTableBody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
}

// MODAL ACCOUNT HANDLERS
function openAddModal() {
    document.getElementById('modalTitle').textContent = "Thêm Tài Khoản Mới";
    document.getElementById('editAccountId').value = "";
    document.getElementById('accountForm').reset();
    document.getElementById('accountModal').classList.remove('hidden');
    document.getElementById('accountModal').classList.add('flex');
}

function closeAccountModal() {
    document.getElementById('accountModal').classList.add('hidden');
    document.getElementById('accountModal').classList.remove('flex');
}

function editAccount(id) {
    const item = mockAccounts.find(a => a.id == id);
    if (!item) return;

    document.getElementById('modalTitle').textContent = "Chỉnh Sửa Tài Khoản";
    document.getElementById('editAccountId').value = item.id;
    document.getElementById('inputMssv').value = item.mssv || "";
    document.getElementById('inputFullName').value = item.fullName || item.full_name || "";
    document.getElementById('inputEmail').value = item.email || "";
    document.getElementById('inputClass').value = item.class_name || "";
    document.getElementById('inputStatus').value = item.status || "Đã phê duyệt";

    document.getElementById('accountModal').classList.remove('hidden');
    document.getElementById('accountModal').classList.add('flex');
}

async function saveAccount() {
    const id = document.getElementById('editAccountId').value;
    const mssv = document.getElementById('inputMssv').value.trim();
    const fullName = document.getElementById('inputFullName').value.trim();
    const email = document.getElementById('inputEmail').value.trim().toLowerCase();
    const className = document.getElementById('inputClass').value.trim();
    const status = document.getElementById('inputStatus').value;

    const accountData = {
        mssv,
        full_name: fullName,
        fullName,
        email,
        class_name: className,
        status,
        created_at: new Date().toISOString().split('T')[0]
    };

    if (supabase) {
        try {
            if (id) {
                await supabase.from('accounts').update(accountData).eq('id', id);
            } else {
                await supabase.from('accounts').insert([accountData]);
            }
        } catch (e) {
            console.error("Supabase Save Error:", e);
        }
    }

    // Local state sync
    if (id) {
        const idx = mockAccounts.findIndex(a => a.id == id);
        if (idx !== -1) mockAccounts[idx] = { ...mockAccounts[idx], ...accountData };
    } else {
        accountData.id = Date.now().toString();
        mockAccounts.unshift(accountData);
    }

    closeAccountModal();
    loadAccounts();
}

async function deleteAccount(id) {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này khỏi hệ thống?")) return;

    if (supabase) {
        try {
            await supabase.from('accounts').delete().eq('id', id);
        } catch (e) {
            console.error("Supabase Delete Error:", e);
        }
    }

    mockAccounts = mockAccounts.filter(a => a.id != id);
    loadAccounts();
}
