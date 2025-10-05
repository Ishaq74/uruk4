import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Place, Article, Trail, Profile } from '../types';
import Icon from './Icon';
import StarRating from './StarRating';

interface SearchPageProps {
  query: string;
  places: Place[];
  articles: Article[];
  trails: Trail[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string) => void;
}

const PlaceResultCard: React.FC<{ item: Place, navigateTo: (page: string, id: string) => void }> = ({ item, navigateTo }) => (
    <div onClick={() => navigateTo('place-detail', item.id)} className="group flex bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <img src={item.imageUrl} alt={item.name} className="w-24 h-24 rounded-md object-cover"/>
        <div className="ml-4">
            <p className="text-xs font-semibold text-sky-600">{item.mainCategory}</p>
            <h4 className="font-bold text-gray-800 group-hover:underline">{item.name}</h4>
            <div className="flex items-center text-sm"><StarRating rating={item.rating} /> <span className="ml-2 text-gray-500">({item.reviewCount} avis)</span></div>
            <p className="text-sm text-gray-600 mt-1">{item.category}</p>
        </div>
    </div>
);

const ArticleResultCard: React.FC<{ item: Article, navigateTo: (page: string, id: string) => void }> = ({ item, navigateTo }) => (
     <div onClick={() => navigateTo('article-detail', item.id)} className="group flex bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <img src={item.imageUrl} alt={item.title} className="w-24 h-24 rounded-md object-cover"/>
        <div className="ml-4">
            <p className="text-xs font-semibold text-emerald-600">Magazine</p>
            <h4 className="font-bold text-gray-800 group-hover:underline">{item.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{item.excerpt.substring(0,100)}...</p>
        </div>
    </div>
);

const TrailResultCard: React.FC<{ item: Trail, navigateTo: (page: string, id: string) => void }> = ({ item, navigateTo }) => (
     <div onClick={() => navigateTo('trail-detail', item.id)} className="group flex bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <img src={item.imageUrl} alt={item.name} className="w-24 h-24 rounded-md object-cover"/>
        <div className="ml-4">
            <p className="text-xs font-semibold text-amber-600">Sentier</p>
            <h4 className="font-bold text-gray-800 group-hover:underline">{item.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{item.excerpt}</p>
        </div>
    </div>
);


const SearchResultsSection: React.FC<{title: string, icon: string, children: React.ReactNode, count: number}> = ({title, icon, children, count}) => {
    if (count === 0) return null;
    return (
        <section>
            <div className="flex items-center space-x-3 mb-6">
                <Icon name={icon} className="w-8 h-8 text-gray-500" />
                <h2 className="text-2xl font-bold text-gray-800">{title} ({count})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {children}
            </div>
        </section>
    )
}

const SearchPage: React.FC<SearchPageProps> = ({ query, places, articles, trails, navigateTo }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{ places: Place[], articles: Article[], trails: Trail[] }>({ places: [], articles: [], trails: [] });

  useEffect(() => {
    const performSearch = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      
      if (!process.env.API_KEY) {
        setError("La clé API n'est pas configurée. Recherche par mot-clé activée.");
        const lowerCaseQuery = query.toLowerCase();
        const placeResults = places.filter(p => p.name.toLowerCase().includes(lowerCaseQuery) || p.description.toLowerCase().includes(lowerCaseQuery));
        const articleResults = articles.filter(a => a.title.toLowerCase().includes(lowerCaseQuery) || a.excerpt.toLowerCase().includes(lowerCaseQuery));
        const trailResults = trails.filter(t => t.name.toLowerCase().includes(lowerCaseQuery) || t.excerpt.toLowerCase().includes(lowerCaseQuery));
        setResults({ places: placeResults, articles: articleResults, trails: trailResults });
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const allContent = {
          places: places.map(p => ({id: p.id, name: p.name, description: p.description, category: p.category, attributes: p.attributes.join(','), type: 'place'})),
          articles: articles.map(a => ({id: a.id, title: a.title, excerpt: a.excerpt, type: 'article'})),
          trails: trails.map(t => ({id: t.id, name: t.name, excerpt: t.excerpt, difficulty: t.difficulty, type: 'trail'})),
      };

      const prompt = `
          Tu es le moteur de recherche sémantique de la plateforme "Salut Annecy".
          Voici la requête de l'utilisateur : "${query}"

          Voici une liste de contenus disponibles sur la plateforme :
          ${JSON.stringify(allContent)}

          Analyse la requête de l'utilisateur et trouve les contenus les plus pertinents (lieux, articles, sentiers).
          Retourne UNIQUEMENT un objet JSON valide contenant trois tableaux : 'place_ids', 'article_ids', 'trail_ids'.
          Si une catégorie n'a pas de résultat pertinent, retourne un tableau vide pour cette clé.
          Le format doit être : { "place_ids": ["id1", "id2"], "article_ids": ["id3"], "trail_ids": [] }
      `;

      try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        let jsonStr = response.text.trim().replace(/^```(\w*\s)?/, '').replace(/```$/, '').trim();
        const parsedData = JSON.parse(jsonStr);
        
        const foundPlaces = (parsedData.place_ids || []).map((id: string) => places.find(p => p.id === id)).filter(Boolean);
        const foundArticles = (parsedData.article_ids || []).map((id: string) => articles.find(a => a.id === id)).filter(Boolean);
        const foundTrails = (parsedData.trail_ids || []).map((id: string) => trails.find(t => t.id === id)).filter(Boolean);
        
        setResults({
            places: foundPlaces as Place[],
            articles: foundArticles as Article[],
            trails: foundTrails as Trail[]
        });

      } catch(e) {
        console.error("Erreur Gemini API Search:", e);
        setError("Désolé, la recherche intelligente a rencontré une erreur. Réessayez plus tard.");
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, places, articles, trails]);
  
  const totalResults = results.places.length + results.articles.length + results.trails.length;

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Recherche pour : <span className="text-sky-600">"{query}"</span>
        </h1>
        
        {loading && (
             <div className="text-center py-20">
                <div className="flex justify-center items-center space-x-3">
                    <Icon name="spinner" className="w-8 h-8 text-sky-500" />
                    <p className="text-xl text-gray-600">Recherche intelligente en cours...</p>
                </div>
            </div>
        )}
        
        {!loading && (
          <>
            <p className="mt-2 text-gray-600">{totalResults} résultat(s) trouvé(s).</p>
            {error && <p className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
            
            <div className="mt-12 space-y-12">
                <SearchResultsSection title="Lieux" icon="map-pin" count={results.places.length}>
                    {results.places.map(item => <PlaceResultCard key={item.id} item={item} navigateTo={navigateTo} />)}
                </SearchResultsSection>
                
                <SearchResultsSection title="Articles du Magazine" icon="store" count={results.articles.length}>
                    {results.articles.map(item => <ArticleResultCard key={item.id} item={item} navigateTo={navigateTo} />)}
                </SearchResultsSection>
                
                <SearchResultsSection title="Sentiers & Randonnées" icon="hiking" count={results.trails.length}>
                    {results.trails.map(item => <TrailResultCard key={item.id} item={item} navigateTo={navigateTo} />)}
                </SearchResultsSection>

                {totalResults === 0 && !error && (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                        <h2 className="text-2xl font-semibold text-gray-800">Aucun résultat trouvé</h2>
                        <p className="mt-2 text-gray-500">Essayez une autre recherche ou explorez nos catégories.</p>
                         <button
                            onClick={() => navigateTo('home')}
                            className="mt-6 px-5 py-3 text-sm font-semibold text-white bg-sky-500 rounded-full hover:bg-sky-600 transition-all duration-300 shadow-sm"
                        >
                            Retour à l'accueil
                        </button>
                    </div>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;