package com.localautomationhub.agent.pairing;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.security.SecureRandom;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;

class PairingServiceTests {
    @Test
    void createsSixDigitPairingSession() {
        PairingService service = new PairingService(new SecureRandom(), fixedClock());

        CreatePairingSessionResponse response = service.createPairingSession();

        assertThat(response.pairingCode()).matches("\\d{6}");
        assertThat(response.pairingToken()).isNotBlank();
        assertThat(response.expiresInSeconds()).isEqualTo(300);
    }

    @Test
    void confirmsPairingAndListsDeviceWithoutSessionToken() {
        PairingService service = new PairingService(new SecureRandom(), fixedClock());
        CreatePairingSessionResponse session = service.createPairingSession();

        ConfirmPairingResponse response = service.confirmPairing(
                new ConfirmPairingRequest(session.pairingCode(), "Gino's Phone"));

        assertThat(response.paired()).isTrue();
        assertThat(response.deviceId()).isNotBlank();
        assertThat(response.deviceName()).isEqualTo("Gino's Phone");
        assertThat(response.sessionToken()).isNotBlank();
        assertThat(service.isKnownSessionToken(response.sessionToken())).isTrue();
        assertThat(service.listPairedDevices().devices())
                .singleElement()
                .satisfies(device -> {
                    assertThat(device.deviceName()).isEqualTo("Gino's Phone");
                    assertThat(device.deviceId()).isEqualTo(response.deviceId());
                });
    }

    @Test
    void rejectsInvalidPairingCode() {
        PairingService service = new PairingService(new SecureRandom(), fixedClock());

        assertThatThrownBy(() -> service.confirmPairing(new ConfirmPairingRequest("000000", "My Phone")))
                .isInstanceOf(PairingException.class)
                .hasMessageContaining("invalid");
    }

    private static Clock fixedClock() {
        return Clock.fixed(Instant.parse("2026-07-11T23:00:00Z"), ZoneOffset.UTC);
    }
}
