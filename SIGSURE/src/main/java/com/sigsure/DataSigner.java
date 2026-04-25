package com.sigsure;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.SignatureException;
import java.util.Base64;

/**
 * Handles the creation of digital signatures.
 * This class uses a private key to sign a piece of data, producing a
 * unique signature that proves the data's origin and integrity. This
 * corresponds to the "Sign Data" step in the UI.
 *
 * 
 */
public class DataSigner {

    // SHA256withRSA is a standard and secure algorithm for creating digital signatures.
    private static final String SIGNING_ALGORITHM = "SHA256withRSA";

    /**
     * Signs the given data using the provided private key.
     * The process involves creating a hash of the data and then encrypting that hash
     * with the private key.
     *
     * @param plainTextData The data to be signed. Must not be null.
     * @param privateKey The private key to use for signing. Must not be null.
     * @return A Base64-encoded string representing the digital signature.
     * @throws IllegalArgumentException if input data or key is null.
     * @throws RuntimeException if the signing process fails for cryptographic reasons.
     */
    public String signData(String plainTextData, PrivateKey privateKey) {
        if (plainTextData == null || privateKey == null) {
            System.err.println("Error: Data to sign and private key cannot be null.");
            throw new IllegalArgumentException("Input data and private key are required.");
        }

        try {
            System.out.println("Initializing Signature object with algorithm: " + SIGNING_ALGORITHM);
            Signature privateSignature = Signature.getInstance(SIGNING_ALGORITHM);

            // Initialize the Signature object for signing with the private key.
            privateSignature.initSign(privateKey);
            System.out.println("Signature object initialized for signing.");

            // Add the data to be signed. Data is converted to bytes using UTF-8 encoding.
            System.out.println("Updating signature object with data to be signed...");
            byte[] dataBytes = plainTextData.getBytes(StandardCharsets.UTF_8);
            privateSignature.update(dataBytes);

            // Generate the signature. This is the final step.
            System.out.println("Generating the digital signature...");
            byte[] signatureBytes = privateSignature.sign();
            System.out.println("Signature generated successfully in binary format.");

            // Encode the binary signature into a Base64 string for easy transport and storage.
            String encodedSignature = Base64.getEncoder().encodeToString(signatureBytes);
            System.out.println("Signature encoded to Base64 for transport.");

            return encodedSignature;

        } catch (NoSuchAlgorithmException e) {
            System.err.println("An unexpected error occurred: The " + SIGNING_ALGORITHM + " algorithm is not available.");
            e.printStackTrace();
            throw new RuntimeException("Data signing failed due to missing algorithm.", e);
        } catch (InvalidKeyException e) {
            System.err.println("An unexpected error occurred: The provided private key is invalid or incompatible.");
            e.printStackTrace();
            throw new RuntimeException("Data signing failed due to an invalid key.", e);
        } catch (SignatureException e) {
            System.err.println("An unexpected error occurred during the signing operation.");
            e.printStackTrace();
            throw new RuntimeException("Data signing failed.", e);
        }
    }
}
