// DUMMY auth API — the backend has no login/register endpoints yet.
// =============================================================
// Accounts live in localStorage. Functions are async (like a real API),
// so when the backend endpoints exist only this file has to change.

// ---------- Storage keys ----------
const USERS_KEY = "demoUsers";
const TOKEN_KEY = "token"; // read by routes/ProtectedRoute.jsx
const SESSION_KEY = "currentUser";

// ---------- Seed account (shown on the Login page) ----------
export const DEMO_ACCOUNT = { name: "Sarita", email: "sarita@demo.com", password: "admin123" };

// ---------- Helpers ----------
const fakeNetworkDelay = () => new Promise((resolve) => setTimeout(resolve, 400));
const sameEmail = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

const readAccounts = () => readJson(USERS_KEY, [DEMO_ACCOUNT]);

// ---------- Public API ----------
export const authApi = {
  async login({ email, password }) {
    await fakeNetworkDelay();
    const account = readAccounts().find((a) => sameEmail(a.email, email) && a.password === password);
    if (!account) throw new Error("Invalid email or password");

    const session = { name: account.name, email: account.email };
    localStorage.setItem(TOKEN_KEY, `demo-token-${Date.now()}`);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async register({ name, email, password }) {
    await fakeNetworkDelay();
    const accounts = readAccounts();
    if (accounts.some((a) => sameEmail(a.email, email))) {
      throw new Error("An account with this email already exists");
    }
    localStorage.setItem(USERS_KEY, JSON.stringify([...accounts, { name, email, password }]));
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: () => readJson(SESSION_KEY, null),
};
