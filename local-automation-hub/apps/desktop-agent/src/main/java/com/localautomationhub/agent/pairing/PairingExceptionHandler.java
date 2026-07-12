package com.localautomationhub.agent.pairing;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class PairingExceptionHandler {
    @ExceptionHandler(PairingException.class)
    public ResponseEntity<PairingErrorResponse> handlePairingException(PairingException exception) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new PairingErrorResponse(exception.getErrorCode(), exception.getMessage()));
    }
}
