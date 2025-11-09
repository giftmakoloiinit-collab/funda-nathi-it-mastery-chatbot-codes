


// FIX: Added missing IUser interface for Google Login user data.
export interface IUser {
  name: string;
  picture: string;
}

export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system',
}

export interface Message {
  role: Role;
  content: string;
  timestamp: number;
}

export enum ChatFlowState {
  AWAITING_NAME_INPUT = 'AWAITING_NAME_INPUT',
  AWAITING_CERTIFICATION_INPUT = 'AWAITING_CERTIFICATION_INPUT',
  AWAITING_LANGUAGE_INPUT = 'AWAITING_LANGUAGE_INPUT',
  CHATTING = 'CHATTING',
}