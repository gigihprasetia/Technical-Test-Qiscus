export interface DataMaster {
  data: Data;
  meta: Meta;
  status: number;
  messages: Messages[];
}

export interface Data {
  customer_rooms: CustomerRoom[];
}

export interface CustomerRoom {
  channel_id: number;
  contact_id: number;
  id: number;
  is_calling: boolean;
  is_handled_by_bot: boolean;
  is_resolved: boolean;
  is_waiting: boolean;
  last_comment_sender: string;
  last_comment_sender_type: string;
  last_comment_text: string;
  last_comment_timestamp: Date;
  last_customer_comment_text: null;
  last_customer_timestamp: Date;
  name: string;
  room_badge: null;
  room_id: string;
  room_type: string;
  source: string;
  user_avatar_url: string;
  user_id: string;
}

export interface Messages {
  id: string;
  room_id: number;
  text: string;
  from: string;
  to: number;
  date: Date;
}

export interface Meta {
  current_total: number;
  cursor_after: Date;
  cursor_before: Date;
}
