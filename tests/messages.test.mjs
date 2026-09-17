import assert from "node:assert/strict";
import test from "node:test";
import { initialConversations, filterConversations, isConversationList, validateMessage } from "../data/messages.ts";
test("folders distinguish unread, starred, and archived conversations", () => {
  assert.equal(filterConversations(initialConversations, "Inbox", "").length, 5);
  assert.equal(filterConversations(initialConversations, "Unread", "").length, 3);
  assert.equal(filterConversations(initialConversations, "Starred", "").length, 2);
  assert.equal(filterConversations(initialConversations, "Archived", "").length, 1);
  const read = initialConversations.map((t) => ({ ...t, unread: false }));
  assert.equal(filterConversations(read, "Unread", "").length, 0);
});
test("search matches contacts, subjects, and message content", () => {
  assert.equal(filterConversations(initialConversations, "Inbox", " OLIVIA ")[0].id, "thread-1");
  assert.equal(filterConversations(initialConversations, "Inbox", "payment pending")[0].contactId, "drew");
  assert.equal(filterConversations(initialConversations, "Inbox", "no match").length, 0);
});
test("stored conversations reject malformed contacts and message dates", () => {
  assert.ok(isConversationList(initialConversations));
  assert.equal(isConversationList([{ ...initialConversations[0], contactId: "missing" }]), false);
  assert.equal(isConversationList([{ ...initialConversations[0], messages: [] }]), false);
  assert.equal(isConversationList([initialConversations[0], initialConversations[0]]), false);
  assert.equal(isConversationList([{ ...initialConversations[0], messages: [{ ...initialConversations[0].messages[0], createdAt: "invalid" }] }]), false);
});
test("blank and oversized replies are rejected", () => {
  assert.ok(validateMessage("   "));
  assert.ok(validateMessage("x".repeat(4001)));
  assert.equal(validateMessage(" Thanks for your help. "), null);
});
