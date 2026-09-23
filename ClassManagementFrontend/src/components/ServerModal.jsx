import React, { useState } from "react";
import { Server, Check, RefreshCw, X, Globe, HardDrive } from "lucide-react";
import axios from "axios";
import { getBaseUrl, setBaseUrl } from "../resigterAndLogin";

export default function ServerModal({ isOpen, onClose, onServerChange, showToast }) {
  const currentUrl = getBaseUrl();
  const [customUrl, setCustomUrl] = useState(currentUrl);
  const [testing, setTesting] = useState(false);
  const [pingStatus, setPingStatus] = useState(null); // { success: boolean, message: string }

  if (!isOpen) return null;

  const testConnection = async (urlToTest) => {
    setTesting(true);
    setPingStatus(null);
    try {
      const start = Date.now();
      await axios.get(`${urlToTest.trim().replace(/\/+$/, "")}/course/getallcourse`, { timeout: 8000 });
      const latency = Date.now() - start;
      setPingStatus({
        success: true,
        message: `Connected successfully! (${latency}ms latency)`
      });
    } catch (err){
      setPingStatus({
        success: false,
        message: err.code === "ECONNABORTED"
          ? "Connection timed out (backend may be sleeping or unreachable)"
          : `Connection failed: ${err.message || "Cannot connect to server"}`
      });
    } finally {
      setTesting(false);
    }
  };

  const handleApply = (url) => {
    setBaseUrl(url);
    if (onServerChange) onServerChange(url);
    if (showToast) showToast(`API server set to: ${url}`, "info");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Server className="text-primary" size={22} />
            <h3 className="modal-title">Backend API Configuration</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p className="modal-subtitle">
          Select whether to connect to the live Render cloud backend or your local Spring Boot server.
        </p>

        <div className="server-options-grid">
          {/* Option 1: Render Cloud */}
          <div
            className={`server-option-card ${currentUrl.includes("onrender.com") ? "active" : ""}`}
            onClick={() => {
              setCustomUrl("https://classmanagement-backend.onrender.com");
              testConnection("https://classmanagement-backend.onrender.com");
            }}
          >
            <div className="server-option-info">
              <div className="server-option-badge">
                <Globe size={16} /> Cloud Production
              </div>
              <div className="server-option-url">https://classmanagement-backend.onrender.com</div>
              <div className="server-option-desc">Deployed Render instance (free tier might sleep)</div>
            </div>
            {currentUrl.includes("onrender.com") && <Check size={18} className="text-success" />}
          </div>

          {/* Option 2: Localhost */}
          <div
            className={`server-option-card ${currentUrl.includes("localhost:8080") ? "active" : ""}`}
            onClick={() => {
              setCustomUrl("http://localhost:8080");
              testConnection("http://localhost:8080");
            }}
          >
            <div className="server-option-info">
              <div className="server-option-badge">
                <HardDrive size={16} /> Local Server
              </div>
              <div className="server-option-url">http://localhost:8080</div>
              <div className="server-option-desc">Running locally via `mvnw spring-boot:run`</div>
            </div>
            {currentUrl.includes("localhost:8080") && <Check size={18} className="text-success" />}
          </div>
        </div>

        {/* Custom URL Input */}
        <div className="custom-server-box">
          <label className="input-label">Custom API URL:</label>
          <div className="input-btn-group">
            <input
              type="text"
              className="custom-input"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="e.g. http://localhost:8080"
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => testConnection(customUrl)}
              disabled={testing}
              style={{ width: "auto" }}
            >
              <RefreshCw size={16} className={testing ? "spin" : ""} />
              {testing ? "Testing..." : "Test Ping"}
            </button>
          </div>
        </div>

        {pingStatus && (
          <div className={`ping-status-banner ${pingStatus.success ? "ping-success" : "ping-error"}`}>
            {pingStatus.message}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => handleApply(customUrl)}>
            Save & Switch Server
          </button>
        </div>
      </div>
    </div>
  );
}

