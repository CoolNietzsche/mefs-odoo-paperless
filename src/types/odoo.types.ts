export interface OdooSession {
  session_id: string;
  uid: number;
  name: string;
  username: string;
  user_context: Record<string, any>;
  db: string;
  company_id: number;
  partner_id: number;
  server_url: string;
}

export interface OdooRpcResponse<T> {
  jsonrpc: string;
  id: number | string;
  result?: T;
  error?: {
    code: number;
    message: string;
    data: any;
  };
}

export interface OdooDbListResponse {
  result: string[];
}
