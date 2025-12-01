let editId = null;

document.getElementById("giziForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        nama: nama.value,
        jenis_kelamin: jenis_kelamin.value,
        usia_bulan: usia_bulan.value,
        berat_badan: berat_badan.value,
        tinggi_badan: tinggi_badan.value,
        lingkar_kepala: lingkar_kepala.value || null
    };

    const url = editId ? `/api/gizi/update/${editId}` : "/api/gizi/add";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    alert((await res.json()).message);

    editId = null;
    document.querySelector("button[type='submit']").innerText = "Simpan";
    e.target.reset();
    loadData();
});


async function loadData() {
    const res = await fetch("/api/gizi/list");
    const records = await res.json();

    const container = document.getElementById("dataList");

    if (records.length === 0) {
        container.innerHTML = "<p style='text-align:center;color:gray;'>Belum ada data tersimpan</p>";
        return;
    }

    let table = `
    <table class="gizi-table">
      <thead>
        <tr>
          <th>Nama</th>
          <th>JK</th>
          <th>Usia (bln)</th>
          <th>Berat (kg)</th>
          <th>Tinggi (cm)</th>
          <th>Lingkar Kepala</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
  `;

    records.forEach(item => {
        let color = item.status_gizi === "Gizi Kurang" ? "red" :
                    item.status_gizi === "Risiko Obesitas" ? "orange" : "green";

        table += `
        <tr>
        <td>${item.nama}</td>
        <td>${item.jenis_kelamin}</td>
        <td>${item.usia_bulan}</td>
        <td>${item.berat_badan}</td>
        <td>${item.tinggi_badan}</td>
        <td>${item.lingkar_kepala ?? "-"}</td>
        <td style="color:${color}; font-weight:bold">${item.status_gizi}</td>
        <td>
            <button class="edit-btn" onclick="editData(${item.id})">✏ Edit</button>
            <button class="delete-btn" onclick="deleteData(${item.id})">🗑 Hapus</button>
        </td>
        </tr>`;
    });

    table += `</tbody></table>`;
    container.innerHTML = table;
}

loadData();


// =========================
//  FUNGSI EDIT
// =========================
function editData(id) {
    fetch(`/api/gizi/get/${id}`)
        .then(res => res.json())
        .then(data => {

            editId = id;

            document.getElementById("nama").value = data.nama;
            document.getElementById("jenis_kelamin").value = data.jenis_kelamin;
            document.getElementById("usia_bulan").value = data.usia_bulan;
            document.getElementById("berat_badan").value = data.berat_badan;
            document.getElementById("tinggi_badan").value = data.tinggi_badan;
            document.getElementById("lingkar_kepala").value = data.lingkar_kepala ?? "";

            document.querySelector("button[type='submit']").innerText = "Update Data";
        });
}


// =========================
//  FUNGSI DELETE (FIXED)
// =========================
function deleteData(id) {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    fetch(`/api/gizi/delete/${id}`, { method: "DELETE" })
        .then(res => res.json())
        .then(msg => {
            alert(msg.message);
            loadData();
        });
}
