'use client'

import { useState } from 'react'
import { Profile, Section } from '@/lib/types'
import TextListSection from './sections/TextListSection'
import LinksSection from './sections/LinksSection'
import GallerySection from './sections/GallerySection'

interface Props {
  profile: Profile
  sections: Section[]
}

export default function ProfileCard({ profile, sections }: Props) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '')

  const renderSection = (section: Section) => {
    switch (section.type) {
      case 'text_list':
        return <TextListSection section={section} />
      case 'links':
        return <LinksSection section={section} />
      case 'gallery':
        return <GallerySection section={section} />
      default:
        return null
    }
  }

  const activeContent = sections.find((s) => s.id === activeSection)

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Banner */}
        <div className="relative bg-gray-900 h-48 border-b border-gray-800 overflow-hidden">
          {profile.banner_url ? (
            <img
              src={profile.banner_url}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-900 to-gray-800" />
          )}
        </div>

        {/* Profile Container */}
        <div className="border border-gray-800 border-t-0 overflow-hidden">
          {/* Profile Header */}
          <div className="px-8 pb-8 -mt-24">
            <div className="flex items-end gap-6 mb-6">
              <div className="w-32 h-32 bg-black rounded-full border-4 border-black flex items-center justify-center text-5xl">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name || profile.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600">👤</span>
                )}
              </div>
              <div className="flex-1 mb-2">
                <h1 className="text-4xl font-serif mb-2">{profile.display_name}</h1>
                <p className="text-gray-400">@{profile.username}</p>
              </div>
            </div>

            {profile.bio && (
              <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">{profile.bio}</p>
            )}
          </div>

          {/* Sections Navigation */}
          {sections.length > 0 && (
            <>
              <div className="border-t border-gray-800 px-8 py-4 flex gap-3 overflow-x-auto">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-5 py-2 font-medium transition whitespace-nowrap text-sm rounded-lg ${
                      activeSection === section.id
                        ? 'bg-white text-black'
                        : 'border border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>

              {/* Section Content */}
              {activeContent && (
                <div className="px-8 py-10 border-t border-gray-800">
                  {renderSection(activeContent)}
                </div>
              )}
            </>
          )}

          {sections.length === 0 && (
            <div className="px-8 py-16 text-center text-gray-500 border-t border-gray-800">
              <p>No sections yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
