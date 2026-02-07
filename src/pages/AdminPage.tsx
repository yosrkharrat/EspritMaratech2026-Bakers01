import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft, Shield, Users, UserPlus, UserMinus, 
  BookOpen, Share2, UsersRound, Dumbbell
} from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, hasRole, isAdmin, isCoach, isGroupAdmin } = useAuth();

  if (!user || (!isAdmin && !isCoach && !isGroupAdmin)) {
    return (
      <div className="pb-20 pt-6 px-4">
        <div className="bg-card rounded-2xl rct-shadow-card p-8 text-center">
          <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="font-display font-bold text-xl mb-2">Accès Restreint</h2>
          <p className="text-muted-foreground">Cette page est réservée aux administrateurs.</p>
        </div>
      </div>
    );
  }

  const roleInfo = {
    admin: {
      title: 'Comité Directeur',
      icon: Shield,
      color: 'text-red-500',
      gradient: 'from-red-500 to-red-600',
      permissions: [
        'Gestion des rôles et permissions',
        'Création d\'utilisateurs',
        'Modification d\'utilisateurs',
        'Suppression d\'utilisateurs',
        'Création/suppression d\'admins'
      ]
    },
    coach: {
      title: 'Admin Coach',
      icon: Dumbbell,
      color: 'text-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      permissions: [
        'Afficher les programmes d\'entraînement',
        'Partager les programmes aux adhérents',
        'Créer de nouveaux programmes'
      ]
    },
    group_admin: {
      title: 'Responsable de Groupe',
      icon: UsersRound,
      color: 'text-green-500',
      gradient: 'from-green-500 to-green-600',
      permissions: [
        'Affectation des utilisateurs à son groupe',
        'Suppression des utilisateurs de son groupe',
        'Gestion de son groupe uniquement'
      ]
    }
  };

  const currentRole = isAdmin ? 'admin' : isCoach ? 'coach' : 'group_admin';
  const info = roleInfo[currentRole];

  // Actions disponibles selon le rôle
  const actions = [
    ...(isAdmin ? [
      { icon: Users, label: 'Gestion Utilisateurs', path: '/admin/users', badge: '125' },
      { icon: UserPlus, label: 'Créer Utilisateur', path: '/admin/create-user', badge: null },
      { icon: Shield, label: 'Gérer Admins', path: '/admin/manage-admins', badge: '8' },
    ] : []),
    ...(isCoach ? [
      { icon: BookOpen, label: 'Programmes', path: '/admin/programs', badge: '12' },
      { icon: Share2, label: 'Partager Programme', path: '/admin/share-program', badge: null },
    ] : []),
    ...(isGroupAdmin ? [
      { icon: UsersRound, label: 'Mon Groupe', path: '/admin/my-group', badge: user.group || 'N/A' },
      { icon: UserPlus, label: 'Ajouter Membre', path: '/admin/add-member', badge: null },
      { icon: UserMinus, label: 'Retirer Membre', path: '/admin/remove-member', badge: null },
    ] : [])
  ];

  // Stats rapides
  const stats = [
    ...(isAdmin ? [
      { label: 'Total Adhérents', value: '125', subtitle: 'membres actifs' },
      { label: 'Admins', value: '8', subtitle: 'administrateurs' },
      { label: 'Comptes', value: '133', subtitle: 'total' },
    ] : []),
    ...(isCoach ? [
      { label: 'Programmes', value: '12', subtitle: 'disponibles' },
      { label: 'Abonnés', value: '89', subtitle: 'aux programmes' },
    ] : []),
    ...(isGroupAdmin ? [
      { label: 'Membres', value: '28', subtitle: user.group || 'groupe' },
      { label: 'Actifs', value: '24', subtitle: 'ce mois' },
    ] : [])
  ];

  return (
    <div className="pb-20 pt-6">
      {/* Header */}
      <div className="px-4 mb-6 flex items-center gap-3">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-extrabold text-2xl">Administration</h1>
          <p className="text-sm text-muted-foreground">{info.title}</p>
        </div>
      </div>

      {/* Role Badge */}
      <div className={`mx-4 mb-6 bg-gradient-to-br ${info.gradient} rounded-2xl p-6 rct-shadow-elevated`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <info.icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-white">{info.title}</h2>
            <p className="text-white/80 text-sm">{user.name}</p>
            {user.group && <p className="text-white/70 text-xs mt-1">Groupe: {user.group}</p>}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 mb-6">
        <h3 className="font-display font-bold text-lg mb-3">Aperçu Rapide</h3>
        <div className="grid grid-cols-3 gap-3">
          {stats.map(stat => (
            <div key={stat.label} className="bg-card rounded-xl rct-shadow-card p-3">
              <p className="text-2xl font-display font-bold rct-text-gradient">{stat.value}</p>
              <p className="text-xs font-medium mt-1">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions */}
      <div className="px-4 mb-6">
        <h3 className="font-display font-bold text-lg mb-3">Vos Permissions</h3>
        <div className="bg-card rounded-2xl rct-shadow-card p-4 space-y-2">
          {info.permissions.map((perm, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full ${info.color.replace('text-', 'bg-')} mt-1.5`} />
              <p className="text-sm flex-1">{perm}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 mb-6">
        <h3 className="font-display font-bold text-lg mb-3">Actions Rapides</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map(action => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="bg-card rounded-xl rct-shadow-card p-4 text-left hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <action.icon className={`w-6 h-6 ${info.color} group-hover:scale-110 transition-transform`} />
                {action.badge && (
                  <span className="text-xs font-bold text-muted-foreground">{action.badge}</span>
                )}
              </div>
              <p className="text-sm font-semibold">{action.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Comparison des Rôles */}
      <div className="px-4 mb-6">
        <h3 className="font-display font-bold text-lg mb-3">Comparaison des Rôles</h3>
        <div className="space-y-3">
          {Object.entries(roleInfo).map(([role, data]) => (
            <div 
              key={role}
              className={`bg-card rounded-xl rct-shadow-card p-4 ${currentRole === role ? 'ring-2 ring-primary' : ''}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <data.icon className={`w-6 h-6 ${data.color}`} />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{data.title}</h4>
                  {currentRole === role && (
                    <span className="text-xs text-primary">Votre rôle actuel</span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                {data.permissions.slice(0, 3).map((perm, i) => (
                  <p key={i} className="text-xs text-muted-foreground">• {perm}</p>
                ))}
                <p className="text-xs text-primary mt-2">
                  +{data.permissions.length - 3} autres permissions
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="px-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">💡 Rappel</h4>
          <p className="text-xs text-blue-800 dark:text-blue-200">
            {isAdmin && "Comité Directeur: Vous gérez tous les utilisateurs et les permissions."}
            {isCoach && "Admin Coach: Partagez vos programmes avec les adhérents."}
            {isGroupAdmin && `Responsable ${user.group || 'de Groupe'}: Gérez uniquement les membres de votre groupe.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
