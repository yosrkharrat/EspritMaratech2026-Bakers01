import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { stravaApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';

const StravaCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // userId

    if (!code) {
      setError('Code d\'autorisation manquant');
      setTimeout(() => navigate('/strava'), 2000);
      return;
    }

    if (!state) {
      setError('User ID manquant');
      setTimeout(() => navigate('/strava'), 2000);
      return;
    }

    // Exchange code for tokens
    const exchangeToken = async () => {
      try {
        const response = await stravaApi.exchangeCode(code, state);

        if (response.success) {
          // Success - redirect to Strava page with success message
          navigate('/strava?connected=true', { replace: true });
        } else {
          setError('Erreur lors de la connexion Strava');
          setTimeout(() => navigate('/strava'), 2000);
        }
      } catch (err: any) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Erreur lors de la connexion à Strava');
        setTimeout(() => navigate('/strava'), 2000);
      }
    };

    exchangeToken();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        {error ? (
          <div className="text-red-600 dark:text-red-400">
            <p className="text-xl font-semibold mb-2">Erreur</p>
            <p>{error}</p>
            <p className="text-sm mt-2">Redirection...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#FC4C02] mb-4" />
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Connexion à Strava en cours...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StravaCallbackPage;
