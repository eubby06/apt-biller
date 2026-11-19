export interface Tenant {
  id?: number | undefined;
  name: string;
  unit: number;
  move_in_date: string;
  total_heads: number;
  rent_amount: number;
  internet_plan: string;
}

export type InvoiceStatus = "pending" | "paid";

export interface Invoice {
  id: number;
  tenant_id: number;
  prev_date: string;
  prev_reading: number;
  curr_date: string;
  curr_reading: number;
  electricity_rate: number;
  electricity_amount: number;
  total_heads: number;
  water_rate: number;
  water_amount: number;
  rent_amount: number;
  internet_amount: number;
  total: number;
  status: InvoiceStatus;
  tenant: Tenant | null;
}

export interface CreateInvoiceInput {
  tenant_id: number;
  prev_date: string;
  prev_reading: number;
  curr_date: string;
  curr_reading: number;
}

export interface TenantFormData {
  id?: number;
  name: string;
  unit: number;
  move_in_date: string | null;
  total_heads: number;
  rent_amount: number;
  internet_plan: string;
}
