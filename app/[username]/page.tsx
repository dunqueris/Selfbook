import { getSupabaseClient } from '@/lib/supabase'
import { Profile, Section } from '@/lib/types'
import ProfileCard from '@/components/ProfileCard'
import { notFound } from 'next/navigation'

// Always serve fresh profile data; disable Next.js caching for this page
export const revalidate = 0

interface PageProps {
  params: {
    username: string
  }
}

async function getProfile(username: string) {
  const supabase = getSupabaseClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username.toLowerCase())
    .single<Profile>()

  if (!profile) {
    return null
  }

  // TypeScript now knows profile is Profile (not null)
  const profileId: string = profile.id

  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .eq('profile_id', profileId)
    .eq('visible', true)
    .order('position')

  return { profile, sections: sections || [] }
}

export default async function PublicProfilePage({ params }: PageProps) {
  const data = await getProfile(params.username)

  if (!data) {
    notFound()
  }

  return <ProfileCard profile={data.profile} sections={data.sections} />
}
