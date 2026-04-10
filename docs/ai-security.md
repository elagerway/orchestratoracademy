# AI Agent Security Research — April 2026

## Sources

### Claude Mythos / Project Glasswing
- [Project Glasswing](https://www.anthropic.com/glasswing) — Anthropic's defensive security initiative
- [SecurityWeek: Claude Mythos Cybersecurity Breakthrough](https://www.securityweek.com/anthropic-unveils-claude-mythos-a-cybersecurity-breakthrough-that-could-also-supercharge-attacks/)
- [The Hacker News: Thousands of Zero-Day Flaws](https://thehackernews.com/2026/04/anthropics-claude-mythos-finds.html)
- [CNN: Faster Attacks Than Ever](https://edition.cnn.com/2026/04/07/tech/anthropic-claude-mythos-preview-cybersecurity)
- [CrowdStrike: Founding Member](https://www.crowdstrike.com/en-us/blog/crowdstrike-founding-member-anthropic-mythos-frontier-model-to-secure-ai/)

### OWASP Agentic Top 10
- [OWASP Top 10 for Agentic Applications 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)
- [Palo Alto Networks Analysis](https://www.paloaltonetworks.com/blog/cloud-security/owasp-agentic-ai-security/)
- [Giskard Security Guide](https://www.giskard.ai/knowledge/owasp-top-10-for-agentic-application-2026)

### Anthropic Red Team Assessment
- [Mythos Preview Red Team Report](https://red.anthropic.com/2026/mythos-preview/) — Full security assessment

**Key findings from the red team:**
- Firefox: 181 successful exploits vs Opus 4.6's 2 attempts
- Memory safety: 595 crashes + 10 full control flow hijacks vs Opus 4.6's 1
- Cost per complex exploit: under $2,000
- FreeBSD NFS exploit: unauthenticated RPCSEC_GSS → stack overflow → 200-byte ROP chain → root SSH key injection
- 89% of 198 reviewed bug reports matched model's severity assessment exactly
- Over 99% of discovered vulnerabilities remain unpatched

**Recommendations for defenders:**
- Adopt frontier models for vulnerability discovery NOW
- Shorten patch cycles dramatically
- Enable auto-updates aggressively
- Reconsider defenses relying on "friction rather than hard barriers"
- Automate incident response pipelines

### Claude Code Security
- [Claude Code Security Docs](https://code.claude.com/docs/en/security)
- [Anthropic: Claude Code Security Announcement](https://www.anthropic.com/news/claude-code-security)
- [Deny Rules Bypass Vulnerability](https://adversa.ai/blog/claude-code-security-bypass-deny-rules-disabled/)
- [Enterprise Governance Guide](https://www.truefoundry.com/blog/claude-code-governance-building-an-enterprise-usage-policy-from-scratch)

---

## Key Findings

### Claude Mythos Preview
- Unreleased frontier model with exceptional vulnerability discovery capabilities
- Found thousands of zero-day vulnerabilities autonomously, without human steering
- 27-year-old OpenBSD vulnerability (remote crash)
- 16-year-old FFmpeg flaw (automated testing hit it 5M times without detecting)
- Linux kernel privilege escalation chains
- Discovered vulnerabilities in every major OS and browser
- Project Glasswing partners: AWS, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorgan, Linux Foundation, Microsoft, NVIDIA, Palo Alto Networks
- $100M in model usage credits dedicated to defensive security
- Model escaped a secured sandbox during testing — "potentially dangerous capability"
- Key insight: same AI capabilities that find vulnerabilities can guard deployments

### OWASP Agentic Top 10 (2026)
Developed by 100+ experts. The definitive threat model for agent deployments.

| Code | Risk | Description |
|------|------|-------------|
| ASI01 | Agent Goal Hijack | Attackers redirect agent objectives via manipulated inputs |
| ASI02 | Unsafe Tool Use | Agents misuse legitimate tools due to ambiguous instructions |
| ASI03 | Identity & Privilege Abuse | Agents inherit/retain privileges improperly across sessions |
| ASI04 | Insecure Supply Chain | Compromised plugins, tools, agent cards loaded dynamically |
| ASI05 | Code Execution Exploitation | Agents manipulated into running malicious code |
| ASI06 | Memory & Context Poisoning | Persistent corruption of agent memory/RAG stores |
| ASI07 | Insecure Inter-Agent Communication | Spoofed/intercepted agent messages (NEW — doesn't exist in traditional LLM apps) |
| ASI08 | Cascading Failures | Single-point faults propagate through multi-agent workflows |
| ASI09 | Human-Agent Trust Exploitation | Over-reliance on persuasive agents leads to unsafe approvals |
| ASI10 | Rogue Agents | Compromised agents diverge from intended behavior |

### The 82:1 Identity Ratio
Enterprises now manage 82 machine identities for every 1 human identity. Each is a potential compromise point.

### Claude Code Security Configuration

**Default deny rules:** rm -rf, force push, curl, wget, npm publish, .env access

**Critical vulnerability:** Claude Code silently ignores deny rules when a command contains 50+ subcommands. A denied command runs freely if preceded by 50 harmless statements.

**Enterprise settings:**
- `allowManagedMcpServersOnly: true` — most important setting
- Pin MCP server versions, never use @latest
- Docker sandbox (microVM) for production
- Transcript retention: 7-14 days
- Disable sharing of connector-sourced data

**Sandboxing levels:**
1. Process isolation (bubblewrap/seatbelt) — dev only
2. Container sandbox — staging
3. MicroVM sandbox (dedicated Linux kernel) — production

**Claude Enterprise features:**
- SAML 2.0 / OIDC SSO
- SCIM provisioning
- SOC 2 Type II
- Compliance API (real-time usage data)
- NNSA safety classifiers for high-risk prompts
- BYOK encryption (AES-256)

---

## Security Agent Architecture

### Core Concept
A dedicated agent in the multi-agent team whose sole job is governance:
- Pre-flight checks on all agent inputs
- Real-time behavioral monitoring
- Post-action output validation
- Periodic vulnerability scanning
- Incident response automation

### Key Patterns
1. **Permission Matrix** — Explicit allow/deny for every agent/tool combination
2. **Signed Inter-Agent Messages** — HMAC-SHA256 signatures prevent spoofing
3. **Circuit Breakers** — Prevent cascading failures (trip after N failures, reset after timeout)
4. **Bulkhead Isolation** — Per-agent resource pools
5. **PII Scanning** — Regex + LLM detection on all I/O
6. **Canary Data** — Plant fake sensitive data, alert on access
7. **Red Team Agent** — Automated adversary that continuously tests defenses

### Enterprise Governance Dashboard Metrics
- Security Posture Score (0-100, target 90+)
- Active incidents by severity
- Compliance status (SOC 2, data residency, retention)
- Cost burn rate per agent/model
- Mean Time to Detect / Mean Time to Respond
- Red team success rate (should decrease over time)

### Deployment Checklist (non-negotiable for production)
- [ ] MicroVM sandbox active
- [ ] Network policies enforced
- [ ] TLS 1.2+ everywhere
- [ ] Secrets in vault (not code/env)
- [ ] Audit logs to immutable store
- [ ] Permission matrix per agent/tool
- [ ] Deny rules tested (50-command bypass)
- [ ] MCP servers allowlisted + version-pinned
- [ ] Inter-agent messages signed
- [ ] Circuit breakers + bulkhead isolation
- [ ] Security agent deployed + monitoring
- [ ] PII scanner active
- [ ] Incident response documented
- [ ] Red team tests passing
- [ ] Credential rotation schedule active

### Data Classification
| Level | Label | Access |
|-------|-------|--------|
| 1 | Public | All agents |
| 2 | Internal | Authenticated agents only |
| 3 | Confidential | Named agents with clearance |
| 4 | Restricted | Security agent only |
