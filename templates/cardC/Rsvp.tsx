"use client";
import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import type { ClientConfig } from "@/lib/types";
import { formatDate, has } from "@/lib/config";
import { sendRsvp } from "@/components/shared/rsvp";
import { script } from "./fonts";
import { Flutter, FloralSpray, WashEdge, WashStroke } from "./decor";
import s from "./cardC.module.css";

const field = "mt-1 w-full rounded-2xl border border-(--sage)/40 bg-white/80 px-4 py-2.5 text-lg outline-none focus:border-(--sage-deep)";

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
    <section className={`relative overflow-hidden px-6 py-24 text-center ${s.blushWash}`}>
      <WashEdge />
      <Flutter tone={1} className="top-16 left-[10%] w-7" />
      <Flutter tone={2} className="right-[12%] bottom-20 w-8" style={{ "--delay": "-7s" } as CSSProperties} />

      <h2 className={`js-float ${script.className} relative text-5xl text-(--rose) sm:text-7xl`}>Will You Join Us?</h2>
      <WashStroke className={`${s.wash} relative mx-auto mt-2 w-52`} />
      <p className="js-float relative mx-auto mt-5 max-w-md text-lg italic">Your presence would make our garden bloom.</p>
      {has(config.rsvp.deadline) && (
        <p className="js-float relative mt-2 text-xs tracking-[0.3em] text-(--muted) uppercase">Kindly reply by {formatDate(config.rsvp.deadline)}</p>
      )}
      <button
        type="button"
        onClick={() => {
          setSent(false);
          dialog.current?.showModal();
        }}
        className="js-float relative mt-9 rounded-full bg-(--sage-deep) px-10 py-4 text-xs tracking-[0.35em] text-white uppercase shadow-lg transition-colors hover:bg-(--sage)"
      >
        RSVP here
      </button>

      <dialog
        ref={dialog}
        data-lenis-prevent
        aria-labelledby="rsvp-title-c"
        className="m-auto w-[min(92vw,460px)] overflow-hidden rounded-[2rem] bg-(--cream) p-0 text-(--ink) shadow-2xl backdrop:bg-[rgb(70_80_65/0.55)]"
      >
        <div className="relative px-7 pt-12 pb-9">
          <FloralSpray className="pointer-events-none absolute -top-6 -left-8 w-36 opacity-90" />
          <button type="button" onClick={close} aria-label="Close" className="absolute top-4 right-4 size-9 rounded-full text-2xl text-(--muted)">
            ×
          </button>
          <h3 id="rsvp-title-c" className={`${script.className} relative text-center text-6xl text-(--rose)`}>
            {sent ? "Thank you" : "RSVP"}
          </h3>
          {sent ? (
            <div className="mt-4 text-center">
              <p className="text-lg">WhatsApp has opened with your reply — just press send.</p>
              <button type="button" onClick={close} className="mt-6 rounded-full bg-(--sage-deep) px-8 py-3 text-xs tracking-[0.3em] text-white uppercase">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="relative mt-5 space-y-5 text-left">
              <label className="block text-xs tracking-[0.25em] text-(--sage-deep) uppercase">
                Your name
                <input name="name" required maxLength={80} autoComplete="name" className={field} />
              </label>
              <fieldset>
                <legend className="text-xs tracking-[0.25em] text-(--sage-deep) uppercase">Will you attend?</legend>
                <div className="mt-2 flex gap-3">
                  {[
                    { v: true, label: "Happily yes" },
                    { v: false, label: "Sadly no" },
                  ].map((o) => (
                    <label
                      key={o.label}
                      className={`flex-1 cursor-pointer rounded-full px-3 py-2.5 text-center text-base transition ${
                        attending === o.v ? "bg-(--rose) text-white shadow-sm" : "bg-white text-(--ink) ring-1 ring-(--sage)/40"
                      }`}
                    >
                      <input type="radio" name="attending" className="sr-only" checked={attending === o.v} onChange={() => setAttending(o.v)} />
                      {o.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              {attending && (
                <label className="block text-xs tracking-[0.25em] text-(--sage-deep) uppercase">
                  Guests
                  <select name="guests" defaultValue="1" className={field}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </label>
              )}
              <label className="block text-xs tracking-[0.25em] text-(--sage-deep) uppercase">
                A wish for the couple <span className="normal-case">(optional)</span>
                <textarea name="message" rows={2} maxLength={500} className={field} />
              </label>
              <button type="submit" className="w-full rounded-full bg-(--sage-deep) py-4 text-xs tracking-[0.35em] text-white uppercase shadow-md">
                Send via WhatsApp
              </button>
            </form>
          )}
        </div>
      </dialog>
    </section>
  );
}
