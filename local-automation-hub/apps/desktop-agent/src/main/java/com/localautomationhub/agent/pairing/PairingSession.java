package com.localautomationhub.agent.pairing;

import java.time.Instant;

record PairingSession(String pairingCode, String pairingToken, Instant expiresAt) {
    boolean isExpired(Instant now) {
        return !expiresAt.isAfter(now);
    }
}
