package com.localautomationhub.agent.commands;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/commands")
public class CommandController {
    private final CommandPreviewService commandPreviewService;

    public CommandController(CommandPreviewService commandPreviewService) {
        this.commandPreviewService = commandPreviewService;
    }

    @PostMapping("/preview")
    public CommandPreviewResponse preview(@RequestBody CommandPreviewRequest request) {
        return commandPreviewService.preview(request);
    }
}
