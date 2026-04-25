package com.sigsure;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.Signature;
import java.security.SignatureException;
import java.util.Base64;

/**
 * Handles the verification of digital signatures.
 * This class uses a public key to verify that a signature corresponds to
 * the original data, ensuring authenticity and integrity. This corresponds to the
 * "Verify Signature" step in the UI.
 *
 * 
 */
public class SignatureVerifier {

    private static final String SIGNING_ALGORITHM = "SHA256withRSA";

    /**
     * Verifies a digital signature against the original data and a public key.
     * This operation proves that the data has not been altered since it was signed
     * and that it was signed by the holder of the corresponding private key.
     *
     * @param plainTextData The original, unsigned data. Must not be null.
     * @param signature     The signature to be verified (in Base64 format). Must not be null.
     * @param publicKey     The public key corresponding to the private key used for signing. Must not be null.
     * @return true if the signature is valid; false otherwise.
     * @throws IllegalArgumentException if any of the inputs are null.
     */
    public boolean verifySignature(String plainTextData, String signature, PublicKey publicKey) {
        if (plainTextData == null || signature == null || publicKey == null) {
            System.err.println("Error: Original data, signature, and public key cannot be null.");
            throw new IllegalArgumentException("Inputs for verification are required.");
        }

        try {
            System.out.println("Initializing Signature object for verification with algorithm: " + SIGNING_ALGORITHM);
            Signature publicSignature = Signature.getInstance(SIGNING_ALGORITHM);

            // Initialize the Signature object for verification with the public key.
            publicSignature.initVerify(publicKey);
            System.out.println("Signature object initialized for verification.");

            // Add the original data that the signature should correspond to.
            System.out.println("Updating signature object with original data for comparison...");
            publicSignature.update(plainTextData.getBytes(StandardCharsets.UTF_8));

            // Decode the Base64 signature back to its binary form for verification.
            System.out.println("Decoding Base64 signature to binary format...");
            byte[] signatureBytes = Base64.getDecoder().decode(signature);

            // Perform the verification.
            // This re-calculates the hash from the original data and compares it to the
            // decrypted hash from the signature.
            System.out.println("Performing verification...");
            return publicSignature.verify(signatureBytes);

        } catch (NoSuchAlgorithmException e) {
            // These exceptions indicate a setup problem (e.g., bad key) and should be logged.
            System.err.println("Verification failed due to a cryptographic configuration error: " + e.getMessage());
            e.printStackTrace();
            return false;
        } catch (InvalidKeyException e) {
            System.err.println("Verification failed due to an invalid or incompatible public key: " + e.getMessage());
            e.printStackTrace();
            return false;
        } catch (SignatureException e) {
            // This exception occurs if the signature is malformed or doesn't verify.
            // This is an expected failure case for an invalid signature and not necessarily an error.
            System.err.println("Signature verification check failed. The signature is invalid or malformed.");
            return false;
        } catch (IllegalArgumentException e) {
            // This occurs if the Base64 signature string is invalid and cannot be decoded.
             System.err.println("Signature verification failed. The signature is not a valid Base64 string.");
             e.printStackTrace();
            return false;
        }
    }
}
