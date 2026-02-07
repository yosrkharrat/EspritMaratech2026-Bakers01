import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, UserPlus, Shield, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coach' | 'group_admin' | 'member';
  group: string;
  active: boolean;
}

const ManageUsersPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  useEffect(() => {
    // Simuler des données utilisateurs
    setUsers([
      { id: '1', name: 'Ahmed Ben Salem', email: 'admin@rct.tn', role: 'admin', group: 'Élite', active: true },
      { id: '2', name: 'Fatma Trabelsi', email: 'coach@rct.tn', role: 'coach', group: 'Élite', active: true },
      { id: '3', name: 'Mohamed Khelifi', email: 'mohamed@rct.tn', role: 'member', group: 'Intermédiaire', active: true },
      { id: '4', name: 'Leila Mansour', email: 'leila@rct.tn', role: 'member', group: 'Intermédiaire', active: true },
      { id: '5', name: 'Youssef Chaabane', email: 'youssef@rct.tn', role: 'group_admin', group: 'Débutant', active: true },
    ]);
  }, []);

  if (!isAdmin) {
    return <div className="p-4">Accès refusé</div>;
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const roleLabel = (role: string) => {
    switch(role) {
      case 'admin': return 'Comité Directeur';
      case 'coach': return 'Admin Coach';
      case 'group_admin': return 'Responsable Groupe';
      default: return 'Adhérant';
    }
  };

  const roleColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      case 'coach': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'group_admin': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  return (
    <div className="pb-20 pt-6">
      {/* Header */}
      <div className="px-4 mb-6 flex items-center gap-3">
        <button 
          onClick={() => navigate('/admin')}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-extrabold text-2xl">Gestion Utilisateurs</h1>
          <p className="text-sm text-muted-foreground">{users.length} comptes au total</p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 mb-4">
        <button
          onClick={() => navigate('/admin/create-user')}
          className="w-full py-3 rounded-xl rct-gradient-hero text-white font-semibold flex items-center justify-center gap-2"
        >
          <UserPlus className="w-5 h-5" />
          Créer un nouveau compte
        </button>
      </div>

      {/* Search & Filter */}
      <div className="px-4 mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border-0 focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {['all', 'admin', 'coach', 'group_admin', 'member'].map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                filterRole === role ? 'rct-gradient-hero text-white' : 'bg-muted'
              }`}
            >
              {role === 'all' ? 'Tous' : roleLabel(role)}
            </button>
          ))}
        </div>
      </div>

      {/* Users List */}
      <div className="px-4 space-y-3">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-card rounded-xl rct-shadow-card p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{user.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Groupe: {user.group}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${roleColor(user.role)}`}>
                {roleLabel(user.role)}
              </span>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                <Edit2 className="w-4 h-4" />
                Modifier
              </button>
              {user.role === 'admin' && (
                <button className="flex-1 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  Gérer rôle
                </button>
              )}
              <button className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Aucun utilisateur trouvé
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsersPage;
