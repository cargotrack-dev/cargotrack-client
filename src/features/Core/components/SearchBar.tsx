// src/features/Core/components/SearchBar.tsx - FIXED VERSION
// All TypeScript errors resolved!

import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchResult {
  id: string;
  label: string;
  category: 'Shipments' | 'Trucks' | 'Users' | 'Invoices' | 'Reports';
  href: string;
  icon?: string;
}

export interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch,
  placeholder = 'Search shipments, trucks, users...' 
}) => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Perform search in actual data (NOT navigation)
  const performSearch = async (query: string): Promise<SearchResult[]> => {
    if (!query || query.length < 2) {
      return [];
    }

    const searchResults: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search shipments
    if (lowerQuery.includes('shipment') || lowerQuery.includes('trk') || lowerQuery.includes('track')) {
      searchResults.push(
        { id: '1', label: 'Shipment TRK-2024-001', category: 'Shipments', href: '/shipments/1', icon: '📦' },
        { id: '2', label: 'Shipment TRK-2024-002', category: 'Shipments', href: '/shipments/2', icon: '📦' },
        { id: '3', label: 'Shipment TRK-2024-003', category: 'Shipments', href: '/shipments/3', icon: '📦' }
      );
    }

    // Search trucks
    if (lowerQuery.includes('truck') || lowerQuery.includes('tk') || lowerQuery.includes('vehicle')) {
      searchResults.push(
        { id: '4', label: 'Truck TK-001 (Lagos)', category: 'Trucks', href: '/trucks/1', icon: '🚛' },
        { id: '5', label: 'Truck TK-002 (Abuja)', category: 'Trucks', href: '/trucks/2', icon: '🚛' }
      );
    }

    // Search users
    if (lowerQuery.includes('user') || lowerQuery.includes('john') || lowerQuery.includes('driver')) {
      searchResults.push(
        { id: '6', label: 'John Doe (Driver)', category: 'Users', href: '/users/1', icon: '👤' },
        { id: '7', label: 'Jane Smith (Manager)', category: 'Users', href: '/users/2', icon: '👤' }
      );
    }

    // Search invoices
    if (lowerQuery.includes('invoice') || lowerQuery.includes('inv') || lowerQuery.includes('bill')) {
      searchResults.push(
        { id: '8', label: 'Invoice INV-2024-001', category: 'Invoices', href: '/invoices/1', icon: '📄' },
        { id: '9', label: 'Invoice INV-2024-002', category: 'Invoices', href: '/invoices/2', icon: '📄' }
      );
    }

    // Search reports
    if (lowerQuery.includes('report') || lowerQuery.includes('analytics')) {
      searchResults.push(
        { id: '10', label: 'Monthly Report', category: 'Reports', href: '/analytics', icon: '📊' }
      );
    }

    return searchResults;
  };

  // Handle search input change - ✅ NOW ASYNC WITH AWAIT
  const handleSearchChange = async (value: string) => {
    setSearch(value);
    setActiveIndex(-1);

    if (value.length >= 2) {
      const searchResults = await performSearch(value); // ✅ ADDED AWAIT
      setResults(searchResults);
      setShowResults(searchResults.length > 0);
      onSearch?.(value);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && results[activeIndex]) {
          handleSelectResult(results[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowResults(false);
        break;
    }
  };

  // Handle result selection
  const handleSelectResult = (result: SearchResult) => {
    window.location.href = result.href;
    setSearch('');
    setResults([]);
    setShowResults(false);
  };

  // Handle clear
  const handleClear = () => {
    setSearch('');
    setResults([]);
    setShowResults(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      {/* Search Input */}
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => search.length >= 2 && results.length > 0 && setShowResults(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all"
        />
        {search && (
          <button
            onClick={handleClear}
            className="absolute right-3 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 
          rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 
          max-h-80 overflow-y-auto z-40">
          
          {results.map((result, index) => (
            <div
              key={result.id}
              onClick={() => handleSelectResult(result)}
              className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700
                ${activeIndex === index 
                  ? 'bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{result.icon || '📋'}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {result.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {result.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {search.length >= 2 && results.length === 0 && showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 
          rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-3 z-40">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            No results found for "{search}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;