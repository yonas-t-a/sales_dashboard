"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Send, X } from "lucide-react";
import { contacts } from "@/data/messages";
import { createConversation } from "./message-store";
import shared from "@/components/leaderboard/leaderboard.module.css";
import styles from "./messages.module.css";

export function ComposeDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const id = createConversation(
        String(data.get("contact")),
        String(data.get("subject")),
        String(data.get("body")),
      );
      onCreated(id);
      dialog.current?.close();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to save this message.",
      );
    }
  }
  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="compose-title"
      onClose={onClose}
    >
      <form onSubmit={submit}>
        <header>
          <div>
            <h2 id="compose-title">New message</h2>
            <p>Start a conversation with a demo contact.</p>
          </div>
          <button
            type="button"
            className={shared.button}
            aria-label="Close new message"
            onClick={() => dialog.current?.close()}
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <label>
          To
          <select name="contact" required defaultValue="" autoFocus>
            <option value="" disabled>
              Select a contact
            </option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} · {c.role}
              </option>
            ))}
          </select>
        </label>
        <label>
          Subject
          <input
            name="subject"
            required
            maxLength={120}
            placeholder="What would you like to discuss?"
          />
        </label>
        <label>
          Message
          <textarea
            name="body"
            required
            maxLength={4000}
            rows={6}
            placeholder="Write your message..."
          />
        </label>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <p className={styles.demoNote}>
          Demo only. Messages stay in this browser and are not delivered to
          anyone.
        </p>
        <footer>
          <button
            type="button"
            className={shared.button}
            onClick={() => dialog.current?.close()}
          >
            Cancel
          </button>
          <button className={styles.primary} type="submit">
            <Send aria-hidden="true" />
            Save message
          </button>
        </footer>
      </form>
    </dialog>
  );
}
