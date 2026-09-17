export type Message = { id: string; body: string; author: "contact" | "you"; createdAt: string };
export type Conversation = { id: string; contactId: string; subject: string; unread: boolean; starred: boolean; archived: boolean; draft: string; messages: Message[] };
export type InboxFolder = "Inbox" | "Unread" | "Starred" | "Archived";
export const contacts = [
  { id: "olivia", name: "Olivia Rhye", email: "olivia.rhye@example.com", role: "Customer", color: "purple" },
  { id: "phoenix", name: "Phoenix Baker", email: "phoenix.baker@example.com", role: "Customer", color: "blue" },
  { id: "lana", name: "Lana Steiner", email: "lana.steiner@example.com", role: "Sales team", color: "pink" },
  { id: "demi", name: "Demi Wilkinson", email: "demi.wilkinson@example.com", role: "Customer", color: "peach" },
  { id: "drew", name: "Drew Cano", email: "drew.cano@example.com", role: "Customer", color: "green" },
  { id: "natali", name: "Natali Craig", email: "natali.craig@example.com", role: "Sales team", color: "purple" },
];
export const initialConversations: Conversation[] = [
  { id: "thread-1", contactId: "olivia", subject: "A question about order #DB-1048", unread: false, starred: true, archived: false, draft: "", messages: [
    { id: "m1", author: "contact", body: "Hi! I placed an order for the Home Decor Range and Bathroom Essentials. Could you confirm when it will be ready to ship?", createdAt: "2026-09-10T08:30:00Z" },
    { id: "m2", author: "you", body: "Hi Olivia, thanks for reaching out! Your payment has been received and the order is being prepared. Standard delivery takes 3–5 business days after dispatch.", createdAt: "2026-09-10T08:42:00Z" },
    { id: "m3", author: "contact", body: "That’s great, thank you! Please keep me updated when it’s on the way.", createdAt: "2026-09-10T09:05:00Z" },
  ] },
  { id: "thread-2", contactId: "phoenix", subject: "Delivery update for my order", unread: true, starred: false, archived: false, draft: "", messages: [{ id: "m4", author: "contact", body: "Hello, I can see my order has shipped. Where can I check the delivery details?", createdAt: "2026-09-10T08:55:00Z" }] },
  { id: "thread-3", contactId: "lana", subject: "September product recommendations", unread: true, starred: true, archived: false, draft: "", messages: [{ id: "m5", author: "contact", body: "The Home Decor Range is performing well this month. Could we review the stock levels before the next campaign?", createdAt: "2026-09-10T08:10:00Z" }] },
  { id: "thread-4", contactId: "demi", subject: "Thanks for the quick delivery", unread: false, starred: false, archived: false, draft: "", messages: [{ id: "m6", author: "contact", body: "My smartwatch arrived today. Everything looks great. Thank you for your help!", createdAt: "2026-09-09T16:20:00Z" }] },
  { id: "thread-5", contactId: "drew", subject: "Help completing my payment", unread: true, starred: false, archived: false, draft: "", messages: [{ id: "m7", author: "contact", body: "My order still says payment pending. Could you help me understand the next step?", createdAt: "2026-09-09T14:15:00Z" }] },
  { id: "thread-6", contactId: "natali", subject: "Weekly sales review", unread: false, starred: false, archived: true, draft: "", messages: [{ id: "m8", author: "contact", body: "Thanks for sharing the report. We have everything we need for the weekly review.", createdAt: "2026-09-08T11:00:00Z" }, { id: "m9", author: "you", body: "You’re welcome, Natali. Glad it helped!", createdAt: "2026-09-08T11:15:00Z" }] },
];
export function contactFor(id: string) { return contacts.find((contact) => contact.id === id)!; }
export function filterConversations(threads: Conversation[], folder: InboxFolder, query: string) {
  const term = query.trim().toLowerCase();
  return threads.filter((thread) => {
    const inFolder = folder === "Archived" ? thread.archived : !thread.archived && (folder === "Unread" ? thread.unread : folder === "Starred" ? thread.starred : true);
    const contact = contactFor(thread.contactId);
    return inFolder && `${contact.name} ${contact.email} ${thread.subject} ${thread.messages.map((message) => message.body).join(" ")}`.toLowerCase().includes(term);
  }).sort((a, b) => b.messages[b.messages.length - 1].createdAt.localeCompare(a.messages[a.messages.length - 1].createdAt));
}
export function validateMessage(body: string) { return !body.trim() ? "Write a message before saving." : body.trim().length > 4000 ? "Keep messages within 4,000 characters." : null; }
export function isConversationList(value: unknown): value is Conversation[] {
  return Array.isArray(value) && new Set(value.map((t) => t?.id)).size === value.length && value.every((t) => t && typeof t.id === "string" && contacts.some((c) => c.id === t.contactId) && typeof t.subject === "string" && t.subject.length > 0 && t.subject.length <= 120 && [t.unread, t.starred, t.archived].every((v) => typeof v === "boolean") && typeof t.draft === "string" && t.draft.length <= 4000 && Array.isArray(t.messages) && t.messages.length > 0 && t.messages.every((m: Message) => m && typeof m.id === "string" && typeof m.body === "string" && !validateMessage(m.body) && ["contact", "you"].includes(m.author) && typeof m.createdAt === "string" && Number.isFinite(Date.parse(m.createdAt))));
}
