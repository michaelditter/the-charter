# The Charter

**Write a commons that governs itself, then sign it so no single platform can quietly recall it.**

A guided builder for a **commons charter**, on Elinor Ostrom's eight design principles for shared resources that endure: the rules a town green, a tool library, a maker space, a community fund, or a shared well needs to last. Fill in your specifics, get a real charter document, and **sign it to the open network** so the official copy lives on no one's server. It is signed and tamper-evident: no one but the holder of the seal can alter it, and amendments are published as new signed versions, so the history stays visible.

This is the **oath layer** from *[You Cannot Eat Code](https://youcannoteat.codes)*: a binding commitment, made real. It signs your charter the same way [The Record](https://github.com/michaelditter/the-record) does: a signed Nostr event on the same relays, tagged `#therecord`, so both tools' records interleave on any Nostr client. The adopting body's signature is the seal.

> Work through eight principles, sign the result, and it's a commons, not a mailing list: governed by the people who use it, under rules they wrote.

## Use it
Open the app, work through the eight principles (each comes with a plain-language prompt and a starter you edit), hit **Draft the charter**, then **Download (.md)** or **Sign & record to the open network**.

- **Source and app:** [github.com/michaelditter/the-charter](https://github.com/michaelditter/the-charter)
- **Book:** [youcannoteat.codes](https://youcannoteat.codes)
- **Hosted demo:** deploying at `charter.youcannoteat.codes` (not live yet). Until it is, run it locally:

```bash
npx serve .          # serves on http://localhost:3000
# or:
python3 -m http.server 3000
# or:
npm run serve        # same, python on port 3000
```

No account, no build step. The Nostr library and fonts are **vendored locally** (`vendor/`), so drafting works fully offline. Nothing is stored on a server while you draft; only *you* decide when to record it. **Recording** does need internet: it broadcasts to live Nostr relays.

## Elinor Ostrom's eight principles
Ostrom won the Nobel for showing commons don't need to be privatized or nationalized to survive: communities govern them well when the design follows eight principles. The Charter walks you through each:

1. **Clear boundaries** — who belongs, what's shared.
2. **Rules that fit the place** — benefits and burdens shared in proportion, for *your* situation.
3. **Collective choice** — the people affected can change the rules.
4. **Monitoring** — by people accountable to the members.
5. **Graduated sanctions** — escalating, proportional, applied evenly.
6. **Conflict resolution** — cheap, fast, local.
7. **Right to organize** — the group's authority to govern itself is recognized.
8. **Nested layers** — local decisions stay local; layers coordinate.

## What happens when you record (in plain English)
You don't need to know anything about Nostr to use this. Here is what the buttons do.

- **Nostr** is an open messaging network. Instead of one company's server, there are many independent servers called **relays**. Anyone can run one. Your charter is posted to several at once, so no single operator can erase or edit it.
- **Signing** means your charter is stamped with a cryptographic key that only you hold. That stamp is the **adopting body's seal**. Anyone can check the stamp; no one can forge it.
- Your key comes as two strings. The **npub** (public seal) is safe to share; it identifies your charter. The **nsec** (secret key) is the private half. Guard it like the town seal itself.
- After recording you get a link (via [njump.me](https://njump.me), a Nostr viewer) plus the raw identifiers, so anyone can open and verify the charter. The **`nevent`** link points at the exact version you signed. The **`naddr`** address points at "the latest version," which a later signature by the same key can replace.

**Durable, not eternal.** A recorded charter lives as long as at least one relay keeps a copy. That is stronger than any one platform (no company can unilaterally recall it) but it is not a promise of forever. Keep your own `.md` download as the canonical backup.

## Amendments, and who holds the key
Nostr long-form documents (kind 30023) are **replaceable**: the holder of the secret key can publish a new signed version. That is the amendment mechanism, and it is also the honest caveat.

- **Amendments are new signed versions, not silent edits.** The app records every charter under a fresh identifier, so each recording is its own signed document you can link to. To amend, record again and share the new link; keep the old `nevent` link if you want to show what changed. Never reuse a key to overwrite the *same* address unless you intend to replace that charter in place.
- **Who signs?** Exactly one key signs, so decide whose it is *before* you record. The usual answer: the clerk or moderator signs on the body's behalf, and the meeting minutes record that they were authorized. The **Adopted by** field names the members; the key is the instrument that acts for them.
- **If the key is lost:** you can never amend the charter. The recorded version stands as-is, forever verifiable, but frozen. This is why you download and safeguard the key at recording time.
- **If the key is stolen:** the thief can publish a replacement at the same address. They cannot forge a *different* key's signature, but they can act as the seal-holder. Treat the nsec like the physical town seal. If it may be compromised, adopt a fresh charter under a new key and announce the change.

## Signing safely
- **Best:** if you have a Nostr browser extension (Alby, nos2x), choose **Sign with my Nostr extension**. Your secret key never touches this page.
- **Otherwise:** choose **Create a dedicated charter key**. The app generates a key, shows it once, and stores it in *this browser* until you remove it. Use the **Download key file** button to save it, and **Remove key from this browser** when you're done (especially on a shared or town-office computer).
- When an extension is present, the app makes you pick explicitly rather than silently creating a local key.

## The recording method, made real
One of *one real tool per recording layer*:
- **Print → Nostr:** [The Record](https://github.com/michaelditter/the-record).
- **Correspondence → CRDT:** [The Correspondence](https://github.com/michaelditter/the-correspondence).
- **Oath → Ostrom charter:** this. It signs to the same relays as The Record and shares the `#therecord` tag, so charters appear alongside The Record's entries on any Nostr client.

## Security & privacy
- **Keys:** generated in your browser and, for the local option, stored in this browser only until you remove them. Nothing is sent to us. See "Signing safely" above.
- **Supply chain:** `nostr-tools@2.23.5` is vendored at `vendor/nostr.bundle.js` (no runtime CDN), so a compromised CDN can't swap the signing code.
- **Metadata:** recording reveals your IP address to the relays you publish to, and the charter text is public by design. Draft offline; only recording touches the network.

MIT licensed. Built for *You Cannot Eat Code*.
