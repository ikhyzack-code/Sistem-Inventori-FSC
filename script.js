// Data Barang berdasarkan Borang Pengambilan FSC
const inventoryData = [
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

const historyData = [];

// Muat data awal ke dalam UI
document.addEventListener('DOMContentLoaded', () => {
    populateItemDropdowns();
    renderStockTable();
});

// Masukkan pilihan barang ke dalam Dropdown
function populateItemDropdowns() {
    const inSelect = document.getElementById('inItem');
    const outSelect = document.getElementById('outItem');

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

// Paparkan jadual stok
function renderStockTable() {
    const tbody = document.getElementById('stockTableBody');
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
document.getElementById('formStockIn').addEventListener('submit', function(e) {
    e.preventDefault();

    const inputter = document.getElementById('inInputter').value;
    const itemId = parseInt(document.getElementById('inItem').value);
    const qtyPack = parseInt(document.getElementById('inPack').value) || 0;
    const qtyCarton = parseInt(document.getElementById('inCarton').value) || 0;

    if (qtyPack === 0 && qtyCarton === 0) {
        alert('Sila masukkan sekurang-kurangnya 1 Pack atau Carton!');
        return;
    }

    const item = inventoryData.find(i => i.id === itemId);
    item.stockPack += qtyPack;
    item.stockCarton += qtyCarton;

    const totalPrice = (qtyPack * item.packPrice) + (qtyCarton * item.cartonPrice);

    // Tambah Rekod Sejarah
    addHistoryRecord({
        date: new Date().toLocaleString('ms-MY'),
        type: 'STOK IN',
        person: `${inputter} (Penginput)`,
        itemName: item.name,
        qty: `${qtyPack} Pack / ${qtyCarton} Carton`,
        totalPrice: totalPrice
    });

    renderStockTable();
    this.reset();
    alert('Stok In berjaya direkodkan!');
});

// Pengendali Borang Stok OUT
document.getElementById('formStockOut').addEventListener('submit', function(e) {
    e.preventDefault();

    const applicant = document.getElementById('outApplicant').value;
    const matric = document.getElementById('outMatric').value;
    const kiosk = document.getElementById('outKiosk').value;
    const itemId = parseInt(document.getElementById('outItem').value);
    const qtyPack = parseInt(document.getElementById('outPack').value) || 0;
    const qtyCarton = parseInt(document.getElementById('outCarton').value) || 0;

    if (qtyPack === 0 && qtyCarton === 0) {
        alert('Sila masukkan sekurang-kurangnya 1 Pack atau Carton!');
        return;
    }

    const item = inventoryData.find(i => i.id === itemId);

    // Semakan Baki Stok
    if (qtyPack > item.stockPack || qtyCarton > item.stockCarton) {
        alert(`Stok tidak mencukupi! Baki semasa: ${item.stockPack} Pack, ${item.stockCarton} Carton.`);
        return;
    }

    item.stockPack -= qtyPack;
    item.stockCarton -= qtyCarton;

    const totalPrice = (qtyPack * item.packPrice) + (qtyCarton * item.cartonPrice);

    const personDetail = `${applicant} ${matric ? '(' + matric + ')' : ''} ${kiosk ? '[' + kiosk + ']' : ''}`;

    // Tambah Rekod Sejarah
    addHistoryRecord({
        date: new Date().toLocaleString('ms-MY'),
        type: 'STOK OUT',
        person: personDetail,
        itemName: item.name,
        qty: `${qtyPack} Pack / ${qtyCarton} Carton`,
        totalPrice: totalPrice
    });

    renderStockTable();
    this.reset();
    alert('Stok Out (Pengambilan) berjaya direkodkan!');
});

// Paparkan Sejarah Transaksi
function addHistoryRecord(record) {
    historyData.unshift(record);
    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = '';

    historyData.forEach(rec => {
        const row = document.createElement('tr');
        const badgeClass = rec.type === 'STOK IN' ? 'badge-in' : 'badge-out';
        row.innerHTML = `
            <td>${rec.date}</td>
            <td><span class="${badgeClass}">${rec.type}</span></td>
            <td>${rec.person}</td>
            <td>${rec.itemName}</td>
            <td>${rec.qty}</td>
            <td>RM ${rec.totalPrice.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });
}

// Fungsi Muat Turun ke Excel (.xlsx)
document.getElementById('exportBtn').addEventListener('click', function() {
    if (historyData.length === 0) {
        alert('Tiada sebarang rekod transaksi untuk dimuat turun buat masa ini.');
        return;
    }

    // Ubah format data untuk Excel
    const excelData = historyData.map(item => ({
        "Tarikh & Masa": item.date,
        "Jenis Transaksi": item.type,
        "Penginput / Pemohon": item.person,
        "Nama Barang": item.itemName,
        "Kuantiti": item.qty,
        "Jumlah Harga (RM)": item.totalPrice.toFixed(2)
    }));

    // Buat worksheet dan workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Log Transaksi");

    // Simpan fail dengan nama Laporan_Inventori_FSC.xlsx
    XLSX.writeFile(workbook, "Laporan_Inventori_FSC.xlsx");
});