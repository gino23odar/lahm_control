package com.localautomationhub.agent.pairing;

import java.time.Instant;

public record PairedDevice(
        String deviceId,
        String deviceName,
        Instant pairedAt,
        Instant lastSeenAt) {
}
