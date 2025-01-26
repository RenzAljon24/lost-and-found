// components/form-message.tsx

import { Message as MessageComponent, Message } from './Message';

interface FormMessageProps {
  message: Message | null;
}

export function FormMessage({ message }: FormMessageProps) {
  if (!message) return null;

  return <MessageComponent type={message.type} content={message.content} />;
}
