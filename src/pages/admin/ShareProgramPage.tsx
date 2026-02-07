import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2, Users, Calendar, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

const ShareProgramPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedProgram, setSelectedProgram] = useState('');
  const [targetGroup, setTargetGroup] = useState('all');
  const [message, setMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Only coaches can share programs
  if (user?.role !== 'coach' && user?.role !== 'admin') {
    return (
      <div className="pb-20 pt-6 px-4">
        <h1 className="font-display font-extrabold text-2xl mb-4">Accès refusé</h1>
        <div className="bg-card rounded-2xl rct-shadow-card p-8 text-center">
          <p className="text-muted-foreground">Seuls les coaches peuvent partager des programmes.</p>
          <button onClick={() => navigate('/admin')} className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-xl font-semibold">
            Retour
          </button>
        </div>
      </div>
    );
  }

  const programs: Program[] = [
    {
      id: '1',
      title: 'Programme 5km Débutant',
      description: 'Programme de 8 semaines pour courir 5km',
      duration: '8 semaines',
      level: 'beginner'
    },
    {
      id: '2',
      title: 'Programme 10km Intermédiaire',
      description: 'Programme de 12 semaines pour améliorer votre temps sur 10km',
      duration: '12 semaines',
      level: 'intermediate'
    },
    {
      id: '3',
      title: 'Programme Semi-Marathon',
      description: 'Programme de 16 semaines pour préparer un semi-marathon',
      duration: '16 semaines',
      level: 'advanced'
    }
  ];

  const groups = [
    { id: 'all', name: 'Tous les membres' },
    { id: 'beginner', name: 'Groupe Débutants' },
    { id: 'intermediate', name: 'Groupe Intermédiaires' },
    { id: 'advanced', name: 'Groupe Avancés' }
  ];

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;

    setIsSharing(true);
    try {
      // TODO: Implement API call
      // await programsApi.share(selectedProgram, targetGroup, message);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/programs');
      }, 1500);
    } catch (error) {
      console.error('Error sharing program:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'beginner':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">Débutant</span>;
      case 'intermediate':
        return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold">Intermédiaire</span>;
      case 'advanced':
        return <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] font-semibold">Avancé</span>;
      default:
        return null;
    }
  };

  return (
    <div className="pb-20 pt-6">
      <div className="flex items-center gap-3 px-4 mb-6">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-extrabold text-xl">Partager un programme</h1>
          <p className="text-xs text-muted-foreground">Distribuer un programme d'entraînement</p>
        </div>
      </div>

      <div className="px-4">
        <div className="bg-card rounded-2xl rct-shadow-card p-5">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Programme partagé!</h3>
              <p className="text-sm text-muted-foreground">Les membres recevront une notification.</p>
            </div>
          ) : (
            <form onSubmit={handleShare} className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-2 block flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Sélectionner un programme
                </label>
                <div className="space-y-2">
                  {programs.map(program => (
                    <label
                      key={program.id}
                      className={`block p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedProgram === program.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-muted hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="program"
                        value={program.id}
                        checked={selectedProgram === program.id}
                        onChange={e => setSelectedProgram(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-sm">{program.title}</h3>
                        {getLevelBadge(program.level)}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{program.description}</p>
                      <p className="text-[10px] text-primary">📅 {program.duration}</p>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-2 block flex items-center gap-2">
                  <Users className="w-4 h-4" /> Groupe cible
                </label>
                <select
                  value={targetGroup}
                  onChange={e => setTargetGroup(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSharing}
                >
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium mb-2 block">Message (optionnel)</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Ajouter un message pour les membres..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  disabled={isSharing}
                />
              </div>

              <button
                type="submit"
                disabled={isSharing || !selectedProgram}
                className="w-full h-11 rct-gradient-hero text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSharing ? (
                  <span>Partage en cours...</span>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    Partager le programme
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs text-blue-800">
            <strong>💡 Info:</strong> Les membres recevront une notification et pourront consulter
            le programme détaillé dans leur espace personnel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareProgramPage;
