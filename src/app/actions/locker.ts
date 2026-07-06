'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Database } from '@/types/supabase'
import { z } from 'zod'

export type LockerItemInsert = Database['public']['Tables']['locker_items']['Insert']
export type LockerItemRow = Database['public']['Tables']['locker_items']['Row']
export type LockerItemWithTags = LockerItemRow & {
  locker_item_tags?: { tags: { name: string; slug: string } | null }[] | null
}
export type LockerItemImport = Omit<LockerItemInsert, 'user_id'> & {
  created_at?: string
  locker_item_tags?: { tags?: { name?: string | null } | null }[] | null
}

const lockerItemTypes = [
  'code_snippet',
  'shell_command',
  'ai_prompt',
  'agent_skill',
  'project_idea',
  'config',
  'debug_fix',
  'note',
] as const

function isLockerItemType(value: string): value is LockerItemRow['item_type'] {
  return lockerItemTypes.some((type) => type === value)
}

const itemSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional().nullable(),
  content: z.string().min(1).max(100_000),
  item_type: z.enum(lockerItemTypes).default('note'),
  language: z.string().max(100).optional().nullable(),
  framework: z.string().max(100).optional().nullable(),
  source_url: z.string().url().max(1000).optional().nullable(),
  is_favorite: z.boolean().default(false),
  is_archived: z.boolean().default(false),
})

const importItemSchema = itemSchema.extend({
  copy_count: z.number().optional(),
  last_copied_at: z.string().optional().nullable(),
})

const importSchema = z.array(importItemSchema.passthrough())

export async function createLockerItem(rawData: unknown, tagsString?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Unauthorized')

  const data = itemSchema.parse(rawData)

  const { data: item, error } = await supabase
    .from('locker_items')
    .insert({
      ...data,
      user_id: user.id
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating locker item:', error)
    throw new Error('Failed to create item. Please try again.')
  }

  if (tagsString) {
    const tagNames = tagsString.split(',').map(t => t.trim()).filter(Boolean)
    if (tagNames.length > 0) {
      const tagsToUpsert = tagNames.map(name => ({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        user_id: user.id
      }))
      
      const { data: upsertedTags } = await supabase.from('tags')
        .upsert(tagsToUpsert, { onConflict: 'user_id, slug' })
        .select('id')
        
      if (upsertedTags && upsertedTags.length > 0) {
        await supabase.from('locker_item_tags').insert(
          upsertedTags.map(t => ({ locker_item_id: item.id, tag_id: t.id }))
        )
      }
    }
  }

  revalidatePath('/dashboard')
  return item
}

export async function updateLockerItem(id: string, rawData: unknown, tagsString?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Unauthorized')

  const data = itemSchema.partial().parse(rawData)

  const { data: item, error } = await supabase
    .from('locker_items')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating locker item:', error)
    throw new Error('Failed to update item. Please try again.')
  }

  if (typeof tagsString === 'string') {
    // Delete existing tags first
    await supabase.from('locker_item_tags').delete().eq('locker_item_id', id)
    
    const tagNames = tagsString.split(',').map(t => t.trim()).filter(Boolean)
    if (tagNames.length > 0) {
      const tagsToUpsert = tagNames.map(name => ({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        user_id: user.id
      }))
      
      const { data: upsertedTags } = await supabase.from('tags')
        .upsert(tagsToUpsert, { onConflict: 'user_id, slug' })
        .select('id')
        
      if (upsertedTags && upsertedTags.length > 0) {
        await supabase.from('locker_item_tags').insert(
          upsertedTags.map(t => ({ locker_item_id: id, tag_id: t.id }))
        )
      }
    }
  }

  revalidatePath('/dashboard')
  return item
}

export async function getLockerItems(params?: { query?: string, type?: string }): Promise<LockerItemWithTags[]> {
  const supabase = await createClient()
  
  let q = supabase
    .from('locker_items')
    .select('*, locker_item_tags(tags(name, slug))')
    .order('created_at', { ascending: false })

  if (params?.query) {
    // Replace spaces with + for proper websearch format if needed, but supabase textSearch handles it
    q = q.textSearch('search_vector', params.query, { type: 'websearch', config: 'english' })
  }

  if (params?.type && params.type !== 'all' && isLockerItemType(params.type)) {
    q = q.eq('item_type', params.type)
  }

  const { data: items, error } = await q

  if (error) {
    console.error('Error fetching locker items:', error)
    throw new Error('Failed to fetch items.')
  }

  return (items ?? []) as unknown as LockerItemWithTags[]
}

export async function deleteLockerItem(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { error } = await supabase
    .from('locker_items')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting locker item:', error)
    throw new Error('Failed to delete item. Please try again.')
  }

  revalidatePath('/dashboard')
}

export async function incrementCopyCount(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  
  const { data: item } = await supabase
    .from('locker_items')
    .select('copy_count')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()
  
  if (item) {
    await supabase
      .from('locker_items')
      .update({ 
        copy_count: item.copy_count + 1,
        last_copied_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
  }
}

export async function exportLockerItems() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data, error } = await supabase
    .from('locker_items')
    .select('title, description, content, item_type, language, created_at, locker_item_tags(tags(name))')
    .order('created_at', { ascending: true })

  if (error) throw new Error('Failed to export locker items.')
  return data
}

export async function importLockerItems(rawItems: unknown) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: existing } = await supabase
    .from('locker_items')
    .select('title, content')

  const existingSet = new Set(existing?.map(e => `${e.title}:::${e.content}`))

  let insertedCount = 0

  const items = importSchema.parse(rawItems)

  for (const item of items) {
    if (existingSet.has(`${item.title}:::${item.content}`)) {
      continue
    }

    const { locker_item_tags, created_at, ...itemData } = item as LockerItemImport
    void created_at

    const { data: newItem, error: insertError } = await supabase
      .from('locker_items')
      .insert({
        ...itemData,
        user_id: user.id
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('Import error:', insertError)
      continue
    }

    insertedCount++

    if (locker_item_tags && Array.isArray(locker_item_tags) && locker_item_tags.length > 0) {
      const tagNames = locker_item_tags
        .map((t) => t.tags?.name)
        .filter((name): name is string => Boolean(name))
      
      if (tagNames.length > 0) {
        const tagsToUpsert = tagNames.map(name => ({
          name,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          user_id: user.id
        }))

        const { data: upsertedTags } = await supabase.from('tags')
          .upsert(tagsToUpsert, { onConflict: 'user_id, slug' })
          .select('id')

        if (upsertedTags) {
          await supabase.from('locker_item_tags').insert(
            upsertedTags.map(t => ({ locker_item_id: newItem.id, tag_id: t.id }))
          )
        }
      }
    }
  }

  revalidatePath('/dashboard')
  return insertedCount
}
