import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserPlus, UserMinus, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Member {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  active: boolean;
}

const MyGroupPage = () => {
  const navigate = useNavigate();
  const { isGroupAdmin, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [members] = useState<Member[]>([
    { id: '1', name: 'Mohamed Khelifi', email: 'mohamed@rct.tn', joinDate: '2024-01-15', active: true },
    { id: '2', name: 'Leila Mansour', email: 'leila@rct.tn', joinDate: '2024-02-20', active: true },
    { id: '3', name: 'Amira Bouazizi', email: 'amira@rct.tn', joinDate: '2024-03-10', active: false },
    { id: '4', name: 'Karim Mejri', email: 'karim@rct.tn', joinDate: '2024-01-05', active: true },
  ]);

  if (!isGroupAdmin) {
    return <div className="p-4">Accès refusé</div>;
  }

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeMembersCount = members.filter(m => m.active).length;

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (confirm(`Retirer ${memberName} du groupe ${user?.group} ?`)) {
      alert('Membre retiré du groupe');
    }
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
          <h1 className="font-display font-extrabold text-2xl">Groupe {user?.group}</h1>
          <p className="text-sm text-muted-foreground">Responsable de groupe</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl rct-shadow-card p-3 text-center">
            <p className="text-2xl font-display font-bold rct-text-gradient">{members.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total membres</p>
          </div>
          <div className="bg-card rounded-xl rct-shadow-card p-3 text-center">
            <p className="text-2xl font-display font-bold text-green-600">{activeMembersCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Actifs</p>
          </div>
          <div className="bg-card rounded-xl rct-shadow-card p-3 text-center">
            <p className="text-2xl font-display font-bold text-orange-600">{members.length - activeMembersCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Inactifs</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 mb-4 grid grid-cols-2 gap-3">
        <button className="py-3 rounded-xl rct-gradient-hero text-white font-semibold flex items-center justify-center gap-2">
          <UserPlus className="w-5 h-5" />
          Ajouter
        </button>
        <button className="py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors font-semibold flex items-center justify-center gap-2">
          <Users className="w-5 h-5" />
          Voir tous
        </button>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un membre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {/* Members List */}
      <div className="px-4 space-y-3">
        {filteredMembers.map(member => (
          <div key={member.id} className="bg-card rounded-xl rct-shadow-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{member.name}</h3>
                  {member.active && (
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{member.email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Membre depuis {new Date(member.joinDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleRemoveMember(member.id, member.name)}
              className="w-full py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <UserMinus className="w-4 h-4" />
              Retirer du groupe
            </button>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Aucun membre trouvé
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGroupPage;
