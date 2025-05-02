(function (global) {
  const KEY = "ceylonBurgers.session";

  function currentUser() {
    try {
      return JSON.parse(sessionStorage.getItem(KEY) || "null");
    } catch {
      return null;
    }
  }

  function setUser(user) {
    sessionStorage.setItem(KEY, JSON.stringify(user));
  }

  function logout() {
    sessionStorage.removeItem(KEY);
    location.href = "login.html";
  }

  function requireRole(...roles) {
    const user = currentUser();
    if (!user) {
      location.href = "login.html";
      return null;
    }
    if (roles.length && !roles.includes(user.role)) {
      location.href = user.role === "admin" ? "admin.html" : "pos.html";
      return null;
    }
    return user;
  }

  global.Auth = { currentUser, setUser, logout, requireRole };
})(window);
