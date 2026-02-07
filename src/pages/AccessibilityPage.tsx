import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AccessibilitySettings from '@/components/AccessibilitySettings';

const AccessibilityPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-20 pt-6">
      <div className="flex items-center gap-3 px-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          aria-label="Retour"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display font-extrabold text-xl">Accessibilité</h1>
      </div>

      <div className="px-4">
        <AccessibilitySettings />
      </div>
    </div>
  );
};

export default AccessibilityPage;
