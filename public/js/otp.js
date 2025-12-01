// isi email otomatis jika datang dari query
const params = new URLSearchParams(location.search);
const preEmail = params.get("email");
if (preEmail) document.getElementById("email").value = decodeURIComponent(preEmail);

document.getElementById("otpForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const otp = document.getElementById("otp").value.trim();

  try {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      window.location.href = "/login.html";
    } else {
      alert(data.message || "Gagal verifikasi");
    }
  } catch (err) {
    console.error(err);
    alert("Gagal terhubung ke server");
  }
});
