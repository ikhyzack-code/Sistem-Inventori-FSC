// Data Barang berdasarkan Borang Pengambilan FSC
let inventoryData = JSON.parse(localStorage.getItem('inventoryDataFSC')) || [
    { id: 1, name: "Fried Chicken (Hot Spicy) - Rib", category: "Bahan Mentah", packPrice: 101.70, cartonPrice: 305.10, stockPack: 0, stockCarton: 0 },
    { id: 2, name: "Fried Chicken (Original) - Rib", category: "Bahan Mentah", packPrice: 101.70, cartonPrice: 305.10, stockPack: 0, stockCarton: 0 },
    { id: 3, name: "Korean Fried Chicken", category: "Bahan Mentah", packPrice: 0, cartonPrice: 0, stockPack: 0, stockCarton: 0 },
    { id: 4, name: "Chicken Nugget", category: "Bahan Mentah", packPrice: 29.95, cartonPrice: 299.50, stockPack: 0, stockCarton: 0 },
    { id: 5, name: "Crispy Finger", category: "Bahan Mentah", packPrice: 31.00, cartonPrice: 310.00, stockPack: 0, stockCarton: 0 },
    { id: 6, name: "Popcorn (Original)", category: "Bahan Mentah", packPrice: 39.75, cartonPrice: 397.50, stockPack: 0, stockCarton: 0 },
    { id: 7, name: "Popcorn Jumbo (Tom Yam)", category: "Bahan Mentah", packPrice: 0, cartonPrice: 0, stockPack: 0, stockCarton: 0 },
    { id: 8, name: "Chicken Roll (Dim Sum)", category: "Bahan Mentah", packPrice: 33.10, cartonPrice: 331.00, stockPack: 0, stockCarton: 0 },
    { id: 9, name: "Black Pepper Sausage", category: "Bahan Mentah", packPrice: 37.90, cartonPrice: 379.00, stockPack: 0, stockCarton: 0 },
    { id: 10, name: "Cheese Sausage", category: "Bahan Mentah", packPrice: 37.90, cartonPrice: 379.00, stockPack: 0, stockCarton: 0 },
    { id: 11, name: "Smoked Cocktail", category: "Bahan Mentah", packPrice: 37.83, cartonPrice: 378.30, stockPack: 0, stockCarton: 0 },
    { id: 12, name: "Cheese Cocktail", category: "Bahan Mentah", packPrice: 37.83, cartonPrice: 378.30, stockPack: 0, stockCarton: 0 },
    { id: 13, name: "Corn Roll (Cheese)", category: "Bahan Mentah", packPrice: 0, cartonPrice: 0, stockPack: 0, stockCarton: 0 },
    { id: 14, name: "Sweet Chilli (1kg)", category: "Sos/Aksesori", packPrice: 7.00, cartonPrice: 0, stockPack: 0, stockCarton: 0 },
    { id: 15, name: "Mayonnaise (1kg)", category: "Sos/Aksesori", packPrice: 12.00, cartonPrice: 0, stockPack: 0, stockCarton: 0 }
];

let historyData = JSON.parse(localStorage.getItem('historyDataFSC')) || [];

// Fungsi Custom Alert (Menggantikan alert() biasa)
function customAlert(message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('customModal');
        const title = document.getElementById('modalTitle');
        const msg = document.getElementById('modalMessage');
        const okBtn = document.getElementById('modalOkBtn');
        const cancelBtn = document.getElementById('modalCancelBtn');

        title.textContent = "Sistem Inventori FSC";
        msg.textContent = message;
        cancelBtn.style.display = 'none';
        modal.style.display = 'flex';

        okBtn.onclick = function() {
            modal.style.display = 'none';
            resolve(true);
        };
    });
}

// Fungsi Custom Confirm (Menggantikan confirm() biasa)
function customConfirm(message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('customModal');
        const title = document.getElementById('modalTitle');
        const msg = document.getElementById('modalMessage');
        const okBtn = document.getElementById('modalOkBtn');
        const cancelBtn = document.getElementById('modalCancelBtn');

        title.textContent = "Sistem Inventori FSC";
        msg.textContent = message;
        cancelBtn.style.display = 'inline-block';
        modal.style.display = 'flex';

        okBtn.onclick = function() {
            modal.style.display = 'none';
            resolve(true);
        };

        cancelBtn.onclick = function() {
            modal.style.display = 'none';
            resolve(false);
        };
    });
}

// Muat data awal ke dalam UI
document.addEventListener('DOMContentLoaded', () => {
    populateItemDropdowns();
    renderStockTable();
    renderHistoryTable();
    
    // Pasang fungsi butang padam log
    const deleteBtn = document.getElementById('deleteSelectedHistoryBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteSelectedHistory);
    }

    // Pasang fungsi Select All checkbox log
    const selectAll = document.getElementById('selectAllHistory');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.historyCheckbox');
            checkboxes.forEach(cb => cb.checked = selectAll.checked);
        });
    }
});

// Simpan data ke localStorage
function saveToLocalStorage() {
    localStorage.setItem('inventoryDataFSC', JSON.stringify(inventoryData));
    localStorage.setItem('historyDataFSC', JSON.stringify(historyData));
}

// Masukkan pilihan barang ke dalam Dropdown
function populateItemDropdowns() {
    const inSelect = document.getElementById('inItem');
    const outSelect = document.getElementById('outItem');

    if (!inSelect || !outSelect) return;

    inSelect.innerHTML = '<option value="">-- Pilih Barang --</option>';
    outSelect.innerHTML = '<option value="">-- Pilih Barang --</option>';

    inventoryData.forEach(item => {
        const optionIn = document.createElement('option');
        optionIn.value = item.id;
        optionIn.textContent = `${item.name} (${item.category})`;
        inSelect.appendChild(optionIn);

        const optionOut = document.createElement('option');
        optionOut.value = item.id;
        optionOut.textContent = `${item.name} (${item.category})`;
        outSelect.appendChild(optionOut);
    });
}

// Paparkan Jadual Stok Semasa
function renderStockTable() {
    const tbody = document.getElementById('stockTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    inventoryData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td><strong>${item.name}</strong></td>
            <td>${item.category}</td>
            <td>${item.packPrice > 0 ? 'RM ' + item.packPrice.toFixed(2) : '-'}</td>
            <td>${item.cartonPrice > 0 ? 'RM ' + item.cartonPrice.toFixed(2) : '-'}</td>
            <td>${item.stockPack}</td>
            <td>${item.stockCarton}</td>
        `;
        tbody.appendChild(row);
    });
}

// Pengendali Borang Stok IN
const formStockIn = document.getElementById('formStockIn');
if (formStockIn) {
    formStockIn.addEventListener('submit', async function(e) {
        e.preventDefault();

        const inputter = document.getElementById('inInputter').value;
        const itemId = parseInt(document.getElementById('inItem').value);
        const qtyPack = parseInt(document.getElementById('inPack').value) || 0;
        const qtyCarton = parseInt(document.getElementById('inCarton').value) || 0;

        if (!itemId) {
            await customAlert('Sila pilih barang terlebih dahulu!');
            return;
        }

        if (qtyPack === 0 && qtyCarton === 0) {
            await customAlert('Sila masukkan sekurang-kurangnya 1 Pack atau Carton!');
            return;
        }

        const item = inventoryData.find(i => i.id === itemId);
        item.stockPack += qtyPack;
        item.stockCarton += qtyCarton;

        const totalPrice = (qtyPack * item.packPrice) + (qtyCarton * item.cartonPrice);

        historyData.unshift({
            date: new Date().toLocaleString('ms-MY'),
            type: 'STOK IN',
            person: `${inputter} (Penginput)`,
            itemId: item.id,
            itemName: item.name,
            qtyPack: qtyPack,
            qtyCarton: qtyCarton,
            qty: `${qtyPack} Pack / ${qtyCarton} Carton`,
            totalPrice: totalPrice
        });

        saveToLocalStorage();
        renderStockTable();
        renderHistoryTable();
        this.reset();
        await customAlert('Stok In berjaya direkodkan!');
    });
}

// Pengendali Borang Stok OUT
const formStockOut = document.getElementById('formStockOut');
if (formStockOut) {
    formStockOut.addEventListener('submit', async function(e) {
        e.preventDefault();

        const applicant = document.getElementById('outApplicant').value;
        const matric = document.getElementById('outMatric').value;
        const kiosk = document.getElementById('outKiosk').value;
        const itemId = parseInt(document.getElementById('outItem').value);
        const qtyPack = parseInt(document.getElementById('outPack').value) || 0;
        const qtyCarton = parseInt(document.getElementById('outCarton').value) || 0;

        if (!itemId) {
            await customAlert('Sila pilih barang terlebih dahulu!');
            return;
        }

        if (qtyPack === 0 && qtyCarton === 0) {
            await customAlert('Sila masukkan sekurang-kurangnya 1 Pack atau Carton!');
            return;
        }

        const item = inventoryData.find(i => i.id === itemId);

        if (qtyPack > item.stockPack || qtyCarton > item.stockCarton) {
            await customAlert(`Stok tidak mencukupi! Baki semasa: ${item.stockPack} Pack, ${item.stockCarton} Carton.`);
            return;
        }

        item.stockPack -= qtyPack;
        item.stockCarton -= qtyCarton;

        const totalPrice = (qtyPack * item.packPrice) + (qtyCarton * item.cartonPrice);
        const personDetail = `${applicant} ${matric ? '(' + matric + ')' : ''} ${kiosk ? '[' + kiosk + ']' : ''}`;

        historyData.unshift({
            date: new Date().toLocaleString('ms-MY'),
            type: 'STOK OUT',
            person: personDetail,
            itemId: item.id,
            itemName: item.name,
            qtyPack: qtyPack,
            qtyCarton: qtyCarton,
            qty: `${qtyPack} Pack / ${qtyCarton} Carton`,
            totalPrice: totalPrice
        });

        saveToLocalStorage();
        renderStockTable();
        renderHistoryTable();
        this.reset();
        await customAlert('Stok Out (Pengambilan) berjaya direkodkan!');
    });
}

// Paparkan Jadual Sejarah dengan Checkbox
function renderHistoryTable() {
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    historyData.forEach((rec, index) => {
        const row = document.createElement('tr');
        const badgeClass = rec.type === 'STOK IN' ? 'badge-in' : 'badge-out';
        row.innerHTML = `
            <td style="text-align: center;"><input type="checkbox" class="historyCheckbox" data-index="${index}"></td>
            <td>${rec.date}</td>
            <td><span class="${badgeClass}">${rec.type}</span></td>
            <td>${rec.person}</td>
            <td>${rec.itemName}</td>
            <td>${rec.qty}</td>
            <td>RM ${rec.totalPrice.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });

    const selectAllHistory = document.getElementById('selectAllHistory');
    if (selectAllHistory) selectAllHistory.checked = false;
}

// Fungsi Utama: Padam Log & Auto-Reverse Stok
async function deleteSelectedHistory() {
    const checkedBoxes = document.querySelectorAll('.historyCheckbox:checked');

    if (checkedBoxes.length === 0) {
        await customAlert('Sila tandakan (pilih) sekurang-kurangnya satu rekod log yang hendak dipadam!');
        return;
    }

    const confirmDelete = await customConfirm(`Adakah anda pasti mahu memadam ${checkedBoxes.length} rekod log transaksi yang dipilih? Baki stok semasa akan dilaraskan semula.`);
    if (!confirmDelete) return;

    const indexesToDelete = Array.from(checkedBoxes)
        .map(cb => parseInt(cb.getAttribute('data-index')))
        .sort((a, b) => b - a);

    indexesToDelete.forEach(index => {
        const record = historyData[index];
        
        if (record && record.itemId) {
            const item = inventoryData.find(i => i.id === record.itemId);

            if (item) {
                if (record.type === 'STOK IN') {
                    item.stockPack -= (record.qtyPack || 0);
                    item.stockCarton -= (record.qtyCarton || 0);

                    if (item.stockPack < 0) item.stockPack = 0;
                    if (item.stockCarton < 0) item.stockCarton = 0;
                } else if (record.type === 'STOK OUT') {
                    item.stockPack += (record.qtyPack || 0);
                    item.stockCarton += (record.qtyCarton || 0);
                }
            }
        }

        historyData.splice(index, 1);
    });

    saveToLocalStorage();
    renderStockTable();
    renderHistoryTable();
    await customAlert('Log transaksi berjaya dipadam dan baki stok semasa telah dikemas kini.');
}

// Fungsi Muat Turun ke Excel (.xlsx)
const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
    exportBtn.addEventListener('click', async function() {
        if (historyData.length === 0) {
            await customAlert('Tiada sebarang rekod transaksi untuk dimuat turun buat masa ini.');
            return;
        }

        const excelData = historyData.map(item => ({
            "Tarikh & Masa": item.date,
            "Jenis Transaksi": item.type,
            "Penginput / Pemohon": item.person,
            "Nama Barang": item.itemName,
            "Kuantiti": item.qty,
            "Jumlah Harga (RM)": item.totalPrice.toFixed(2)
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Log Transaksi");

        XLSX.writeFile(workbook, "Laporan_Inventori_FSC.xlsx");
    });
}