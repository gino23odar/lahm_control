package com.localautomationhub.agent.pairing;

public record CreatePairingSessionResponse(
        String pairingCode,
        String pairingToken,
        long expiresInSeconds,
        String instructions) {
}
