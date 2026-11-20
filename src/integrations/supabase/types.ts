export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          consent_at: string | null
          country: string
          created_at: string
          email: string
          handled: boolean
          id: string
          message: string
          name: string
          subject: string
        }
        Insert: {
          consent_at?: string | null
          country?: string
          created_at?: string
          email: string
          handled?: boolean
          id?: string
          message: string
          name: string
          subject?: string
        }
        Update: {
          consent_at?: string | null
          country?: string
          created_at?: string
          email?: string
          handled?: boolean
          id?: string
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string
          created_at: string
          file_path: string
          id: string
          is_public: boolean
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          file_path: string
          id?: string
          is_public?: boolean
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          file_path?: string
          id?: string
          is_public?: boolean
          title?: string
        }
        Relationships: []
      }
      donation_pledges: {
        Row: {
          amount: number
          created_at: string
          destination: string
          email: string
          handled: boolean
          id: string
          method: string
          name: string
        }
        Insert: {
          amount: number
          created_at?: string
          destination: string
          email: string
          handled?: boolean
          id?: string
          method: string
          name: string
        }
        Update: {
          amount?: number
          created_at?: string
          destination?: string
          email?: string
          handled?: boolean
          id?: string
          method?: string
          name?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string
          id: string
          kind: string
          location: string
          starts_at: string
          title: string
          video_link: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          kind?: string
          location?: string
          starts_at: string
          title: string
          video_link?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          kind?: string
          location?: string
          starts_at?: string
          title?: string
          video_link?: string
        }
        Relationships: []
      }
      member_files: {
        Row: {
          category: string
          created_at: string
          file_path: string
          id: string
          member_id: string
          title: string
          year: number
        }
        Insert: {
          category?: string
          created_at?: string
          file_path: string
          id?: string
          member_id: string
          title: string
          year: number
        }
        Update: {
          category?: string
          created_at?: string
          file_path?: string
          id?: string
          member_id?: string
          title?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "member_files_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_records"
            referencedColumns: ["id"]
          },
        ]
      }
      member_records: {
        Row: {
          category: string
          city: string
          country: string
          created_at: string
          documents_consent_at: string | null
          email: string | null
          first_name: string
          founder: boolean
          id: string
          last_name: string
          member_number: number
          phone: string
          pole: string
          status: string
          user_id: string | null
        }
        Insert: {
          category?: string
          city?: string
          country?: string
          created_at?: string
          documents_consent_at?: string | null
          email?: string | null
          first_name?: string
          founder?: boolean
          id?: string
          last_name?: string
          member_number?: number
          phone?: string
          pole?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          city?: string
          country?: string
          created_at?: string
          documents_consent_at?: string | null
          email?: string | null
          first_name?: string
          founder?: boolean
          id?: string
          last_name?: string
          member_number?: number
          phone?: string
          pole?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          body: string
          created_at: string
          excerpt: string
          id: string
          image_url: string
          is_public: boolean
          published: boolean
          published_at: string
          title: string
        }
        Insert: {
          body?: string
          created_at?: string
          excerpt?: string
          id?: string
          image_url?: string
          is_public?: boolean
          published?: boolean
          published_at?: string
          title: string
        }
        Update: {
          body?: string
          created_at?: string
          excerpt?: string
          id?: string
          image_url?: string
          is_public?: boolean
          published?: boolean
          published_at?: string
          title?: string
        }
        Relationships: []
      }
      page_content: {
        Row: {
          key: string
          lang: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          lang: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          lang?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          admin_note: string
          amount: number
          created_at: string
          currency: string
          id: string
          kind: string
          method: string
          month: string
          paid_at: string
          proof_path: string | null
          reference: string
          reviewed_at: string | null
          status: Database["public"]["Enums"]["payment_status"]
          user_id: string
        }
        Insert: {
          admin_note?: string
          amount: number
          created_at?: string
          currency?: string
          id?: string
          kind?: string
          method?: string
          month: string
          paid_at?: string
          proof_path?: string | null
          reference?: string
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          user_id: string
        }
        Update: {
          admin_note?: string
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          kind?: string
          method?: string
          month?: string
          paid_at?: string
          proof_path?: string | null
          reference?: string
          reviewed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          user_id?: string
        }
        Relationships: []
      }
      polls: {
        Row: {
          closes_at: string | null
          created_at: string
          description: string
          id: string
          is_open: boolean
          options: string[]
          question: string
        }
        Insert: {
          closes_at?: string | null
          created_at?: string
          description?: string
          id?: string
          is_open?: boolean
          options: string[]
          question: string
        }
        Update: {
          closes_at?: string | null
          created_at?: string
          description?: string
          id?: string
          is_open?: boolean
          options?: string[]
          question?: string
        }
        Relationships: []
      }
      private_settings: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value?: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          accepted_statutes_at: string | null
          category: string
          city: string
          country: string
          created_at: string
          directory_visible: boolean
          email: string
          first_name: string
          id: string
          last_name: string
          member_number: number
          phone: string
          pole: string
          rgpd_consent_at: string | null
          status: Database["public"]["Enums"]["member_status"]
          validated_at: string | null
        }
        Insert: {
          accepted_statutes_at?: string | null
          category?: string
          city?: string
          country?: string
          created_at?: string
          directory_visible?: boolean
          email: string
          first_name?: string
          id: string
          last_name?: string
          member_number?: number
          phone?: string
          pole?: string
          rgpd_consent_at?: string | null
          status?: Database["public"]["Enums"]["member_status"]
          validated_at?: string | null
        }
        Update: {
          accepted_statutes_at?: string | null
          category?: string
          city?: string
          country?: string
          created_at?: string
          directory_visible?: boolean
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          member_number?: number
          phone?: string
          pole?: string
          rgpd_consent_at?: string | null
          status?: Database["public"]["Enums"]["member_status"]
          validated_at?: string | null
        }
        Relationships: []
      }
      resignations: {
        Row: {
          created_at: string
          id: string
          reason: string
          receipt_number: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason?: string
          receipt_number?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          receipt_number?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      volunteer_requests: {
        Row: {
          activities: string[]
          availability: string
          city: string
          consent_at: string | null
          country: string
          created_at: string
          email: string
          handled: boolean
          id: string
          kind: string
          message: string
          name: string
          phone: string
          proposal: string
          structure_type: string
        }
        Insert: {
          activities?: string[]
          availability?: string
          city?: string
          consent_at?: string | null
          country?: string
          created_at?: string
          email: string
          handled?: boolean
          id?: string
          kind: string
          message?: string
          name: string
          phone?: string
          proposal?: string
          structure_type?: string
        }
        Update: {
          activities?: string[]
          availability?: string
          city?: string
          consent_at?: string | null
          country?: string
          created_at?: string
          email?: string
          handled?: boolean
          id?: string
          kind?: string
          message?: string
          name?: string
          phone?: string
          proposal?: string
          structure_type?: string
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string
          id: string
          option_index: number
          poll_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_index: number
          poll_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_index?: number
          poll_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_first_admin: { Args: never; Returns: boolean }
      consent_documents: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_up_to_date: { Args: { _uid: string }; Returns: boolean }
      is_validated_member: { Args: { _uid: string }; Returns: boolean }
      poll_results: {
        Args: { _poll: string }
        Returns: {
          option_index: number
          total: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "tresorier" | "secretaire"
      member_status: "pending" | "validated" | "refused" | "resigned"
      payment_status: "pending" | "validated" | "refused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "tresorier", "secretaire"],
      member_status: ["pending", "validated", "refused", "resigned"],
      payment_status: ["pending", "validated", "refused"],
    },
  },
} as const
