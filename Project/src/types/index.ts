export interface QRCodeType {
  id: string;
  name: string;
  description: string;
  supports: string;
  maxLength?: number;
  example: string;
}

export interface GenerationLog {
  id: number;
  filename: string;
  data: string;
  label: string;
  code_type: string;
  date: string;
  time: string;
  location: string;
  created_at: string;
  qr_code_url: string;
}

export interface GenerateRequest {
  data: string;
  label: string;
  code_type: string;
}

export interface GenerateResponse {
  success: boolean;
  message: string;
  log: GenerationLog;
  qr_code_url: string;
}