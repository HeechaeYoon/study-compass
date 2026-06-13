import type { Result, SavedResult } from "../types";

export const STORAGE_KEY = "srl-coach-result-v1";

const canUseStorage = () => typeof window !== "undefined" && Boolean(window.localStorage);

export function loadSavedResults(): SavedResult[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && item.version === "1.0.0");
  } catch {
    return [];
  }
}

export function persistSavedResults(results: SavedResult[]) {
  if (!canUseStorage()) {
    throw new Error("이 브라우저에서는 저장 기능을 사용할 수 없습니다.");
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

export function createSavedResult(
  result: Result,
  memo = "",
  includeMemoInPrompt = false,
): SavedResult {
  const savedAt = new Date().toISOString();
  return {
    ...result,
    version: "1.0.0",
    memo,
    includeMemoInPrompt,
    savedAt,
  };
}

export function saveResult(result: Result, memo = "", includeMemoInPrompt = false) {
  const saved = createSavedResult(result, memo, includeMemoInPrompt);
  const current = loadSavedResults();
  persistSavedResults([saved, ...current].slice(0, 10));
  return saved;
}

export function deleteSavedResult(savedAt: string) {
  const current = loadSavedResults();
  persistSavedResults(current.filter((result) => result.savedAt !== savedAt));
}

export function clearSavedResults() {
  persistSavedResults([]);
}
