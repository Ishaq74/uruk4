
import React, { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { generateSlug } from './utils/slug';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import PlaceListPage from './components/PlaceListPage';
import EventListPage from './components/EventListPage';
import TrailListPage from './components/TrailListPage';
import ArticleListPage from './components/ArticleListPage';
import AnnoncesListPage from './components/AnnoncesListPage';
import ForumListPage from './components/ForumListPage';
import NewThreadPage from './components/NewThreadPage';
import GroupListPage from './components/GroupListPage';
import NewGroupPage from './components/NewGroupPage';
import MemberListPage from './components/MemberListPage';
import FavoritesPage from './components/FavoritesPage';
import DashboardPage from './components/DashboardPage';
import ProposeContentPage from './components/ProposeContentPage';
import ProposePlaceForm from './components/propose/ProposePlaceForm';
import ProposeEventForm from './components/propose/ProposeEventForm';
import ProposeTrailForm from './components/propose/ProposeTrailForm';
import ProposeListingForm from './components/propose/ProposeListingForm';
import ConversationsListPage from './components/ConversationsListPage';
import SettingsPage from './components/SettingsPage';
import EspaceProPage from './components/EspaceProPage';
import ClaimPlacePage from './components/ClaimPlacePage';
import AdCampaignsPage from './components/AdCampaignsPage';
import CookieBanner from './components/CookieBanner';
import ReportModal from './components/ReportModal';
import LivePage from './components/LivePage';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import AdminDashboard from './components/AdminDashboard';
import {
  PlaceDetailWrapper,
  PlaceListCategoryWrapper,
  EventDetailWrapper,
  TrailDetailWrapper,
  ArticleDetailWrapper,
  AnnonceDetailWrapper,
  AnnoncesListCategoryWrapper,
  ForumCategoryWrapper,
  ForumThreadWrapper,
  GroupDetailWrapper,
  ConversationDetailWrapper,
  ProfileWrapper,
  ManagePlaceWrapper,
  PlaceAnalyticsWrapper,
  ManageProductsWrapper,
  ManageServicesWrapper,
  OrdersListWrapper,
  BookingsListWrapper,
  StaticPageWrapper,
  SearchPageWrapper
} from './components/RouteWrappers';

import { authClient } from './auth-client';
import { 
  usePlaces, useEvents, useTrails, useArticles, useListings, 
  useForumThreads, useGroups, useProfiles, useConversations,
  useOrganizations, useProducts, useServices, useOrders, useBookings,
  useClaims, useReports, useLiveEvents
} from './hooks/useApiData';

import { Place, Profile, Review, ForumPost, Message, ForumThread, Order, Booking, Comment, PlaceClaim, Group, Report, Event, Trail, Listing, LiveEvent, Conversation } from './types';
import { ANALYTICS_EVENTS } from './constants';

const App: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [authUser, setAuthUser] = useState<any | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  // Fetch data from API
  const { data: placesData, loading: placesLoading } = usePlaces();
  const { data: eventsData, loading: eventsLoading } = useEvents();
  const { data: trailsData, loading: trailsLoading } = useTrails();
  const { data: articlesData, loading: articlesLoading } = useArticles();
  const { data: listingsData, loading: listingsLoading } = useListings();
  const { data: profilesData, loading: profilesLoading } = useProfiles();
  const { data: forumThreadsData, loading: forumThreadsLoading } = useForumThreads();
  const { data: groupsData, loading: groupsLoading } = useGroups();
  const { data: conversationsData, loading: conversationsLoading } = useConversations();
  const { data: organizationsData, loading: organizationsLoading } = useOrganizations();
  const { data: productsData, loading: productsLoading } = useProducts();
  const { data: servicesData, loading: servicesLoading } = useServices();
  const { data: ordersData, loading: ordersLoading } = useOrders();
  const { data: bookingsData, loading: bookingsLoading } = useBookings();
  const { data: claimsData, loading: claimsLoading } = useClaims();
  const { data: reportsData, loading: reportsLoading } = useReports();
  const { data: liveEventsData, loading: liveEventsLoading } = useLiveEvents();
  
  // State Management (fallback to empty arrays if data is null)
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [forumThreads, setForumThreads] = useState<ForumThread[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [claims, setClaims] = useState<PlaceClaim[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [analyticsEvents, setAnalyticsEvents] = useState(ANALYTICS_EVENTS);

  // Update state when data loads
  useEffect(() => {
    if (placesData) setPlaces(placesData);
  }, [placesData]);

  useEffect(() => {
    if (eventsData) setEvents(eventsData);
  }, [eventsData]);

  useEffect(() => {
    if (trailsData) setTrails(trailsData);
  }, [trailsData]);

  useEffect(() => {
    if (articlesData) setArticles(articlesData);
  }, [articlesData]);

  useEffect(() => {
    if (listingsData) setAllListings(listingsData);
  }, [listingsData]);

  useEffect(() => {
    if (profilesData) setProfiles(profilesData);
  }, [profilesData]);

  useEffect(() => {
    if (forumThreadsData) setForumThreads(forumThreadsData);
  }, [forumThreadsData]);

  useEffect(() => {
    if (groupsData) setGroups(groupsData);
  }, [groupsData]);

  useEffect(() => {
    if (conversationsData) setConversations(conversationsData);
  }, [conversationsData]);

  useEffect(() => {
    if (organizationsData) setOrganizations(organizationsData);
  }, [organizationsData]);

  useEffect(() => {
    if (productsData) setProducts(productsData);
  }, [productsData]);

  useEffect(() => {
    if (servicesData) setServices(servicesData);
  }, [servicesData]);

  useEffect(() => {
    if (ordersData) setOrders(ordersData);
  }, [ordersData]);

  useEffect(() => {
    if (bookingsData) setBookings(bookingsData);
  }, [bookingsData]);

  useEffect(() => {
    if (claimsData) setClaims(claimsData);
  }, [claimsData]);

  useEffect(() => {
    if (reportsData) setReports(reportsData);
  }, [reportsData]);

  useEffect(() => {
    if (liveEventsData) setLiveEvents(liveEventsData);
  }, [liveEventsData]);


  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [reportModalInfo, setReportModalInfo] = useState<{ isOpen: boolean, targetId: string, targetType: string }>({ isOpen: false, targetId: '', targetType: '' });


  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
        setShowCookieBanner(true);
    }

    // Check if user is logged in using Better Auth
    const loadSession = async () => {
      try {
        const session = await authClient.getSession();
        
        if (session?.data?.session && session.data.user) {
          setAuthUser(session.data.user);
          
          // Fetch user profile
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/me`, {
            credentials: 'include',
          });
          
          if (response.ok) {
            const { user, profile } = await response.json();
            if (profile) {
              const mappedProfile: Profile = {
                id: profile.id,
                username: profile.username,
                fullName: profile.fullName,
                avatarUrl: profile.avatarUrl || '',
                coverImageUrl: profile.coverImageUrl || '',
                bio: profile.bio || '',
                levelId: profile.levelId,
                joinDate: profile.joinDate?.toString() || new Date().toISOString(),
                isVerified: profile.isVerified,
                points: profile.points,
                role: user.role as any,
              };
              setCurrentUser(mappedProfile);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load session:', error);
      }
    };
    
    loadSession();
  }, []);

  const handleCookieAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowCookieBanner(false);
  }

  const navigateTo = useCallback((page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string, filter?: 'my-listings' | 'my-groups') => {
    window.scrollTo(0, 0);
    
    // Map old page names to new URL routes
    switch (page) {
      case 'home': navigate('/'); break;
      case 'live': navigate('/live'); break;
      case 'restaurants': navigate('/restaurants'); break;
      case 'hebergements': navigate('/hebergements'); break;
      case 'activites': navigate('/activites'); break;
      case 'commerces': navigate('/commerces'); break;
      case 'place-detail': 
        // Use slug-based URLs for places
        if (slug && mainCategory) {
          const categoryMap: Record<Place['mainCategory'], string> = {
            'restauration': 'restaurant',
            'hebergement': 'hebergement',
            'activites': 'activite',
            'commerces': 'commerce'
          };
          navigate(`/${categoryMap[mainCategory]}/${slug}`);
        } else if (slug) {
          // Fallback: try to find the place to get mainCategory
          const place = places.find(p => p.slug === slug || p.id === id);
          if (place) {
            const categoryMap: Record<Place['mainCategory'], string> = {
              'restauration': 'restaurant',
              'hebergement': 'hebergement',
              'activites': 'activite',
              'commerces': 'commerce'
            };
            navigate(`/${categoryMap[place.mainCategory]}/${place.slug}`);
          } else {
            navigate(`/place/${id}`); // Old fallback
          }
        } else {
          navigate(`/place/${id}`); // Old fallback for backward compatibility
        }
        break;
      case 'events': navigate('/events'); break;
      case 'event-detail': navigate(slug ? `/evenement/${slug}` : `/event/${id}`); break;
      case 'trails': navigate('/trails'); break;
      case 'trail-detail': navigate(slug ? `/sentier/${slug}` : `/trail/${id}`); break;
      case 'articles': navigate('/articles'); break;
      case 'article-detail': navigate(slug ? `/article/${slug}` : `/article/${id}`); break;
      case 'annonces': navigate(filter === 'my-listings' ? '/mes-annonces' : '/annonces'); break;
      case 'annonce-detail': navigate(slug ? `/annonce/${slug}` : `/annonce/${id}`); break;
      case 'forums': navigate('/forums'); break;
      case 'forum-category': navigate(`/forum/category/${id}`); break;
      case 'forum-thread': navigate(slug ? `/forum/${slug}` : `/forum/thread/${id}`); break;
      case 'new-thread': navigate(`/forum/new-thread${id ? `?category=${id}` : ''}`); break;
      case 'groupes': navigate(filter === 'my-groups' ? '/mes-groupes' : '/groupes'); break;
      case 'group-detail': navigate(slug ? `/groupe/${slug}` : `/groupe/${id}`); break;
      case 'new-group': navigate('/nouveau-groupe'); break;
      case 'membres': navigate('/membres'); break;
      case 'conversations': navigate('/conversations'); break;
      case 'conversation-detail': navigate(`/conversation/${id}`); break;
      case 'profile': navigate(slug ? `/profil/${slug}` : `/profil/${id}`); break;
      case 'favorites': navigate('/favoris'); break;
      case 'dashboard': navigate('/dashboard'); break;
      case 'propose': navigate('/proposer'); break;
      case 'propose-place': navigate('/proposer/lieu'); break;
      case 'propose-event': navigate('/proposer/evenement'); break;
      case 'propose-trail': navigate('/proposer/sentier'); break;
      case 'propose-listing': navigate('/proposer/annonce'); break;
      case 'settings': navigate('/parametres'); break;
      case 'espace-pro': navigate('/espace-pro'); break;
      case 'manage-place': navigate(`/espace-pro/lieu/${id}`); break;
      case 'place-analytics': navigate(`/espace-pro/analytics/${id}`); break;
      case 'manage-products': navigate(`/espace-pro/produits/${id}`); break;
      case 'manage-services': navigate(`/espace-pro/services/${id}`); break;
      case 'pro-orders': navigate(`/espace-pro/commandes/${id}`); break;
      case 'pro-bookings': navigate(`/espace-pro/reservations/${id}`); break;
      case 'claim-place': navigate('/revendiquer-lieu'); break;
      case 'ad-campaigns': navigate('/campagnes-pub'); break;
      case 'admin': navigate('/admin'); break;
      case 'search': navigate(`/recherche?q=${query || ''}`); break;
      case 'static': navigate(`/page/${slug}`); break;
      default: navigate('/');
    }
  }, [navigate, places]);

  const handleOpenReportModal = (targetId: string, targetType: string) => { setReportModalInfo({ isOpen: true, targetId, targetType }); };
  const handleCloseReportModal = () => { setReportModalInfo({ isOpen: false, targetId: '', targetType: '' }); };
  
  const loadUserSession = async () => {
    try {
      const session = await authClient.getSession();
      
      if (session?.data?.session && session.data.user) {
        setAuthUser(session.data.user);
        
        // Fetch user profile
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/me`, {
          credentials: 'include',
        });
        
        if (response.ok) {
          const { user, profile } = await response.json();
          if (profile) {
            const mappedProfile: Profile = {
              id: profile.id,
              username: profile.username,
              fullName: profile.fullName,
              avatarUrl: profile.avatarUrl || '',
              coverImageUrl: profile.coverImageUrl || '',
              bio: profile.bio || '',
              levelId: profile.levelId,
              joinDate: profile.joinDate?.toString() || new Date().toISOString(),
              isVerified: profile.isVerified,
              points: profile.points,
              role: user.role as any,
            };
            setCurrentUser(mappedProfile);
          }
        }
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    setCurrentUser(null);
    setAuthUser(null);
    navigateTo('home');
  };

  const handleOpenLogin = () => { setIsLoginModalOpen(true); };
  const handleSearch = (query: string) => { navigateTo('search', undefined, undefined, query, undefined); }
  
  // --- Data mutation handlers ---
  
  const handleReportSubmit = (reportData: Omit<Report, 'id' | 'reporterId'>) => { 
    if (currentUser) { 
        const newReport: Report = { ...reportData, id: `rep${Date.now()}`, reporterId: currentUser.id };
        setReports(prev => [...prev, newReport]);
        alert('Votre signalement a bien été pris en compte.');
    } 
    handleCloseReportModal(); 
  };
  
  const toggleFavorite = useCallback((placeId: string) => {
    if (!currentUser) return;
    setProfiles(prevProfiles => prevProfiles.map(p => {
        if (p.id !== currentUser.id) return p;
        const newFavorites = (p.favoritePlaceIds || []).includes(placeId) 
            ? (p.favoritePlaceIds || []).filter(id => id !== placeId) 
            : [...(p.favoritePlaceIds || []), placeId];
        const updatedProfile = { ...p, favoritePlaceIds: newFavorites };
        setCurrentUser(updatedProfile); 
        return updatedProfile;
    }));
  }, [currentUser]);
  
  const handleAddReview = useCallback((placeId: string, review: Omit<Review, 'id' | 'date' | 'placeId'>) => {
    const newReview: Review = { ...review, id: `rev${Date.now()}`, date: 'À l\'instant', placeId };
    setPlaces(prev => prev.map(p => p.id === placeId ? { ...p, reviews: [newReview, ...p.reviews], reviewCount: p.reviewCount + 1 } : p));
  }, []);

  const handleAddPostToThread = useCallback((threadId: string, post: Omit<ForumPost, 'id' | 'createdAt' | 'threadId'>) => {
    const newPost: ForumPost = { ...post, id: `fp${Date.now()}`, createdAt: 'À l\'instant', threadId };
    setForumThreads(prev => prev.map(t => t.id === threadId ? { ...t, posts: [...t.posts, newPost] } : t));
  }, []);

  const handleStartConversation = useCallback((recipientId: string) => {
    if(!currentUser) return;
    const existing = conversations.find(c => c.participantIds.length === 2 && c.participantIds.includes(currentUser.id) && c.participantIds.includes(recipientId));
    if (existing) {
      navigateTo('conversation-detail', existing.id);
      return;
    }
    const newConversation: Conversation = { id: `conv${Date.now()}`, participantIds: [currentUser.id, recipientId], messages: [] };
    setConversations(prev => [newConversation, ...prev]);
    navigateTo('conversation-detail', newConversation.id);
  }, [currentUser, conversations]);

  const handleSendMessage = useCallback((conversationId: string, message: Omit<Message, 'id' | 'createdAt'>) => {
    const newMessage: Message = { ...message, id: `msg${Date.now()}`, createdAt: 'À l\'instant' };
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, messages: [...c.messages, newMessage] } : c));
  }, []);

  const handleJoinGroup = useCallback((groupId: string, userId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const memberIndex = g.members.findIndex(m => m.profileId === userId);
      if (memberIndex > -1) {
        return { ...g, members: g.members.filter(m => m.profileId !== userId), memberCount: g.memberCount - 1 };
      } else {
        return { ...g, members: [...g.members, { profileId: userId, role: 'member' }], memberCount: g.memberCount + 1 };
      }
    }));
  }, []);

  const handleAddThread = useCallback((thread: Omit<ForumThread, 'id' | 'posts' | 'createdAt'>, firstPostContent: string) => {
    if(!currentUser) return;
    const newThreadId = `ft${Date.now()}`;
    const firstPost: ForumPost = { id: `fp${Date.now()}`, threadId: newThreadId, authorId: thread.authorId, content: firstPostContent, createdAt: 'À l\'instant' };
    const newThread: ForumThread = { ...thread, id: newThreadId, createdAt: 'À l\'instant', posts: [firstPost] };
    setForumThreads(prev => [newThread, ...prev]);
    navigateTo('forum-thread', newThread.id);
  }, [currentUser]);

  const handleAddGroup = useCallback((group: Omit<Group, 'id' | 'members' | 'memberCount' | 'bannerUrl' | 'avatarUrl'>, ownerId: string) => {
    const newGroup: Group = { ...group, id: `g${Date.now()}`, memberCount: 1, members: [{ profileId: ownerId, role: 'owner' }], bannerUrl: 'https://picsum.photos/seed/newgroup/1200/300', avatarUrl: 'https://picsum.photos/seed/newgroupavatar/200/200' };
    setGroups(prev => [newGroup, ...prev]);
    navigateTo('group-detail', newGroup.id);
  }, []);

  const handleUpdateProfile = useCallback((data: { fullName: string, bio: string }) => {
    if(!currentUser) return;
    setProfiles(prev => prev.map(p => p.id === currentUser.id ? { ...p, ...data } : p));
    setCurrentUser(prev => prev ? ({ ...prev, ...data }) : null);
    alert('Profil mis à jour !');
  }, [currentUser]);

  const handleUpdatePlace = useCallback((placeId: string, data: Partial<Pick<Place, 'name' | 'description' | 'category'>>) => {
    setPlaces(prev => prev.map(p => p.id === placeId ? { ...p, ...data } : p));
    alert('Établissement mis à jour !');
    navigateTo('espace-pro');
  }, []);

  const handleAddOrder = useCallback((order: Omit<Order, 'id'>) => {
    setOrders(prev => [{ ...order, id: `order${Date.now()}` }, ...prev]);
    alert(`Votre commande a bien été enregistrée !`);
  }, []);

  const handleAddBooking = useCallback((booking: Omit<Booking, 'id'>) => {
    setBookings(prev => [{ ...booking, id: `book${Date.now()}` }, ...prev]);
    alert(`Votre réservation a bien été enregistrée !`);
  }, []);

  const handleAddComment = useCallback((articleId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'target_entity_id'>) => {
    const newComment: Comment = { ...comment, id: `c${Date.now()}`, createdAt: 'À l\'instant', target_entity_id: articleId };
    setArticles(prev => prev.map(a => a.id === articleId ? { ...a, comments: [...a.comments, newComment] } : a));
  }, []);

  const handleClaimPlace = useCallback((claim: Omit<PlaceClaim, 'id' | 'status'>) => {
    if(!currentUser) return;
    setClaims(prev => [...prev, { ...claim, id: `claim${Date.now()}`, status: 'pending' }]);
    alert('Votre demande de revendication a été envoyée.');
    navigateTo('espace-pro');
  }, [currentUser]);
  
  const handleAddPlace = useCallback((place: Omit<Place, 'id' | 'slug' | 'rating' | 'reviewCount' | 'reviews' | 'openingHours' | 'coordinates' | 'phone' | 'website' | 'imageUrl' | 'priceRange' | 'attributes' | 'status' | 'organization_id' | 'rejection_reason'>) => {
    if(!currentUser) return;
    const slug = generateSlug(place.name);
    const newPlace: Place = { ...place, id: `place${Date.now()}`, slug, status: 'pending_review', rating: 0, reviewCount: 0, reviews: [], openingHours: {}, coordinates: { lat: 45.9, lng: 6.12 }, phone: '', website: '', imageUrl: `https://picsum.photos/seed/${place.name}/800/600`, priceRange: '€€', attributes: [] };
    setPlaces(prev => [newPlace, ...prev]);
    alert(`${newPlace.name} a été soumis pour modération. Merci !`);
    navigateTo('place-detail', newPlace.id, newPlace.mainCategory, undefined, newPlace.slug);
  }, [currentUser, navigateTo]);

   const handleAddEvent = useCallback((event: Omit<Event, 'id' | 'imageUrl' | 'coordinates' | 'status' | 'rejection_reason'>) => {
    if(!currentUser) return;
    const newEvent: Event = { ...event, id: `event${Date.now()}`, status: 'pending_review', imageUrl: `https://picsum.photos/seed/${event.title}/400/300`, coordinates: { lat: 45.9, lng: 6.12 } };
    setEvents(prev => [newEvent, ...prev]);
    alert(`${newEvent.title} a été soumis pour modération. Merci !`);
    navigateTo('event-detail', newEvent.id);
  }, [currentUser]);

   const handleAddTrail = useCallback((trail: Omit<Trail, 'id' | 'imageUrl' | 'startPoint' | 'status' | 'rejection_reason'>) => {
    if(!currentUser) return;
    const newTrail: Trail = { ...trail, id: `trail${Date.now()}`, status: 'pending_review', imageUrl: `https://picsum.photos/seed/${trail.name}/800/600`, startPoint: { lat: 45.9, lng: 6.12 } };
    setTrails(prev => [newTrail, ...prev]);
    alert(`${newTrail.name} a été soumis pour modération. Merci !`);
    navigateTo('trail-detail', newTrail.id);
  }, [currentUser]);
  
  const handleAddListing = useCallback((listing: Omit<Listing, 'id' | 'date' | 'userId' | 'status' | 'rejection_reason' | 'expires_at' | 'imageUrl' | 'metadata'>) => {
    if(!currentUser) return;
    const newListing: Listing = { ...listing, id: `listing${Date.now()}`, status: 'pending_review', date: 'Aujourd\'hui', userId: currentUser.id };
    setAllListings(prev => [newListing, ...prev]);
    alert(`${newListing.title} a été soumis pour modération. Merci !`);
    navigateTo('annonce-detail', newListing.id);
  }, [currentUser]);

  const handleAddLiveEvent = useCallback((event: Omit<LiveEvent, 'id' | 'createdAt' | 'expiresAt' | 'upvotes' | 'downvotes'>) => {
    const newEvent: LiveEvent = { ...event, id: `live${Date.now()}`, createdAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), upvotes: [event.authorId], downvotes: [] };
    setLiveEvents(prev => [newEvent, ...prev]);
  }, []);

  const handleVoteLiveEvent = useCallback((eventId: string, voteType: 'up' | 'down') => {
      if (!currentUser) return;
      const userId = currentUser.id;
      setLiveEvents(prev => prev.map(event => {
        if (event.id !== eventId) return event;
        const upvotes = event.upvotes.filter(id => id !== userId);
        const downvotes = event.downvotes.filter(id => id !== userId);
        if (voteType === 'up') {
            return { ...event, upvotes: [...upvotes, userId], downvotes };
        } else {
            return { ...event, upvotes, downvotes: [...downvotes, userId] };
        }
      }));
  }, [currentUser]);

  const requestDataExport = (userId: string) => alert(`Une demande d'export de données a été enregistrée.`);
  const deleteAccount = (userId: string) => { if (confirm(`Êtes-vous sûr de vouloir supprimer votre compte ?`)) { alert(`Le compte a été marqué pour suppression.`); }};

  const handleApprovePlace = useCallback((placeId: string) => {
    setPlaces(prev => prev.map(p => p.id === placeId ? { ...p, status: 'published' as const } : p));
    alert('Lieu approuvé avec succès');
  }, []);

  const handleRejectPlace = useCallback((placeId: string, reason: string) => {
    setPlaces(prev => prev.map(p => p.id === placeId ? { ...p, status: 'rejected' as const, rejection_reason: reason } : p));
    alert('Lieu rejeté');
  }, []);

  const handleApproveEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'published' as const } : e));
    alert('Événement approuvé avec succès');
  }, []);

  const handleRejectEvent = useCallback((eventId: string, reason: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, status: 'rejected' as const, rejection_reason: reason } : e));
    alert('Événement rejeté');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header navigateTo={navigateTo} currentUser={currentUser} onLogin={handleOpenLogin} onLogout={handleLogout} onSearch={handleSearch} />
      <main className="flex-grow">
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage places={places} events={events} trails={trails} articles={articles} listings={allListings} navigateTo={navigateTo} onSearch={handleSearch} />} />
          
          {/* Discovery Pages */}
          <Route path="/live" element={<LivePage liveEvents={liveEvents} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} onAddEvent={handleAddLiveEvent} onVote={handleVoteLiveEvent} onLogin={handleOpenLogin} />} />
          <Route path="/restaurants" element={<PlaceListPage places={places} navigateTo={navigateTo} mainCategory="restauration" />} />
          <Route path="/restaurants/:categorySlug" element={<PlaceListCategoryWrapper places={places} navigateTo={navigateTo} mainCategory="restauration" />} />
          <Route path="/hebergements" element={<PlaceListPage places={places} navigateTo={navigateTo} mainCategory="hebergement" />} />
          <Route path="/hebergements/:categorySlug" element={<PlaceListCategoryWrapper places={places} navigateTo={navigateTo} mainCategory="hebergement" />} />
          <Route path="/activites" element={<PlaceListPage places={places} navigateTo={navigateTo} mainCategory="activites" />} />
          <Route path="/activites/:categorySlug" element={<PlaceListCategoryWrapper places={places} navigateTo={navigateTo} mainCategory="activites" />} />
          <Route path="/commerces" element={<PlaceListPage places={places} navigateTo={navigateTo} mainCategory="commerces" />} />
          <Route path="/commerces/:categorySlug" element={<PlaceListCategoryWrapper places={places} navigateTo={navigateTo} mainCategory="commerces" />} />
          
          {/* Place Detail Pages - new semantic URLs */}
          <Route path="/restaurant/:slug" element={<PlaceDetailWrapper places={places} profiles={profiles} organizations={organizations} products={products} services={services} navigateTo={navigateTo} currentUser={currentUser} toggleFavorite={toggleFavorite} addReview={handleAddReview} onLogin={handleOpenLogin} onAddOrder={handleAddOrder} onAddBooking={handleAddBooking} onOpenReportModal={handleOpenReportModal} />} />
          <Route path="/hebergement/:slug" element={<PlaceDetailWrapper places={places} profiles={profiles} organizations={organizations} products={products} services={services} navigateTo={navigateTo} currentUser={currentUser} toggleFavorite={toggleFavorite} addReview={handleAddReview} onLogin={handleOpenLogin} onAddOrder={handleAddOrder} onAddBooking={handleAddBooking} onOpenReportModal={handleOpenReportModal} />} />
          <Route path="/activite/:slug" element={<PlaceDetailWrapper places={places} profiles={profiles} organizations={organizations} products={products} services={services} navigateTo={navigateTo} currentUser={currentUser} toggleFavorite={toggleFavorite} addReview={handleAddReview} onLogin={handleOpenLogin} onAddOrder={handleAddOrder} onAddBooking={handleAddBooking} onOpenReportModal={handleOpenReportModal} />} />
          <Route path="/commerce/:slug" element={<PlaceDetailWrapper places={places} profiles={profiles} organizations={organizations} products={products} services={services} navigateTo={navigateTo} currentUser={currentUser} toggleFavorite={toggleFavorite} addReview={handleAddReview} onLogin={handleOpenLogin} onAddOrder={handleAddOrder} onAddBooking={handleAddBooking} onOpenReportModal={handleOpenReportModal} />} />
          
          {/* Old place detail route for backward compatibility */}
          <Route path="/place/:id" element={<PlaceDetailWrapper places={places} profiles={profiles} organizations={organizations} products={products} services={services} navigateTo={navigateTo} currentUser={currentUser} toggleFavorite={toggleFavorite} addReview={handleAddReview} onLogin={handleOpenLogin} onAddOrder={handleAddOrder} onAddBooking={handleAddBooking} onOpenReportModal={handleOpenReportModal} />} />
          
          {/* Events */}
          <Route path="/events" element={<EventListPage events={events} navigateTo={navigateTo} />} />
          <Route path="/evenement/:slug" element={<EventDetailWrapper events={events} navigateTo={navigateTo} currentUser={currentUser} />} />
          <Route path="/event/:id" element={<EventDetailWrapper events={events} navigateTo={navigateTo} currentUser={currentUser} />} />
          
          {/* Trails */}
          <Route path="/trails" element={<TrailListPage trails={trails} navigateTo={navigateTo} />} />
          <Route path="/sentier/:slug" element={<TrailDetailWrapper trails={trails} navigateTo={navigateTo} />} />
          <Route path="/trail/:id" element={<TrailDetailWrapper trails={trails} navigateTo={navigateTo} />} />
          
          {/* Articles */}
          <Route path="/articles" element={<ArticleListPage articles={articles} profiles={profiles} navigateTo={navigateTo} />} />
          <Route path="/article/:slug" element={<ArticleDetailWrapper articles={articles} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} onAddComment={handleAddComment} onLogin={handleOpenLogin} onOpenReportModal={handleOpenReportModal} />} />
          
          {/* Annonces */}
          <Route path="/annonces" element={<AnnoncesListPage listings={allListings} navigateTo={navigateTo} currentUser={currentUser} />} />
          <Route path="/annonces/:categorySlug" element={<AnnoncesListCategoryWrapper listings={allListings} navigateTo={navigateTo} currentUser={currentUser} />} />
          <Route path="/mes-annonces" element={<AnnoncesListPage listings={allListings} navigateTo={navigateTo} currentUser={currentUser} filter="my-listings" />} />
          <Route path="/annonce/:slug" element={<AnnonceDetailWrapper listings={allListings} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} onStartConversation={handleStartConversation} />} />
          
          {/* Forums */}
          <Route path="/forums" element={<ForumListPage threads={forumThreads} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} />} />
          <Route path="/forum/category/:id" element={<ForumCategoryWrapper threads={forumThreads} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} />} />
          <Route path="/forum/:slug" element={<ForumThreadWrapper threads={forumThreads} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} addPost={handleAddPostToThread} onOpenReportModal={handleOpenReportModal} />} />
          <Route path="/forum/thread/:id" element={<ForumThreadWrapper threads={forumThreads} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} addPost={handleAddPostToThread} onOpenReportModal={handleOpenReportModal} />} />
          <Route path="/forum/new-thread" element={<NewThreadPage categoryId={new URLSearchParams(window.location.search).get('category') || undefined} navigateTo={navigateTo} currentUser={currentUser} onAddThread={handleAddThread} />} />
          
          {/* Groups */}
          <Route path="/groupes" element={<GroupListPage groups={groups} navigateTo={navigateTo} currentUser={currentUser} onAddGroup={() => navigateTo('new-group')} />} />
          <Route path="/mes-groupes" element={<GroupListPage groups={groups} navigateTo={navigateTo} currentUser={currentUser} filter="my-groups" onAddGroup={() => navigateTo('new-group')} />} />
          <Route path="/groupe/:slug" element={<GroupDetailWrapper groups={groups} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} onToggleMembership={(groupId) => currentUser && handleJoinGroup(groupId, currentUser.id)} />} />
          <Route path="/nouveau-groupe" element={<NewGroupPage navigateTo={navigateTo} currentUser={currentUser} onAddGroup={(group) => currentUser && handleAddGroup(group, currentUser.id)} />} />
          
          {/* Members & Conversations */}
          <Route path="/membres" element={<MemberListPage profiles={profiles} navigateTo={navigateTo} />} />
          <Route path="/conversations" element={<ConversationsListPage conversations={conversations} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} />} />
          <Route path="/conversation/:id" element={<ConversationDetailWrapper conversations={conversations} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} onSendMessage={handleSendMessage} />} />
          
          {/* User Profile & Actions */}
          <Route path="/profil/:slug" element={<ProfileWrapper profiles={profiles} places={places} articles={articles} navigateTo={navigateTo} currentUser={currentUser} onStartConversation={handleStartConversation} />} />
          <Route path="/favoris" element={<FavoritesPage places={places} navigateTo={navigateTo} currentUser={currentUser} />} />
          <Route path="/dashboard" element={<DashboardPage navigateTo={navigateTo} currentUser={currentUser} />} />
          
          {/* Propose Content */}
          <Route path="/proposer" element={<ProposeContentPage navigateTo={navigateTo} currentUser={currentUser} />} />
          <Route path="/proposer/lieu" element={<ProposePlaceForm navigateTo={navigateTo} currentUser={currentUser} onAddPlace={handleAddPlace} />} />
          <Route path="/proposer/evenement" element={<ProposeEventForm navigateTo={navigateTo} currentUser={currentUser} onAddEvent={handleAddEvent} />} />
          <Route path="/proposer/sentier" element={<ProposeTrailForm navigateTo={navigateTo} currentUser={currentUser} onAddTrail={handleAddTrail} />} />
          <Route path="/proposer/annonce" element={<ProposeListingForm navigateTo={navigateTo} currentUser={currentUser} onAddListing={handleAddListing} />} />
          
          {/* Settings */}
          <Route path="/parametres" element={<SettingsPage currentUser={currentUser} navigateTo={navigateTo} onUpdateProfile={handleUpdateProfile} onRequestDataExport={requestDataExport} onDeleteAccount={deleteAccount} />} />
          
          {/* Espace Pro */}
          <Route path="/espace-pro" element={<EspaceProPage currentUser={currentUser} navigateTo={navigateTo} organizations={organizations} places={places} claims={claims} />} />
          <Route path="/espace-pro/lieu/:id" element={<ManagePlaceWrapper currentUser={currentUser} navigateTo={navigateTo} onUpdatePlace={handleUpdatePlace} places={places} />} />
          <Route path="/espace-pro/analytics/:id" element={<PlaceAnalyticsWrapper currentUser={currentUser} navigateTo={navigateTo} places={places} />} />
          <Route path="/espace-pro/produits/:id" element={<ManageProductsWrapper currentUser={currentUser} navigateTo={navigateTo} organizations={organizations} products={products} />} />
          <Route path="/espace-pro/services/:id" element={<ManageServicesWrapper currentUser={currentUser} navigateTo={navigateTo} organizations={organizations} services={services} />} />
          <Route path="/espace-pro/commandes/:id" element={<OrdersListWrapper currentUser={currentUser} navigateTo={navigateTo} organizations={organizations} orders={orders} profiles={profiles} />} />
          <Route path="/espace-pro/reservations/:id" element={<BookingsListWrapper currentUser={currentUser} navigateTo={navigateTo} organizations={organizations} bookings={bookings} profiles={profiles} />} />
          <Route path="/revendiquer-lieu" element={<ClaimPlacePage currentUser={currentUser} navigateTo={navigateTo} onClaim={handleClaimPlace} places={places} organizations={organizations} />} />
          <Route path="/campagnes-pub" element={<AdCampaignsPage currentUser={currentUser} navigateTo={navigateTo} />} />
          
          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard 
            currentUser={currentUser} 
            navigateTo={navigateTo}
            pendingPlaces={places.filter(p => p.status === 'pending_review')}
            pendingEvents={events.filter(e => e.status === 'pending_review')}
            pendingReports={reports.filter(r => r.status === 'pending')}
            onApprovePlace={handleApprovePlace}
            onRejectPlace={handleRejectPlace}
            onApproveEvent={handleApproveEvent}
            onRejectEvent={handleRejectEvent}
          />} />
          
          {/* Search & Static Pages */}
          <Route path="/recherche" element={<SearchPageWrapper places={places} articles={articles} trails={trails} navigateTo={navigateTo} />} />
          <Route path="/page/:slug" element={<StaticPageWrapper navigateTo={navigateTo} />} />
        </Routes>
      </main>
      <Footer navigateTo={navigateTo} onOpenReportModal={() => handleOpenReportModal('site-general', 'Platform')} />
      {showCookieBanner && <CookieBanner onAccept={handleCookieAccept} />}
      <ReportModal isOpen={reportModalInfo.isOpen} onClose={handleCloseReportModal} onSubmit={handleReportSubmit} targetId={reportModalInfo.targetId} targetType={reportModalInfo.targetType} />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSwitchToRegister={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); }}
        onLoginSuccess={loadUserSession}
      />
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
        onSwitchToLogin={() => { setIsRegisterModalOpen(false); setIsLoginModalOpen(true); }}
        onRegisterSuccess={loadUserSession}
      />
    </div>
  );
};

export default App;
