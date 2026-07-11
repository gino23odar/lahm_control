package com.localautomationhub.agent.commands;

public record CommandPreviewResponse(
        boolean accepted,
        boolean requiresApproval,
        boolean willExecute,
        String preview) {
}
