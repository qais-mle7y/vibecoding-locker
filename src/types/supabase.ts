export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      locker_items: {
        Row: {
          content: string
          copy_count: number
          created_at: string
          description: string | null
          framework: string | null
          id: string
          is_archived: boolean
          is_favorite: boolean
          item_type: 'code_snippet' | 'shell_command' | 'ai_prompt' | 'agent_skill' | 'project_idea' | 'config' | 'debug_fix' | 'note'
          language: string | null
          last_copied_at: string | null
          source_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          copy_count?: number
          created_at?: string
          description?: string | null
          framework?: string | null
          id?: string
          is_archived?: boolean
          is_favorite?: boolean
          item_type?: 'code_snippet' | 'shell_command' | 'ai_prompt' | 'agent_skill' | 'project_idea' | 'config' | 'debug_fix' | 'note'
          language?: string | null
          last_copied_at?: string | null
          source_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          copy_count?: number
          created_at?: string
          description?: string | null
          framework?: string | null
          id?: string
          is_archived?: boolean
          is_favorite?: boolean
          item_type?: 'code_snippet' | 'shell_command' | 'ai_prompt' | 'agent_skill' | 'project_idea' | 'config' | 'debug_fix' | 'note'
          language?: string | null
          last_copied_at?: string | null
          source_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          user_id?: string
        }
        Relationships: []
      }
      locker_item_tags: {
        Row: {
          locker_item_id: string
          tag_id: string
        }
        Insert: {
          locker_item_id: string
          tag_id: string
        }
        Update: {
          locker_item_id?: string
          tag_id?: string
        }
        Relationships: []
      }
      collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      locker_item_collections: {
        Row: {
          collection_id: string
          locker_item_id: string
        }
        Insert: {
          collection_id: string
          locker_item_id: string
        }
        Update: {
          collection_id?: string
          locker_item_id?: string
        }
        Relationships: []
      }
      usage_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          locker_item_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          locker_item_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          locker_item_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      locker_item_type: 'code_snippet' | 'shell_command' | 'ai_prompt' | 'agent_skill' | 'project_idea' | 'config' | 'debug_fix' | 'note'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
