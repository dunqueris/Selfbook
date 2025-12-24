import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(profile)
}

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const body = await request.json()
  const { username, display_name, user_id } = body

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  // Try to get the current user first
  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id || user_id

  if (!currentUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if username is already taken
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username.toLowerCase())
    .single()

  if (existingProfile) {
    return NextResponse.json({ error: 'Username is already taken' }, { status: 400 })
  }

  // Check if user already has a profile
  const { data: existingUserProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', currentUserId)
    .single()

  if (existingUserProfile) {
    return NextResponse.json({ error: 'Profile already exists' }, { status: 400 })
  }

  // Try to create profile using RPC function first (bypasses RLS)
  try {
    const { data: profileData, error: rpcError } = await supabase.rpc('create_profile_for_user', {
      p_user_id: currentUserId,
      p_username: username.toLowerCase(),
      p_display_name: display_name || username,
    })

    if (!rpcError && profileData) {
      return NextResponse.json({ id: profileData, username, display_name }, { status: 201 })
    }

    // If RPC fails, fall through to direct insert
    if (rpcError) {
      console.error('RPC error, attempting direct insert:', rpcError)
    }
  } catch (err) {
    console.error('RPC exception:', err)
  }

  // Fallback: Try direct insert (will work if user has session)
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      user_id: currentUserId,
      username: username.toLowerCase(),
      display_name: display_name || username,
    })
    .select()
    .single()

  if (error) {
    console.error('Profile insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(profile, { status: 201 })
}

export async function PATCH(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { display_name, bio, avatar_url, banner_url, theme } = body

  const { data: profile, error } = await supabase
    .from('profiles')
    .update({
      display_name,
      bio,
      avatar_url,
      banner_url,
      theme,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(profile)
}
