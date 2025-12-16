'use client';

import { useState, useEffect, useRef } from 'react';
import { FiSend, FiX } from 'react-icons/fi';
import { chatService } from '@services/chatService';
import { useAuthStore } from '@store/authStore';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Chat, Message } from '@types';

interface ChatBoxProps {
  chat: Chat;
  onClose?: () => void;
  onMessageSent?: () => void;
}

export default function ChatBox({ chat, onClose, onMessageSent }: ChatBoxProps) {
  const { user } = useAuthStore();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(chat.messages || []);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(chat.messages || []);
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    try {
      setIsSending(true);
      const updatedChat = await chatService.sendMessage(chat._id, message);
      setMessages(updatedChat.messages || []);
      setMessage('');
      onMessageSent?.();
      
      // Mark as read
      if (user?.role === 'customer') {
        await chatService.markAsRead(chat._id);
      }
    } catch (error: any) {
      toast.error('Gửi tin nhắn thất bại');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-secondary to-yellow-500 text-white rounded-t-lg">
        <div>
          <h3 className="font-bold">{chat.customerName}</h3>
          {chat.subject && <p className="text-sm opacity-90">{chat.subject}</p>}
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <FiX size={20} />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Chưa có tin nhắn nào</p>
            <p className="text-sm mt-2">Bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwnMessage = msg.senderId === user?._id;
            return (
              <div
                key={idx}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isOwnMessage
                      ? 'bg-secondary text-white'
                      : 'bg-white text-gray-900 border'
                  }`}
                >
                  {!isOwnMessage && (
                    <div className="text-xs font-semibold mb-1 opacity-75">
                      {msg.senderName}
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  {msg.images && msg.images.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msg.images.map((img, imgIdx) => (
                        <img
                          key={imgIdx}
                          src={img}
                          alt=""
                          className="rounded max-w-full h-auto"
                        />
                      ))}
                    </div>
                  )}
                  <div className="text-xs mt-1 opacity-75">
                    {format(new Date(msg.sentAt), 'HH:mm', { locale: vi })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSend size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

