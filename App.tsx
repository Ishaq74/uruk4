
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import PlaceListPage from './components/PlaceListPage';
import PlaceDetailPage from './components/PlaceDetailPage';
import ProfilePage from './components/ProfilePage';
import AnnoncesListPage from './components/AnnoncesListPage';
import AnnonceDetailPage from './components/AnnonceDetailPage';
import ArticleListPage from './components/ArticleListPage';
import ArticleDetailPage from './components/ArticleDetailPage';
import EventListPage from './components/EventListPage';
import EventDetailPage from './components/EventDetailPage';
import TrailListPage from './components/TrailListPage';
import TrailDetailPage from './components/TrailDetailPage';
import FavoritesPage from './components/FavoritesPage';
import DashboardPage from './components/DashboardPage';
import ForumListPage from './components/ForumListPage';
import ForumCategoryPage from './components/ForumCategoryPage';
import ForumThreadPage from './components/ForumThreadPage';
import NewThreadPage from './components/NewThreadPage';
import GroupListPage from './components/GroupListPage';
import GroupDetailPage from './components/GroupDetailPage';
import NewGroupPage from './components/NewGroupPage';
import MemberListPage from './components/MemberListPage';
import SearchPage from './components/SearchPage';
import ProposeContentPage from './components/ProposeContentPage';
import ProposePlaceForm from './components/propose/ProposePlaceForm';
import ProposeEventForm from './components/propose/ProposeEventForm';
import ProposeTrailForm from './components/propose/ProposeTrailForm';
import ProposeListingForm from './components/propose/ProposeListingForm';
import ConversationsListPage from './components/ConversationsListPage';
import ConversationDetailPage from './components/ConversationDetailPage';
import SettingsPage from './components/SettingsPage';
import StaticPage from './components/StaticPage';
import EspaceProPage from './components/EspaceProPage';
import ManagePlacePage from './components/ManagePlacePage';
import PlaceAnalyticsPage from './components/PlaceAnalyticsPage';
import CookieBanner from './components/CookieBanner';
import ManageProductsPage from './components/ManageProductsPage';
import ManageServicesPage from './components/ManageServicesPage';
import OrdersListPage from './components/OrdersListPage';
import BookingsListPage from './components/BookingsListPage';
import ClaimPlacePage from './components/ClaimPlacePage';
import AdCampaignsPage from './components/AdCampaignsPage';
import ReportModal from './components/ReportModal';
import LivePage from './components/LivePage';


import { Place, Profile, Review, ForumPost, Message, ForumThread, Order, Booking, Comment, PlaceClaim, Group, Report, Event, Trail, Listing, LiveEvent, Conversation } from './types';
import { 
    PROFILES, PLACES, EVENTS, TRAILS, ALL_LISTINGS, MAGAZINE_ARTICLES,
    FORUM_THREADS, GROUPS, CONVERSATIONS, ORGANIZATIONS, PRODUCTS, SERVICES,
    ORDERS, BOOKINGS, CLAIMS, REPORTS, LIVE_EVENTS, ANALYTICS_EVENTS
} from './constants';

type Route = {
  page: string;
  id?: string;
  mainCategory?: Place['mainCategory'];
  query?: string;
  slug?: string;
  filter?: 'my-listings' | 'my-groups';
}

const App: React.FC = () => {
  const [route, setRoute] = useState<Route>({ page: 'home' });
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  
  // State Management
  const [profiles, setProfiles] = useState(PROFILES);
  const [places, setPlaces] = useState(PLACES);
  const [events, setEvents] = useState(EVENTS);
  const [trails, setTrails] = useState(TRAILS);
  const [allListings, setAllListings] = useState(ALL_LISTINGS);
  const [articles, setArticles] = useState(MAGAZINE_ARTICLES);
  const [forumThreads, setForumThreads] = useState(FORUM_THREADS);
  const [groups, setGroups] = useState(GROUPS);
  const [conversations, setConversations] = useState(CONVERSATIONS);
  const [organizations, setOrganizations] = useState(ORGANIZATIONS);
  const [products, setProducts] = useState(PRODUCTS);
  const [services, setServices] = useState(SERVICES);
  const [orders, setOrders] = useState(ORDERS);
  const [bookings, setBookings] = useState(BOOKINGS);
  const [claims, setClaims] = useState(CLAIMS);
  const [reports, setReports] = useState(REPORTS);
  const [liveEvents, setLiveEvents] = useState(LIVE_EVENTS);
  const [analyticsEvents, setAnalyticsEvents] = useState(ANALYTICS_EVENTS);

  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [reportModalInfo, setReportModalInfo] = useState<{ isOpen: boolean, targetId: string, targetType: string }>({ isOpen: false, targetId: '', targetType: '' });


  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
        setShowCookieBanner(true);
    }
  }, []);

  const handleCookieAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowCookieBanner(false);
  }

  const navigateTo = (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string, filter?: 'my-listings' | 'my-groups') => {
    setRoute({ page, id, mainCategory, query, slug, filter });
    window.scrollTo(0, 0);
  };

  const handleOpenReportModal = (targetId: string, targetType: string) => { setReportModalInfo({ isOpen: true, targetId, targetType }); };
  const handleCloseReportModal = () => { setReportModalInfo({ isOpen: false, targetId: '', targetType: '' }); };
  const handleLogin = () => { setCurrentUser(profiles[0]); };
  const handleLogout = () => { setCurrentUser(null); navigateTo('home'); };
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
  
  const handleAddPlace = useCallback((place: Omit<Place, 'id' | 'rating' | 'reviewCount' | 'reviews' | 'openingHours' | 'coordinates' | 'phone' | 'website' | 'imageUrl' | 'priceRange' | 'attributes' | 'status' | 'organization_id' | 'rejection_reason'>) => {
    if(!currentUser) return;
    const newPlace: Place = { ...place, id: `place${Date.now()}`, status: 'pending_review', rating: 0, reviewCount: 0, reviews: [], openingHours: {}, coordinates: { lat: 45.9, lng: 6.12 }, phone: '', website: '', imageUrl: `https://picsum.photos/seed/${place.name}/800/600`, priceRange: '€€', attributes: [] };
    setPlaces(prev => [newPlace, ...prev]);
    alert(`${newPlace.name} a été soumis pour modération. Merci !`);
    navigateTo('place-detail', newPlace.id, newPlace.mainCategory);
  }, [currentUser]);

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

  const renderPage = () => {
    switch (route.page) {
      // Discovery
      case 'live': return <LivePage liveEvents={liveEvents} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} onAddEvent={handleAddLiveEvent} onVote={handleVoteLiveEvent} onLogin={handleLogin} />;
      case 'restaurants': return <PlaceListPage places={places} navigateTo={navigateTo} mainCategory="restauration" />;
      case 'hebergements': return <PlaceListPage places={places} navigateTo={navigateTo} mainCategory="hebergement" />;
      case 'activites': return <PlaceListPage places={places} navigateTo={navigateTo} mainCategory="activites" />;
      case 'commerces': return <PlaceListPage places={places} navigateTo={navigateTo} mainCategory="commerces" />;
      case 'place-detail': return <PlaceDetailPage id={route.id!} places={places} profiles={profiles} organizations={organizations} products={products} services={services} navigateTo={navigateTo} currentUser={currentUser} toggleFavorite={toggleFavorite} addReview={handleAddReview} onLogin={handleLogin} onAddOrder={handleAddOrder} onAddBooking={handleAddBooking} onOpenReportModal={handleOpenReportModal} />;
      case 'events': return <EventListPage events={events} navigateTo={navigateTo} />;
      case 'event-detail': return <EventDetailPage id={route.id!} events={events} navigateTo={navigateTo} currentUser={currentUser} />;
      case 'trails': return <TrailListPage trails={trails} navigateTo={navigateTo} />;
      case 'trail-detail': return <TrailDetailPage id={route.id!} trails={trails} navigateTo={navigateTo} />;
      case 'articles': return <ArticleListPage articles={articles} profiles={profiles} navigateTo={navigateTo} />;
      case 'article-detail': return <ArticleDetailPage id={route.id!} articles={articles} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} onAddComment={handleAddComment} onLogin={handleLogin} onOpenReportModal={handleOpenReportModal} />;
      
      // Community & Services
      case 'annonces': return <AnnoncesListPage listings={allListings} navigateTo={navigateTo} currentUser={currentUser} filter={route.filter} />;
      case 'annonce-detail': return <AnnonceDetailPage id={route.id!} listings={allListings} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} onStartConversation={handleStartConversation} />;
      case 'forums': return <ForumListPage threads={forumThreads} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} />;
      case 'forum-category': return <ForumCategoryPage categoryId={route.id!} threads={forumThreads} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} />;
      case 'forum-thread': return <ForumThreadPage id={route.id!} threads={forumThreads} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} addPost={handleAddPostToThread} onOpenReportModal={handleOpenReportModal} />;
      case 'new-thread': return <NewThreadPage categoryId={route.id} navigateTo={navigateTo} currentUser={currentUser} onAddThread={handleAddThread} />;
      case 'groupes': return <GroupListPage groups={groups} navigateTo={navigateTo} currentUser={currentUser} filter={route.filter} onAddGroup={() => navigateTo('new-group')} />;
      case 'group-detail': return <GroupDetailPage id={route.id!} groups={groups} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} onToggleMembership={(groupId) => currentUser && handleJoinGroup(groupId, currentUser.id)} />;
      case 'new-group': return <NewGroupPage navigateTo={navigateTo} currentUser={currentUser} onAddGroup={(group) => currentUser && handleAddGroup(group, currentUser.id)} />;
      case 'membres': return <MemberListPage profiles={profiles} navigateTo={navigateTo} />;
      case 'conversations': return <ConversationsListPage conversations={conversations} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} />
      case 'conversation-detail': return <ConversationDetailPage id={route.id!} conversations={conversations} profiles={profiles} navigateTo={navigateTo} currentUser={currentUser} onSendMessage={handleSendMessage} />

      // User Actions
      case 'profile': return <ProfilePage id={route.id!} slug={route.slug} profiles={profiles} places={places} articles={articles} navigateTo={navigateTo} currentUser={currentUser} onStartConversation={handleStartConversation} />;
      case 'favorites': return <FavoritesPage places={places} navigateTo={navigateTo} currentUser={currentUser} />;
      case 'dashboard': return <DashboardPage navigateTo={navigateTo} currentUser={currentUser} />;
      case 'propose': return <ProposeContentPage navigateTo={navigateTo} currentUser={currentUser} />;
      case 'propose-place': return <ProposePlaceForm navigateTo={navigateTo} currentUser={currentUser} onAddPlace={handleAddPlace} />;
      case 'propose-event': return <ProposeEventForm navigateTo={navigateTo} currentUser={currentUser} onAddEvent={handleAddEvent} />;
      case 'propose-trail': return <ProposeTrailForm navigateTo={navigateTo} currentUser={currentUser} onAddTrail={handleAddTrail} />;
      case 'propose-listing': return <ProposeListingForm navigateTo={navigateTo} currentUser={currentUser} onAddListing={handleAddListing} />;

      // Settings & Pro
      case 'settings': return <SettingsPage currentUser={currentUser} navigateTo={navigateTo} onUpdateProfile={handleUpdateProfile} onRequestDataExport={requestDataExport} onDeleteAccount={deleteAccount} />;
      case 'espace-pro': return <EspaceProPage currentUser={currentUser} navigateTo={navigateTo} />;
      case 'manage-place': return <ManagePlacePage id={route.id!} currentUser={currentUser} navigateTo={navigateTo} onUpdatePlace={handleUpdatePlace} />;
      case 'place-analytics': return <PlaceAnalyticsPage id={route.id!} currentUser={currentUser} navigateTo={navigateTo} />;
      case 'manage-products': return <ManageProductsPage orgId={route.id!} currentUser={currentUser} navigateTo={navigateTo} />;
      case 'manage-services': return <ManageServicesPage orgId={route.id!} currentUser={currentUser} navigateTo={navigateTo} />;
      case 'pro-orders': return <OrdersListPage orgId={route.id!} currentUser={currentUser} navigateTo={navigateTo} />;
      case 'pro-bookings': return <BookingsListPage orgId={route.id!} currentUser={currentUser} navigateTo={navigateTo} />;
      case 'claim-place': return <ClaimPlacePage currentUser={currentUser} navigateTo={navigateTo} onClaim={handleClaimPlace} />;
      case 'ad-campaigns': return <AdCampaignsPage currentUser={currentUser} navigateTo={navigateTo} />;
      
      // System Pages
      case 'search': return <SearchPage query={route.query || ''} places={places} articles={articles} trails={trails} navigateTo={navigateTo} />;
      case 'static-page': return <StaticPage slug={route.slug!} navigateTo={navigateTo} />;
      case 'home': default: return <HomePage places={places} events={events} trails={trails} articles={articles} listings={allListings} navigateTo={navigateTo} onSearch={handleSearch} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header navigateTo={navigateTo} currentUser={currentUser} onLogin={handleLogin} onLogout={handleLogout} onSearch={handleSearch} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer navigateTo={navigateTo} onOpenReportModal={() => handleOpenReportModal('site-general', 'Platform')} />
      {showCookieBanner && <CookieBanner onAccept={handleCookieAccept} />}
      <ReportModal isOpen={reportModalInfo.isOpen} onClose={handleCloseReportModal} onSubmit={handleReportSubmit} targetId={reportModalInfo.targetId} targetType={reportModalInfo.targetType} />
    </div>
  );
};

export default App;
