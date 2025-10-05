import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

const icons: { [key: string]: React.ReactNode } = {
  search: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  chevronDown: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  utensils: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16,5.13C16,5.13,16,5.13,16,5.13c-0.43,0-0.83,0.1-1.21,0.2C13.6,5.09,12.8,5,12,5s-1.6,0.09-2.79,0.33C8.83,5.23,8.43,5.13,8,5.13c-0.47,0-0.9,0.12-1.28,0.32l-0.1,0.05C6.23,5.74,6,6.1,6,6.5v8.83c0,0.37,0.22,0.7,0.56,0.87l0.09,0.04c0.35,0.16,0.75,0.16,1.1,0L8,16.17V9.5C8,9.5,8,9.5,8,9.5c0.69,0,1.32,0.27,1.78,0.68L9.88,10.27c0.41,0.36,1,0.36,1.41,0c0,0,0,0,0,0l0.09-0.08C11.52,10.06,11.75,10,12,10s0.48,0.06,0.62,0.19l0.09,0.08c0.41,0.36,1,0.36,1.41,0l0.1-0.09C14.68,9.77,15.31,9.5,16,9.5c0,0,0,0,0,0v6.67l0.25,0.07c0.35,0.1,0.75,0.1,1.1,0l0.09-0.04C17.78,16.03,18,15.7,18,15.33V6.5c0-0.4-0.23-0.76-0.62-1C17.28,5.3,16.85,5.13,16,5.13z M12,3c0.63,0,1.21,0.23,1.66,0.61l0.06,0.05c0.4,0.35,0.68,0.81,0.78,1.33C13.6,5.09,12.8,5,12,5s-1.6,0.09-2.79,0.33C9.32,4.8,9.59,4.35,10,4c0,0,0.01-0.01,0.01-0.01l0.06-0.05C10.51,3.58,11.23,3.23,12,3L12,3z M12,21c-2.45,0-4.64-1-6.22-2.61C5.4,18.01,5.03,17.65,5,17.24V17c0,0,0,0,0,0c0-1.5,0.48-2.88,1.29-4.03l0.1-0.13c0.34-0.45,0.85-0.74,1.42-0.81C8.4,12.51,9,13.04,9,13.75v3.42c0,0.41,0.25,0.78,0.63,0.93l0.03,0.01c0.31,0.12,0.66,0.12,0.97,0L10.75,18l0.5,0.25c0.31,0.16,0.69,0.16,1,0l0.5-0.25l0.13,0.06c0.31,0.12,0.66,0.12,0.97,0l0.03-0.01c0.38-0.15,0.63-0.52,0.63-0.93v-3.42c0-0.71,0.6-1.24,1.19-1.72c0.57-0.07,1.08,0.22,1.42,0.67l0.1,0.13C18.52,14.12,19,15.5,19,17c0,0.35-0.22,0.66-0.54,0.85l-0.1,0.05C17.68,18.3,16.59,19.2,15,20.02C14.07,20.64,13.07,21,12,21z"/>
    </svg>
  ),
  bed: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
       <path d="M20,9.65V7.5c0-1.38-1.12-2.5-2.5-2.5H6.5C5.12,5,4,6.12,4,7.5v2.15c-1.69,0.43-3,1.96-3,3.72V17c0,0.55,0.45,1,1,1h1v1c0,0.55,0.45,1,1,1h16c0.55,0,1-0.45,1-1v-1h1c0.55,0,1-0.45,1-1v-3.63c0-1.76-1.31-3.29-3-3.72z M18,8.5c0.28,0,0.5,0.22,0.5,0.5S18.28,9.5,18,9.5H6c-0.28,0-0.5-0.22-0.5-0.5S5.72,8.5,6,8.5H18z M6.5,6.5h11c0.28,0,0.5,0.22,0.5,0.5S17.78,7.5,17.5,7.5h-11C6.22,7.5,6,7.28,6,7S6.22,6.5,6.5,6.5z M20,16h-2v-1.5c0-0.83-0.67-1.5-1.5-1.5h-9C6.67,13,6,13.67,6,14.5V16H4v-2.63c0-1.03,0.62-1.93,1.54-2.29L6,11h12l0.46,0.08c0.92,0.36,1.54,1.26,1.54,2.29V16z"/>
    </svg>
  ),
  hiking: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5,5.5c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S12.4,5.5,13.5,5.5z M9.8,8.9L7,15.4V22h2v-6l2.1-5.6l2.3,2.7L16.2,17l1.5-1.5l-2.3-4.3l-2-1.6L12.1,8L9.8,8.9z"/>
    </svg>
  ),
  store: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20,4H4C2.89,4,2,4.89,2,6v2c0,1.11,0.89,2,2,2h16c1.11,0,2-0.89,2-2V6C22,4.89,21.11,4,20,4z M4,12h16v8H4V12z M12,13 c-1.66,0-3,1.34-3,3s1.34,3,3,3s3-1.34,3-3S13.66,13,12,13z" opacity=".3"/>
        <path d="M20,2H4C2.89,2,2,2.89,2,4v2c0,1.11,0.89,2,2,2h16c1.11,0,2-0.89,2-2V4C22,2.89,21.11,2,20,2z M20,6H4V4h16V6z M20,10H4c-1.11,0-2,0.89-2,2v8c0,1.11,0.89,2,2,2h16c1.11,0,2-0.89,2-2v-8C22,10.89,21.11,10,20,10z M20,20H4v-8h16V20z"/>
        <path d="M12,16c1.66,0,3-1.34,3-3s-1.34-3-3-3s-3,1.34-3,3S10.34,16,12,16z"/>
    </svg>
  ),
  briefcase: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
       <path d="M20,6h-4V4c0-1.1-0.9-2-2-2h-4C8.9,2,8,2.9,8,4v2H4C2.9,6,2,6.9,2,8v11c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8 C22,6.9,21.1,6,20,6z M10,4h4v2h-4V4z M20,19H4V8h16V19z"/>
       <path d="M14,14v-2h-4v2H8l4,4l4-4H14z" opacity=".3"/>
       <path d="M12,16l-4-4h3V9.9c0-0.55-0.45-0.9-1-0.9H8v2h1.17L12,13.83L14.83,11H16v-2h-2c-0.55,0-1,0.35-1,0.8V12h3l-4,4z"/>
    </svg>
  ),
  home: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
       <path d="M12,5.5l6,4.5v9H6v-9L12,5.5z M12,3L4,9v12h16V9L12,3z"/>
       <path d="M10,14v4h4v-4H10z"/>
    </svg>
  ),
  tag: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
       <path d="M21.41,11.58l-9-9C12.05,2.22,11.55,2,11,2H4C2.9,2,2,2.9,2,4v7c0,0.55,0.22,1.05,0.59,1.42l9,9 c0.36,0.36,0.86,0.58,1.41,0.58s1.05-0.22,1.41-0.59l7-7C22.22,13.62,22.22,12.38,21.41,11.58z M13,20.01L4,11V4h7l9,9L13,20.01 z"/>
       <circle cx="6.5" cy="6.5" r="1.5"/>
    </svg>
  ),
  users: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16,11c1.66,0,2.99-1.34,2.99-3S17.66,5,16,5s-3,1.34-3,3S14.34,11,16,11z M8,11c1.66,0,2.99-1.34,2.99-3S9.66,5,8,5 S5,6.34,5,8S6.34,11,8,11z M8,13c-2.33,0-7,1.17-7,3.5V19h14v-2.5C15,14.17,10.33,13,8,13z M16,13c-0.27,0-0.53,0.01-0.78,0.03 c1.15,0.5,2.01,1.27,2.56,2.16C19.16,14.38,17.43,13.33,16,13z"/>
    </svg>
  ),
  user: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  heart: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.273l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
  ),
  share: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4m0 0L8 8m4-4v12" />
      </svg>
  ),
  'map-pin': (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
  ),
  phone: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  'globe-alt': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 00-9-9m9-9a9 9 0 019 9" />
    </svg>
  ),
  'dog': (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.419c-2.43.089-4.524 2.174-4.5 4.581 0 .034.002.068.005.1.066.634.349 1.22.754 1.685C5.08 11.06 3.012 12.049 3 15v2h2v-2.247c.56-1.547 2.05-2.697 3.82-3.003.116.59.344 1.146.678 1.649.04.06.08.12.122.18.36.52.82.939 1.359 1.241-1.092 1.25-1.092 2.68 0 3.931 1.34 1.52 3.66 1.52 5 0 1.092-1.25 1.092-2.68 0-3.931-.49-.55-1.07-.98-1.7-1.28.09-.15.17-.3.25-.45.49-.9.49-1.97 0-2.87-.55-.99-1.57-1.63-2.75-1.72V4.42z M10.5 9.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  'water': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5.138C8.544 4.542 9.248 4.09 10.03 3.82c1.78-.62 3.8-.06 5.16 1.3 1.38 1.38 1.92 3.38 1.3 5.16-.27.78-.72 1.48-1.32 2.02M16 18.86c-.54.59-1.24.94-2.02 1.32-1.78.62-3.8-.06-5.16-1.3-1.38-1.38-1.92-3.38-1.3-5.16.27-.78.72-1.48 1.32-2.02" />
    </svg>
  ),
  'award': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'calendar': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  'message-square': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  ),
  'activity':(
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  'building-office': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-4h1m-1 4h1m-1-4h1m-1 4h1" />
    </svg>
  ),
  'shopping-bag': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  'sparkles':(
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M19 3v4M17 5h4M14 11l-1-1-1 1-1-1-1 1-1-1-1 1M10 21l-1-1-1 1-1-1-1 1-1-1-1 1" />
    </svg>
  ),
  'ticket':(
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  ),
  'music':(
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-13c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
    </svg>
  ),
  'palette':(
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  'clock': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'trending-up': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  ),
  'map': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l6.553 3.276A1 1 0 0021 19.382V8.618a1 1 0 00-1.447-.894L15 10m0 10V7" />
    </svg>
  ),
  'download': (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  sun: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  moon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  zap: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  truck: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 17h2v-5H3V4h14v8h-4l-3 3z" />
       <path d="M14 9h4" />
     </svg>
  ),
  'hash': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    </svg>
  ),
  'message-circle': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  'layout-dashboard': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h6v6H4V4zm0 10h6v6H4v-6zM14 4h6v6h-6V4zm0 10h6v6h-6v-6z" />
    </svg>
  ),
  'spinner': (
    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ),
   'alert-triangle': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  'info': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
    'cloud-lightning': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.246 15.013A7.5 7.5 0 014.5 9.75a7.5 7.5 0 0115 0 7.5 7.5 0 01-1.254 5.263m-12.492 0H19.5" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  'arrow-up': (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
      </svg>
  ),
  'arrow-down': (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
  ),
  'traffic-cone': (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L12 3l2.25 14" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.25 17h13.5" />
    </svg>
  ),
};

const Icon: React.FC<IconProps> = ({ name, className }) => {
  const selectedIcon = icons[name];
  if (!selectedIcon) {
    return <span className={className}>?</span>;
  }
  return <div className={className}>{selectedIcon}</div>;
};

export default Icon;
