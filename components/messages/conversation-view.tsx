"use client";
import { useEffect, useRef, useState } from "react";
import { Archive, ArchiveRestore, ArrowLeft, Mail, MailOpen, Send, Star } from "lucide-react";
import { contactFor, type Conversation } from "@/data/messages";
import { replyToConversation, updateConversation } from "./message-store";
import shared from "@/components/leaderboard/leaderboard.module.css";
import styles from "./messages.module.css";

export function ConversationView({ thread, onBack }: { thread: Conversation; onBack: () => void }) {
  const contact = contactFor(thread.contactId);
  const [draft, setDraft] = useState(thread.draft);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [thread.messages.length]);
  function update(changes: Parameters<typeof updateConversation>[1]) {
    try { updateConversation(thread.id, changes); setError(""); }
    catch (error) { setError(error instanceof Error ? error.message : "Unable to save this change."); }
  }
  return <section className={styles.conversation} aria-label={`Conversation with ${contact.name}`}>
    <header className={styles.threadHeader}><button className={`${shared.button} ${styles.back}`} onClick={onBack} aria-label="Back to inbox"><ArrowLeft aria-hidden="true" /></button><span className={`${shared.avatar} ${shared[contact.color]}`}>{contact.name.split(" ").map((p) => p[0]).join("")}</span><div className={styles.threadIdentity}><h2>{contact.name}</h2><p>{contact.role} · {contact.email}</p></div><div className={styles.threadActions}>
      <button className={styles.iconButton} aria-label={thread.starred ? "Unstar conversation" : "Star conversation"} aria-pressed={thread.starred} onClick={() => update({ starred: !thread.starred })}><Star fill={thread.starred ? "currentColor" : "none"} aria-hidden="true" /></button>
      <button className={styles.iconButton} aria-label={thread.unread ? "Mark as read" : "Mark as unread"} onClick={() => update({ unread: !thread.unread })}>{thread.unread ? <MailOpen aria-hidden="true" /> : <Mail aria-hidden="true" />}</button>
      <button className={styles.iconButton} aria-label={thread.archived ? "Restore conversation" : "Archive conversation"} onClick={() => update({ archived: !thread.archived })}>{thread.archived ? <ArchiveRestore aria-hidden="true" /> : <Archive aria-hidden="true" />}</button>
    </div></header>
    <div className={styles.subject}><h3>{thread.subject}</h3><span>{thread.archived ? "Archived" : "Conversation"}</span></div>
    <div className={styles.messageHistory} ref={scroller} role="log" aria-label="Conversation history" aria-live="polite">{thread.messages.map((message) => <article key={message.id} className={`${styles.message} ${message.author === "you" ? styles.outgoing : ""}`}><span>{message.author === "you" ? "You" : contact.name}</span><p>{message.body}</p><time dateTime={message.createdAt}>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(new Date(message.createdAt))} UTC{message.author === "you" ? " · Saved locally" : ""}</time></article>)}</div>
    {error && <p role="alert" className={styles.error}>{error}</p>}
    <p role="status" className={styles.saveStatus}>{notice}</p>
    {thread.archived ? <div className={styles.archivedNote}>This conversation is archived.<button className={shared.button} onClick={() => update({ archived: false })}>Restore to reply</button></div> : <form className={styles.reply} onSubmit={(event) => {
      event.preventDefault();
      try { replyToConversation(thread.id, draft); setDraft(""); setError(""); setNotice("Reply saved to this demo conversation."); }
      catch (error) { setError(error instanceof Error ? error.message : "Unable to save reply."); }
    }}><label className={shared.srOnly} htmlFor="message-reply">Write a reply</label><textarea id="message-reply" placeholder={`Reply to ${contact.name.split(" ")[0]}...`} rows={3} maxLength={4000} value={draft} onChange={(event) => { setDraft(event.target.value); setNotice(""); update({ draft: event.target.value }); }} /><div><span>Local demo · no messages are delivered</span><button type="submit" className={styles.primary} disabled={!draft.trim()}><Send aria-hidden="true" />Save reply</button></div></form>}
  </section>;
}
