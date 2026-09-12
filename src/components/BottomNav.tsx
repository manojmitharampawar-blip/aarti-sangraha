'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, ListMusic, Heart, Search } from 'lucide-react';

const navItems = [
  { href: '/', label: 'होम', sublabel: 'Home', icon: Home },
  { href: '/deities', label: 'देवता', sublabel: 'Deities', icon: Layers },
  { href: '/playlists', label: 'माझे संग्रह', sublabel: 'My Sangrah', icon: ListMusic },
  { href: '/search', label: 'शोध', sublabel: 'Search', icon: Search },
  { href: '/favorites', label: 'आवडते', sublabel: 'Saved', icon: Heart },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg transition-colors duration-300 border-[var(--border-main)] bg-[var(--card-main)]/95 pb-safe">
      <div className="max-w-xl mx-auto px-2 flex justify-around items-center h-16">
        {navItems.map(item => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/' && pathname?.startsWith(item.href)) ||
            (item.href === '/playlists' && (pathname?.startsWith('/groups') || pathname?.startsWith('/group')));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-200 ${
                isActive
                  ? 'text-saffron-600 font-bold scale-105'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-saffron-600 rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight font-devanagari">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
