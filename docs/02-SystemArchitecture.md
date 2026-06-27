# EthioCred – System Architecture

**Document Version:** 1.0  
**Project:** EthioCred – Secure Academic Credential Verification Platform  
**Architecture Style:** Layered Monolithic Architecture (MVP) with Modular Services  
**Technology Stack:** React + Node.js + Express + PostgreSQL + Node Crypto API

# 1. Introduction

## 1.1 Purpose

This document describes the complete system architecture of EthioCred, a secure digital academic credential issuance and verification platform. It defines the system's major components, architectural principles, data flow, communication patterns, trust relationships, and security mechanisms.

The architecture serves as the technical blueprint for implementing the platform and provides a shared understanding for developers, supervisors, and future maintainers.

# 1.2 System Overview

EthioCred is a secure web-based platform designed to modernize academic credential management through the use of public key cryptography, trusted institution registration, secure identity mapping, and automated verification.

Instead of relying on manually inspected paper certificates, every academic credential issued through EthioCred is digitally signed using the issuing university's private RSA key. Employers can independently verify the authenticity and integrity of a credential using the corresponding public key stored in the system's Trust Registry.

The platform consists of three independent client applications communicating with a centralized REST API backed by PostgreSQL and a dedicated cryptographic subsystem.

The MVP follows a centralized architecture while remaining extensible for future integration with permissioned blockchain networks and distributed verification services.

# 2. Architectural Goals

The architecture has been designed around the following engineering objectives:

### Security

Ensure that every issued credential can be cryptographically verified and cannot be modified without detection.

### Trust

Only authorized and manually verified educational institutions may issue credentials.

### Scalability

Support the addition of universities, employers, credential types, and future distributed technologies without major architectural redesign.

### Maintainability

Separate responsibilities into modular components that are easy to extend, test, and maintain.

### Performance

Provide near real-time credential verification while supporting batch issuance for graduating students.

### Extensibility

Allow future integration of:

- Permissioned blockchain
- Mobile applications
- Real Fayda authentication
- Notification services
- External university APIs
- Background job queues

without changing the core business logic.

# 3. Architectural Principles

EthioCred follows several well-established software engineering principles.

## 3.1 Separation of Concerns

Each major responsibility is isolated into its own module.


| Component            | Responsibility           |
| -------------------- | ------------------------ |
| Frontend             | User interaction         |
| Backend API          | Business logic           |
| Database             | Persistent storage       |
| Crypto Module        | Signing and verification |
| Trust Registry       | Institution validation   |
| Audit Service        | Activity logging         |
| Notification Service | User notifications       |


This separation minimizes coupling and improves maintainability.

## 3.2 Layered Architecture

The system is divided into logical layers.

```text
┌──────────────────────────────────────────┐
│            Presentation Layer            │
│   React Applications (3 Portals)         │
└──────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│             REST API Layer               │
│        Node.js + Express Server          │
└──────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│          Business Logic Layer            │
│ Authentication │ Credentials │ Crypto    │
│ Verification │ Audit │ Notifications     │
└──────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────┐
│           Persistence Layer              │
│             PostgreSQL                   │
└──────────────────────────────────────────┘

```

Each layer communicates only with the layer directly below it, ensuring clear separation of responsibilities.

# 4. High-Level System Architecture

EthioCred consists of three independent frontend applications connected to a centralized backend service.

```text
                         EthioCred Platform

 ┌───────────────────────────────────────────────────────────────┐
 │                                                               │
 │                    React Frontend Clients                     │
 │                                                               │
 │  ┌──────────────┐  ┌─────────────────┐  ┌──────────────────┐  │
 │  │ User Wallet  │  │ University      │  │ Employer Portal  │  │
 │  │              │  │ Portal          │  │                  │  │
 │  └──────┬───────┘  └────────┬────────┘  └────────┬─────────┘  │
 └─────────┼───────────────────┼────────────────────┼────────────┘
           │                   │                    │
           │ HTTPS / JSON      │ HTTPS / CSV        │ HTTPS / JSON
           ▼                   ▼                    ▼

 ┌───────────────────────────────────────────────────────────────┐
 │                    Node.js + Express API                      │
 │                                                               │
 │ Authentication │ Credentials │ Verification │ Crypto │ Audit │
 └───────────────────────────────────────────────────────────────┘
                         │
         ┌───────────────┼─────────────────┐
         ▼               ▼                 ▼

 ┌──────────────┐  ┌───────────────┐  ┌────────────────┐
 │ PostgreSQL   │  │ Crypto Module │  │ Trust Registry │
 │ Database     │  │ RSA + SHA-256 │  │ Public Keys    │
 └──────────────┘  └───────────────┘  └────────────────┘

```

The backend acts as the central orchestrator responsible for coordinating communication between all frontend applications and the underlying security services.

# 5. Core System Components

The EthioCred platform is composed of seven primary architectural components.

## 5.1 User Wallet

The User Wallet is the primary interface for graduates.

Responsibilities include:

- Authenticate using Fayda-linked credentials (simulated for MVP)
- View issued credentials
- Accept or reject employer verification requests
- Generate QR codes
- View notification history
- Download credential information

The wallet never generates or modifies digital signatures.

Its role is limited to secure presentation and controlled sharing.

## 5.2 University Portal

The University Portal is used exclusively by authorized registrar staff.

Its primary responsibilities include:

- Upload graduation batches
- Preview uploaded student data
- Validate CSV formatting
- Issue digitally signed credentials
- Revoke issued credentials
- View issuance history
- Manage institutional information

Only the University Portal is permitted to trigger the credential signing pipeline.

## 5.3 Employer Portal

The Employer Portal allows employers to verify credentials submitted by applicants.

Responsibilities include:

- Employer authentication
- Submit verification requests
- Scan QR codes
- Verify credential authenticity
- Display verification results
- Maintain verification history

The Employer Portal never performs cryptographic operations locally.

All verification occurs on the backend.

# 6. Architectural Characteristics

The MVP architecture possesses the following characteristics:


| Characteristic     | Description                      |
| ------------------ | -------------------------------- |
| Architecture Style | Layered Monolithic               |
| Communication      | RESTful HTTP APIs                |
| Authentication     | JWT-Based                        |
| Authorization      | Role-Based Access Control (RBAC) |
| Database           | PostgreSQL                       |
| Cryptography       | RSA-2048/4096 + SHA-256          |
| Identity Mapping   | Fayda ID (Simulated)             |
| Deployment         | Centralized                      |
| Blockchain         | Planned Future Enhancement       |


# 7. Design Philosophy

EthioCred is not simply a certificate management application.

It is designed as a **digital trust infrastructure**.

Traditional systems ask:

> "Does this certificate look genuine?"

EthioCred instead asks:

> "Can this credential be mathematically proven to originate from a trusted institution, remain unaltered since issuance, and still be considered valid today?"

By shifting trust from visual inspection to cryptographic verification, the platform provides significantly stronger guarantees of authenticity, integrity, and accountability.

This philosophy guides every architectural decision made throughout the system.