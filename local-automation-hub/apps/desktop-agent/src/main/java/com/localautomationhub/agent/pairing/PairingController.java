package com.localautomationhub.agent.pairing;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/pairing")
public class PairingController {
    private final PairingService pairingService;

    public PairingController(PairingService pairingService) {
        this.pairingService = pairingService;
    }

    @PostMapping("/session")
    public CreatePairingSessionResponse createSession() {
        return pairingService.createPairingSession();
    }

    @PostMapping("/confirm")
    public ConfirmPairingResponse confirm(@RequestBody ConfirmPairingRequest request) {
        return pairingService.confirmPairing(request);
    }

    @GetMapping("/devices")
    public ListPairedDevicesResponse devices() {
        return pairingService.listPairedDevices();
    }
}
