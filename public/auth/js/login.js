document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      // Simpan user di localStorage (opsional)
      localStorage.setItem("gizi_user", JSON.stringify(data.user));
      window.location.href = "/";
    } else {
      alert(data.message || "Login gagal");
    }
  } catch (err) {
    console.error(err);
    alert("Gagal terhubung ke server");
  }
});
