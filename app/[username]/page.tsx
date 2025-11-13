import { getSupabaseClient } from '@/lib/supabase'
import { Profile, Section } from '@/lib/types'
import ProfileCard from '@/components/ProfileCard'
import { notFound } from 'next/navigation'

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
    .single()

  if (!profile) return null

  const { data: sections } = await supabase
    .from('sections')
    .select('*')
    .eq('profile_id', profile.id)
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
