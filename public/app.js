// REGISTER
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    name: name.value,
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value
  };

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  alert(data.message || data.error);
});

// LOGIN
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    email: email.value,
    password: password.value,
  };

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (data.token) {
    alert("Login berhasil!");
    localStorage.setItem("token", data.token);
    window.location.href = "index.html"; 
  } else {
    alert(data.error);
  }
});
