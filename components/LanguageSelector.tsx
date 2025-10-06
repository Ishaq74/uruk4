import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';

const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <div className="relative group">
      <button 
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label={t('common.language')}
      >
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentLanguage.code.toUpperCase()}
        </span>
        <Icon name="chevron-down" className="w-4 h-4 text-gray-500" />
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-200 dark:border-gray-700">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3 first:rounded-t-lg last:rounded-b-lg ${
              i18n.language === language.code ? 'bg-sky-50 dark:bg-sky-900/20' : ''
            }`}
          >
            <span className="text-2xl">{language.flag}</span>
            <span className={`text-sm font-medium ${
              i18n.language === language.code 
                ? 'text-sky-600 dark:text-sky-400' 
                : 'text-gray-700 dark:text-gray-300'
            }`}>
              {language.name}
            </span>
            {i18n.language === language.code && (
              <Icon name="check" className="w-4 h-4 text-sky-600 dark:text-sky-400 ml-auto" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
