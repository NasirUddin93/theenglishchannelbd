'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Images, Plus, Trash2, Edit2, Upload, X, Search, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface GalleryPhoto {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  image_path?: string;
  order: number;
  is_active: boolean;
  created_at: string;
}

interface PaginatedResponse {
  data: GalleryPhoto[];
  current_page: number;
  last_page: number;
  total: number;
}

export default function EditGalleryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 0,
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && user.role !== 'staff') {
      toast.error('Access denied. Staff only.');
      router.push('/');
      return;
    }
    fetchGallery();
  }, [currentPage, search, user]);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        per_page: '12',
        page: String(currentPage),
      };
      if (search) params.search = search;

      const queryString = new URLSearchParams(params).toString();
      const res = await api.get<PaginatedResponse>(`/staff/gallery?${queryString}`);
      setPhotos(res.data || []);
      setCurrentPage(res.current_page);
      setLastPage(res.last_page);
      setTotal(res.total);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingPhoto(null);
    setFormData({ title: '', description: '', order: 0, is_active: true });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (photo: GalleryPhoto) => {
    setEditingPhoto(photo);
    setFormData({
      title: photo.title,
      description: photo.description || '',
      order: photo.order,
      is_active: photo.is_active,
    });
    setImageFile(null);
    setImagePreview(photo.image);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile && !editingPhoto?.image) {
      toast.error('Please select an image');
      return;
    }

    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('order', String(formData.order));
      formDataToSend.append('is_active', String(formData.is_active));

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

      if (editingPhoto) {
        // For updates, use POST with _method override for file uploads
        formDataToSend.append('_method', 'PUT');
        const response = await fetch(`${apiUrl}/staff/gallery/${editingPhoto.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          body: formDataToSend,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update photo');
        }
        toast.success('Photo updated successfully');
      } else {
        const response = await fetch(`${apiUrl}/staff/gallery`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          body: formDataToSend,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to create photo');
        }
        toast.success('Photo added successfully');
      }

      setShowModal(false);
      fetchGallery();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      await api.delete(`/staff/gallery/${id}`);
      toast.success('Photo deleted successfully');
      fetchGallery();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete photo');
    }
  };

  const toggleActive = async (photo: GalleryPhoto) => {
    try {
      await api.put(`/staff/gallery/${photo.id}`, {
        is_active: !photo.is_active,
      });
      toast.success(photo.is_active ? 'Photo hidden' : 'Photo shown');
      fetchGallery();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update photo');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Images className="w-8 h-8" />
                <h1 className="text-3xl font-serif font-bold">Manage Gallery</h1>
              </div>
              <p className="text-orange-100">Add, edit, and manage gallery photos</p>
            </div>
            <button
              onClick={openCreateModal}
              className="px-6 py-3 bg-white text-orange-600 rounded-full font-bold hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Photo
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search gallery photos..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded flex-1" />
                    <div className="h-8 bg-gray-200 rounded flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Images className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No Photos Found</h3>
            <p className="text-gray-500 mb-6">
              {search ? 'Try adjusting your search terms' : 'Start by adding your first gallery photo'}
            </p>
            {!search && (
              <button
                onClick={openCreateModal}
                className="px-6 py-3 bg-orange-600 text-white rounded-full font-bold hover:bg-orange-700 transition-all"
              >
                Add Your First Photo
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow relative"
                >
                  {/* Number Badge */}
                  <div className="absolute top-3 left-3 z-10 w-8 h-8 bg-gradient-to-br from-orange-600 to-amber-500 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg">
                    {index + 1}
                  </div>

                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {photo.image ? (
                      <img
                        src={photo.image}
                        alt={photo.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
                        <div className="text-center">
                          <div className="text-5xl mb-2">📝</div>
                          <div className="text-xs font-bold text-green-700">Text Only</div>
                        </div>
                      </div>
                    )}
                    {!photo.is_active && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="px-4 py-2 bg-white rounded-full text-sm font-bold text-gray-700">
                          Hidden
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{photo.title}</h3>
                      {photo.image && photo.description && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs font-bold rounded-full">Photo + Text</span>
                      )}
                      {photo.image && !photo.description && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-bold rounded-full">Photo</span>
                      )}
                      {!photo.image && photo.description && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs font-bold rounded-full">Text</span>
                      )}
                    </div>
                    {photo.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{photo.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                      <span>Order: {photo.order}</span>
                      <span>•</span>
                      <span>{new Date(photo.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(photo)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium"
                      >
                        {photo.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        {photo.is_active ? 'Hide' : 'Show'}
                      </button>
                      <button
                        onClick={() => openEditModal(photo)}
                        className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(photo.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 bg-white border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold">
                  {currentPage} / {lastPage}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(lastPage, p + 1))}
                  disabled={currentPage === lastPage}
                  className="p-3 bg-white border border-gray-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPhoto ? 'Edit Photo' : 'Add New Photo'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Image {editingPhoto ? '(optional)' : '*'}
                </label>
                <div
                  className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm font-medium text-gray-700 mb-1">Click to upload image</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF, WEBP up to 5MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter photo title..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter photo description..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Show on website</span>
                  </label>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {editingPhoto ? 'Updating...' : 'Uploading...'}
                  </>
                ) : (
                  <>
                    {editingPhoto ? 'Update Photo' : 'Add Photo'}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
