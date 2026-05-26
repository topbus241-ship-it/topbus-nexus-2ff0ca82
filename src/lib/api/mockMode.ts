export const MOCK_MODE_KEY = "appbus-mock-mode";

export function isMockModeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MOCK_MODE_KEY) === "on";
}

export function setMockMode(enabled: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCK_MODE_KEY, enabled ? "on" : "off");
  window.dispatchEvent(new CustomEvent("appbus-mock-mode-change", { detail: { enabled } }));
}
