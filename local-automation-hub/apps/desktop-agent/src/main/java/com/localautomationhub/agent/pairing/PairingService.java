package com.localautomationhub.agent.pairing;

import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;

@Service
public class PairingService {
    public static final Duration PAIRING_SESSION_TTL = Duration.ofMinutes(5);
    private static final String PAIRING_INSTRUCTIONS =
            "Enter this pairing code on the mobile app to connect this device.";

    private final SecureRandom secureRandom;
    private final Clock clock;
    private final Map<String, PairingSession> pairingSessionsByCode = new ConcurrentHashMap<>();
    private final Map<String, PairedDevice> pairedDevicesById = new ConcurrentHashMap<>();
    private final Map<String, String> sessionTokensByDeviceId = new ConcurrentHashMap<>();

    public PairingService() {
        this(new SecureRandom(), Clock.systemUTC());
    }

    PairingService(SecureRandom secureRandom, Clock clock) {
        this.secureRandom = secureRandom;
        this.clock = clock;
    }

    public CreatePairingSessionResponse createPairingSession() {
        removeExpiredPairingSessions();
        String pairingCode = generatePairingCode();
        String pairingToken = generateSecureToken();
        Instant expiresAt = clock.instant().plus(PAIRING_SESSION_TTL);
        pairingSessionsByCode.put(pairingCode, new PairingSession(pairingCode, pairingToken, expiresAt));

        return new CreatePairingSessionResponse(
                pairingCode,
                pairingToken,
                PAIRING_SESSION_TTL.toSeconds(),
                PAIRING_INSTRUCTIONS);
    }

    public ConfirmPairingResponse confirmPairing(ConfirmPairingRequest request) {
        if (request == null || isBlank(request.pairingCode())) {
            throw new PairingException("missing_pairing_code", "A pairing code is required.");
        }
        if (isBlank(request.deviceName())) {
            throw new PairingException("missing_device_name", "A device name is required.");
        }

        PairingSession session = pairingSessionsByCode.remove(request.pairingCode());
        if (session == null) {
            throw new PairingException("invalid_pairing_code", "The pairing code is invalid or has already been used.");
        }
        if (session.isExpired(clock.instant())) {
            throw new PairingException("expired_pairing_code", "The pairing code has expired. Create a new pairing session.");
        }

        String deviceId = UUID.randomUUID().toString();
        String sessionToken = generateSecureToken();
        Instant now = clock.instant();
        PairedDevice pairedDevice = new PairedDevice(deviceId, request.deviceName().trim(), now, now);
        pairedDevicesById.put(deviceId, pairedDevice);
        sessionTokensByDeviceId.put(deviceId, sessionToken);

        return new ConfirmPairingResponse(true, deviceId, pairedDevice.deviceName(), sessionToken);
    }

    public ListPairedDevicesResponse listPairedDevices() {
        List<PairedDevice> devices = pairedDevicesById.values().stream()
                .sorted((left, right) -> left.pairedAt().compareTo(right.pairedAt()))
                .toList();
        return new ListPairedDevicesResponse(devices);
    }

    public boolean isKnownSessionToken(String sessionToken) {
        if (isBlank(sessionToken)) {
            return false;
        }
        return sessionTokensByDeviceId.values().stream()
                .anyMatch(sessionToken::equals);
    }

    private String generatePairingCode() {
        String code;
        do {
            code = String.format("%06d", secureRandom.nextInt(1_000_000));
        } while (pairingSessionsByCode.containsKey(code));
        return code;
    }

    private String generateSecureToken() {
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    private void removeExpiredPairingSessions() {
        Instant now = clock.instant();
        pairingSessionsByCode.entrySet().removeIf(entry -> entry.getValue().isExpired(now));
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
