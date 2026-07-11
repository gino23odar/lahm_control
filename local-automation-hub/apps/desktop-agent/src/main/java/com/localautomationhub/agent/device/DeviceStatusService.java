package com.localautomationhub.agent.device;

import com.localautomationhub.agent.integrations.IntegrationStatus;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DeviceStatusService {
    public DeviceStatusResponse getStatus() {
        return new DeviceStatusResponse(
                "Local PC",
                true,
                List.of(new IntegrationStatus("Discord", "not_configured")),
                new AutomationEngineStatus("disabled_for_mvp"));
    }
}
