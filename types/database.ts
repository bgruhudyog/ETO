// types/database.ts
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
          created_at: string
          updated_at: string
          full_name: string | null
          preferences: Json | null
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          preferences?: Json | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          preferences?: Json | null
        }
      }
    }
  }
}