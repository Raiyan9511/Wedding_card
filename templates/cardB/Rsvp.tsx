"use client";
import { useRef, useState, type FormEvent } from "react";
import type { ClientConfig } from "@/lib/types";
import { formatDate, has } from "@/lib/config";
import { sendRsvp } from "@/components/shared/rsvp";
import { script } from "./fonts";
import { Flourish, TornEdge, tornPolygon } from "./decor";
import s from "./cardB.module.css";

const CARD = tornPolygon(41, 8, 24);
const field = "mt-1 w-full border-0 border-b border-(--maroon)/30 bg-transparent px-1 py-2 text-lg outline-none focus:border-(--maroon)";

export default function Rsvp({ config }: { config: ClientConfig }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [attending, setAttending] = useState(true);
  const [sent, setSent] = useState(false);
  if (!has(config.rsvp.whatsappNumber)) return null;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    sendRsvp(config, {
      name: String(data.get("name")).trim(),
      attending,
      guests: attending ? Number(data.get("guests")) : 0,
      message: String(data.get("message") ?? "").trim(),
    });
    setSent(true);
  };
  const close = () => dialog.current?.close();

  return (
    <section className={`relative px-6 py-24 text-center ${s.blush}`}>
      <TornEdge color="var(--blush)" seed={33} />
      <Flourish className="absolute bottom-6 left-4 w-16 -scale-y-100 text-(--rose)/60 sm:w-24" />
      <Flourish className="absolute right-4 bottom-6 w-16 -scale-100 text-(--rose)/60 sm:w-24" />

      <h2 className={`${s.tearX} ${script.className} text-5xl text-(--maroon) sm:text-6xl`}>Kindly Reply</h2>
      <p className={`${s.tear} mx-auto mt-5 max-w-md text-lg italic`}>It would mean the world to have you with us.</p>
      {has(config.rsvp.deadline) && (
        <p className={`${s.tear} mt-2 text-xs tracking-[0.3em] text-(--muted) uppercase`}>Reply by {formatDate(config.rsvp.deadline)}</p>
      )}
      <button
        type="button"
        onClick={() => {
          setSent(false);
          dialog.current?.showModal();
        }}
        className={`js-drop mt-9 rounded-sm px-10 py-4 text-xs font-semibold tracking-[0.35em] text-(--gold-soft) uppercase shadow-lg ${s.velvet}`}
      >
        Send your RSVP
      </button>

      <dialog
        ref={dialog}
        data-lenis-prevent
        aria-labelledby="rsvp-title-b"
        className="m-auto w-[min(92vw,460px)] bg-transparent p-0 text-(--ink) backdrop:bg-[rgb(30_4_10/0.7)]"
      >
        <div className={`${s.paper} relative px-7 pt-12 pb-10`} style={{ clipPath: CARD }}>
          <button type="button" onClick={close} aria-label="Close" className="absolute top-5 right-5 size-9 text-2xl text-(--muted)">
            ×
          </button>
          <h3 id="rsvp-title-b" className={`${script.className} text-center text-5xl text-(--maroon)`}>
            {sent ? "Thank you" : "RSVP"}
          </h3>
          {sent ? (
            <div className="mt-4 text-center">
              <p className="text-lg">WhatsApp has opened with your reply — just press send.</p>
              <button type="button" onClick={close} className={`mt-6 px-8 py-3 text-xs font-semibold tracking-[0.3em] text-(--gold-soft) uppercase ${s.velvet}`}>
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-5 space-y-5 text-left">
              <label className="block text-xs tracking-[0.25em] text-(--muted) uppercase">
                Your name
                <input name="name" required maxLength={80} autoComplete="name" className={field} />
              </label>
              <fieldset>
                <legend className="text-xs tracking-[0.25em] text-(--muted) uppercase">Will you attend?</legend>
                <div className="mt-2 flex gap-3">
                  {[
                    { v: true, label: "With joy" },
                    { v: false, label: "With regret" },
                  ].map((o) => (
                    <label
                      key={o.label}
                      className={`flex-1 cursor-pointer rounded-full border-2 px-3 py-2 text-center text-base transition ${
                        attending === o.v ? "border-(--maroon) bg-(--maroon) text-(--ivory)" : "border-(--maroon)/30 text-(--maroon)"
                      }`}
                    >
                      <input type="radio" name="attending" className="sr-only" checked={attending === o.v} onChange={() => setAttending(o.v)} />
                      {o.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              {attending && (
                <label className="block text-xs tracking-[0.25em] text-(--muted) uppercase">
                  Guests
                  <select name="guests" defaultValue="1" className={field}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </label>
              )}
              <label className="block text-xs tracking-[0.25em] text-(--muted) uppercase">
                A note for the couple <span className="normal-case">(optional)</span>
                <textarea name="message" rows={2} maxLength={500} className={field} />
              </label>
              <button type="submit" className={`w-full py-4 text-xs font-semibold tracking-[0.35em] text-(--gold-soft) uppercase shadow-md ${s.velvet}`}>
                Send via WhatsApp
              </button>
            </form>
          )}
        </div>
      </dialog>
    </section>
  );
}
