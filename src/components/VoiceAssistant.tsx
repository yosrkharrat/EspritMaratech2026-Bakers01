import { Mic, MicOff, Volume2, VolumeX, HelpCircle, X } from 'lucide-react';
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';
import { useEffect, useState } from 'react';

const VoiceAssistant = () => {
  const {
    isListening,
    isSpeaking,
    transcript,
    response,
    isEnabled,
    startListening,
    stopListening,
    stopSpeaking,
    toggle,
    isSupported,
  } = useVoiceAssistant();

  const [isExpanded, setIsExpanded] = useState(false);

  // Keyboard shortcut: Ctrl/Cmd + Shift + V to toggle assistant
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'V') {
        e.preventDefault();
        toggle();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggle]);

  if (!isSupported) {
    return null;
  }

  if (!isEnabled) {
    return (
      <button
        onClick={toggle}
        className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full bg-[#FC4C02] text-white shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        aria-label="Activer l'assistant vocal (Raccourci: Ctrl+Shift+V)"
        title="Activer l'assistant vocal&#10;Raccourci: Ctrl+Shift+V"
      >
        <Volume2 className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-24 right-4 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
      style={{ width: isExpanded ? '320px' : '280px' }}
      role="dialog"
      aria-label="Assistant vocal RCT Connect"
      aria-live="polite"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-[#FC4C02] text-white rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          <span className="font-display font-bold text-sm">Assistant Vocal</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label={isExpanded ? "Réduire" : "Agrandir"}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <button
            onClick={toggle}
            className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Fermer l'assistant vocal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Status */}
        <div className="text-center">
          {isListening ? (
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-red-500 mx-auto animate-pulse flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Je vous écoute...
              </p>
            </div>
          ) : isSpeaking ? (
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-500 mx-auto animate-pulse flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Je parle...
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto flex items-center justify-center">
                <MicOff className="w-6 h-6 text-gray-500" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                En attente
              </p>
            </div>
          )}
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
              Vous avez dit :
            </p>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              "{transcript}"
            </p>
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="bg-[#FC4C02]/10 rounded-lg p-3">
            <p className="text-xs font-semibold text-[#FC4C02] mb-1">
              Réponse :
            </p>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {response}
            </p>
          </div>
        )}

        {/* Help (expanded mode) */}
        {isExpanded && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Commandes disponibles :
            </p>
            <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
              <li>• "Y a-t-il des courses aujourd'hui ?"</li>
              <li>• "Événements de demain"</li>
              <li>• "Quels événements cette semaine ?"</li>
              <li>• "Naviguer vers le calendrier"</li>
              <li>• "Qui suis-je ?"</li>
              <li>• "Aide"</li>
            </ul>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-2">
          {isListening ? (
            <button
              onClick={stopListening}
              className="flex-1 h-12 bg-red-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
              aria-label="Arrêter l'écoute"
            >
              <MicOff className="w-5 h-5" />
              Arrêter
            </button>
          ) : isSpeaking ? (
            <button
              onClick={stopSpeaking}
              className="flex-1 h-12 bg-gray-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
              aria-label="Arrêter la lecture"
            >
              <VolumeX className="w-5 h-5" />
              Silence
            </button>
          ) : (
            <button
              onClick={startListening}
              className="flex-1 h-12 bg-[#FC4C02] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 hover:bg-[#e04500]"
              aria-label="Commencer à parler"
            >
              <Mic className="w-5 h-5" />
              Parler
            </button>
          )}
        </div>

        {/* Keyboard shortcut hint */}
        <p className="text-[10px] text-center text-gray-500 dark:text-gray-400">
          Raccourci: Ctrl+Shift+V
        </p>
      </div>
    </div>
  );
};

export default VoiceAssistant;
