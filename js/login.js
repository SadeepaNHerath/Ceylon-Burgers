(function () {
  const existing = Auth.currentUser();
  if (existing) {
    location.href = existing.role === "admin" ? "admin.html" : "pos.html";
    return;
  }

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const error = document.getElementById("error");
    error.hidden = true;
    const data = new FormData(e.target);
    try {
      const user = Store.login(data.get("username"), data.get("password"));
      Auth.setUser(user);
      location.href = user.role === "admin" ? "admin.html" : "pos.html";
    } catch (err) {
      error.textContent = err.message;
      error.hidden = false;
    }
  });
})();
