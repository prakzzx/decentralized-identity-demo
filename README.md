Decentralized Identity Verification System
A client-side, zero-server identity verification system built on Self-Sovereign Identity (SSI) principles. Enables secure, tamper-resistant credential issuance and verification entirely within the browser — without reliance on any centralized infrastructure.

Overview
Traditional identity systems depend on centralized databases that present significant risks: single points of failure, large-scale data breaches, and infrastructure outages that render credentials inaccessible. This system addresses those vulnerabilities by shifting credential ownership entirely to the user.
Credentials are generated, held, and verified without any data leaving the client. There is no server, no database, and no third-party dependency.

Features
FeatureDescriptionIssuer InterfaceGenerates structured, tamper-resistant identity credentialsQR Code ExchangeEncodes credentials into scannable QR codes for contactless presentationVerifier InterfaceDecodes and validates credentials without any server communicationSHA-256 Integrity HashingEnsures credential data has not been modified after issuancePortable Identity PayloadCredentials are self-contained and carried by the userOffline-CapableFully functional without an internet connection after initial page load

System Architecture
┌─────────────────┐        QR Code         ┌──────────────────┐
│   ISSUER        │ ─────────────────────► │   VERIFIER       │
│  (index.html)   │                         │ (verifier.html)  │
│                 │                         │                  │
│ • Build payload │                         │ • Scan QR        │
│ • Hash w SHA-256│                         │ • Decode payload │
│ • Encode to QR  │                         │ • Verify hash    │
└─────────────────┘                         └──────────────────┘
        ↑
   Credential resides
   with the user
No backend. No database. No API calls.

Project Structure
decentralized-identity-demo/
├── index.html          # Issuer interface — credential generation
├── verifier.html       # Verifier interface — QR scanning and validation
├── style.css           # Application styling
├── util.js             # Core logic — SHA-256 hashing and payload serialization
├── qrcode.min.js       # QR code generation (qrcode.js)
└── jsQR.min.js         # QR code scanning (jsQR)

How It Works
1. Credential Issuance
The issuer constructs a structured identity payload containing the subject's claims and a timestamp, then computes a SHA-256 hash of the canonicalized JSON. This hash serves as a tamper-evident seal — any alteration to the credential after issuance, however minor, will produce a completely different hash upon verification.
javascriptconst payload = {
  id: "did:local:abc123",
  claims: { name: "Jane Doe", role: "Student", org: "MIT" },
  issuedAt: "2024-01-15T10:30:00Z",
  hash: sha256(canonicalize(claims))
};
2. QR Code Encoding
The serialized payload is encoded into a QR code using qrcode.js. This QR code functions as the user's portable credential — a self-contained token they present directly to any verifier.
3. Verification
The verifier scans the QR code via jsQR, deserializes the payload, and independently recomputes the SHA-256 hash from the extracted claims. If the recomputed hash matches the hash embedded in the payload, the credential is confirmed valid. The entire process requires no network request and no contact with the original issuer.
Scanned payload  →  extract claims  →  recompute SHA-256  →  compare hashes  →  valid / invalid
This approach mirrors the verification model used in blockchain systems — establishing trust through cryptographic proof rather than through a trusted intermediary.

Concepts Demonstrated
Self-Sovereign Identity (SSI)
SSI is an emerging identity model in which individuals hold and control their own credentials independently of any central authority. This project implements a working prototype of that model — fully client-side, portable, and verifiable in an offline environment.
Decentralized Identifiers (DIDs)
The payload structure is modeled after the W3C DID specification, using a did:local: method namespace to represent locally-issued identifiers. This positions the system as a conceptual foundation for production DID implementations.
Zero-Knowledge-Inspired Verification
The verifier confirms credential integrity without receiving any information from the issuer at verification time. The embedded hash functions as a standalone cryptographic proof — conceptually aligned with zero-knowledge verification techniques.

Security Properties

Tamper Resistance — SHA-256 hashing ensures any modification to credential fields is immediately detectable
No Centralized Attack Surface — there is no database or server that can be breached or taken offline
Privacy by Design — credential data is never transmitted to or logged by any external system
Replay Attack Mitigation — issuedAt timestamps are incorporated into the hash, binding credentials to a point in time


Scope Note: This is a proof-of-concept implementation. A production-grade SSI system would employ asymmetric cryptography (e.g., Ed25519 digital signatures), a live DID registry, and a formal credential revocation mechanism. The SHA-256 hash used here demonstrates data integrity without a full public key infrastructure (PKI).


Real-World Relevance
Failure ModeSystem ResponseCentral database outageCredentials remain accessible on the user's deviceLarge-scale data breachNo centralized credential store exists to compromiseCredential tamperingSHA-256 verification detects any modification at presentation timeIdentity surveillanceNo server logs or tracking of credential usage
Comparable production implementations of this identity model include Microsoft Entra Verified ID, the Sovrin Network, and the EU Digital Identity Wallet (EUDI).

Future Development

Replace SHA-256 integrity hashing with Ed25519 digital signatures to establish cryptographic proof of issuance
Implement a DID resolver backed by a local or IPFS-based registry
Introduce selective disclosure to allow presentation of individual claims without exposing the full credential
Develop a credential revocation list mechanism
Pursue alignment with the W3C Verifiable Credentials (VC) specification
