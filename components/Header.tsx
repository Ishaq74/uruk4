import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import LanguageSelector from './LanguageSelector';
import { Place, Profile } from '../types';
import { 
    RESTAURATION_CATEGORIES, 
    HEBERGEMENT_CATEGORIES, 
    ACTIVITES_CATEGORIES,
    COMMERCES_CATEGORIES,
    LISTING_CATEGORIES 
} from '../constants';
import { generateCategorySlug } from '../utils/slug';

const MobileCollapsible: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center px-3 py-2 text-left text-lg font-semibold text-gray-800">
                <span>{title}</span>
                <Icon name="chevronDown" className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="pl-6 pb-2 space-y-1">{children}</div>}
        </div>
    )
}

const DropdownMenu: React.FC<{ title: React.ReactNode; children: React.ReactNode; isUserMenu?: boolean }> = ({ title, children, isUserMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative" 
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className={`text-gray-600 hover:text-sky-600 transition-colors duration-300 font-medium px-3 py-2 rounded-md flex items-center ${isUserMenu ? 'pl-1' : ''}`}>
        {title}
        {!isUserMenu && <Icon name="chevronDown" className="w-4 h-4 ml-1" />}
      </button>
      {isOpen && (
        <div className="absolute z-20 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 right-0">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownItem: React.FC<{ href?: string; onClick?: () => void; children: React.ReactNode, isMobile?: boolean }> = ({ href = '#', onClick, children, isMobile }) => (
    <a 
        href={href} 
        onClick={(e) => { if(onClick) { e.preventDefault(); onClick(); } }} 
        className={isMobile ? "block px-3 py-2 rounded-md text-base font-medium text-gray-700" : "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"}
        role="menuitem"
    >
        {children}
    </a>
);

interface HeaderProps {
    navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string, filter?: 'my-listings' | 'my-groups') => void;
    currentUser: Profile | null;
    onLogin: () => void;
    onLogout: () => void;
    onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ navigateTo, currentUser, onLogin, onLogout, onSearch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if(isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(searchQuery.trim()){
          onSearch(searchQuery.trim());
          if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
  }

  const UserMenuTitle = currentUser ? (
    <>
      <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-8 h-8 rounded-full mr-2" />
      <span>{currentUser.fullName.split(' ')[0]}</span>
      <Icon name="chevronDown" className="w-4 h-4 ml-1" />
    </>
  ) : null;

  const navClick = (page: string, id?: string, category?: Place['mainCategory'], query?: string, slug?: string) => {
      navigateTo(page, id, category, query, slug);
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };
  
  // Helper to navigate to a category page by path
  const navToPath = (path: string) => {
      window.location.href = path;
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };
  
  const MobileMenu = () => (
      <div className="fixed inset-0 z-40 bg-white md:hidden">
          <div className="pt-20 h-full overflow-y-auto">
            <div className="px-5 pt-5 pb-8 space-y-4">
                <form onSubmit={handleSearchSubmit}>
                    <input 
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher..."
                        className="w-full h-12 px-4 rounded-full text-gray-900 placeholder-gray-500 ring-1 ring-gray-300 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                    />
                </form>
                
                <MobileCollapsible title="Restaurants">
                    <DropdownItem isMobile onClick={() => navClick('restaurants')}>
                        <div className="font-semibold">Tous les restaurants</div>
                    </DropdownItem>
                    {RESTAURATION_CATEGORIES.map(cat => (
                        <DropdownItem key={cat.id} isMobile onClick={() => navToPath(`/restaurants/${generateCategorySlug(cat.label)}`)}>
                            {cat.label}
                        </DropdownItem>
                    ))}
                </MobileCollapsible>
                
                <MobileCollapsible title="Hébergements">
                    <DropdownItem isMobile onClick={() => navClick('hebergements')}>
                        <div className="font-semibold">Tous les hébergements</div>
                    </DropdownItem>
                    {HEBERGEMENT_CATEGORIES.map(cat => (
                        <DropdownItem key={cat.id} isMobile onClick={() => navToPath(`/hebergements/${generateCategorySlug(cat.label)}`)}>
                            {cat.label}
                        </DropdownItem>
                    ))}
                </MobileCollapsible>
                
                <MobileCollapsible title="Activités">
                    <DropdownItem isMobile onClick={() => navClick('activites')}>
                        <div className="font-semibold">Toutes les activités</div>
                    </DropdownItem>
                    {ACTIVITES_CATEGORIES.map(cat => (
                        <DropdownItem key={cat.id} isMobile onClick={() => navToPath(`/activites/${generateCategorySlug(cat.label)}`)}>
                            {cat.label}
                        </DropdownItem>
                    ))}
                </MobileCollapsible>
                
                <MobileCollapsible title="Shopping">
                    <DropdownItem isMobile onClick={() => navClick('commerces')}>
                        <div className="font-semibold">Tous les commerces</div>
                    </DropdownItem>
                    {COMMERCES_CATEGORIES.map(cat => (
                        <DropdownItem key={cat.id} isMobile onClick={() => navToPath(`/commerces/${generateCategorySlug(cat.label)}`)}>
                            {cat.label}
                        </DropdownItem>
                    ))}
                </MobileCollapsible>
                
                <MobileCollapsible title="Plus">
                    <DropdownItem isMobile onClick={() => navClick('live')}>
                        <div className="flex items-center justify-between">
                            <span>En Direct</span>
                            <span className="flex items-center space-x-1">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                </span>
                                <span className="text-xs font-bold text-rose-500">LIVE</span>
                            </span>
                        </div>
                    </DropdownItem>
                    <DropdownItem isMobile onClick={() => navClick('events')}>Agenda</DropdownItem>
                    <DropdownItem isMobile onClick={() => navClick('trails')}>Sentiers</DropdownItem>
                    <DropdownItem isMobile onClick={() => navClick('articles')}>Magazine</DropdownItem>
                    <DropdownItem isMobile onClick={() => navClick('annonces')}>Petites Annonces</DropdownItem>
                    <DropdownItem isMobile onClick={() => navClick('forums')}>Forums</DropdownItem>
                    <DropdownItem isMobile onClick={() => navClick('groupes')}>Groupes</DropdownItem>
                    <DropdownItem isMobile onClick={() => navClick('membres')}>Membres</DropdownItem>
                </MobileCollapsible>
            </div>
            <div className="py-6 px-5 border-t border-gray-200">
                {currentUser ? (
                    <div className="space-y-1">
                          <DropdownItem isMobile onClick={() => navClick('dashboard')}>Tableau de Bord</DropdownItem>
                          <DropdownItem isMobile onClick={() => navClick('profile', currentUser.id)}>Mon Profil</DropdownItem>
                          <DropdownItem isMobile onClick={() => navClick('favorites')}>Mes Favoris</DropdownItem>
                          <DropdownItem isMobile onClick={() => navClick('settings')}>Paramètres</DropdownItem>
                          <DropdownItem isMobile onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}>Déconnexion</DropdownItem>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <button onClick={() => { onLogin(); setIsMobileMenuOpen(false); }} className="w-full text-center block px-4 py-3 text-base font-semibold text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200">Connexion</button>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center block px-4 py-3 text-base font-semibold text-white bg-sky-500 rounded-full hover:bg-sky-600 shadow-sm">Inscription</button>
                    </div>
                )}
            </div>
          </div>
      </div>
  )

  return (
    <>
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center space-x-8">
            <a href="/" onClick={(e) => {e.preventDefault(); navigateTo('home')}} className="text-2xl font-extrabold text-slate-800">
              Salut <span className="text-sky-500">Annecy</span>
            </a>
            <nav className="hidden md:flex items-center space-x-2">
                {/* Restaurants Dropdown */}
                <DropdownMenu title="Restaurants">
                    <DropdownItem onClick={() => navClick('restaurants')}>
                        <div className="font-semibold">Tous les restaurants</div>
                    </DropdownItem>
                    <div className="border-t my-1"></div>
                    {RESTAURATION_CATEGORIES.map(cat => (
                        <DropdownItem key={cat.id} onClick={() => navToPath(`/restaurants/${generateCategorySlug(cat.label)}`)}>
                            {cat.label}
                        </DropdownItem>
                    ))}
                </DropdownMenu>

                {/* Hébergements Dropdown */}
                <DropdownMenu title="Hébergements">
                    <DropdownItem onClick={() => navClick('hebergements')}>
                        <div className="font-semibold">Tous les hébergements</div>
                    </DropdownItem>
                    <div className="border-t my-1"></div>
                    {HEBERGEMENT_CATEGORIES.map(cat => (
                        <DropdownItem key={cat.id} onClick={() => navToPath(`/hebergements/${generateCategorySlug(cat.label)}`)}>
                            {cat.label}
                        </DropdownItem>
                    ))}
                </DropdownMenu>

                {/* Activités Dropdown */}
                <DropdownMenu title="Activités">
                    <DropdownItem onClick={() => navClick('activites')}>
                        <div className="font-semibold">Toutes les activités</div>
                    </DropdownItem>
                    <div className="border-t my-1"></div>
                    {ACTIVITES_CATEGORIES.map(cat => (
                        <DropdownItem key={cat.id} onClick={() => navToPath(`/activites/${generateCategorySlug(cat.label)}`)}>
                            {cat.label}
                        </DropdownItem>
                    ))}
                </DropdownMenu>

                {/* Shopping & Services Dropdown */}
                <DropdownMenu title="Shopping">
                    <DropdownItem onClick={() => navClick('commerces')}>
                        <div className="font-semibold">Tous les commerces</div>
                    </DropdownItem>
                    <div className="border-t my-1"></div>
                    {COMMERCES_CATEGORIES.map(cat => (
                        <DropdownItem key={cat.id} onClick={() => navToPath(`/commerces/${generateCategorySlug(cat.label)}`)}>
                            {cat.label}
                        </DropdownItem>
                    ))}
                </DropdownMenu>

                {/* Plus Menu - for other content */}
                <DropdownMenu title="Plus">
                    <DropdownItem onClick={() => navClick('live')}>
                        <div className="flex items-center justify-between">
                            <span>En Direct</span>
                            <span className="flex items-center space-x-1">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                </span>
                                <span className="text-xs font-bold text-rose-500">LIVE</span>
                            </span>
                        </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => navClick('events')}>Agenda</DropdownItem>
                    <DropdownItem onClick={() => navClick('trails')}>Sentiers</DropdownItem>
                    <DropdownItem onClick={() => navClick('articles')}>Magazine</DropdownItem>
                    <div className="border-t my-1"></div>
                    <DropdownItem onClick={() => navClick('annonces')}>Petites Annonces</DropdownItem>
                    <div className="border-t my-1"></div>
                    <DropdownItem onClick={() => navClick('forums')}>Forums</DropdownItem>
                    <DropdownItem onClick={() => navClick('groupes')}>Groupes</DropdownItem>
                    <DropdownItem onClick={() => navClick('membres')}>Membres</DropdownItem>
                </DropdownMenu>
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
             <LanguageSelector />
             <div className="h-6 w-px bg-gray-200"></div>
             <a href="/propose" onClick={(e) => { e.preventDefault(); navClick('propose') }} className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
              Proposer un contenu
            </a>
             <div className="h-6 w-px bg-gray-200"></div>
            {currentUser ? (
              <DropdownMenu title={UserMenuTitle} isUserMenu={true}>
                <DropdownItem onClick={() => navClick('dashboard')}>Mon Tableau de Bord</DropdownItem>
                <DropdownItem onClick={() => navClick('profile', currentUser.id)}>Voir mon Profil Public</DropdownItem>
                <DropdownItem onClick={() => navigateTo('profile', currentUser.id, undefined, undefined, 'contributions')}>Mes Contributions</DropdownItem>
                <DropdownItem onClick={() => navClick('favorites')}>Mes Favoris</DropdownItem>
                <DropdownItem onClick={() => navClick('conversations')}>Ma Messagerie</DropdownItem>
                <DropdownItem onClick={() => navigateTo('annonces', undefined, undefined, undefined, undefined, 'my-listings')}>Mes Annonces</DropdownItem>
                <DropdownItem onClick={() => navigateTo('groupes', undefined, undefined, undefined, undefined, 'my-groups')}>Mes Groupes</DropdownItem>
                <DropdownItem onClick={() => navClick('settings')}>Paramètres du Compte</DropdownItem>
                <div className="border-t my-1"></div>
                <DropdownItem onClick={() => navClick('espace-pro')}>Espace Professionnel</DropdownItem>
                {(currentUser.role === 'admin' || currentUser.role === 'moderator') && (
                  <>
                    <div className="border-t my-1"></div>
                    <DropdownItem onClick={() => navClick('admin')}>
                      <span className="flex items-center gap-2 text-sky-600 font-semibold">
                        <Icon name="shield" className="w-4 h-4" />
                        Administration
                      </span>
                    </DropdownItem>
                  </>
                )}
                <DropdownItem onClick={onLogout}>Déconnexion</DropdownItem>
              </DropdownMenu>
            ) : (
              <>
                <button onClick={onLogin} className="text-sm font-semibold text-gray-600 hover:text-sky-600 transition-colors">
                  Connexion
                </button>
                <button onClick={onLogin} className="px-4 py-2 text-sm font-semibold text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-all duration-300 shadow-sm">
                  Inscription
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 z-50 relative">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && <MobileMenu />}
    </header>
    </>
  );
};

export default Header;
