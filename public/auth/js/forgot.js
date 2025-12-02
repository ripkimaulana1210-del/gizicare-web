document.getElementById("forgotForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok) {
        alert(data.message);
        window.location.href = `reset.html?email=${encodeURIComponent(email)}`;
    } else {
        alert(data.message);
    }
});
