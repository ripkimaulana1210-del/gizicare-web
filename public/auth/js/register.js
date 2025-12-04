console.log("Register.js loaded!");

document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm").value.trim();

  if (!username || !email || !password || !confirmPassword) {
    alert("Semua field wajib diisi!");
    return;
  }

  if (password !== confirmPassword) {
    alert("Konfirmasi sandi tidak cocok!");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, confirmPassword })
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      window.location.href = `/auth/verify.html?email=${encodeURIComponent(email)}`;
    } else {
      alert(data.message || "Terjadi kesalahan server");
    }
  } catch (err) {
    console.error(err);
    alert("Tidak dapat terhubung ke server!");
  }
});
