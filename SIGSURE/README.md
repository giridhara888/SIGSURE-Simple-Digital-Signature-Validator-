# SIGSURE: Digital Signature Playground

Welcome to SIGSURE, a web-based application designed to demonstrate the core concepts of digital signatures in a clear and interactive way. This tool allows you to generate key pairs, sign data, and verify signatures, providing a hands-on understanding of how public-key cryptography is used to ensure data integrity and authenticity.

This project was built with Next.js and JavaScript.

## Core Features

The application is organized into a simple, three-step workflow:

1.  **Generate Keys**: Create a unique pair of public and private keys.
    *   **Public Key**: Can be shared freely. It is used to verify signatures.
    *   **Private Key**: Must be kept secret. It is used to create signatures.

2.  **Sign Data**: Use your private key to generate a unique digital signature for any piece of text data. The signature is a cryptographic hash that is intrinsically linked to both the data and your private key.

3.  **Verify Signature**: Confirm the authenticity of a signature. This process uses the public key, the original data, and the signature itself. If the verification is successful, it proves that the data has not been tampered with and was signed by the holder of the corresponding private key.

## Technical Overview

This application is a single-page application built with modern web technologies to demonstrate a frontend-only implementation of a digital signature workflow.

### Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with React)
*   **Language**: JavaScript
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Cryptography (Mock)**: The Web Crypto API (`crypto.subtle`) is used for hashing to simulate the signing and verification process. **Note**: This is a simplified, educational implementation and not intended for production-grade security.

### Architecture

*   **Centralized State**: The main page component (`src/app/page.js`) manages the application's state (public key, private key, data, and signature).
*   **Component-Based Structure**: The UI is broken down into three main interactive components, located in `src/components/sign-verify/`:
    *   `key-generator.js`: Handles the creation of the key pair.
    *   `data-signer.js`: Manages the data input and signature generation.
    *   `signature-verifier.js`: Handles the verification logic and displays the result (Valid or Invalid).
*   **Unidirectional Data Flow**: State is passed down from the main page to the child components as props. Child components use callback functions (also passed as props) to update the central state, ensuring a predictable and maintainable flow of data.
*   **System Diagrams**: For a visual representation of the architecture and data flow, please see the [System Diagrams page](/diagrams).
