export interface Courier {
  courier_id: string;
  name: string | null;
  is_available: number | null;
}

export interface CreateCourierInput {
  courier_id: string;
  name?: string | null;
  is_available?: number | null;
}

export interface UpdateCourierInput {
  name?: string | null;
  is_available?: number | null;
}
