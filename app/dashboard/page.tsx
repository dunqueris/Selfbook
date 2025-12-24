'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'
import { Profile, Section } from '@/lib/types'
import { Plus, Eye, Edit2, Trash2, GripVertical } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single<Profile>()

    if (profileError) {
      console.error('Error loading profile:', profileError)
      console.error('User ID:', user.id)
      console.error('Error code:', profileError.code)
      
      // If profile doesn't exist, try to create it as a fallback
      if (profileError.code === 'PGRST116') {
        console.warn('Profile not found for user, attempting to create...')
        try {
          const response = await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              username: `user_${user.id.slice(0, 8)}`,
              display_name: user.email?.split('@')[0] || 'New User',
            }),
          })
          
          const result = await response.json()
          if (response.ok && result) {
            setProfile(result)
            setDisplayName(result.display_name || '')
            setBio(result.bio || '')
          } else {
            console.error('Failed to create profile:', result.error)
          }
        } catch (err) {
          console.error('Exception creating profile:', err)
        }
      }
    }

    if (profileData) {
      setProfile(profileData)
      setDisplayName(profileData.display_name || '')
      setBio(profileData.bio || '')
      setAvatarUrl(profileData.avatar_url || '')
      setBannerUrl(profileData.banner_url || '')

      const profileId: string = profileData.id

      const { data: sectionsData } = await supabase
        .from('sections')
        .select('*')
        .eq('profile_id', profileId)
        .order('position')

      if (sectionsData) {
        setSections(sectionsData)
      }
    }

    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const updateProfile = async () => {
    if (!profile) return

    const updateData = {
      display_name: displayName,
      bio: bio,
      avatar_url: avatarUrl,
      banner_url: bannerUrl,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('profiles')
      // @ts-expect-error - Supabase type inference issue
      .update(updateData)
      .eq('id', profile.id)

    if (!error) {
      setEditingProfile(false)
      loadProfile()
    }
  }

  const uploadAvatar = async (file: File) => {
    if (!profile) return
    setUploadingAvatar(true)
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}-avatar.${fileExt}`
      const filePath = `avatars/${fileName}`

      console.log('Starting avatar upload...')
      console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type)
      console.log('Upload path:', filePath)

      const { error: uploadError, data } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true })

      console.log('Upload response:', { error: uploadError, data })

      if (uploadError) {
        console.error('Upload error details:', uploadError)
        throw uploadError
      }

      const { data: publicUrlData } = supabase.storage.from('Profiles').getPublicUrl(filePath)
      const newUrl = publicUrlData.publicUrl
      console.log('Generated public URL:', newUrl)
      setAvatarUrl(newUrl)

      // Auto-save to database
      // @ts-ignore - Supabase type inference
      await supabase.from('profiles').update({ avatar_url: newUrl, updated_at: new Date().toISOString() }).eq('id', profile.id)
      console.log('Avatar URL saved to database')
    } catch (error) {
      console.error('Avatar upload failed:', error)
      const errorMsg = error instanceof Error ? error.message : String(error)
      alert(`Failed to upload avatar: ${errorMsg}`)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const uploadBanner = async (file: File) => {
    if (!profile) return
    setUploadingBanner(true)
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}-banner.${fileExt}`
      const filePath = `banners/${fileName}`

      console.log('Starting banner upload...')
      console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type)
      console.log('Upload path:', filePath)

      const { error: uploadError, data } = await supabase.storage
        .from('Profiles')
        .upload(filePath, file, { upsert: true })

      console.log('Upload response:', { error: uploadError, data })

      if (uploadError) {
        console.error('Upload error details:', uploadError)
        throw uploadError
      }

      const { data: publicUrlData } = supabase.storage.from('Profiles').getPublicUrl(filePath)
      const newUrl = publicUrlData.publicUrl
      console.log('Generated public URL:', newUrl)
      setBannerUrl(newUrl)

      // Auto-save to database
      // @ts-ignore - Supabase type inference
      await supabase.from('profiles').update({ banner_url: newUrl, updated_at: new Date().toISOString() }).eq('id', profile.id)
      console.log('Banner URL saved to database')
    } catch (error) {
      console.error('Banner upload failed:', error)
      const errorMsg = error instanceof Error ? error.message : String(error)
      alert(`Failed to upload banner: ${errorMsg}`)
    } finally {
      setUploadingBanner(false)
    }
  }

  const addSection = async (type: 'text_list' | 'links' | 'gallery') => {
    if (!profile) return

    const defaultContent = {
      text_list: { items: ['First item', 'Second item'] },
      links: { links: [{ title: 'My Link', url: 'https://example.com' }] },
      gallery: { images: [] },
    }

    const insertData = {
      profile_id: profile.id,
      title: `New ${type.replace('_', ' ')}`,
      type,
      content: defaultContent[type],
      position: sections.length,
    }

    const { error } = await supabase
      .from('sections')
      // @ts-expect-error - Supabase type inference issue
      .insert(insertData)

    if (!error) {
      loadProfile()
    }
  }

  const deleteSection = async (sectionId: string) => {
    if (!confirm('Delete this section?')) return

    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', sectionId)

    if (!error) {
      loadProfile()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>Profile not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Profile Info */}
        <div className="border border-gray-800 p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-serif mb-2">{profile.display_name}</h2>
              <p className="text-gray-400">@{profile.username}</p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/${profile.username}`}
                className="flex items-center gap-2 px-4 py-2 border border-gray-700 text-gray-300 hover:border-white hover:text-white transition text-sm rounded-lg"
              >
                <Eye size={16} />
                View
              </Link>
              <button
                onClick={() => setEditingProfile(!editingProfile)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 transition text-sm rounded-lg"
              >
                <Edit2 size={16} />
                Edit
              </button>
            </div>
          </div>

          {editingProfile && (
            <div className="space-y-5 pt-6 border-t border-gray-800">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Profile Picture
                </label>
                <div className="flex gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && uploadAvatar(e.target.files[0])}
                    disabled={uploadingAvatar}
                    className="flex-1 px-4 py-3 bg-black border border-gray-800 text-white text-sm focus:border-white focus:outline-none transition rounded"
                  />
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    disabled={uploadingAvatar}
                    className="flex-1 px-4 py-3 bg-black border border-gray-800 text-white text-sm focus:border-white focus:outline-none transition rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Or paste URL"
                  />
                </div>
                {avatarUrl && (
                  <img src={avatarUrl} alt="Preview" className="mt-3 w-24 h-24 rounded-full object-cover border border-gray-800" />
                )}
                {uploadingAvatar && <p className="text-xs text-gray-400 mt-2">Uploading...</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-3">
                  Banner
                </label>
                <div className="flex gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files && uploadBanner(e.target.files[0])}
                    disabled={uploadingBanner}
                    className="flex-1 px-4 py-3 bg-black border border-gray-800 text-white text-sm focus:border-white focus:outline-none transition rounded"
                  />
                  <input
                    type="url"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    disabled={uploadingBanner}
                    className="flex-1 px-4 py-3 bg-black border border-gray-800 text-white text-sm focus:border-white focus:outline-none transition rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Or paste URL"
                  />
                </div>
                {bannerUrl && (
                  <img src={bannerUrl} alt="Banner Preview" className="mt-3 w-full h-32 rounded object-cover border border-gray-800" />
                )}
                {uploadingBanner && <p className="text-xs text-gray-400 mt-2">Uploading...</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gray-800 text-white focus:border-white focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-black border border-gray-800 text-white focus:border-white focus:outline-none transition resize-none"
                  placeholder="Tell your story..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={updateProfile}
                  className="px-6 py-2 bg-white text-black hover:bg-gray-200 transition text-sm rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingProfile(false)}
                  className="px-6 py-2 border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-white transition text-sm rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sections */}
        <div className="border border-gray-800 p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-serif">Sections</h3>
            <div className="relative">
              <button 
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 transition text-sm rounded-lg"
              >
                <Plus size={16} />
                Add Section
              </button>
              {showAddMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-800 z-10 rounded">
                  <button
                    onClick={() => {
                      addSection('text_list')
                      setShowAddMenu(false)
                    }}
                    className="w-full px-4 py-3 text-left text-white hover:bg-gray-900 border-b border-gray-800"
                  >
                    Text List
                  </button>
                  <button
                    onClick={() => {
                      addSection('links')
                      setShowAddMenu(false)
                    }}
                    className="w-full px-4 py-3 text-left text-white hover:bg-gray-900 border-b border-gray-800"
                  >
                    Links
                  </button>
                  <button
                    onClick={() => {
                      addSection('gallery')
                      setShowAddMenu(false)
                    }}
                    className="w-full px-4 py-3 text-left text-white hover:bg-gray-900"
                  >
                    Gallery
                  </button>
                </div>
              )}
            </div>
          </div>

          {sections.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="mb-2">No sections yet</p>
              <p className="text-sm text-gray-600">Add a section to begin</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center gap-4 p-4 border border-gray-800 hover:border-gray-700 transition"
                >
                  <GripVertical size={18} className="text-gray-600 cursor-move" />
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{section.title}</h4>
                    <p className="text-sm text-gray-500 capitalize">
                      {section.type.replace('_', ' ')}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteSection(section.id)}
                    className="p-2 text-gray-500 hover:text-red-400 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
