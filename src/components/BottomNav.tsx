'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, ListMusic, Heart, Search } from 'lucide-react';

const navItems = [
  { href: '/', label: 'होम', sublabel: 'Home', icon: Home },
  { href: '/deities', label: 'देवता', sublabel: 'Deities', icon: Layers },
  { href: '/playlists', label: 'क्रम', sublabel: 'Sequences', icon: ListMusic },
  { href: '/search', label: 'शोध', sublabel: 'Search', icon: Search },
  { href: '/favorites', label: 'आवडते', sublabel: 'Saved', icon: Heart },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg transition-colors duration-300 border-[var(--border-main)] bg-[var(--card-main)]/95 pb-safe">
      <div className="max-w-xl mx-auto px-2 flex justify-around items-center h-16">
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
                isActive
                  ? 'text-saffron-600 font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] opacity-80'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-saffron-500/10 scale-110' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
