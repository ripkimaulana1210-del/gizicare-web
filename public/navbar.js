document.addEventListener("DOMContentLoaded", () => {
  const authButton = document.getElementById("auth-button");
  const isLoggedIn = !!localStorage.getItem("token");

  if (isLoggedIn) {
    authButton.innerHTML = `
      <button class="nav-login" id="logoutBtn">Keluar</button>
    `;

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "index.html";
    });
  } else {
    authButton.innerHTML = `
      <a href="auth/login.html" class="nav-login">Masuk</a>
    `;
  }
});
