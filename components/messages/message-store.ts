"use client";
import { useSyncExternalStore } from "react";
import { contacts, initialConversations, isConversationList, validateMessage, type Conversation } from "@/data/messages";
const key = "dabang-messages-v1", eventName = "dabang-messages-change";
let rawCache: string | null | undefined;
let cache = initialConversations;
function snapshot() {
  try {
    const raw = localStorage.getItem(key);
    if (raw === rawCache) return cache;
    rawCache = raw;
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return cache = isConversationList(parsed) ? parsed : initialConversations;
  } catch { return cache = initialConversations; }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback); window.addEventListener(eventName, callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener(eventName, callback); };
}
export function useMessages() { return useSyncExternalStore(subscribe, snapshot, () => initialConversations); }
function persist(threads: Conversation[]) {
  try { localStorage.setItem(key, JSON.stringify(threads)); }
  catch { throw new Error("Your browser could not save this change. Check local storage permissions or available space and try again."); }
  window.dispatchEvent(new Event(eventName));
}
export function updateConversation(id: string, changes: Partial<Pick<Conversation, "unread" | "starred" | "archived" | "draft">>) {
  persist(snapshot().map((thread) => thread.id === id ? { ...thread, ...changes } : thread));
}
export function replyToConversation(id: string, body: string) {
  const error = validateMessage(body); if (error) throw new Error(error);
  const threads = snapshot();
  const thread = threads.find((t) => t.id === id);
  if (!thread) throw new Error("This conversation is no longer available.");
  if (thread.archived) throw new Error("Restore this conversation before replying.");
  persist(threads.map((t) => t.id === id ? { ...t, draft: "", unread: false, messages: [...t.messages, { id: crypto.randomUUID(), author: "you", body: body.trim(), createdAt: new Date().toISOString() }] } : t));
}
export function createConversation(contactId: string, subject: string, body: string) {
  if (!contacts.some((c) => c.id === contactId)) throw new Error("Choose a demo contact.");
  if (!subject.trim() || subject.trim().length > 120) throw new Error("Enter a subject between 1 and 120 characters.");
  const error = validateMessage(body); if (error) throw new Error(error);
  const id = crypto.randomUUID();
  persist([{ id, contactId, subject: subject.trim(), unread: false, starred: false, archived: false, draft: "", messages: [{ id: crypto.randomUUID(), body: body.trim(), author: "you", createdAt: new Date().toISOString() }] }, ...snapshot()]);
  return id;
}
