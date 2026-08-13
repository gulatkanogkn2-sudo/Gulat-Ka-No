export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone_number: string | null;
          role: 'OWNER' | 'ADMIN' | 'STAFF' | 'VIEWER' | 'CUSTOMER' | string;
          customer_tier: string | null;
          lifetime_spend_php: number;
          reward_points: number;
          admin_notes: string | null;
          is_primary_owner: boolean;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone_number?: string | null;
          role?: 'OWNER' | 'ADMIN' | 'STAFF' | 'VIEWER' | 'CUSTOMER' | string;
          customer_tier?: string | null;
          lifetime_spend_php?: number;
          reward_points?: number;
          admin_notes?: string | null;
          is_primary_owner?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone_number?: string | null;
          role?: 'OWNER' | 'ADMIN' | 'STAFF' | 'VIEWER' | 'CUSTOMER' | string;
          customer_tier?: string | null;
          lifetime_spend_php?: number;
          reward_points?: number;
          admin_notes?: string | null;
          is_primary_owner?: boolean;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
        };
        Relationships: [];
      };
      store_configs: {
        Row: {
          store_type: 'groupbuy' | 'onhand' | 'moq';
          display_name: string;
          status_override: 'OPEN' | 'CLOSED';
          schedule_enabled: boolean;
          schedule_config_jsonb: Json;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          store_type: 'groupbuy' | 'onhand' | 'moq';
          display_name: string;
          status_override?: 'OPEN' | 'CLOSED';
          schedule_enabled?: boolean;
          schedule_config_jsonb?: Json;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          store_type?: 'groupbuy' | 'onhand' | 'moq';
          display_name?: string;
          status_override?: 'OPEN' | 'CLOSED';
          schedule_enabled?: boolean;
          schedule_config_jsonb?: Json;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          scientific_name: string | null;
          short_description: string | null;
          full_description: string | null;
          admin_notes: string | null;
          category: string;
          primary_store_type: 'groupbuy' | 'onhand' | 'moq';
          price_php: number;
          currency: string;
          status: 'Active' | 'Draft' | 'Archived' | 'Sold Out' | string;
          is_visible: boolean;
          is_featured: boolean;
          image_url: string | null;
          gallery: string[] | null;
          cas_number: string | null;
          testing_lab: string | null;
          purity: string | null;
          selling_unit: 'vial' | 'kit';
          vials_per_kit: number;
          inventory_quantity: number | null;
          store_specific_settings_jsonb: Json;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          scientific_name?: string | null;
          short_description?: string | null;
          full_description?: string | null;
          admin_notes?: string | null;
          category?: string;
          primary_store_type: 'groupbuy' | 'onhand' | 'moq';
          price_php?: number;
          currency?: string;
          status?: string;
          is_visible?: boolean;
          is_featured?: boolean;
          image_url?: string | null;
          gallery?: string[] | null;
          cas_number?: string | null;
          testing_lab?: string | null;
          purity?: string | null;
          selling_unit?: 'vial' | 'kit';
          vials_per_kit?: number;
          inventory_quantity?: number | null;
          store_specific_settings_jsonb?: Json;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          scientific_name?: string | null;
          short_description?: string | null;
          full_description?: string | null;
          admin_notes?: string | null;
          category?: string;
          primary_store_type?: 'groupbuy' | 'onhand' | 'moq';
          price_php?: number;
          currency?: string;
          status?: string;
          is_visible?: boolean;
          is_featured?: boolean;
          image_url?: string | null;
          gallery?: string[] | null;
          cas_number?: string | null;
          testing_lab?: string | null;
          purity?: string | null;
          selling_unit?: 'vial' | 'kit';
          vials_per_kit?: number;
          inventory_quantity?: number | null;
          store_specific_settings_jsonb?: Json;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_primary_store_type_fkey";
            columns: ["primary_store_type"];
            isOneToOne: false;
            referencedRelation: "store_configs";
            referencedColumns: ["store_type"];
          }
        ];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          strength: string | null;
          size: string | null;
          price_php: number;
          cost_price_php: number | null;
          min_order: number;
          order_step: number;
          inventory_quantity: number | null;
          sku: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          strength?: string | null;
          size?: string | null;
          price_php: number;
          cost_price_php?: number | null;
          min_order?: number;
          order_step?: number;
          inventory_quantity?: number | null;
          sku?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          strength?: string | null;
          size?: string | null;
          price_php?: number;
          cost_price_php?: number | null;
          min_order?: number;
          order_step?: number;
          inventory_quantity?: number | null;
          sku?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      product_addon_relationships: {
        Row: {
          id: string;
          scope: 'ENTIRE_STORE' | 'SPECIFIC_PRODUCTS' | string;
          store: 'groupbuy' | 'onhand' | 'moq';
          parent_product_id: string | null;
          parent_product_ids: string[] | null;
          related_product_id: string;
          rule_type: string;
          max_related_qty: number | null;
          excess_unit_fee_php: number | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          scope?: string;
          store: 'groupbuy' | 'onhand' | 'moq';
          parent_product_id?: string | null;
          parent_product_ids?: string[] | null;
          related_product_id: string;
          rule_type?: string;
          max_related_qty?: number | null;
          excess_unit_fee_php?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          scope?: string;
          store?: 'groupbuy' | 'onhand' | 'moq';
          parent_product_id?: string | null;
          parent_product_ids?: string[] | null;
          related_product_id?: string;
          rule_type?: string;
          max_related_qty?: number | null;
          excess_unit_fee_php?: number | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_addon_relationships_related_product_id_fkey";
            columns: ["related_product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      checkout_accessories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          calculation_mode: 'PER_VIAL' | 'PER_KIT' | 'MANUAL' | string;
          multiplier: number;
          price_php: number;
          available_stores: string[];
          is_enabled: boolean;
          sort_order: number;
          settings_jsonb: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          calculation_mode?: string;
          multiplier?: number;
          price_php: number;
          available_stores?: string[];
          is_enabled?: boolean;
          sort_order?: number;
          settings_jsonb?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          calculation_mode?: string;
          multiplier?: number;
          price_php?: number;
          available_stores?: string[];
          is_enabled?: boolean;
          sort_order?: number;
          settings_jsonb?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payment_methods: {
        Row: {
          id: string;
          name: string;
          method_type: string;
          account_name: string | null;
          account_number: string | null;
          wallet_address: string | null;
          qr_code_storage_path: string | null;
          instructions: string | null;
          available_stores: string[];
          is_enabled: boolean;
          sort_order: number;
          settings_jsonb: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          method_type: string;
          account_name?: string | null;
          account_number?: string | null;
          wallet_address?: string | null;
          qr_code_storage_path?: string | null;
          instructions?: string | null;
          available_stores?: string[];
          is_enabled?: boolean;
          sort_order?: number;
          settings_jsonb?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          method_type?: string;
          account_name?: string | null;
          account_number?: string | null;
          wallet_address?: string | null;
          qr_code_storage_path?: string | null;
          instructions?: string | null;
          available_stores?: string[];
          is_enabled?: boolean;
          sort_order?: number;
          settings_jsonb?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      shipping_methods: {
        Row: {
          id: string;
          name: string;
          method_type: string;
          base_fee_php: number;
          base_included_qty: number;
          additional_per_vial_fee_php: number;
          available_stores: string[];
          regional_rates_jsonb: Json | null;
          is_enabled: boolean;
          sort_order: number;
          settings_jsonb: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          method_type?: string;
          base_fee_php: number;
          base_included_qty?: number;
          additional_per_vial_fee_php?: number;
          available_stores?: string[];
          regional_rates_jsonb?: Json | null;
          is_enabled?: boolean;
          sort_order?: number;
          settings_jsonb?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          method_type?: string;
          base_fee_php?: number;
          base_included_qty?: number;
          additional_per_vial_fee_php?: number;
          available_stores?: string[];
          regional_rates_jsonb?: Json | null;
          is_enabled?: boolean;
          sort_order?: number;
          settings_jsonb?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      additional_fees: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          fee_type: string;
          amount_php: number;
          available_stores: string[];
          is_enabled: boolean;
          sort_order: number;
          settings_jsonb: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          fee_type?: string;
          amount_php: number;
          available_stores?: string[];
          is_enabled?: boolean;
          sort_order?: number;
          settings_jsonb?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          fee_type?: string;
          amount_php?: number;
          available_stores?: string[];
          is_enabled?: boolean;
          sort_order?: number;
          settings_jsonb?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          store_type: 'groupbuy' | 'onhand' | 'moq';
          status: string;
          payment_status: string;
          subtotal_php: number;
          shipping_fee_php: number;
          discount_php: number;
          grand_total_php: number;
          earned_reward_points: number;
          shipping_address_jsonb: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          store_type: 'groupbuy' | 'onhand' | 'moq';
          status?: string;
          payment_status?: string;
          subtotal_php: number;
          shipping_fee_php?: number;
          discount_php?: number;
          grand_total_php: number;
          earned_reward_points?: number;
          shipping_address_jsonb?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string | null;
          store_type?: 'groupbuy' | 'onhand' | 'moq';
          status?: string;
          payment_status?: string;
          subtotal_php?: number;
          shipping_fee_php?: number;
          discount_php?: number;
          grand_total_php?: number;
          earned_reward_points?: number;
          shipping_address_jsonb?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          variant_id: string | null;
          product_name: string;
          variant_name: string | null;
          selling_unit: 'vial' | 'kit';
          quantity: number;
          total_vials: number;
          unit_price_php: number;
          total_price_php: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          variant_id?: string | null;
          product_name: string;
          variant_name?: string | null;
          selling_unit?: 'vial' | 'kit';
          quantity: number;
          total_vials: number;
          unit_price_php: number;
          total_price_php: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          variant_id?: string | null;
          product_name?: string;
          variant_name?: string | null;
          selling_unit?: 'vial' | 'kit';
          quantity?: number;
          total_vials?: number;
          unit_price_php?: number;
          total_price_php?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      order_timeline_events: {
        Row: {
          id: string;
          order_id: string;
          status: string;
          title: string;
          description: string | null;
          actor_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          status: string;
          title: string;
          description?: string | null;
          actor_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          status?: string;
          title?: string;
          description?: string | null;
          actor_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_timeline_events_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      order_admin_notes: {
        Row: {
          id: string;
          order_id: string;
          author_id: string;
          author_name: string;
          note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          author_id: string;
          author_name: string;
          note: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          author_id?: string;
          author_name?: string;
          note?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "order_admin_notes_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      payment_verifications: {
        Row: {
          id: string;
          order_id: string;
          payment_method_id: string | null;
          reference_number: string | null;
          amount_paid_php: number;
          proof_storage_path: string | null;
          status: string;
          verified_by: string | null;
          verified_at: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          payment_method_id?: string | null;
          reference_number?: string | null;
          amount_paid_php: number;
          proof_storage_path?: string | null;
          status?: string;
          verified_by?: string | null;
          verified_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          payment_method_id?: string | null;
          reference_number?: string | null;
          amount_paid_php?: number;
          proof_storage_path?: string | null;
          status?: string;
          verified_by?: string | null;
          verified_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payment_verifications_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      };
      customer_addresses: {
        Row: {
          id: string;
          customer_id: string;
          label: string | null;
          recipient_name: string;
          phone_number: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          province: string;
          region: string;
          postal_code: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          label?: string | null;
          recipient_name: string;
          phone_number: string;
          address_line1: string;
          address_line2?: string | null;
          city: string;
          province: string;
          region: string;
          postal_code: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          label?: string | null;
          recipient_name?: string;
          phone_number?: string;
          address_line1?: string;
          address_line2?: string | null;
          city?: string;
          province?: string;
          region?: string;
          postal_code?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customer_addresses_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      customer_login_activity: {
        Row: {
          id: string;
          customer_id: string;
          ip_address: string | null;
          user_agent: string | null;
          login_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          ip_address?: string | null;
          user_agent?: string | null;
          login_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          login_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customer_login_activity_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      media_assets: {
        Row: {
          id: string;
          filename: string;
          original_name: string;
          mime_type: string;
          size_bytes: number;
          storage_bucket: string;
          storage_path: string;
          public_url: string;
          category: string;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          filename: string;
          original_name: string;
          mime_type: string;
          size_bytes: number;
          storage_bucket: string;
          storage_path: string;
          public_url: string;
          category?: string;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          filename?: string;
          original_name?: string;
          mime_type?: string;
          size_bytes?: number;
          storage_bucket?: string;
          storage_path?: string;
          public_url?: string;
          category?: string;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      coa_records: {
        Row: {
          id: string;
          product_name: string;
          batch_number: string;
          purity_percentage: number;
          lab_name: string;
          test_date: string;
          chromatogram_storage_path: string;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_name: string;
          batch_number: string;
          purity_percentage: number;
          lab_name: string;
          test_date: string;
          chromatogram_storage_path: string;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_name?: string;
          batch_number?: string;
          purity_percentage?: number;
          lab_name?: string;
          test_date?: string;
          chromatogram_storage_path?: string;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      protocol_records: {
        Row: {
          id: string;
          product_name: string;
          title: string;
          reconstitution_instructions: string;
          dosage_guidelines: string | null;
          storage_guidelines: string | null;
          safety_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_name: string;
          title: string;
          reconstitution_instructions: string;
          dosage_guidelines?: string | null;
          storage_guidelines?: string | null;
          safety_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_name?: string;
          title?: string;
          reconstitution_instructions?: string;
          dosage_guidelines?: string | null;
          storage_guidelines?: string | null;
          safety_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      finance_expenses: {
        Row: {
          id: string;
          category: string;
          description: string;
          amount_php: number;
          store_type: string;
          batch_number: string | null;
          expense_date: string;
          logged_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          category: string;
          description: string;
          amount_php: number;
          store_type?: string;
          batch_number?: string | null;
          expense_date?: string;
          logged_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          category?: string;
          description?: string;
          amount_php?: number;
          store_type?: string;
          batch_number?: string | null;
          expense_date?: string;
          logged_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          actor_email: string | null;
          action: string;
          target_entity: string;
          target_id: string | null;
          details_jsonb: Json;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          actor_email?: string | null;
          action: string;
          target_entity: string;
          target_id?: string | null;
          details_jsonb?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          actor_email?: string | null;
          action?: string;
          target_entity?: string;
          target_id?: string | null;
          details_jsonb?: Json;
          ip_address?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      system_settings: {
        Row: {
          id: string;
          setting_key: string;
          setting_value: Json;
          description: string | null;
          category: string | null;
          is_sensitive: boolean | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          setting_key: string;
          setting_value: Json;
          description?: string | null;
          category?: string | null;
          is_sensitive?: boolean | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          setting_key?: string;
          setting_value?: Json;
          description?: string | null;
          category?: string | null;
          is_sensitive?: boolean | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
