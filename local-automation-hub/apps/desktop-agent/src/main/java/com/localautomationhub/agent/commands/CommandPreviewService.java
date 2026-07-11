package com.localautomationhub.agent.commands;

import org.springframework.stereotype.Service;

@Service
public class CommandPreviewService {
    private static final String MVP_PREVIEW_MESSAGE =
            "This is a preview only. No command execution is implemented in the MVP foundation.";

    public CommandPreviewResponse preview(CommandPreviewRequest request) {
        return new CommandPreviewResponse(true, true, false, MVP_PREVIEW_MESSAGE);
    }
}
