package com.localautomationhub.agent.device;

import com.localautomationhub.agent.integrations.IntegrationStatus;
import java.util.List;

public record DeviceStatusResponse(
        String deviceName,
        boolean online,
        List<IntegrationStatus> integrations,
        AutomationEngineStatus automationEngine) {
}
