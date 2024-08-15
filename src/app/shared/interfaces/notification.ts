export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
  recipientUserId: string;
  initiatorUserId: string;
  initiatorFirstName: string;
  profileImageUrl: string;
}

export enum NotificationType {
  Follow = 'FOLLOW',
  Like = 'LIKE',
  Comment = 'COMMENT',
  Reply = 'REPLY',
  Mention = 'MENTION',
  Share = 'SHARE',
  System = 'SYSTEM',
}
