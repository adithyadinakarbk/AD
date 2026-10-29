import React, { useState, useEffect } from 'react';
import { loadSettings, saveSettings, executeAIRequest } from './api';
import { AISettings } from './types';
import { KeyRound, ShieldAlert, Cpu, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<AISettings>({
    provider: 'gemini',
    apiKey: '',
    model: 'gemini-2.5-flash',
  });
  const [showKey, setShowKey] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');
  const [savedNotification, setSavedNotification] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(loadSettings());
      setTestStatus('idle');
      setTestMessage('');
      setSavedNotification(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveSettings(settings);
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
      onClose();
    }, 900);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Verifying connection with headers (x-llm-provider, x-llm-key, x-llm-model)...');
    try {
      saveSettings(settings);
      const res = await executeAIRequest('Test connectivity ping for academic course synthesis.');
      setTestStatus('success');
      setTestMessage(`Connection confirmed. Synthesis engine responded: "${res.slice(0, 80)}..."`);
    } catch (err: unknown) {
      setTestStatus('error');
      setTestMessage(err instanceof Error ? err.message : 'Connection test failed. Verify network or API key.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl academic-card bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Top Header */}
        <div className="bg-[#1E3A5F] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded">
              <Cpu className="w-5 h-5 text-[#80F3DD]" />
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold tracking-tight text-white">
                AI Curriculum Synthesis Settings
              </h3>
              <p className="text-xs text-slate-300">
                Institutional LLM gateway configuration & credentials
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 bg-[#F8FAFC]">
          {/* Security Banner */}
          <div className="flex items-start gap-3 p-3.5 bg-amber-50/80 border-l-4 border-[#D97706] rounded-r text-xs text-slate-700">
            <ShieldAlert className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-900">Accreditation Security Guarantee:</span> Your key is stored exclusively in your browser’s local storage and dispatched directly via authenticated request headers (<code className="bg-amber-100/70 px-1 py-0.5 rounded font-mono">x-llm-key</code>). Keys are never committed to repositories or retained by intermediate servers.
            </div>
          </div>

          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              LLM Provider
            </label>
            <select
              value={settings.provider}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  provider: e.target.value as AISettings['provider'],
                  model:
                    e.target.value === 'gemini'
                      ? 'gemini-2.5-flash'
                      : e.target.value === 'openai'
                      ? 'gpt-4o'
                      : 'claude-3-5-sonnet',
                })
              }
              className="w-full academic-input bg-white text-slate-900"
            >
              <option value="gemini">Google Gemini (Recommended for Curricula & Bloom's Taxonomy)</option>
              <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
              <option value="anthropic">Anthropic Claude (Claude 3.5 Sonnet)</option>
              <option value="custom">Institutional Custom Proxy / Gateway</option>
            </select>
          </div>

          {/* Model Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Model Identifier
            </label>
            <input
              type="text"
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value })}
              placeholder="e.g. gemini-2.5-flash, gemini-2.5-pro, gpt-4o"
              className="w-full academic-input bg-white font-mono text-xs text-slate-900"
            />
          </div>

          {/* API Key */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                API Key (<span className="font-mono lowercase text-[#1E3A5F]">x-llm-key</span>)
              </label>
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-xs text-[#0F9D8A] hover:underline font-medium"
              >
                {showKey ? 'Hide key' : 'Show key'}
              </button>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                placeholder="Paste API Key here (or leave blank for intelligent offline synthesis)"
                className="w-full academic-input bg-white font-mono text-xs text-slate-900 pr-10"
              />
              <KeyRound className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports live generation of Course Outcomes, syllabus unit breakdown, and CO-PO alignment matrices.
            </p>
          </div>

          {/* Test Status feedback */}
          {testStatus !== 'idle' && (
            <div
              className={`p-3 rounded border text-xs flex items-start gap-2 ${
                testStatus === 'testing'
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : testStatus === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              {testStatus === 'testing' && <Sparkles className="w-4 h-4 animate-spin shrink-0 mt-0.5 text-blue-600" />}
              {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />}
              {testStatus === 'error' && <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />}
              <span className="leading-relaxed">{testMessage}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testStatus === 'testing'}
            className="academic-btn-secondary text-xs h-9"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#1E3A5F]" />
            Test Connection
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="academic-btn-primary text-xs h-9 min-w-[100px]"
            >
              {savedNotification ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Settings;
