import React from 'react';

interface CookieBannerProps {
  onAccept: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white p-4 shadow-lg z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between">
        <p className="text-sm text-slate-300 mb-4 sm:mb-0">
          Nous utilisons des cookies pour améliorer votre expérience. En continuant, vous acceptez notre utilisation des cookies.
        </p>
        <button
          onClick={onAccept}
          className="px-4 py-2 bg-sky-500 text-white font-semibold rounded-full hover:bg-sky-600 transition-colors flex-shrink-0"
        >
          J'ai compris
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
