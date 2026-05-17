# Adobe Reader JS Sandbox Escape — POC

Proof-of-concept for three chained vulnerabilities in Adobe Acrobat/Reader on macOS,
disclosed by STAR Labs in April 2026.

## Vulnerabilities

| CVE | Description | Patched in |
|-----|-------------|------------|
| CVE-2026-34621 | Prototype pollution via collaboration login (`SilentDocCenterLogin`) | 26.001.21368 |
| CVE-2026-34622 | Eval injection via dialog button handler (`ANFancyAlertImpl`) | 26.001.21412 |
| CVE-2026-34626 | Object confusion to escalate to trusted execution context | 26.001.21412 |

**Affected:** Acrobat DC / Reader DC / Acrobat 2024 ≤ 26.001.21411 on macOS and Windows.
**Patches released:** April 12–14, 2026.

Full write-up: https://starlabs.sg/blog/2026/04-three-bugs-walk-into-a-pdf-prototype-pollution-served-cold/

## How it works

1. `ANFancyAlertImpl` evaluates button labels unsanitized — inject arbitrary JS (CVE-2026-34622)
2. Injected code pollutes `Object.prototype.swConn` to hijack `SilentDocCenterLogin` call chain (CVE-2026-34621)
3. Call chain reaches `app.trustedFunction`, promoting arbitrary function to privileged context (CVE-2026-34626)
4. Privileged function calls `app.beginPriv()` + `util.readFileIntoStream()` — sandbox escaped, arbitrary file read

## Build

```bash
pip3 install pypdf
make build   # writes out/malicious-poc.pdf
make clean   # removes out/
```

Open the generated PDF with a vulnerable Reader version to trigger the exploit.

## Disclosure

Vulnerabilities reported to Adobe by EXPMON; independently analyzed and chained by STAR Labs.
This POC is released for educational and defensive purposes after patches were publicly available.
