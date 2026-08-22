const USER_KEY = "cc_users";
const CURRENT_USER_KEY = "cc_current_user";

function getUsers() {
  return JSON.parse(localStorage.getItem(USER_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USER_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

function setCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = "login.html";
}

function isValidChitkaraEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();

  return (
    normalizedEmail.endsWith("@chitkara.edu.in") ||
    normalizedEmail.endsWith("@chitkarauniversity.edu.in")
  );
}

function requireLogin() {
  const user = getCurrentUser();

  if (!user) {
    window.location.href = "login.html?next=lost-found.html#add";
    return false;
  }

  return true;
}