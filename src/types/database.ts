export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          created_at: string
          trial_end_at: string
          stripe_customer_id: string | null
          current_plan: 'starter' | 'student' | 'graduate' | null
          subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing' | null
          subscription_id: string | null
          pages_processed_this_month: number
          docs_processed_this_month: number
          usage_reset_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          created_at?: string
          trial_end_at?: string
          stripe_customer_id?: string | null
          current_plan?: 'starter' | 'student' | 'graduate' | null
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing' | null
          subscription_id?: string | null
          pages_processed_this_month?: number
          docs_processed_this_month?: number
          usage_reset_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          created_at?: string
          trial_end_at?: string
          stripe_customer_id?: string | null
          current_plan?: 'basic' | 'growth' | 'pro' | null
          subscription_status?: 'active' | 'canceled' | 'past_due' | 'trialing' | null
          subscription_id?: string | null
          pages_processed_this_month?: number
          docs_processed_this_month?: number
          usage_reset_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_path: string
          file_size: number
          pages_count: number
          document_type: string | null
          created_at: string
          status: 'processing' | 'completed' | 'failed'
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_path: string
          file_size: number
          pages_count: number
          document_type?: string | null
          created_at?: string
          status?: 'processing' | 'completed' | 'failed'
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_path?: string
          file_size?: number
          pages_count?: number
          document_type?: string | null
          created_at?: string
          status?: 'processing' | 'completed' | 'failed'
        }
      }
      summaries: {
        Row: {
          id: string
          document_id: string
          summary: Json
          risks: Json
          questions: Json
          actions: Json
          key_clauses: Json
          easy_reading: string | null
          tokens_used: number
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          summary: Json
          risks: Json
          questions: Json
          actions: Json
          key_clauses: Json
          easy_reading?: string | null
          tokens_used?: number
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          summary?: Json
          risks?: Json
          questions?: Json
          actions?: Json
          key_clauses?: Json
          easy_reading?: string | null
          tokens_used?: number
          created_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          user_id: string | null
          event_type: string
          event_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_type: string
          event_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          event_type?: string
          event_data?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type User = Database['public']['Tables']['users']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type Summary = Database['public']['Tables']['summaries']['Row']
export type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row']

export interface DocumentDigest {
  documentType: string
  summary: string[]
  keyClauses: { title: string; description: string }[]
  risks: { title: string; description: string; severity: 'high' | 'medium' | 'low' }[]
  questions: string[]
  actions: { action: string; priority: 'high' | 'medium' | 'low' }[]
}

export interface DocumentComparison {
  mainDifferences: string[]
  clausesAdded: { title: string; content: string }[]
  clausesRemoved: { title: string; content: string }[]
  clausesModified: { title: string; before: string; after: string }[]
  impactAssessment: string
}
