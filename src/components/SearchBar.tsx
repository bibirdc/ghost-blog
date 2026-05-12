'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SearchItem {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date: string;
  text: string;
}

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchItem[]>([]);
  const [results, setResults] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/search-index.json')
      .then((r) => r.json())
      .then((data) => setIndex(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
        setResults([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
        setResults([]);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  function handleSearch(q: string) {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const lower = q.toLowerCase();
    const matched = index.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.excerpt.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower) ||
        item.text.toLowerCase().includes(lower)
    );
    setResults(matched.slice(0, 5));
  }

  function handleResultClick() {
    setOpen(false);
    setQuery('');
    setResults([]);
  }

  return (
    <div className="search-container" ref={containerRef}>
      <button
        className="search-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Search"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {open && (
        <div className="search-dropdown">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search posts..."
            className="search-input"
          />
          {results.length > 0 && (
            <ul className="search-results">
              {results.map((item) => (
                <li key={item.slug}>
                  <Link href={`/post/${item.slug}`} onClick={handleResultClick}>
                    <span className="search-result-title">{item.title}</span>
                    <span className="search-result-meta">
                      {item.category && <span>{item.category}</span>}
                      <span>{item.date}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {query.length >= 2 && results.length === 0 && (
            <p className="search-no-results">No posts found.</p>
          )}
        </div>
      )}
    </div>
  );
}
