package com.localautomationhub.agent.pairing;

public class PairingException extends RuntimeException {
    private final String errorCode;

    public PairingException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
