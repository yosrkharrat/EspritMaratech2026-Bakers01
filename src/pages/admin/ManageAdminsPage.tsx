import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coach' | 'group_admin';
  groupName?: string;
}

const ManageAdminsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Only admin can manage admins
  if (user?.role !== 'admin') {
    return (
      <div className="pb-20 pt-6 px-4">
        <h1 className="font-display font-extrabold text-2xl mb-4">Accès refusé</h1>
        <div className="bg-card rounded-2xl rct-shadow-card p-8 text-center">
          <p className="text-muted-foreground">Seul le Comité Directeur peut gérer les administrateurs.</p>
          <button onClick={() => navigate('/admin')} className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-xl font-semibold">
            Retour
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchAdmins = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with real API call
        // const response = await usersApi.getByRole(['admin', 'coach', 'group_admin']);
        
        // Mock data
        const mockAdmins: AdminUser[] = [
          { id: '1', name: 'Admin Principal', email: 'admin@rct.tn', role: 'admin' },
          { id: '2', name: 'Coach Mohamed', email: 'coach@rct.tn', role: 'coach' },
          { id: '3', name: 'Youssef Ben Ali', email: 'youssef@rct.tn', role: 'group_admin', groupName: 'Groupe Avancé' }
        ];
        
        setAdmins(mockAdmins);
      } catch (error) {
        console.error('Error fetching admins:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] font-semibold">Comité Dir.</span>;
      case 'coach':
        return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold">Coach</span>;
      case 'group_admin':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">Resp. Groupe</span>;
      default:
        return null;
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir retirer les privilèges d'admin à ${name}?`)) return;
    
    try {
      // TODO: Implement API call
      // await usersApi.removeAdminRole(id);
      setAdmins(admins.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error removing admin:', error);
    }
  };

  return (
    <div className="pb-20 pt-6">
      <div className="flex items-center gap-3 px-4 mb-6">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-display font-extrabold text-xl">Gérer les admins</h1>
          <p className="text-xs text-muted-foreground">Tous les administrateurs du système</p>
        </div>
        <button
          onClick={() => navigate('/admin/create-user')}
          className="w-10 h-10 rounded-full rct-gradient-hero flex items-center justify-center rct-glow-blue"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Rechercher un admin..."
            className="w-full h-11 pl-12 pr-4 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="px-4 space-y-2">
        {isLoading ? (
          <div className="bg-card rounded-2xl rct-shadow-card p-8 text-center">
            <p className="text-muted-foreground text-sm">Chargement...</p>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="bg-card rounded-2xl rct-shadow-card p-8 text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Aucun administrateur trouvé</p>
          </div>
        ) : (
          filteredAdmins.map(admin => (
            <div key={admin.id} className="bg-card rounded-2xl rct-shadow-card p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{admin.name}</h3>
                    {getRoleBadge(admin.role)}
                  </div>
                  <p className="text-xs text-muted-foreground">{admin.email}</p>
                  {admin.groupName && (
                    <p className="text-xs text-primary mt-1">📍 {admin.groupName}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {/* TODO: Navigate to edit */}}
                    className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors"
                  >
                    <Edit className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(admin.id, admin.name)}
                    className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageAdminsPage;
