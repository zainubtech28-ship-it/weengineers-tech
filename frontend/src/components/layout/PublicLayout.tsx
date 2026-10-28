import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { EnquiryTrackerModal } from '../enquiries/EnquiryTrackerModal';

export const PublicLayout: React.FC = () => {
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#07070a] text-[#f4efe4] selection:bg-[#e8b84a] selection:text-[#07070a]">
      <Navbar onOpenTracker={() => setIsTrackerOpen(true)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer onOpenTracker={() => setIsTrackerOpen(true)} />
      <EnquiryTrackerModal isOpen={isTrackerOpen} onClose={() => setIsTrackerOpen(false)} />
    </div>
  );
};
