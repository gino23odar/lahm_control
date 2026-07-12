package com.localautomationhub.agent.pairing;

public record ConfirmPairingResponse(
        boolean paired,
        String deviceId,
        String deviceName,
        String sessionToken) {
}
