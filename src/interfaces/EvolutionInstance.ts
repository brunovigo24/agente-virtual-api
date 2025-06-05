export interface EvolutionInstance {
  id?: number;
  instance_name: string;
  instance_id: string;
  hash: string;
  status: string;
  webhook_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface EvolutionCreateResponse {
  instance: {
    instanceName: string;
    instanceId: string;
    integration: string;
    status: string;
  };
  hash: string;
  webhook?: any;
  qrcode?: any;
} 