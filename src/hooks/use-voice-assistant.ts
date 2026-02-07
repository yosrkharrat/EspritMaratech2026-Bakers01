import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { eventsApi } from '@/lib/api';

interface VoiceCommand {
  pattern: RegExp;
  handler: (matches: RegExpMatchArray) => Promise<string>;
  description: string;
}

export function useVoiceAssistant() {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if browser supports speech recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.lang = 'fr-FR';
        recognitionRef.current.interimResults = false;
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          handleCommand(text);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Voice commands
  const commands: VoiceCommand[] = [
    {
      pattern: /(?:y[- ]?a[- ]?t[- ]?il|est[- ]?ce qu'il y a|il y a|quels?|combien).*(course|événement|sortie|entraînement|training).*(aujourd'hui|ce jour|maintenant)/i,
      handler: async () => {
        try {
          const today = new Date().toISOString().split('T')[0];
          const result = await eventsApi.getAll({ date: today });
          
          if (result.success && result.data.length > 0) {
            const events = result.data;
            const plural = events.length > 1 ? 's' : '';
            let message = `Il y a ${events.length} événement${plural} aujourd'hui. `;
            
            events.forEach((event: any, index: number) => {
              const time = new Date(event.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
              message += `${index + 1}. ${event.title} à ${time}. `;
            });
            
            return message;
          } else {
            return "Il n'y a aucun événement prévu aujourd'hui.";
          }
        } catch (error) {
          return "Désolé, je n'ai pas pu récupérer les événements.";
        }
      },
      description: "Lister les événements du jour"
    },
    {
      pattern: /(?:y[- ]?a[- ]?t[- ]?il|quels?).*(course|événement|sortie).*(demain|tomorrow)/i,
      handler: async () => {
        try {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const dateStr = tomorrow.toISOString().split('T')[0];
          const result = await eventsApi.getAll({ date: dateStr });
          
          if (result.success && result.data.length > 0) {
            const events = result.data;
            const plural = events.length > 1 ? 's' : '';
            let message = `Il y a ${events.length} événement${plural} demain. `;
            
            events.forEach((event: any, index: number) => {
              const time = new Date(event.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
              message += `${index + 1}. ${event.title} à ${time}. `;
            });
            
            return message;
          } else {
            return "Il n'y a aucun événement prévu demain.";
          }
        } catch (error) {
          return "Désolé, je n'ai pas pu récupérer les événements.";
        }
      },
      description: "Lister les événements de demain"
    },
    {
      pattern: /(?:y[- ]?a[- ]?t[- ]?il|quels?).*(course|événement|sortie).*(semaine|cette semaine|week)/i,
      handler: async () => {
        try {
          const result = await eventsApi.getAll();
          
          if (result.success && result.data.length > 0) {
            const now = new Date();
            const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            
            const weekEvents = result.data.filter((event: any) => {
              const eventDate = new Date(event.date);
              return eventDate >= now && eventDate <= weekEnd;
            });
            
            if (weekEvents.length > 0) {
              const plural = weekEvents.length > 1 ? 's' : '';
              return `Il y a ${weekEvents.length} événement${plural} cette semaine.`;
            } else {
              return "Il n'y a aucun événement prévu cette semaine.";
            }
          } else {
            return "Il n'y a aucun événement prévu cette semaine.";
          }
        } catch (error) {
          return "Désolé, je n'ai pas pu récupérer les événements.";
        }
      },
      description: "Lister les événements de la semaine"
    },
    {
      pattern: /(?:qui|quel).*(je|suis|mon nom|utilisateur|connecté)/i,
      handler: async () => {
        if (user) {
          return `Vous êtes connecté en tant que ${user.name}.`;
        } else {
          return "Vous n'êtes pas connecté.";
        }
      },
      description: "Info utilisateur"
    },
    {
      pattern: /(?:aide|help|commande|que peux[- ]?tu faire|qu'est[- ]?ce que tu peux faire)/i,
      handler: async () => {
        return `Je peux vous aider avec les commandes suivantes : 
        Demandez-moi les événements d'aujourd'hui, de demain, ou de la semaine.
        Demandez-moi qui vous êtes.
        Dites "naviguer vers calendrier" pour aller au calendrier.
        Dites "retour" pour revenir en arrière.`;
      },
      description: "Aide et commandes disponibles"
    },
    {
      pattern: /(?:aller|naviguer|ouvrir|va).*(calendrier|calendar)/i,
      handler: async () => {
        window.location.hash = '#/calendar';
        return "Navigation vers le calendrier.";
      },
      description: "Aller au calendrier"
    },
    {
      pattern: /(?:aller|naviguer|ouvrir|va).*(profil|profile)/i,
      handler: async () => {
        window.location.hash = '#/profile';
        return "Navigation vers votre profil.";
      },
      description: "Aller au profil"
    },
    {
      pattern: /(?:aller|naviguer|ouvrir|va).*(communauté|community|feed)/i,
      handler: async () => {
        window.location.hash = '#/community';
        return "Navigation vers la communauté.";
      },
      description: "Aller à la communauté"
    },
    {
      pattern: /(?:retour|précédent|back|revenir)/i,
      handler: async () => {
        window.history.back();
        return "Retour à la page précédente.";
      },
      description: "Retour arrière"
    },
    {
      pattern: /(?:bonjour|salut|hello|hey)/i,
      handler: async () => {
        const hour = new Date().getHours();
        let greeting = "Bonjour";
        if (hour < 12) greeting = "Bonjour";
        else if (hour < 18) greeting = "Bon après-midi";
        else greeting = "Bonsoir";
        
        return `${greeting} ! Je suis votre assistant vocal RCT Connect. Comment puis-je vous aider ?`;
      },
      description: "Salutation"
    }
  ];

  const handleCommand = async (text: string) => {
    console.log('Processing command:', text);
    
    // Find matching command
    for (const command of commands) {
      const matches = text.match(command.pattern);
      if (matches) {
        try {
          const result = await command.handler(matches);
          setResponse(result);
          speak(result);
          return;
        } catch (error) {
          console.error('Command handler error:', error);
        }
      }
    }
    
    // No command matched
    const fallback = "Je n'ai pas compris votre demande. Dites 'aide' pour connaître les commandes disponibles.";
    setResponse(fallback);
    speak(fallback);
  };

  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      speak("Désolé, la reconnaissance vocale n'est pas supportée par votre navigateur.");
      return;
    }
    
    try {
      setTranscript('');
      setResponse('');
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting recognition:', error);
    }
  }, [speak]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const toggle = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    response,
    isEnabled,
    startListening,
    stopListening,
    stopSpeaking,
    speak,
    toggle,
    isSupported: !!recognitionRef.current && !!synthRef.current,
  };
}
