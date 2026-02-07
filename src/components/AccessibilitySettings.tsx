import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Eye, Type, Zap } from 'lucide-react';

const AccessibilitySettings = () => {
  const {
    highContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    reduceMotion,
    toggleReduceMotion,
  } = useAccessibility();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-xl mb-4">
          Paramètres d'accessibilité
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Personnalisez l'application pour une meilleure expérience.
        </p>
      </div>

      {/* High Contrast */}
      <div className="bg-card rounded-2xl rct-shadow-card p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Eye className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-base mb-1">
              Contraste élevé
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Augmente le contraste pour une meilleure lisibilité
            </p>
            <button
              onClick={toggleHighContrast}
              className={`h-10 px-6 rounded-xl font-semibold text-sm transition-colors ${
                highContrast
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
              aria-pressed={highContrast}
              aria-label={`Contraste élevé ${highContrast ? 'activé' : 'désactivé'}`}
            >
              {highContrast ? 'Activé' : 'Désactivé'}
            </button>
          </div>
        </div>
      </div>

      {/* Font Size */}
      <div className="bg-card rounded-2xl rct-shadow-card p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Type className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-base mb-1">
              Taille du texte
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Ajustez la taille du texte selon vos besoins
            </p>
            <div className="flex gap-2">
              {[
                { value: 'normal' as const, label: 'Normal' },
                { value: 'large' as const, label: 'Grand' },
                { value: 'x-large' as const, label: 'Très grand' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFontSize(option.value)}
                  className={`flex-1 h-10 rounded-xl font-semibold text-sm transition-colors ${
                    fontSize === option.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                  aria-pressed={fontSize === option.value}
                  aria-label={`Taille de police ${option.label}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reduce Motion */}
      <div className="bg-card rounded-2xl rct-shadow-card p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-base mb-1">
              Réduire les animations
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Limite les effets visuels et animations
            </p>
            <button
              onClick={toggleReduceMotion}
              className={`h-10 px-6 rounded-xl font-semibold text-sm transition-colors ${
                reduceMotion
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
              aria-pressed={reduceMotion}
              aria-label={`Réduction des animations ${reduceMotion ? 'activée' : 'désactivée'}`}
            >
              {reduceMotion ? 'Activé' : 'Désactivé'}
            </button>
          </div>
        </div>
      </div>

      {/* Voice Assistant Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
        <h3 className="font-display font-semibold text-base mb-2 text-blue-900 dark:text-blue-100">
          Assistant vocal
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
          Utilisez l'assistant vocal pour naviguer dans l'application par commandes vocales.
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400">
          <strong>Raccourci clavier :</strong> Ctrl + Shift + V
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
          Cliquez sur l'icône flottante en bas à droite ou utilisez le raccourci pour activer l'assistant.
        </p>
      </div>

      {/* Screen Reader Info */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800">
        <h3 className="font-display font-semibold text-base mb-2 text-green-900 dark:text-green-100">
          Lecteurs d'écran
        </h3>
        <p className="text-sm text-green-700 dark:text-green-300">
          Cette application est optimisée pour les lecteurs d'écran (NVDA, JAWS, VoiceOver).
          Tous les éléments interactifs disposent de labels descriptifs.
        </p>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
