package com.biblioteca.backend.security;

import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public final class PasswordHash {
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int ITERATIONS = 600_000;

    private PasswordHash() {}

    public static String create(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Se requiere una contraseña.");
        }
        byte[] salt = new byte[16];
        RANDOM.nextBytes(salt);
        char[] chars = password.toCharArray();
        PBEKeySpec spec = new PBEKeySpec(chars, salt, ITERATIONS, 256);
        try {
            byte[] digest = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
                .generateSecret(spec).getEncoded();
            Base64.Encoder encoder = Base64.getEncoder();
            return "pbkdf2-sha256$" + ITERATIONS + "$" + encoder.encodeToString(salt)
                + "$" + encoder.encodeToString(digest);
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException("PBKDF2 no está disponible.", e);
        } finally {
            spec.clearPassword();
            Arrays.fill(chars, (char) 0);
        }
    }
}
