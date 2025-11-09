import React from 'react';
import { marked } from 'marked';
import { Message, Role } from '../types';
import Logo from './Logo';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.role === Role.USER;
  const bubbleClasses = isUser
    ? 'bg-white text-charcoal-gray self-end'
    : 'bg-[#FFF9C4] text-charcoal-gray self-start';
  
  const containerClasses = isUser ? 'justify-end' : 'justify-start';

  const sanitizedHtml = marked.parse(message.content, { breaks: true });

  return (
    <div className={`flex items-end space-x-3 max-w-xl w-full mx-4 ${containerClasses}`}>
      {!isUser && <Logo className="w-8 h-8 flex-shrink-0 mb-2" />}
      <div
        className={`p-4 rounded-2xl shadow-md break-words ${bubbleClasses}`}
        style={isUser ? { borderTopRightRadius: '0.25rem' } : { borderTopLeftRadius: '0.25rem' }}
      >
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: sanitizedHtml as string }} />
      </div>
    </div>
  );
};

export default ChatBubble;