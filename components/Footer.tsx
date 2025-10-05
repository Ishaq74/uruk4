import React from 'react';
import { Place } from '../types';

interface FooterLinkProps {
    children: React.ReactNode;
    onClick: () => void;
}
const FooterLink: React.FC<FooterLinkProps> = ({ children, onClick }) => (
  <li>
  <a href="/" onClick={(e) => { e.preventDefault(); onClick(); }} className="text-gray-500 hover:text-gray-900 transition-colors duration-300">
      {children}
    </a>
  </li>
);

interface FooterProps {
    navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string) => void;
    onOpenReportModal: () => void;
}

const Footer: React.FC<FooterProps> = ({ navigateTo, onOpenReportModal }) => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
             <a href="/" onClick={(e) => { e.preventDefault(); navigateTo('home')}} className="text-2xl font-extrabold text-slate-800">
              Salut <span className="text-sky-500">Annecy</span>
            </a>
            <p className="mt-4 text-gray-500 text-sm">
              Votre guide pour vivre le meilleur de la région.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">À propos</h3>
            <ul className="mt-4 space-y-3">
              <FooterLink onClick={() => navigateTo('static-page', undefined, undefined, undefined, 'qui-sommes-nous')}>Qui sommes-nous ?</FooterLink>
              <FooterLink onClick={() => navigateTo('static-page', undefined, undefined, undefined, 'presse')}>Presse</FooterLink>
              <FooterLink onClick={() => navigateTo('static-page', undefined, undefined, undefined, 'contact')}>Contact</FooterLink>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Légal</h3>
            <ul className="mt-4 space-y-3">
              <FooterLink onClick={() => navigateTo('static-page', undefined, undefined, undefined, 'cgu')}>CGU</FooterLink>
              <FooterLink onClick={() => navigateTo('static-page', undefined, undefined, undefined, 'cgv')}>CGV</FooterLink>
              <FooterLink onClick={() => navigateTo('static-page', undefined, undefined, undefined, 'confidentialite')}>Politique de Confidentialité</FooterLink>
              <FooterLink onClick={() => navigateTo('static-page', undefined, undefined, undefined, 'mentions-legales')}>Mentions Légales</FooterLink>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-3">
              <FooterLink onClick={() => navigateTo('static-page', undefined, undefined, undefined, 'faq')}>FAQ</FooterLink>
              <FooterLink onClick={onOpenReportModal}>Signaler un problème</FooterLink>
              <FooterLink onClick={() => {}}>Gestion des cookies</FooterLink>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Professionnels</h3>
            <ul className="mt-4 space-y-3">
              <FooterLink onClick={() => navigateTo('espace-pro')}>Espace Pro</FooterLink>
              <FooterLink onClick={() => {}}>Nos offres</FooterLink>
              <FooterLink onClick={() => {}}>Publicité</FooterLink>
              <FooterLink onClick={() => {}}>Devenir partenaire</FooterLink>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Salut Annecy. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;