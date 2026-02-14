const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

const DEFAULT_USER_ID = 'user1';

function getUserId(): string {
  try {
    return localStorage.getItem('db_assistant_user_id') || DEFAULT_USER_ID;
  } catch {
    return DEFAULT_USER_ID;
  }
}

export function setUserId(userId: string) {
  localStorage.setItem('db_assistant_user_id', userId);
}

export function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-User-Id': getUserId(),
  };
}

export async function listDatasets(allUsers = false): Promise<{ count: number; data: Dataset[] }> {
  const url = allUsers ? `${API_BASE}/datasets?all=true` : `${API_BASE}/datasets`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function syncUploads(): Promise<{ synced: number; added: { dataset_id: string; user_id: string; dataset_name: string }[] }> {
  const res = await fetch(`${API_BASE}/datasets/sync`, { method: 'POST', headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function listFromFolder(): Promise<{ count: number; data: { dataset_id: string; user_id: string; dataset_name: string; original_filename: string }[]; path: string }> {
  const res = await fetch(`${API_BASE}/datasets/from-folder`, { headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadDataset(file: File, datasetName?: string): Promise<UploadResponse> {
  const form = new FormData();
  form.append('file', file);
  if (datasetName) form.append('dataset_name', datasetName);
  const headers: Record<string, string> = { 'X-User-Id': getUserId() };
  const res = await fetch(`${API_BASE}/datasets/upload`, {
    method: 'POST',
    headers,
    body: form,
  });
  if (!res.ok) {
    const err = await res.text();
    try {
      const j = JSON.parse(err);
      throw new Error(j.detail || err);
    } catch {
      throw new Error(err);
    }
  }
  return res.json();
}

export async function getPreview(
  datasetId: string,
  limit = 20,
  asUserId?: string
): Promise<PreviewResponse> {
  const headers = asUserId ? { ...getHeaders(), 'X-User-Id': asUserId } : getHeaders();
  const res = await fetch(
    `${API_BASE}/datasets/${datasetId}/preview?limit=${limit}`,
    { headers }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function runQuery(params: {
  question: string;
  dataset_id?: string;
  dataset_ids?: string[];
  limit?: number;
  asUserId?: string;
}): Promise<QueryResponse> {
  const body: Record<string, unknown> = {
    question: params.question,
    limit: params.limit ?? 50,
  };
  if (params.dataset_ids?.length) body.dataset_ids = params.dataset_ids;
  else if (params.dataset_id) body.dataset_id = params.dataset_id;

  const headers = params.asUserId
    ? { ...getHeaders(), 'X-User-Id': params.asUserId }
    : getHeaders();

  const res = await fetch(`${API_BASE}/query/`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    try {
      const j = JSON.parse(err);
      throw new Error(j.detail?.detail || j.detail || err);
    } catch {
      throw new Error(err);
    }
  }
  return res.json();
}

export interface Dataset {
  dataset_id: string;
  user_id?: string;
  dataset_name: string;
  original_filename: string;
  table: string;
  row_count: number;
  created_at: string;
}

export interface UploadResponse {
  dataset_id: string;
  dataset_name: string;
  row_count: number;
  columns: { name: string; pg_type: string }[];
}

export interface PreviewResponse {
  count: number;
  columns: string[];
  data: Record<string, unknown>[];
}

export interface QueryResponse {
  question: string;
  sql: string | null;
  safety_passed: boolean;
  count: number;
  data: Record<string, unknown>[] | null;
  execution_error: string | null;
  execution_time_ms: number | null;
}
