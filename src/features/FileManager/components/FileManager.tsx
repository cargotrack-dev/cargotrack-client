// src/features/FileManager/components/FileManager.tsx
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Search, Download, Trash2, Eye, Grid, List } from 'lucide-react';

interface FileManagerProps {
  userId?: string;
  category?: string;
  relatedTo?: {
    model: string;
    id: string;
  };
}

interface FileItem {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  signedUrl?: string;
  category: string;
  tags: string[];
  createdAt: string;
  uploadedBy: {
    firstName: string;
    lastName: string;
  };
}

interface PaginationData {
  totalPages: number;
  currentPage: number;
  totalFiles: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Memoized FileCard component for better performance
const FileCard = memo<{ 
  file: FileItem; 
  onView: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
  onDelete: (fileId: string) => void;
}>(({ file, onView, onDownload, onDelete }) => {
  const getFileIcon = useCallback((mimetype: string) => {
    if (mimetype.startsWith('image/')) return '🖼️';
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('word')) return '📝';
    return '📁';
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="text-center mb-3">
          <div className="text-4xl mb-2">{getFileIcon(file.mimetype)}</div>
          <h3 className="font-medium text-gray-900 truncate" title={file.originalName}>
            {file.originalName}
          </h3>
        </div>
        
        <div className="text-sm text-gray-500 space-y-1">
          <p>Size: {formatFileSize(file.size)}</p>
          <p>Category: {file.category}</p>
          <p>Date: {formatDate(file.createdAt)}</p>
        </div>

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
          <button
            onClick={() => onView(file)}
            className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
            title="View"
            aria-label={`View ${file.originalName}`}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDownload(file)}
            className="text-green-600 hover:text-green-800 p-1 transition-colors"
            title="Download"
            aria-label={`Download ${file.originalName}`}
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(file.id)}
            className="text-red-600 hover:text-red-800 p-1 transition-colors"
            title="Delete"
            aria-label={`Delete ${file.originalName}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

FileCard.displayName = 'FileCard';

// Memoized table row component
const FileTableRow = memo<{
  file: FileItem;
  onView: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
  onDelete: (fileId: string) => void;
}>(({ file, onView, onDownload, onDelete }) => {
  const getFileIcon = useCallback((mimetype: string) => {
    if (mimetype.startsWith('image/')) return '🖼️';
    if (mimetype.includes('pdf')) return '📄';
    if (mimetype.includes('word')) return '📝';
    return '📁';
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{getFileIcon(file.mimetype)}</span>
          <div>
            <p className="font-medium text-gray-900">{file.originalName}</p>
            <p className="text-sm text-gray-500">{file.mimetype}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {formatFileSize(file.size)}
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {file.category}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {formatDate(file.createdAt)}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onView(file)}
            className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
            title="View"
            aria-label={`View ${file.originalName}`}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDownload(file)}
            className="text-green-600 hover:text-green-800 p-1 transition-colors"
            title="Download"
            aria-label={`Download ${file.originalName}`}
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(file.id)}
            className="text-red-600 hover:text-red-800 p-1 transition-colors"
            title="Delete"
            aria-label={`Delete ${file.originalName}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
});

FileTableRow.displayName = 'FileTableRow';

// Type definitions for cached data
interface CachedFilesData {
  files: FileItem[];
  pagination: PaginationData;
}

// Enhanced cache for API responses
class FileManagerCache {
  private cache = new Map<string, { data: CachedFilesData; timestamp: number; ttl: number }>();
  
  set(key: string, data: CachedFilesData, ttl = 300000) { // 5 minutes default TTL
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
  
  get(key: string): CachedFilesData | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  invalidate(pattern: string) {
    for (const [key] of this.cache) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
  
  clear() {
    this.cache.clear();
  }
}

const fileCache = new FileManagerCache();

export const FileManager: React.FC<FileManagerProps> = ({
  userId,
  category,
  relatedTo
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    totalPages: 1,
    currentPage: 1,
    totalFiles: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [error, setError] = useState<string | null>(null);

  // Debounced search to improve performance
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoized cache key generation
  const getCacheKey = useCallback((page: number, category: string, search: string) => {
    return `files_${userId || 'current'}_${page}_${category}_${search}_${relatedTo?.model || ''}_${relatedTo?.id || ''}`;
  }, [userId, relatedTo]);

  // Optimized fetch function with caching
  const fetchFiles = useCallback(async () => {
    const cacheKey = getCacheKey(page, selectedCategory, debouncedSearchTerm);
    
    // Check cache first
    const cachedData = fileCache.get(cacheKey);
    if (cachedData) {
      setFiles(cachedData.files);
      setPagination(cachedData.pagination);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });

      if (selectedCategory) params.append('category', selectedCategory);
      if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
      if (relatedTo) {
        params.append('relatedTo', `${relatedTo.model}:${relatedTo.id}`);
      }

      const endpoint = userId ? `/api/files/user/${userId}` : '/api/files/user';
      
      // Add request timeout and abort controller for better UX
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${endpoint}?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Cache-Control': 'max-age=300' // 5 minutes browser cache
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const responseData = {
          files: result.data.files,
          pagination: result.data.pagination
        };
        
        // Cache the response
        fileCache.set(cacheKey, responseData);
        
        setFiles(responseData.files);
        setPagination(responseData.pagination);
      } else {
        throw new Error(result.message || 'Failed to fetch files');
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Request timeout. Please try again.');
        } else {
          setError(error.message);
        }
      } else {
        setError('An unexpected error occurred');
      }
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, debouncedSearchTerm, userId, relatedTo, getCacheKey]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Optimized delete function with cache invalidation
  const deleteFile = useCallback(async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        // Optimistically update UI
        setFiles(prev => prev.filter(f => f.id !== fileId));
        
        // Invalidate relevant cache entries
        fileCache.invalidate(`files_${userId || 'current'}`);
        
        // Update pagination count
        setPagination(prev => ({
          ...prev,
          totalFiles: prev.totalFiles - 1
        }));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete file');
      
      // Refresh data on error to ensure consistency
      fetchFiles();
    }
  }, [userId, fetchFiles]);

  // Optimized download function
  const downloadFile = useCallback((file: FileItem) => {
    try {
      const url = file.signedUrl || file.url;
      const link = document.createElement('a');
      link.href = url;
      link.download = file.originalName;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Use a more reliable download method
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Track download analytics if needed
      // analytics.track('file_downloaded', { fileId: file.id, fileName: file.originalName });
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Failed to download file. Please try again.');
    }
  }, []);

  // Optimized view function
  const viewFile = useCallback((file: FileItem) => {
    try {
      const url = file.signedUrl || file.url;
      window.open(url, '_blank', 'noopener,noreferrer');
      
      // Track view analytics if needed
      // analytics.track('file_viewed', { fileId: file.id, fileName: file.originalName });
    } catch (error) {
      console.error('Error viewing file:', error);
      setError('Failed to view file. Please try again.');
    }
  }, []);

  // Reset page when filters change
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [selectedCategory, debouncedSearchTerm, page]);

  // Memoized categories to prevent unnecessary re-renders
  const categories = useMemo(() => [
    { value: '', label: 'All Categories' },
    { value: 'document', label: 'Documents' },
    { value: 'image', label: 'Images' },
    { value: 'avatar', label: 'Avatars' },
    { value: 'proof', label: 'Proof of Delivery' },
    { value: 'other', label: 'Other' }
  ], []);

  if (loading && files.length === 0) {
    return (
      <div className="file-manager">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading files...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="file-manager">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">File Manager</h2>
          {pagination.totalFiles > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {pagination.totalFiles} file{pagination.totalFiles !== 1 ? 's' : ''} total
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg p-1 bg-gray-50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-red-400 mr-3">⚠️</div>
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            aria-label="Search files"
          />
          {debouncedSearchTerm !== searchTerm && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          aria-label="Filter by category"
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Files Display */}
      {files.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <p className="text-gray-500 text-lg">
            {debouncedSearchTerm || selectedCategory 
              ? 'No files match your search criteria' 
              : 'No files found'
            }
          </p>
          {(debouncedSearchTerm || selectedCategory) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {files.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onView={viewFile}
                  onDownload={downloadFile}
                  onDelete={deleteFile}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {files.map((file) => (
                      <FileTableRow
                        key={file.id}
                        file={file}
                        onView={viewFile}
                        onDownload={downloadFile}
                        onDelete={deleteFile}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Enhanced Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
              <div className="text-sm text-gray-700">
                Showing page {pagination.currentPage} of {pagination.totalPages}
                {pagination.totalFiles > 0 && (
                  <span className="ml-2">
                    ({pagination.totalFiles} total files)
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(1)}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="First page"
                >
                  «
                </button>
                
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrevPage}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg">
                  {page}
                </span>
                
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={!pagination.hasNextPage}
                  className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
                
                <button
                  onClick={() => setPage(pagination.totalPages)}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Last page"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Loading overlay for subsequent requests */}
      {loading && files.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-sm text-gray-600">Updating...</span>
        </div>
      )}
    </div>
  );
};