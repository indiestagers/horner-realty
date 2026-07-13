/* ============================================================
   HORNER REALTY KC — Voice agent widget (Vapi)
   Renders the bottom-right "Talk to me" bubble + panel and
   drives a Vapi web call. Config lives in js/agent-config.js.
   The Vapi SDK is only downloaded when a call starts.
   ============================================================ */

(function () {
  "use strict";

  const cfg = Object.assign(
    {
      vapiPublicKey: "",
      vapiAssistantId: "",
      agentName: "Hazel",
      tagline: "Horner Realty's virtual agent",
      bubbleText: "Talk to me!"
    },
    window.HR_AGENT_CONFIG || {}
  );

  const configured = Boolean(cfg.vapiPublicKey && cfg.vapiAssistantId);

  /* ---------- Markup ---------- */
  const icons = {
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4m-4 0h8"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    end: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/><path d="M4 4l16 16" stroke="#ffe9e2"/></svg>',
    muteOn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 9v5a3 3 0 0 0 5.12 2.12M15 9V5a3 3 0 0 0-5.94-.6M5 10v1a7 7 0 0 0 11 5.74M19 10v1a7 7 0 0 1-.11 1.23M12 18v4m-4 0h8M2 2l20 20"/></svg>'
  };

  const root = document.createElement("div");
  root.className = "hra-root";
  root.innerHTML = `
    <div class="hra-panel" role="dialog" aria-label="${cfg.agentName} — voice assistant">
      <div class="hra-head">
        <span class="hra-avatar" aria-hidden="true">${icons.mic}<span class="hra-ring"></span></span>
        <div class="hra-head-name">
          <strong>${cfg.agentName}</strong>
          <span>${cfg.tagline}</span>
        </div>
        <span class="hra-status" id="hra-status" aria-live="polite">Online</span>
      </div>
      <div class="hra-body">
        <p class="hra-copy hra-copy-idle"><strong>Ask me anything</strong> — listings, neighborhoods, what your home might be worth — or book a time to talk with Alicia, Brian &amp; Tyler.</p>
        <div class="hra-chips" aria-hidden="true">
          <span class="hra-chip">Book an appointment</span>
          <span class="hra-chip">What's my home worth?</span>
          <span class="hra-chip">Ask about a listing</span>
        </div>
        <div class="hra-transcript" id="hra-transcript" aria-live="polite"></div>
        <div class="hra-note" id="hra-note"></div>
        <div class="hra-actions">
          <button class="hra-btn hra-btn--start hra-idle-only" id="hra-start" type="button">
            ${icons.mic} Start voice chat
          </button>
          <button class="hra-btn hra-btn--mute hra-live-only" id="hra-mute" type="button" aria-label="Mute microphone" title="Mute microphone">
            ${icons.muteOn}
          </button>
          <button class="hra-btn hra-btn--end hra-live-only" id="hra-end" type="button">
            ${icons.end} End call
          </button>
        </div>
      </div>
      <div class="hra-foot">
        <span>Voice AI assistant</span>
        <span>Horner Realty KC</span>
      </div>
    </div>
    <div class="hra-fab-wrap">
      <span class="hra-bubble" id="hra-bubble">
        ${cfg.bubbleText}
        <button class="hra-bubble-x" id="hra-bubble-x" type="button" aria-label="Dismiss">${icons.x}</button>
      </span>
      <button class="hra-fab" id="hra-fab" type="button" aria-expanded="false"
              aria-label="Talk to our voice assistant">
        <span class="hra-ic-mic">${icons.mic}</span>
        <span class="hra-ic-close">${icons.close}</span>
      </button>
    </div>`;
  document.body.appendChild(root);

  const $ = (id) => document.getElementById(id);
  const fab = $("hra-fab");
  const bubble = $("hra-bubble");
  const statusEl = $("hra-status");
  const transcriptEl = $("hra-transcript");
  const noteEl = $("hra-note");
  const startBtn = $("hra-start");
  const muteBtn = $("hra-mute");
  const endBtn = $("hra-end");
  const ring = root.querySelector(".hra-ring");

  /* ---------- Open / close ---------- */
  if (sessionStorage.getItem("hra_bubble_dismissed")) bubble.classList.add("is-hidden");

  $("hra-bubble-x").addEventListener("click", (e) => {
    e.stopPropagation();
    bubble.classList.add("is-hidden");
    sessionStorage.setItem("hra_bubble_dismissed", "1");
  });

  fab.addEventListener("click", () => {
    const open = root.classList.toggle("is-open");
    fab.setAttribute("aria-expanded", String(open));
    bubble.classList.add("is-hidden");
    sessionStorage.setItem("hra_bubble_dismissed", "1");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.classList.contains("is-open")) {
      root.classList.remove("is-open");
      fab.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Call state ---------- */
  let vapi = null;
  let live = false;

  function setStatus(text) { statusEl.textContent = text; }

  function showNote(msg, isError) {
    noteEl.textContent = msg;
    noteEl.classList.add("is-visible");
    noteEl.classList.toggle("hra-note--error", Boolean(isError));
  }
  function hideNote() { noteEl.classList.remove("is-visible"); }

  function addLine(role, text, isFinal) {
    const cls = role === "user" ? "hra-line-user" : "hra-line-agent";
    let last = transcriptEl.lastElementChild;
    if (!last || last.dataset.role !== role || last.dataset.final === "1") {
      last = document.createElement("p");
      last.className = cls;
      last.dataset.role = role;
      transcriptEl.appendChild(last);
    }
    last.dataset.final = isFinal ? "1" : "0";
    last.innerHTML = role === "user" ? text : `<b>${cfg.agentName}:</b> ${text}`;
    while (transcriptEl.children.length > 8) transcriptEl.removeChild(transcriptEl.firstChild);
    transcriptEl.scrollTop = transcriptEl.scrollHeight;
  }

  function enterLive() {
    live = true;
    root.classList.add("is-live");
    transcriptEl.innerHTML = "";
    hideNote();
  }

  function exitLive(message) {
    live = false;
    root.classList.remove("is-live");
    setStatus("Online");
    startBtn.disabled = false;
    startBtn.innerHTML = `${icons.mic} Start voice chat`;
    muteBtn.classList.remove("is-muted");
    if (message) showNote(message);
  }

  async function startCall() {
    if (live) return;
    hideNote();

    if (!configured) {
      showNote("Our voice line is warming up — it isn't connected just yet. Call us directly at (913) 238-6184, or try again soon!");
      console.warn(
        "[Horner voice agent] Not configured. Add your Vapi PUBLIC key and assistant ID in js/agent-config.js."
      );
      return;
    }

    try {
      startBtn.disabled = true;
      startBtn.innerHTML = "Connecting…";
      setStatus("Connecting…");

      if (!vapi) {
        const mod = await import("https://esm.sh/@vapi-ai/web");
        const Vapi = mod.default;
        vapi = new Vapi(cfg.vapiPublicKey);

        vapi.on("call-start", () => {
          enterLive();
          setStatus("Listening…");
        });
        vapi.on("call-end", () => exitLive("Thanks for chatting! Start again any time."));
        vapi.on("speech-start", () => live && setStatus(`${cfg.agentName} is speaking…`));
        vapi.on("speech-end", () => live && setStatus("Listening…"));
        vapi.on("volume-level", (v) => {
          if (ring) ring.style.transform = `scale(${1 + Math.min(v || 0, 1) * 0.35})`;
        });
        vapi.on("message", (m) => {
          if (m && m.type === "transcript" && m.transcript) {
            addLine(m.role === "user" ? "user" : "agent", m.transcript, m.transcriptType === "final");
          }
        });
        vapi.on("error", (err) => {
          console.error("[Horner voice agent]", err);
          exitLive("Hmm, the line dropped. Please try again — or call us at (913) 238-6184.");
        });
      }

      await vapi.start(cfg.vapiAssistantId);
    } catch (err) {
      console.error("[Horner voice agent]", err);
      exitLive(
        err && String(err).toLowerCase().includes("permission")
          ? "We need microphone access for a voice chat — please allow it and try again."
          : "Couldn't connect just now. Please try again, or call us at (913) 238-6184."
      );
    }
  }

  startBtn.addEventListener("click", startCall);

  endBtn.addEventListener("click", () => {
    if (vapi) vapi.stop();
    exitLive("Thanks for chatting! Start again any time.");
  });

  muteBtn.addEventListener("click", () => {
    if (!vapi || !live) return;
    const muted = !vapi.isMuted();
    vapi.setMuted(muted);
    muteBtn.classList.toggle("is-muted", muted);
    muteBtn.setAttribute("aria-label", muted ? "Unmute microphone" : "Mute microphone");
    setStatus(muted ? "Muted" : "Listening…");
  });

  /* keep the call alive if the visitor navigates panels; end it on page exit */
  window.addEventListener("pagehide", () => { if (vapi && live) vapi.stop(); });
})();
