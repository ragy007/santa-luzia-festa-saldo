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
      booths: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      closing_options: {
        Row: {
          amount: number
          card_returned: boolean
          created_at: string
          deposit_refunded: boolean
          id: string
          notes: string | null
          option: string
          participant_id: string
        }
        Insert: {
          amount: number
          card_returned?: boolean
          created_at?: string
          deposit_refunded?: boolean
          id?: string
          notes?: string | null
          option: string
          participant_id: string
        }
        Update: {
          amount?: number
          card_returned?: boolean
          created_at?: string
          deposit_refunded?: boolean
          id?: string
          notes?: string | null
          option?: string
          participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "closing_options_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      festival_booths: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          total_sales: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          total_sales?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          total_sales?: number
          updated_at?: string
        }
        Relationships: []
      }
      festival_products: {
        Row: {
          booth: string
          created_at: string
          id: string
          is_active: boolean
          is_free: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          booth: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_free?: boolean
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          booth?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_free?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      festival_settings: {
        Row: {
          accent_color: string
          created_at: string
          date: string
          end_time: string
          id: string
          is_active: boolean
          location: string
          logo_url: string | null
          name: string
          phone: string | null
          primary_color: string
          primary_icon: string | null
          religious_message: string | null
          secondary_color: string
          secondary_icon: string | null
          start_time: string
          subtitle: string | null
          theme: string
          title: string | null
          updated_at: string
        }
        Insert: {
          accent_color?: string
          created_at?: string
          date: string
          end_time: string
          id?: string
          is_active?: boolean
          location: string
          logo_url?: string | null
          name: string
          phone?: string | null
          primary_color?: string
          primary_icon?: string | null
          religious_message?: string | null
          secondary_color?: string
          secondary_icon?: string | null
          start_time: string
          subtitle?: string | null
          theme?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          accent_color?: string
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          is_active?: boolean
          location?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          primary_color?: string
          primary_icon?: string | null
          religious_message?: string | null
          secondary_color?: string
          secondary_icon?: string | null
          start_time?: string
          subtitle?: string | null
          theme?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      participants: {
        Row: {
          balance: number
          card_number: string
          created_at: string
          id: string
          initial_balance: number
          is_active: boolean
          name: string
          phone: string | null
          qr_code: string
          updated_at: string
        }
        Insert: {
          balance?: number
          card_number: string
          created_at?: string
          id?: string
          initial_balance?: number
          is_active?: boolean
          name: string
          phone?: string | null
          qr_code: string
          updated_at?: string
        }
        Update: {
          balance?: number
          card_number?: string
          created_at?: string
          id?: string
          initial_balance?: number
          is_active?: boolean
          name?: string
          phone?: string | null
          qr_code?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          booth_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          booth_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          booth_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_booth_id_fkey"
            columns: ["booth_id"]
            isOneToOne: false
            referencedRelation: "booths"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          booth_id: string | null
          created_at: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          booth_id?: string | null
          created_at?: string
          full_name: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          booth_id?: string | null
          created_at?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_booth_id_fkey"
            columns: ["booth_id"]
            isOneToOne: false
            referencedRelation: "booths"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          booth: string | null
          created_at: string
          description: string
          id: string
          operator_name: string
          participant_id: string
          type: string
        }
        Insert: {
          amount: number
          booth?: string | null
          created_at?: string
          description: string
          id?: string
          operator_name: string
          participant_id: string
          type: string
        }
        Update: {
          amount?: number
          booth?: string | null
          created_at?: string
          description?: string
          id?: string
          operator_name?: string
          participant_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_accounts: {
        Row: {
          booth_id: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          password: string
          role: string
          updated_at: string
        }
        Insert: {
          booth_id?: string | null
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name: string
          password: string
          role: string
          updated_at?: string
        }
        Update: {
          booth_id?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          password?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id?: string }
        Returns: boolean
      }
      update_booth_sales: {
        Args: { booth_name: string; amount_change: number }
        Returns: undefined
      }
      update_participant_balance: {
        Args: { participant_id: string; amount_change: number }
        Returns: undefined
      }
    }
    Enums: {
      user_role: "admin" | "operator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "operator"],
    },
  },
} as const
