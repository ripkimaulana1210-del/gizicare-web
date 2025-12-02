document.getElementById("resetForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = new URLSearchParams(window.location.search).get("email");
    const otp = document.getElementById("otp").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();

    const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword })
    });

    const data = await res.json();

    if (res.ok) {
        alert("Password berhasil direset!");
        window.location.href = "login.html";
    } else {
        alert(data.message);
    }
});
