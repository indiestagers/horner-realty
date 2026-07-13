/* ============================================================
   HORNER REALTY KC — Voice agent configuration (Vapi)
   ------------------------------------------------------------
   1. Vapi Dashboard → (org) Settings → API Keys → copy the
      *PUBLIC* key (safe for websites — never the private key).
   2. Vapi Dashboard → Assistants → your assistant → copy its ID.
   3. Paste both below. The widget stays in friendly demo mode
      until both values are filled in.
   ============================================================ */

window.HR_AGENT_CONFIG = {
  vapiPublicKey: "",     // e.g. "1a2b3c4d-...."  (PUBLIC key only)
  vapiAssistantId: "",   // e.g. "9f8e7d6c-...."

  agentName: "Ramon",
  tagline: "Your Horner Realty concierge",
  bubbleText: "Hi, I'm Ramon — talk to me!"
};
