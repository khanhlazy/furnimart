'use client';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import ChatBox from '@components/ChatBox';
import { chatService } from '@services/chatService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';

export default function EmployeeChatPage() {
  const { user, isLoading } = useRequireAuth({ requiredRole: ['employee', 'admin'] });
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: chats = [] } = useQuery<any[]>(
    ['chats', 'open'],
    () => chatService.getOpenChats(),
    { enabled: !isLoading && (user?.role === 'employee' || user?.role === 'admin') }
  );

  const assignMutation = useMutation(
    (chatId: string) => chatService.assignToEmployee(chatId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['chats']);
        toast.success('Đã nhận chat');
      },
    }
  );

  const selectedChat = chats.find((c: any) => c._id === selectedChatId);

  if (isLoading) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="flex-1 section-shell flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || !['employee', 'admin'].includes(user.role)) {
    return null;
  }

  return (
    <div className="page-shell">
      <Navbar />
      <div className="section-shell py-10">
        <h1 className="text-3xl font-bold mb-6">Chat hỗ trợ</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chat List */}
          <div className="lg:col-span-1 panel overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Danh sách chat</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chats.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <FiMessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Không có chat nào</p>
                </div>
              ) : (
                <div className="divide-y">
                  {chats.map((chat: any) => (
                    <button
                      key={chat._id}
                      onClick={() => {
                        setSelectedChatId(chat._id);
                        if (!chat.employeeId) {
                          assignMutation.mutate(chat._id);
                        }
                      }}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                        selectedChatId === chat._id ? 'bg-secondary/10 border-l-4 border-secondary' : ''
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{chat.customerName}</p>
                        {chat.messages && chat.messages.length > 0 && (
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {chat.messages[chat.messages.length - 1].message}
                          </p>
                        )}
                        {!chat.isReadByEmployee && (
                          <span className="inline-block w-2 h-2 bg-secondary rounded-full mt-2"></span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Box */}
          <div className="lg:col-span-2 panel overflow-hidden">
            {selectedChat ? (
              <ChatBox
                chat={selectedChat}
                onMessageSent={() => queryClient.invalidateQueries(['chats'])}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FiMessageSquare size={64} className="mx-auto mb-4 text-gray-300" />
                  <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

