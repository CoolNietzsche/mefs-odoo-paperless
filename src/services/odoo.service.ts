import axios from 'axios';
import { OdooSession, OdooRpcResponse } from '../types/odoo.types';

class OdooService {
  private serverUrl: string = '';
  private sessionId: string | null = null;

  setServerUrl(url: string) {
    this.serverUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  }

  setSessionId(id: string | null) {
    this.sessionId = id;
  }

  getServerUrl() {
    return this.serverUrl;
  }

  async rpc<T>(path: string, params: any = {}): Promise<T> {
    if (!this.serverUrl) throw new Error('Server URL not set');

    const url = `${this.serverUrl}${path}`;
    const payload = {
      jsonrpc: '2.0',
      method: 'call',
      params,
      id: Math.floor(Math.random() * 1000000000),
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.sessionId) {
      // In Odoo 12+, X-Openerp-Session-Id can be used, or just pass session_id in params
      headers['X-Openerp-Session-Id'] = this.sessionId;
    }

    try {
      const response = await axios.post<OdooRpcResponse<T>>(url, payload, { 
        headers,
        withCredentials: true 
      });

      if (response.data.error) {
        throw new Error(response.data.error.message || 'Odoo RPC Error');
      }

      return response.data.result as T;
    } catch (error: any) {
      console.error('Odoo RPC Error:', error.message);
      throw error;
    }
  }

  async authenticate(db: string, login: string, password: string): Promise<OdooSession> {
    const result = await this.rpc<any>('/web/session/authenticate', {
      db,
      login,
      password,
    });

    this.sessionId = result.session_id;

    return {
      session_id: result.session_id,
      uid: result.uid,
      name: result.name,
      username: result.username,
      user_context: result.user_context,
      db: result.db,
      company_id: result.company_id,
      partner_id: result.partner_id,
      server_url: this.serverUrl,
    };
  }

  async getDbList(): Promise<string[]> {
    try {
      const response = await axios.post(`${this.serverUrl}/web/database/list`, {
        jsonrpc: '2.0',
        method: 'call',
        params: {},
        id: 1,
      });
      return response.data.result || [];
    } catch (e) {
      // Some Odoo instances disable db list or use individual dbs
      return [];
    }
  }

  async destroySession() {
    if (this.sessionId) {
      await this.rpc('/web/session/destroy', {});
      this.sessionId = null;
    }
  }
}

export const odooService = new OdooService();
