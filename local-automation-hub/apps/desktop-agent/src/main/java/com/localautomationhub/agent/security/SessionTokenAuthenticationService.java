package com.localautomationhub.agent.security;

import com.localautomationhub.agent.pairing.PairingService;
import org.springframework.stereotype.Service;

@Service
public class SessionTokenAuthenticationService {
    public static final String SESSION_HEADER = "X-Local-Automation-Session";

    private final PairingService pairingService;

    public SessionTokenAuthenticationService(PairingService pairingService) {
        this.pairingService = pairingService;
    }

    /**
     * MVP placeholder for future endpoint protection. Iteration 2 accepts the header and can validate it,
     * but command and integration endpoints are not enforced yet. Future iterations should use this service
     * from a filter/interceptor before allowing paired-device access to sensitive desktop-agent APIs.
     */
    public boolean isValidSessionToken(String sessionToken) {
        return pairingService.isKnownSessionToken(sessionToken);
    }
}
