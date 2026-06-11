# The Charter

**Write a commons that governs itself — then sign it where no one can quietly rewrite it.**

A guided builder for a **commons charter**, on Elinor Ostrom's eight design principles for shared resources that endure — the rules a town green, a tool library, a maker space, a community fund, or a shared well needs to last. Fill in your specifics, get a real charter document, and **record it permanently to the open network** so the official copy lives on no one's server.

This is the **oath layer** from *[You Cannot Eat Code](https://youcannoteat.codes)* — a binding commitment, made real. And it's built *on* the print layer: it signs your charter via [The Record](https://github.com/michaelditter/the-record) (Nostr), so the adopting body's signature is the seal and the charter is permanent and verifiable.

> Sign a one-line commitment, drop a pin, and it's a commons, not a mailing list — governed by the people who use it, under rules they wrote.

## Use it
Open the app, work through the eight principles (each comes with a plain-language prompt and a starter you edit), hit **Draft the charter**, then **Download (.md)** or **Sign & record to the open network**.
→ live at **[charter.youcannoteat.codes](https://youcannoteat.codes)** · or locally:
```bash
npx serve .      # or: python3 -m http.server 4557
```
No account, no build step. Nothing is stored on a server while you draft — only *you* decide when to record it.

## Elinor Ostrom's eight principles
Ostrom won the Nobel for showing commons don't need to be privatized or nationalized to survive — communities govern them well when the design follows eight principles. The Charter walks you through each:

1. **Clear boundaries** — who belongs, what's shared.
2. **Rules that fit the place** — benefits and burdens shared in proportion, for *your* situation.
3. **Collective choice** — the people affected can change the rules.
4. **Monitoring** — by people accountable to the members.
5. **Graduated sanctions** — escalating, proportional, applied evenly.
6. **Conflict resolution** — cheap, fast, local.
7. **Right to organize** — the group's authority to govern itself is recognized.
8. **Nested layers** — local decisions stay local; layers coordinate.

## What "record it" does
The finished charter is signed as a [Nostr long-form document](https://github.com/nostr-protocol/nips/blob/master/23.md) (kind 30023) and broadcast to several independent relays. You get a permanent link anyone can open and verify. The signing key is the **adopting body's seal** — keep it to sign future amendments. No platform owns the canonical charter; it can't be quietly edited or memory-holed.

- **Sign safely:** if you have a Nostr browser extension (Alby, nos2x), it signs without your key touching the page. Otherwise a signing key is generated and shown once — save it.
- **Public and permanent by design** — a charter is meant to be seen and hard to alter. That's the point.

## The recording method, made real
One of *one real tool per recording layer*:
- **Print → Nostr:** [The Record](https://github.com/michaelditter/the-record).
- **Correspondence → CRDT:** [The Correspondence](https://github.com/michaelditter/the-correspondence).
- **Oath → Ostrom charter:** this — and it records *through* The Record.

MIT licensed. Built for *You Cannot Eat Code*.
