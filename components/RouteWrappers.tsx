import React from 'react';
import { useParams } from 'react-router-dom';
import PlaceDetailPage from './PlaceDetailPage';
import EventDetailPage from './EventDetailPage';
import TrailDetailPage from './TrailDetailPage';
import ArticleDetailPage from './ArticleDetailPage';
import AnnonceDetailPage from './AnnonceDetailPage';
import ForumCategoryPage from './ForumCategoryPage';
import ForumThreadPage from './ForumThreadPage';
import GroupDetailPage from './GroupDetailPage';
import ConversationDetailPage from './ConversationDetailPage';
import ProfilePage from './ProfilePage';
import ManagePlacePage from './ManagePlacePage';
import PlaceAnalyticsPage from './PlaceAnalyticsPage';
import ManageProductsPage from './ManageProductsPage';
import ManageServicesPage from './ManageServicesPage';
import OrdersListPage from './OrdersListPage';
import BookingsListPage from './BookingsListPage';
import StaticPage from './StaticPage';
import SearchPage from './SearchPage';
import { Place, Profile, Event, Trail, Article, Listing, ForumThread, Group, Conversation, Organization, Product, Service, Order, Booking, Review, ForumPost, Message, PlaceClaim } from '../types';

// Wrapper components for routes with URL parameters

export const PlaceDetailWrapper: React.FC<{
  places: Place[];
  profiles: Profile[];
  organizations: Organization[];
  products: Product[];
  services: Service[];
  navigateTo: (page: string, id?: string, mainCategory?: Place['mainCategory'], query?: string, slug?: string, filter?: 'my-listings' | 'my-groups') => void;
  currentUser: Profile | null;
  toggleFavorite: (placeId: string) => void;
  addReview: (placeId: string, review: Omit<Review, 'id' | 'date' | 'placeId'>) => void;
  onLogin: () => void;
  onAddOrder: (order: Omit<Order, 'id'>) => void;
  onAddBooking: (booking: Omit<Booking, 'id'>) => void;
  onOpenReportModal: (targetId: string, targetType: string) => void;
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  return <PlaceDetailPage {...props} id={id || ''} />;
};

export const EventDetailWrapper: React.FC<{
  events: Event[];
  navigateTo: (page: string, id?: string) => void;
  currentUser: Profile | null;
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  return <EventDetailPage {...props} id={id || ''} />;
};

export const TrailDetailWrapper: React.FC<{
  trails: Trail[];
  navigateTo: (page: string, id?: string) => void;
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  return <TrailDetailPage {...props} id={id || ''} />;
};

export const ArticleDetailWrapper: React.FC<{
  articles: Article[];
  profiles: Profile[];
  navigateTo: (page: string, id?: string) => void;
  currentUser: Profile | null;
  onAddComment: (articleId: string, comment: any) => void;
  onLogin: () => void;
  onOpenReportModal: (targetId: string, targetType: string) => void;
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  return <ArticleDetailPage {...props} id={id || ''} />;
};

export const AnnonceDetailWrapper: React.FC<{
  listings: Listing[];
  profiles: Profile[];
  navigateTo: (page: string, id?: string) => void;
  currentUser: Profile | null;
  onStartConversation: (recipientId: string) => void;
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  return <AnnonceDetailPage {...props} id={id || ''} />;
};

export const ForumCategoryWrapper: React.FC<{
  threads: ForumThread[];
  profiles: Profile[];
  navigateTo: (page: string, id?: string) => void;
  currentUser: Profile | null;
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  return <ForumCategoryPage {...props} categoryId={id || ''} />;
};

export const ForumThreadWrapper: React.FC<{
  threads: ForumThread[];
  profiles: Profile[];
  navigateTo: (page: string, id?: string) => void;
  currentUser: Profile | null;
  addPost: (threadId: string, post: Omit<ForumPost, 'id' | 'createdAt'>) => void;
  onOpenReportModal: (targetId: string, targetType: string) => void;
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  return <ForumThreadPage {...props} id={id || ''} />;
};

export const GroupDetailWrapper: React.FC<{
  groups: Group[];
  profiles: Profile[];
  navigateTo: (page: string, id?: string) => void;
  currentUser: Profile | null;
  onToggleMembership: (groupId: string) => void;
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  return <GroupDetailPage {...props} id={id || ''} />;
};

export const ConversationDetailWrapper: React.FC<{
  conversations: Conversation[];
  profiles: Profile[];
  navigateTo: (page: string, id?: string) => void;
  currentUser: Profile | null;
  onSendMessage: (conversationId: string, message: Omit<Message, 'id' | 'senderId' | 'createdAt'>) => void;
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  return <ConversationDetailPage {...props} id={id || ''} />;
};

export const ProfileWrapper: React.FC<{
  profiles: Profile[];
  places: Place[];
  articles: Article[];
  navigateTo: (page: string, id?: string) => void;
  currentUser: Profile | null;
  onStartConversation: (recipientId: string) => void;
}> = (props) => {
  const { slug } = useParams<{ slug: string }>();
  return <ProfilePage {...props} id={slug || ''} slug={slug} />;
};

export const ManagePlaceWrapper: React.FC<{
  currentUser: Profile | null;
  navigateTo: (page: string, id?: string) => void;
  onUpdatePlace: (placeId: string, updates: Partial<Place>) => void;
  places: Place[];
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  return <ManagePlacePage {...props} id={id || ''} />;
};

export const PlaceAnalyticsWrapper: React.FC<{
  currentUser: Profile | null;
  navigateTo: (page: string, id?: string) => void;
  places: Place[];
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  return <PlaceAnalyticsPage {...props} id={id || ''} />;
};

export const ManageProductsWrapper: React.FC<{
  currentUser: Profile | null;
  navigateTo: (page: string, id?: string) => void;
  organizations: Organization[];
  products: Product[];
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  return <ManageProductsPage {...props} orgId={id || ''} />;
};

export const ManageServicesWrapper: React.FC<{
  currentUser: Profile | null;
  navigateTo: (page: string, id?: string) => void;
  organizations: Organization[];
  services: Service[];
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  return <ManageServicesPage {...props} orgId={id || ''} />;
};

export const OrdersListWrapper: React.FC<{
  currentUser: Profile | null;
  navigateTo: (page: string, id?: string) => void;
  organizations: Organization[];
  orders: Order[];
  profiles: Profile[];
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  return <OrdersListPage {...props} orgId={id || ''} />;
};

export const BookingsListWrapper: React.FC<{
  currentUser: Profile | null;
  navigateTo: (page: string, id?: string) => void;
  organizations: Organization[];
  bookings: Booking[];
  profiles: Profile[];
}> = (props) => {
  const { id } = useParams<{ id: string }>();
  return <BookingsListPage {...props} orgId={id || ''} />;
};

export const StaticPageWrapper: React.FC<{
  navigateTo: (page: string, id?: string) => void;
}> = (props) => {
  const { slug } = useParams<{ slug: string }>();
  return <StaticPage {...props} slug={slug || ''} />;
};

export const SearchPageWrapper: React.FC<{
  places: Place[];
  articles: Article[];
  trails: Trail[];
  navigateTo: (page: string, id?: string) => void;
}> = (props) => {
  const query = new URLSearchParams(window.location.search).get('q') || '';
  return <SearchPage {...props} query={query} />;
};
