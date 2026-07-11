package com.localautomationhub.agent.device;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/device")
public class DeviceController {
    private final DeviceStatusService deviceStatusService;

    public DeviceController(DeviceStatusService deviceStatusService) {
        this.deviceStatusService = deviceStatusService;
    }

    @GetMapping("/status")
    public DeviceStatusResponse status() {
        return deviceStatusService.getStatus();
    }
}
