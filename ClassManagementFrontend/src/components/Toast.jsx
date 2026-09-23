import React from "react";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => {
        let Icon = Info;
        let iconClass = "toast-icon-info";
        if (toast.type === "success") {
          Icon = CheckCircle2;
          iconClass = "toast-icon-success";
        } else if (toast.type === "error") {
          Icon = AlertCircle;
          iconClass = "toast-icon-error";
        } else if (toast.type === "warning") {
          Icon = AlertTriangle;
          iconClass = "toast-icon-warning";
        }

        return (
          <div
            key={toast.id}
            className={`toast-item toast-${toast.type || "info"}`}
            role="alert"
          >
            <Icon className={`toast-icon ${iconClass}`} size={20} />
            <div className="toast-content">
              {toast.title && <div className="toast-title">{toast.title}</div>}
              <div className="toast-message">{toast.message}</div>
            </div>
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => onDismiss(toast.id)}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

