package com.sigsure;

import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.util.Base64;

/**
 * A command-line demonstration of the SIGSURE application's core logic.
 *
 * This class simulates a user's entire journey through the application:
 * 1. Generates a key pair using KeyGenerator.
 * 2. Signs a sample message using DataSigner.
 * 3. Verifies the signature successfully using SignatureVerifier.
 * 4. Attempts to verify the same signature against tampered data, which correctly fails.
 *
 * This serves as a "backend" entry point to showcase the modular Java logic
 * and how the different components interact.
 */
public class SigsureDemo {

    public static void main(String[] args) {
        System.out.println("--- SIGSURE Core Logic Demonstration ---");
        System.out.println("========================================");

        // Instantiate the logic components that represent our application's services.
        KeyGenerator keyGenerator = new KeyGenerator();
        DataSigner dataSigner = new DataSigner();
        SignatureVerifier signatureVerifier = new SignatureVerifier();

        String originalMessage = "This is a secret message that needs to be authenticated. It must remain unchanged.";
        
        try {
            // --- Step 1: GENERATE KEY PAIR ---
            // This simulates the logic in key-generator.js
            System.out.println("\n[Step 1: GENERATING KEY PAIR]");
            KeyPair keyPair = keyGenerator.generateKeyPair();
            PublicKey publicKey = keyPair.getPublic();
            PrivateKey privateKey = keyPair.getPrivate();


            // --- Step 2: SIGN DATA ---
            // This simulates the logic in data-signer.js
            System.out.println("\n[Step 2: SIGNING DATA]");
            System.out.println("  Original Message: '" + originalMessage + "'");
            String signature = dataSigner.signData(originalMessage, privateKey);
            System.out.println("  Signature Generated (Base64): " + signature);


            // --- Step 3: VERIFY SIGNATURE (Successful Case) ---
            // This simulates a successful verification in signature-verifier.js
            System.out.println("\n[Step 3: VERIFYING SIGNATURE (SUCCESSFUL CASE)]");
            System.out.println("  Attempting to verify the signature against the original message...");
            boolean isSignatureValid = signatureVerifier.verifySignature(originalMessage, signature, publicKey);
            System.out.println("  Verification Result: " + (isSignatureValid ? "VALID" : "INVALID"));
            if (isSignatureValid) {
                System.out.println("  SUCCESS: Correctly identified the signature as valid.");
            } else {
                System.err.println("  FAILURE: Verification failed unexpectedly on original data!");
            }


            // --- Step 4: VERIFY SIGNATURE (Failure Case - Tampered Data) ---
            // This simulates a failed verification due to data tampering.
            System.out.println("\n[Step 4: VERIFYING SIGNATURE (FAILURE CASE - TAMPERED DATA)]");
            String tamperedMessage = "This is a secret massage that needs to be authenticated. It must remain unchanged."; // Typo "massage"
            System.out.println("  Tampered Message: '" + tamperedMessage + "'");
            System.out.println("  Attempting to verify the original signature against the TAMPERED message...");
            isSignatureValid = signatureVerifier.verifySignature(tamperedMessage, signature, publicKey);
            System.out.println("  Verification Result: " + (isSignatureValid ? "VALID" : "INVALID"));
            if (isSignatureValid) {
                System.err.println("  FAILURE: Verification succeeded unexpectedly on tampered data!");
            } else {
                System.out.println("  SUCCESS: Correctly identified the signature as invalid for the tampered data.");
            }

        } catch (Exception e) {
            System.err.println("\nAn unexpected error occurred during the demonstration: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("\n========================================");
        System.out.println("--- Demonstration Complete ---");
    }
}
