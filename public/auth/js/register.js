document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  if (!username || !email || !password || !confirmPassword) {
    alert("Semua field wajib diisi");
    return;
  }

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, confirmPassword })
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      // arahkan ke halaman OTP
      window.location.href = `otp.html?email=${encodeURIComponent(email)}`;
    } else {
      alert(data.message || "Terjadi kesalahan");
    }
  } catch (err) {
    console.error(err);
    alert("Gagal terhubung ke server");
  }
});
