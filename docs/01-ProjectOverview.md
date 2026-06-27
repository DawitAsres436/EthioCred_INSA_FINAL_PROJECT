# EthioCred – Project Overview

**Version:** 1.0  
**Project Type:** Final Project  
**Development Team:** *Abebaye Agumasie, Dawit Asefa, Elnathan Nigussie*  
**Technology Stack:** React, Node.js, Express.js, PostgreSQL, Node Crypto API

# 1. Introduction

## 1.1 Background

Academic credentials such as degrees, diplomas, and certificates remain one of the primary methods of validating an individual's educational achievements. However, traditional credential verification methods are often manual, time-consuming, expensive, and vulnerable to document forgery.

Employers frequently spend days or weeks contacting universities to verify certificates, while fraudulent academic documents continue to become increasingly sophisticated. This creates unnecessary delays during recruitment and reduces trust in educational credentials.

EthioCred is designed to address these challenges by providing a secure digital credential issuance and verification platform that leverages modern cryptography, trusted institutional registration, and identity verification.

Rather than relying on visual inspection of certificates, EthioCred allows employers to mathematically verify whether a credential was genuinely issued by an authorized institution and whether the credential has remained unchanged since issuance.

# 2. Project Vision

To create a secure, scalable, and trustworthy digital academic credential ecosystem where educational institutions can issue cryptographically signed credentials, graduates can securely manage their credentials, and employers can instantly verify their authenticity.

# 3. Problem Statement

Current academic credential verification suffers from several major problems:

- Manual verification is slow and resource intensive.
- Paper certificates can be forged or altered.
- Employers often rely on visual inspection rather than cryptographic validation.
- Universities receive repetitive verification requests.
- Students have limited control over who accesses their credentials.
- There is no centralized trust framework connecting universities, graduates, and employers.

These challenges increase verification costs while reducing confidence in academic credentials.

# 4. Proposed Solution

EthioCred introduces a digital trust platform that combines public key cryptography, trusted institution registration, consent-based credential sharing, and automated verification.

Authorized universities digitally sign every issued credential using their private RSA key.

Graduates receive these credentials inside a secure digital wallet linked to their verified Fayda identity.

Employers can submit verification requests through the Employer Portal.

The system verifies:

- The issuing institution is trusted.
- The digital signature is valid.
- The credential has not been modified.
- The credential has not been revoked.
- The student has granted access (when applicable).

If every validation succeeds, the credential is considered authentic.

# 5. Project Objectives

## Primary Objectives

- Develop a secure digital credential management platform.
- Eliminate manual certificate verification.
- Protect credentials against forgery.
- Enable instant verification using cryptographic techniques.
- Build an auditable trust framework between universities and employers.

## Secondary Objectives

- Reduce verification time.
- Improve credential portability.
- Minimize administrative workload for universities.
- Demonstrate the practical application of Public Key Infrastructure (PKI).
- Design an architecture capable of future blockchain integration.

# 6. Scope of the Project

The MVP focuses on academic credential issuance and verification.

The system includes three independent web applications connected to a centralized backend.

### University Portal

Responsible for:

- Institution authentication
- CSV batch upload
- Credential issuance
- Credential revocation
- Issuance history
- Dashboard and reports

### User Wallet

Responsible for:

- Secure login
- Viewing issued credentials
- Managing verification requests
- QR code generation
- Notification center
- Credential sharing

### Employer Portal

Responsible for:

- Employer authentication
- Credential verification
- Verification request management
- Verification reports
- Verification history

### Core Backend

Responsible for:

- Authentication
- Authorization
- REST API
- Database communication
- Digital signature generation
- Signature verification
- Notification management
- Audit logging
- Trust Registry management

# 7. Functional Requirements

The system shall:

- Register trusted institutions.
- Authenticate users securely.
- Issue digital credentials.
- Verify digital signatures.
- Store issued credentials.
- Process CSV graduation batches.
- Allow employers to request credential verification.
- Allow students to approve or deny requests.
- Generate QR codes.
- Revoke credentials.
- Maintain audit logs.
- Manage institution trust status.
- Support future blockchain integration.

# 8. Non-Functional Requirements

## Security

- RSA-2048/4096 Digital Signatures
- SHA-256 Hashing
- JWT Authentication
- Password Hashing using bcrypt
- HTTPS Communication
- Role-Based Access Control
- Secure Key Management

## Performance

- Credential verification should complete within a few seconds.
- Batch issuance should support hundreds of records.
- Database queries should be optimized using indexes.

## Reliability

- High data consistency.
- Transaction-safe credential issuance.
- Secure recovery after failures.

## Scalability

The architecture should support future expansion through:

- Blockchain integration
- Distributed verification nodes
- Multiple universities
- Additional credential types

## Maintainability

The application follows:

- Modular architecture
- MVC design pattern
- Service layer abstraction
- Shared frontend components
- Comprehensive documentation

# 9. Stakeholders

## Students

Receive, manage, and share academic credentials.

## Universities

Issue, revoke, and manage credentials.

## Employers

Verify applicant credentials.

## EthioCred Administrators

Manage trusted institutions.

Approve university registration.

Monitor system activity.

Maintain Trust Registry.

# 10. Core Technologies


| Layer             | Technology         |
| ----------------- | ------------------ |
| Frontend          | React + Vite       |
| Styling           | Tailwind CSS       |
| Backend           | Node.js + Express  |
| Database          | PostgreSQL         |
| Authentication    | JWT                |
| Password Security | bcrypt             |
| Cryptography      | Node.js Crypto API |
| File Upload       | CSV Parser         |
| API               | REST               |
| Version Control   | Git + GitHub       |


---

# 11. Security Principles

EthioCred is designed around five core security principles:

### Trust

Only manually verified educational institutions are allowed to issue credentials.

### Authenticity

Every credential is digitally signed using RSA.

### Integrity

Every credential is hashed using SHA-256.

Any modification invalidates its signature.

### Authorization

Credential access is controlled through authentication and role-based permissions.

### Accountability

Every important action is permanently recorded inside the Audit Log.

# 12. Future Enhancements

Although the MVP focuses on a centralized architecture, the system is intentionally designed for future expansion.

Potential future improvements include:

- Permissioned blockchain integration
- Immutable integrity ledger
- Key rotation support
- Distributed verification nodes
- Mobile wallet application
- API integration with external university systems
- Real Fayda authentication
- Multi-language support
- Push notifications
- Advanced analytics dashboard

# 13. Security Validation Philosophy

EthioCred is designed not only to perform successful credential verification but also to actively resist common security attacks.

The project includes a dedicated Security Validation Suite demonstrating how the system detects and prevents:

- Credential tampering attacks
- Rogue issuer attacks
- Credential revocation bypass attempts

These demonstrations highlight the effectiveness of the system's cryptographic verification pipeline and trust management mechanisms.

# 14. Project Deliverables

The completed project will include:

- Three React web applications
- Express.js backend
- PostgreSQL database
- RESTful API
- RSA-based digital signature engine
- Trust Registry
- Credential issuance workflow
- Verification engine
- Audit logging
- Security validation demonstrations
- Complete technical documentation

# 15. Success Criteria

The project will be considered successful if it can:

- Successfully issue digitally signed academic credentials.
- Verify credential authenticity automatically.
- Detect any unauthorized modification.
- Reject credentials issued by untrusted institutions.
- Reject revoked credentials.
- Demonstrate cryptographic verification in real time.
- Provide a scalable architecture suitable for future blockchain integration.

# 16. Conclusion

EthioCred aims to modernize academic credential verification by replacing manual trust with cryptographic trust.

Through digital signatures, trusted institution registration, secure identity mapping, audit logging, and automated verification, the platform establishes a reliable ecosystem connecting universities, graduates, employers, and system administrators.

The project is designed with extensibility in mind, enabling future adoption of distributed integrity technologies such as permissioned blockchain networks while maintaining compatibility with existing educational infrastructure.