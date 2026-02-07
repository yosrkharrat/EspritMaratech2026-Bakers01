import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Mail, Lock, Users, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const CreateUserPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cin: '',
    role: 'member' as 'admin' | 'coach' | 'group_admin' | 'member',
    groupName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Only admin can create users
  if (user?.role !== 'admin') {
    return (
      <div className="pb-20 pt-6 px-4">
        <h1 className="font-display font-extrabold text-2xl mb-4">Accès refusé</h1>
        <div className="bg-card rounded-2xl rct-shadow-card p-8 text-center">
          <p className="text-muted-foreground">Seul le Comité Directeur peut créer des utilisateurs.</p>
          <button onClick={() => navigate('/admin')} className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-xl font-semibold">
            Retour
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate CIN (3 digits)
      if (!/^\d{3}$/.test(formData.cin)) {
        setError('Le CIN doit contenir exactement 3 chiffres');
        setIsSubmitting(false);
        return;
      }

      // Validate group name for group_admin
      if (formData.role === 'group_admin' && !formData.groupName.trim()) {
        setError('Le nom du groupe est requis pour un Responsable de Groupe');
        setIsSubmitting(false);
        return;
      }

      // TODO: Call API to create user
      // const response = await usersApi.create(formData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/users');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-20 pt-6">
      <div className="flex items-center gap-3 px-4 mb-6">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-extrabold text-xl">Créer un utilisateur</h1>
          <p className="text-xs text-muted-foreground">Ajouter un nouveau membre au système</p>
        </div>
      </div>

      <div className="px-4">
        <div className="bg-card rounded-2xl rct-shadow-card p-5">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Utilisateur créé avec succès!</h3>
              <p className="text-sm text-muted-foreground">Redirection vers la liste des utilisateurs...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1 block flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Nom complet
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Mohamed Ben Ali"
                  className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="mohamed@example.com"
                  className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block flex items-center gap-2">
                  <Lock className="w-4 h-4" /> CIN (3 derniers chiffres)
                </label>
                <input
                  type="text"
                  value={formData.cin}
                  onChange={e => setFormData({ ...formData, cin: e.target.value.slice(0, 3) })}
                  placeholder="123"
                  maxLength={3}
                  pattern="\d{3}"
                  className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-[10px] text-muted-foreground mt-1">Ces 3 chiffres seront utilisés comme mot de passe</p>
              </div>

              <div>
                <label className="text-xs font-medium mb-1 block flex items-center gap-2">
                  <Users className="w-4 h-4" /> Rôle
                </label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isSubmitting}
                >
                  <option value="member">Adhérant</option>
                  <option value="group_admin">Responsable Groupe</option>
                  <option value="coach">Admin Coach</option>
                  <option value="admin">Comité Directeur</option>
                </select>
              </div>

              {formData.role === 'group_admin' && (
                <div>
                  <label className="text-xs font-medium mb-1 block">Nom du groupe</label>
                  <input
                    type="text"
                    value={formData.groupName}
                    onChange={e => setFormData({ ...formData, groupName: e.target.value })}
                    placeholder="Groupe Avancé"
                    className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              )}

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3">
                  <p className="text-destructive text-xs font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rct-gradient-hero text-white rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Création en cours...</span>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Créer l'utilisateur
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
