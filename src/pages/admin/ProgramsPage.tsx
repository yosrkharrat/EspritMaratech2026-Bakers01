import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Share2, Calendar, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Program {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  participants: number;
  createdBy: string;
}

const ProgramsPage = () => {
  const navigate = useNavigate();
  const { isCoach, user } = useAuth();
  const [programs] = useState<Program[]>([
    {
      id: '1',
      title: '5km en 4 semaines',
      description: 'Programme pour courir 5km sans s\'arrêter',
      level: 'Débutant',
      duration: '4 semaines',
      participants: 23,
      createdBy: 'Fatma Trabelsi'
    },
    {
      id: '2',
      title: 'Semi-Marathon',
      description: 'Préparation 12 semaines pour semi-marathon',
      level: 'Intermédiaire',
      duration: '12 semaines',
      participants: 45,
      createdBy: 'Fatma Trabelsi'
    },
    {
      id: '3',
      title: 'Vitesse & Fractionné',
      description: 'Améliorer sa vitesse de pointe',
      level: 'Élite',
      duration: '8 semaines',
      participants: 18,
      createdBy: 'Ahmed Ben Salem'
    }
  ]);

  if (!isCoach) {
    return <div className="p-4">Accès refusé</div>;
  }

  const handleShare = (programId: string) => {
    navigate('/admin/share-program');
  };

  return (
    <div className="pb-20 pt-6">
      {/* Header */}
      <div className="px-4 mb-6 flex items-center gap-3">
        <button 
          onClick={() => navigate('/admin')}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
          aria-label="Retour au panneau d'administration"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-extrabold text-2xl">Programmes</h1>
          <p className="text-sm text-muted-foreground">{programs.length} programmes disponibles</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl rct-shadow-card p-4">
            <p className="text-2xl font-display font-bold rct-text-gradient">{programs.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Programmes actifs</p>
          </div>
          <div className="bg-card rounded-xl rct-shadow-card p-4">
            <p className="text-2xl font-display font-bold rct-text-gradient">
              {programs.reduce((acc, p) => acc + p.participants, 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total abonnés</p>
          </div>
        </div>
      </div>

      {/* Programs List */}
      <div className="px-4 space-y-4">
        {programs.map(program => (
          <div key={program.id} className="bg-card rounded-2xl rct-shadow-card overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h3 className="font-display font-bold text-lg">{program.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{program.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Niveau</p>
                  <p className="text-sm font-semibold mt-1">{program.level}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Durée</p>
                  <p className="text-sm font-semibold mt-1">{program.duration}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Abonnés</p>
                  <p className="text-sm font-semibold mt-1">{program.participants}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <button
                  onClick={() => handleShare(program.id)}
                  className="w-full py-2.5 rounded-xl rct-gradient-hero text-white font-semibold flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Partager aux adhérents
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Program Button */}
      <div className="px-4 mt-6">
        <button className="w-full py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors font-semibold">
          + Créer un nouveau programme
        </button>
      </div>
    </div>
  );
};

export default ProgramsPage;
