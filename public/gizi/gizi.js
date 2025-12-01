document.getElementById("giziForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        nama: document.getElementById("nama").value,
        jenis_kelamin: document.getElementById("jenis_kelamin").value,
        usia_bulan: document.getElementById("usia_bulan").value,
        berat_badan: document.getElementById("berat_badan").value,
        tinggi_badan: document.getElementById("tinggi_badan").value,
        lingkar_kepala: document.getElementById("lingkar_kepala").value || null
    };

    const res = await fetch("/api/gizi/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    alert(result.message);

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
        </tr>
      </thead>
      <tbody>
  `;

    records.forEach(item => {

        // Warna label status
        let color =
            item.status_gizi === "Gizi Kurang" ? "red"
                : item.status_gizi === "Risiko Obesitas" ? "orange"
                    : "green";

        table += `
      <tr>
        <td>${item.nama}</td>
        <td>${item.jenis_kelamin}</td>
        <td>${item.usia_bulan}</td>
        <td>${item.berat_badan}</td>
        <td>${item.tinggi_badan}</td>
        <td>${item.lingkar_kepala ?? "-"}</td>
        <td><strong style="color:${color}">${item.status_gizi}</strong></td>
      </tr>
    `;
    });

    table += `</tbody></table>`;
    container.innerHTML = table;
}

loadData();
