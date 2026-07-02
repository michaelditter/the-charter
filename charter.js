// The Charter — guided commons charter on Ostrom's 8 principles, then signed to Nostr.
'use strict';
(function () {
  const NT = window.NostrTools;
  const RELAYS = ['wss://relay.damus.io', 'wss://nos.lol', 'wss://relay.primal.net', 'wss://relay.nostr.band'];
  const LS = 'the_charter_nsec';
  const LS_SIGNER = 'the_charter_signer'; // 'ext' | 'local' — remembers the user's choice
  const LS_DRAFT = 'the_charter_draft';   // autosaved form values
  const $ = (s) => document.querySelector(s);
  // Escape HTML so remote-controlled text (e.g. relay error strings) can never inject markup.
  // Escapes quotes too, since esc() is also used in attribute contexts.
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Basics + Elinor Ostrom's eight design principles for governing a commons.
  const BASICS = [
    { id: 'name', label: 'The commons (its name)', ph: 'The Goshen Town Green' },
    { id: 'place', label: 'Place', ph: 'Goshen, Connecticut' },
    { id: 'date', label: 'Date', ph: '' },
    { id: 'stewards', label: 'Adopted by (stewards / members, comma-separated)', ph: 'the residents in assembly' }
  ];
  const PRINCIPLES = [
    { key: 'boundaries', title: 'Clear boundaries', help: 'Who belongs to this commons, and what exactly is shared?',
      start: 'Members of this commons are the people who [live in / use / steward] it. The shared resource is ____. Outsiders may use it under these terms: ____.' },
    { key: 'fit', title: 'Rules that fit the place', help: 'How are benefits and burdens shared, in proportion, for your specific situation?',
      start: 'Members share the upkeep and the benefits in proportion to ____. These rules are written for our particular place and resource, not copied from elsewhere.' },
    { key: 'choice', title: 'Collective choice', help: 'How can the people affected by the rules change the rules?',
      start: 'Any member may propose a change. Rules change by ____ (e.g. a majority at a meeting announced two weeks ahead). No one outside the membership may change them.' },
    { key: 'monitoring', title: 'Monitoring', help: 'Who watches the resource and the rules — accountable to the members?',
      start: '____ monitor the commons and report openly to the members. Monitors are chosen by, and accountable to, the membership.' },
    { key: 'sanctions', title: 'Graduated sanctions', help: 'What happens when someone breaks a rule — starting small?',
      start: 'A first violation gets a reminder. Repeated or serious violations escalate to ____. Sanctions are proportional and applied evenly to everyone.' },
    { key: 'conflict', title: 'Conflict resolution', help: 'Where do disputes go — cheaply, quickly, locally?',
      start: 'Disputes are heard at ____ (a regular meeting / a named steward) and resolved within ____ days, at no cost to the members.' },
    { key: 'recognition', title: 'Right to organize', help: "What is the group's right to govern itself?",
      start: 'We claim the right to govern this commons ourselves. We ask outside authorities to recognize this charter and not undermine it.' },
    { key: 'nested', title: 'Nested layers', help: 'If part of something larger, how do the layers fit (keeping local decisions local)?',
      start: 'This commons coordinates with ____ (larger or neighboring bodies) as a nested layer. Decisions that can be made locally are made locally.' }
  ];

  // ---- render the form ----
  const form = $('#form');
  const basicsBlock = document.createElement('div');
  basicsBlock.className = 'step';
  basicsBlock.innerHTML = '<h3>The basics</h3><div class="grid2" id="basics"></div>';
  form.appendChild(basicsBlock);
  const basicsGrid = $('#basics');
  BASICS.forEach((b) => {
    const wrap = document.createElement('div'); wrap.className = 'fld-row';
    wrap.innerHTML = `<label class="fld" for="b-${b.id}">${b.label}</label><input type="text" id="b-${b.id}" placeholder="${b.ph}">`;
    basicsGrid.appendChild(wrap);
  });
  PRINCIPLES.forEach((p, i) => {
    const step = document.createElement('div');
    step.className = 'step';
    step.innerHTML =
      `<div class="n">Principle ${i + 1}</div><h3>${p.title}</h3><p class="help">${p.help}</p>` +
      `<textarea id="p-${p.key}">${p.start}</textarea>`;
    form.appendChild(step);
  });

  // default date = today (ISO date)
  try { $('#b-date').value = new Date().toISOString().slice(0, 10); } catch (e) {}

  // ---- draft autosave: keep form values across an accidental refresh ----
  const fieldEls = () => Array.prototype.slice.call(form.querySelectorAll('input, textarea'));
  function restoreDraft() {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_DRAFT) || 'null');
      if (!saved) return;
      fieldEls().forEach((el) => { if (Object.prototype.hasOwnProperty.call(saved, el.id) && saved[el.id]) el.value = saved[el.id]; });
    } catch (e) {}
  }
  function saveDraft() {
    try {
      const out = {};
      fieldEls().forEach((el) => { if (el.id) out[el.id] = el.value; });
      localStorage.setItem(LS_DRAFT, JSON.stringify(out));
    } catch (e) {}
  }
  restoreDraft();
  form.addEventListener('input', saveDraft);

  // ---- build the charter ----
  function val(id) { const el = $(id); return (el && el.value.trim()) || ''; }
  function buildMarkdown() {
    const name = val('#b-name') || 'This Commons';
    const place = val('#b-place');
    const date = val('#b-date');
    const stewards = val('#b-stewards');
    let md = `# Charter of ${name}\n\n`;
    md += `_A commons charter${place ? ', for ' + place : ''}${date ? ', drafted ' + date : ''}._\n\n`;
    md += `This charter governs **${name}** as a commons — a shared resource kept by the people who use it, under rules they wrote and can change. It is built on Elinor Ostrom's eight design principles for commons that endure.\n`;
    PRINCIPLES.forEach((p, i) => {
      md += `\n## ${i + 1}. ${p.title}\n\n${val('#p-' + p.key) || '_(to be agreed)_'}\n`;
    });
    md += `\n---\n\n**Adopted by:** ${stewards || '_(the membership)_'}${date ? ' — ' + date : ''}.\n`;
    md += `\n_Drafted with The Charter and signed to the open network, alongside The Record. Durable, not eternal: this record lives as long as one relay keeps a copy, and no single platform can recall it. youcannoteat.codes_\n`;
    return { md, name, date };
  }
  function renderCharter() {
    const { md, name } = buildMarkdown();
    const el = $('#charter');
    // simple, safe markdown → HTML. Only **bold** inline; whole-line _..._ is italic,
    // so the ____ fill-in blanks in the charter render literally (not as italics).
    const bold = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    let html = '';
    md.split('\n').forEach((line) => {
      const t = line.trim();
      if (line.startsWith('# ')) html += `<h2>${bold(line.slice(2))}</h2>`;
      else if (line.startsWith('## ')) html += `<h3>${esc(line.slice(3))}</h3>`;
      else if (t === '---' || !t) return;
      else if (t.length > 2 && t.startsWith('_') && t.endsWith('_'))
        html += `<p style="font-style:italic;color:var(--parch-deep)">${bold(t.slice(1, -1))}</p>`;
      else html += `<p>${bold(t)}</p>`;
    });
    el.innerHTML = html + '<div class="seal">◆ a commons, governed by its own ◆</div>';
    el.hidden = false;
    $('#sign-area').hidden = false;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    refreshSigner();
    return name;
  }
  $('#preview').addEventListener('click', renderCharter);

  $('#download').addEventListener('click', () => {
    const { md, name } = buildMarkdown();
    const slug = (name || 'charter').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const blob = new Blob([md], { type: 'text/markdown' });
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = u; a.download = `charter-${slug}.md`; a.click();
    setTimeout(() => URL.revokeObjectURL(u), 2000);
  });

  // ---- sign to Nostr (kind 30023 long-form) ----
  const hasExt = () => !!window.nostr && typeof window.nostr.signEvent === 'function';
  // Restore a remembered signer choice; only 'ext' is meaningful if an extension is present.
  let useExt = localStorage.getItem(LS_SIGNER) === 'ext';
  function setSigner(choice) {
    useExt = choice === 'ext';
    localStorage.setItem(LS_SIGNER, choice);
    refreshSigner();
  }
  function refreshSigner() {
    const s = $('#signer-status'), choose = $('#signer-choice');
    // If an extension is present but the user hasn't chosen yet, force an explicit choice
    // rather than silently generating a local key.
    const chosen = localStorage.getItem(LS_SIGNER) === 'ext' || localStorage.getItem(LS_SIGNER) === 'local';
    const needChoice = hasExt() && !chosen;
    if (choose) choose.hidden = !needChoice;
    if (hasExt() && useExt) {
      s.innerHTML = 'Signing with your <b>Nostr extension</b> — your secret key never touches this page.';
    } else if (needChoice) {
      s.innerHTML = 'A Nostr extension was detected. Choose how to sign below before recording.';
    } else if (localStorage.getItem(LS)) {
      s.innerHTML = 'Signing with a <b>dedicated charter key stored in this browser</b>. It stays on this device until you remove it.';
    } else {
      s.innerHTML = 'A <b>dedicated charter key</b> will be created and stored in this browser when you record. Anyone with that key can replace the recorded charter, so guard it.';
    }
  }
  const btnExt = $('#use-ext'), btnLocal = $('#use-local');
  if (btnExt) btnExt.addEventListener('click', () => setSigner('ext'));
  if (btnLocal) btnLocal.addEventListener('click', () => setSigner('local'));

  function localSk() {
    let n = localStorage.getItem(LS);
    if (!n) { n = NT.nip19.nsecEncode(NT.generateSecretKey()); localStorage.setItem(LS, n); }
    return NT.nip19.decode(n).data;
  }
  const withTimeout = (p, ms, relay) => Promise.race([
    Promise.resolve(p).then(() => ({ relay, ok: true })),
    new Promise((r) => setTimeout(() => r({ relay, ok: false, error: 'timeout' }), ms))
  ]).catch((e) => ({ relay, ok: false, error: String((e && e.message) || e) }));

  $('#record').addEventListener('click', async () => {
    if (!NT) { alert('Nostr library not loaded — check your connection.'); return; }
    // If a Nostr extension is present, require an explicit signer choice first.
    if (hasExt() && localStorage.getItem(LS_SIGNER) !== 'ext' && localStorage.getItem(LS_SIGNER) !== 'local') {
      refreshSigner();
      alert('A Nostr extension was detected. Choose how to sign — with your extension, or with a dedicated charter key stored in this browser — before recording.');
      return;
    }
    // This is a real, public broadcast to live relays. Confirm before polluting the network.
    if (!confirm('This charter will be signed and broadcast publicly to live Nostr relays, tagged #therecord and #youcannoteat. It is real and cannot be un-published (a relay may keep a copy indefinitely). Record it now?')) return;
    if (!window.RecordCore) { alert('Shared record core not loaded yet — reload and try again.'); return; }
    const { md, name, date } = buildMarkdown();
    const slug = (name || 'charter').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.random().toString(36).slice(2, 6);
    // Built through record-core (the shared CRP core): kind 30023 with the CRP tag
    // grammar (client, t=youcannoteat, t=civic-record, t=commons-charter, d), plus
    // the legacy 'therecord' hashtag and published_at for continuity.
    const tmpl = window.RecordCore.buildCharter({
      content: md,
      title: 'Charter of ' + name,
      d: slug,
      client: 'the-charter',
      extraTags: [['t', 'therecord'], ['published_at', String(Math.floor(Date.now() / 1000))]]
    });
    const btn = $('#record'); btn.disabled = true; btn.textContent = 'Signing…';
    let newKey = null;
    try {
      let event, pk;
      if (hasExt() && useExt) { event = await window.nostr.signEvent(tmpl); pk = event.pubkey; }
      else {
        const had = localStorage.getItem(LS);
        const sk = localSk(); pk = NT.getPublicKey(sk);
        if (!had) newKey = { nsec: NT.nip19.nsecEncode(sk), npub: NT.nip19.npubEncode(pk) };
        event = NT.finalizeEvent(tmpl, sk);
      }
      btn.textContent = 'Recording…';
      const pool = new NT.SimplePool();
      const per = await Promise.all(pool.publish(RELAYS, event).map((p, i) => withTimeout(p, 8000, RELAYS[i])));
      // Close after a short grace period so a slow relay that is still accepting the
      // publish when the 8s timeout fires can finish, rather than being cut off.
      setTimeout(() => { try { pool.close(RELAYS); } catch (e) {} }, 4000);
      // nevent pins the exact signed version by its immutable event id (kind 30023 is
      // replaceable, so the naddr address can be overwritten by a later signature).
      const nevent = NT.nip19.neventEncode({ id: event.id, relays: RELAYS.slice(0, 2), author: pk });
      const naddr = NT.nip19.naddrEncode({ identifier: slug, pubkey: pk, kind: 30023, relays: RELAYS.slice(0, 2) });
      showResult(per, { nevent: nevent, naddr: naddr, id: event.id }, newKey);
    } catch (e) { alert('Could not record: ' + ((e && e.message) || e)); }
    finally { btn.disabled = false; btn.textContent = 'Sign & record to the open network'; refreshSigner(); }
  });

  function showResult(per, links, newKey) {
    const accepted = per.filter((r) => r.ok).length;
    $('#result-title').textContent = accepted > 0 ? `Recorded — live on ${accepted}/${per.length} relays.` : 'No relay accepted it.';
    $('#relays').innerHTML = per.map((r) => `<div><span class="${r.ok ? 'ok' : 'bad'}">${r.ok ? '✓' : '✗'}</span> ${esc(r.relay)}${r.ok ? '' : ' — ' + esc(r.error || 'failed')}</div>`).join('');
    // Primary link references the exact signed version (nevent → immutable event id).
    const thisUrl = 'https://njump.me/' + links.nevent;
    const latestUrl = 'https://njump.me/' + links.naddr;
    const a = $('#verify-link'); a.href = thisUrl; a.textContent = thisUrl;
    // Raw identifiers so verification survives njump.me going away.
    const raw = $('#verify-raw');
    if (raw) {
      raw.hidden = false;
      raw.innerHTML =
        `<div><b>This version</b> (the exact signed document): <code style="user-select:all">${esc(links.nevent)}</code></div>` +
        `<div><b>Latest version</b> (the address; a later signature by the same key replaces it): <a href="${esc(latestUrl)}" target="_blank" rel="noopener">${esc(latestUrl)}</a></div>` +
        `<div>Event id: <code style="user-select:all">${esc(links.id)}</code></div>`;
    }
    const k = $('#keyout');
    if (newKey) {
      k.hidden = false;
      k.innerHTML =
        `<b>The charter's signing key — save it now.</b> This key is the adopting body's seal; it signs future amendments, and <b>anyone who holds it can replace (rewrite) the recorded charter in place.</b> It is stored in this browser until you remove it below.` +
        `<br>Public seal: <code style="color:var(--brass-bright);user-select:all">${esc(newKey.npub)}</code>` +
        `<br>Secret key: <code style="color:var(--brass-bright);user-select:all">${esc(newKey.nsec)}</code>` +
        `<div class="actions" style="margin-top:.6rem">` +
        `<button class="btn btn-ghost" id="dl-key" type="button">Download key file</button>` +
        `<button class="btn btn-ghost" id="rm-key" type="button">Remove key from this browser</button>` +
        `</div>`;
      const dl = $('#dl-key');
      if (dl) dl.addEventListener('click', () => {
        const body = `The Charter — signing key\n\nKeep this secret key safe and private. Anyone who holds it can amend or replace your recorded charter.\n\nPublic seal (npub): ${newKey.npub}\nSecret key (nsec): ${newKey.nsec}\n`;
        const blob = new Blob([body], { type: 'text/plain' });
        const u = URL.createObjectURL(blob);
        const el = document.createElement('a'); el.href = u; el.download = 'the-charter-key.txt'; el.click();
        setTimeout(() => URL.revokeObjectURL(u), 2000);
      });
      const rm = $('#rm-key');
      if (rm) rm.addEventListener('click', () => {
        if (!confirm('Remove the signing key from this browser? Save it first — without it you can never amend this charter. This cannot be undone here.')) return;
        localStorage.removeItem(LS);
        rm.disabled = true; rm.textContent = 'Removed';
        refreshSigner();
      });
    } else k.hidden = true;
    $('#result').classList.add('on');
    $('#result').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  refreshSigner();
})();
