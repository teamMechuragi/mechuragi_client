export interface Notification {
  id: string;
  type: 'ticket_result' | 'vote_ending';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}