package com.sigsure;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

/**
 * Handles the generation of cryptographic key pairs.
 * This class is responsible for creating a new public and private key
 * using the RSA algorithm. This corresponds to the "Generate Keys" step
 * in the user interface.
 *
 * This implementation is designed to be a clear, backend representation
 * of the key generation logic.
 *
 *
 */
public class KeyGenerator {

    private static final String KEY_PAIR_ALGORITHM = "RSA";
    private static final int RSA_KEY_SIZE = 2048; // A standard, secure key size.

    /**
     * Generates a new RSA public/private key pair. The key pair is generated
     * with a cryptographically strong pseudo-random number generator.
     *
     * @return A KeyPair object containing the generated public and private keys.
     * @throws RuntimeException if the RSA algorithm is not available in the Java environment.
     */
    public KeyPair generateKeyPair() {
        try {
            System.out.println("Initializing KeyPairGenerator with " + KEY_PAIR_ALGORITHM + " algorithm...");
            KeyPairGenerator generator = KeyPairGenerator.getInstance(KEY_PAIR_ALGORITHM);

            // Initialize the key pair generator with a specified key size and a secure random number generator.
            // Using SecureRandom is critical for creating unpredictable and secure keys.
            System.out.println("Setting key size to " + RSA_KEY_SIZE + " bits and using SecureRandom.");
            generator.initialize(RSA_KEY_SIZE, new SecureRandom());

            System.out.println("Generating a new " + RSA_KEY_SIZE + "-bit RSA key pair. This may take a moment...");
            KeyPair keyPair = generator.generateKeyPair();
            System.out.println("Successfully generated key pair.");

            // For demonstration, let's log the format of the generated keys.
            logKeyInfo(keyPair);

            return keyPair;

        } catch (NoSuchAlgorithmException e) {
            System.err.println("FATAL ERROR: The cryptographic algorithm " + KEY_PAIR_ALGORITHM + " is not available in this environment.");
            e.printStackTrace();
            // In a real application, this would be a fatal error, as the core functionality is impossible.
            throw new RuntimeException("Key generation failed due to a missing cryptographic algorithm.", e);
        }
    }

    /**
     * A helper method to log basic information about the generated keys.
     * In a real application, you would handle keys much more carefully.
     *
     * @param keyPair The KeyPair to log information about.
     */
    private void logKeyInfo(KeyPair keyPair) {
        if (keyPair == null || keyPair.getPublic() == null || keyPair.getPrivate() == null) {
            System.err.println("Key information logging failed: KeyPair is incomplete.");
            return;
        }

        String publicKeyFormat = keyPair.getPublic().getFormat(); // e.g., "X.509"
        String privateKeyFormat = keyPair.getPrivate().getFormat(); // e.g., "PKCS#8"

        System.out.println("Public Key Details: Algorithm=" + keyPair.getPublic().getAlgorithm() + ", Format=" + publicKeyFormat);
        System.out.println("Private Key Details: Algorithm=" + keyPair.getPrivate().getAlgorithm() + ", Format=" + privateKeyFormat);

        // A quick preview of the encoded keys (as would be stored or transmitted)
        String encodedPublicKey = Base64.getEncoder().encodeToString(keyPair.getPublic().getEncoded());
        System.out.println("Public Key (Base64 Encoded, first 64 chars): " + encodedPublicKey.substring(0, 64) + "...");
    }
}
