"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useEmergencyAlerts } from "@/lib/hooks/useEmergencyAlerts";
import EmergencyAlert from "@/components/alerts/EmergencyAlert";

const queryClient = new QueryClient();

function EmergencyAlertProvider({ children }: { children: React.ReactNode }) {
  const { alerts, dismissAlert } = useEmergencyAlerts();

  return (
    <>
      {children}
      {alerts.map((alert) => (
        <EmergencyAlert
          key={alert.id}
          alert={alert}
          onDismiss={() => dismissAlert(alert.id)}
          allowDismiss={alert.severity !== 'critical'}
        />
      ))}
    </>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <EmergencyAlertProvider>
        {children}
      </EmergencyAlertProvider>
    </QueryClientProvider>
  );
}
