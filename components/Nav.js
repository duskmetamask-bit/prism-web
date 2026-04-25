'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '◈' },
  { href: '/chat', label: 'Chat', icon: '◉' },
  { href: '/calendar', label: 'Calendar', icon: '▣' },
  { href: '/drafts', label: 'Drafts', icon: '◇' },
  { href: '/improvements', label: 'Improvements', icon: '◐' },
  { href: '/generate', label: 'Generate', icon: '▲' },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav style={{
      width: '240px',
      background: '#111',
      borderRight: '1px solid #222',
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      padding: '1.5rem 0',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ padding: '0 1.5rem 1.5rem', borderBottom: '1px solid #222', marginBottom: '1rem' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.02em' }}>PRISM</div>
        <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.125rem' }}>Content Engine</div>
      </div>
      {navItems.map(item => (
        <Link key={item.href} href={item.href}>
          <div style={{
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: pathname === item.href ? '600' : '400',
            background: pathname === item.href ? '#1a1a1a' : 'transparent',
            color: pathname === item.href ? '#fff' : '#888',
            borderLeft: pathname === item.href ? '2px solid #fff' : '2px solid transparent',
          }}>
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            {item.label}
          </div>
        </Link>
      ))}
      <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid #222' }}>
        <div style={{ fontSize: '0.7rem', color: '#444' }}>v1.0.0</div>
        <div style={{ fontSize: '0.65rem', color: '#333', marginTop: '0.125rem' }}>Powered by MEWY</div>
      </div>
    </nav>
  );
}
