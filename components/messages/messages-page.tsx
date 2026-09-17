"use client";
import { useState } from "react";
import { Archive, Inbox, Mail, MessageSquare, Plus, Search, Star } from "lucide-react";
import { contactFor, filterConversations, type InboxFolder } from "@/data/messages";
import { useMessages, updateConversation } from "./message-store";
import { ComposeDialog } from "./compose-dialog";
import { ConversationView } from "./conversation-view";
import shared from "@/components/leaderboard/leaderboard.module.css";
import dashboard from "@/components/dashboard/dashboard.module.css";
import styles from "./messages.module.css";

const folders = [{ name: "Inbox", Icon: Inbox }, { name: "Unread", Icon: Mail }, { name: "Starred", Icon: Star }, { name: "Archived", Icon: Archive }] as const;
export function MessagesPage() {
  const threads = useMessages();
  const [folder, setFolder] = useState<InboxFolder>("Inbox");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [compose, setCompose] = useState(false);
  const [error, setError] = useState("");
  const visible = filterConversations(threads, folder, query);
  const thread = threads.find((t) => t.id === selected);
  const unread = threads.filter((t) => t.unread && !t.archived).length;
  return <main id="main-content" className={`${dashboard.dashboard} ${shared.page}`} aria-label="Messages">
    <div className={shared.pageHeader}><div><div className={shared.headingLine}><h1>Your conversations</h1><span className={shared.demoBadge}>Demo inbox</span></div><p>A little closer to your customers and your team.</p></div><button className={styles.primary} onClick={() => setCompose(true)}><Plus aria-hidden="true" />New message</button></div>
    <div className={styles.inboxOverview}><span><MessageSquare aria-hidden="true" />{threads.filter((t) => !t.archived).length} conversations</span><span><i />{unread} unread</span><span className={styles.localLabel}>Messages and drafts are saved in this browser</span></div>
    {error && <p className={styles.error} role="alert">{error}</p>}
    <div className={`${styles.workspace} ${thread ? styles.threadOpen : ""}`}>
      <section className={styles.inbox} aria-label="Conversation inbox"><div className={styles.inboxHeader}><h2>Messages <span>{unread}</span></h2><label className={styles.search}><Search aria-hidden="true" /><input type="search" aria-label="Search conversations" placeholder="Search conversations..." value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>
        <div className={styles.folders} role="group" aria-label="Message folders">{folders.map(({ name, Icon }) => <button key={name} aria-pressed={folder === name} onClick={() => { setFolder(name); setSelected(null); }}><Icon aria-hidden="true" />{name}<span>{filterConversations(threads, name, "").length}</span></button>)}</div>
        <div className={styles.threadList}>{visible.map((t) => {
          const contact = contactFor(t.contactId), last = t.messages[t.messages.length - 1];
          return <button key={t.id} className={`${styles.threadPreview} ${selected === t.id ? styles.selected : ""} ${t.unread ? styles.unread : ""}`} aria-label={`${contact.name}: ${t.subject}${t.unread ? ", unread" : ""}`} aria-current={selected === t.id ? "true" : undefined} onClick={() => {
            setSelected(t.id);
            if (t.unread) { try { updateConversation(t.id, { unread: false }); setError(""); } catch { setError("This conversation could not be marked as read. Check your browser’s storage permissions."); } }
          }}><span className={`${shared.avatar} ${shared[contact.color]}`} aria-hidden="true">{contact.name.split(" ").map((p) => p[0]).join("")}</span><span className={styles.previewContent}><span className={styles.previewTop}><strong>{contact.name}</strong><time dateTime={last.createdAt}>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(last.createdAt))}</time></span><span className={styles.previewSubject}>{t.subject}</span><span className={styles.previewBody}>{t.draft ? `Draft: ${t.draft}` : `${last.author === "you" ? "You: " : ""}${last.body}`}</span></span><span className={styles.previewIndicators}>{t.unread && <i />}{t.starred && <Star aria-hidden="true" fill="currentColor" />}</span></button>;
        })}{!visible.length && <div className={styles.emptyList}><Search aria-hidden="true" /><h3>No conversations found</h3><p>{query ? "Try another name, subject, or message." : `There are no conversations in ${folder.toLowerCase()}.`}</p>{query && <button className={shared.button} onClick={() => setQuery("")}>Clear search</button>}</div>}</div>
        <p className={styles.inboxFooter}>{visible.length} {visible.length === 1 ? "conversation" : "conversations"}</p>
      </section>
      {thread ? <ConversationView key={thread.id} thread={thread} onBack={() => setSelected(null)} /> : <section className={styles.welcome} aria-label="Select a conversation"><span><MessageSquare aria-hidden="true" /></span><h2>Good conversations start here</h2><p>Select a conversation to catch up with a customer or your team.</p><button className={shared.button} onClick={() => setCompose(true)}><Plus aria-hidden="true" />Start a conversation</button><small>Demo inbox · messages are not delivered externally</small></section>}
    </div>
    {compose && <ComposeDialog onClose={() => setCompose(false)} onCreated={(id) => { setFolder("Inbox"); setQuery(""); setSelected(id); }} />}
  </main>;
}
