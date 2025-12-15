'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useRouter } from 'next/navigation';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import ChatBox from '@components/ChatBox';
import { chatService } from '@services/chatService';
import { useAuthStore } from '@store/authStore';
import { toast } from 'react-toastify';
import { FiMessageSquare, FiPlus } from 'react-icons/fi';
import { Chat } from '@types';

export default function SupportPage() {
  const router = useRouter();
  const { user, hasHydrated } = useAuthStore();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (hasHydrated && !user && typeof window !== 'undefined') {
      router.push('/auth/login?redirect=/support');
    }
  }, [user, hasHydrated, router]);

  const { data: chats = [], isLoading } = useQuery<Chat[]>(
    ['my-chats'],
    () => chatService.getMyChats(),
    { enabled: !!user && hasHydrated }
  );

  if (!hasHydrated) {
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

  if (!user) {
    return null;
  }

  const createChatMutation = useMutation(
    () => chatService.createOrGet({ subject: 'Yêu cầu hỗ trợ' }),
    {
      onSuccess: (newChat) => {
        queryClient.invalidateQueries(['my-chats']);
        setSelectedChatId(newChat._id);
        toast.success('Đã tạo cuộc trò chuyện mới');
      },
    }
  );

  const selectedChat = chats.find((c) => c._id === selectedChatId);

  if (!user) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="flex-1 section-shell flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Vui lòng đăng nhập để sử dụng chat hỗ trợ</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Navbar />

      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Hỗ trợ</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Chat hỗ trợ khách hàng</h1>
          <p className="text-gray-100/90">Liên hệ với chúng tôi bất cứ lúc nào</p>
        </div>
      </header>

      <div className="section-shell py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chat List */}
          <div className="lg:col-span-1 panel overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">Cuộc trò chuyện</h2>
              <button
                onClick={() => createChatMutation.mutate()}
                className="p-2 bg-secondary text-white rounded-lg hover:bg-yellow-600 transition"
              >
                <FiPlus size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <FiMessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Chưa có cuộc trò chuyện nào</p>
                  <button
                    onClick={() => createChatMutation.mutate()}
                    className="mt-4 text-secondary hover:underline"
                  >
                    Tạo cuộc trò chuyện mới
                  </button>
                </div>
              ) : (
                <div className="divide-y">
                  {chats.map((chat) => (
                    <button
                      key={chat._id}
                      onClick={() => setSelectedChatId(chat._id)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                        selectedChatId === chat._id ? 'bg-secondary/10 border-l-4 border-secondary' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{chat.customerName}</p>
                          {chat.subject && (
                            <p className="text-sm text-gray-600 mt-1">{chat.subject}</p>
                          )}
                          {chat.messages && chat.messages.length > 0 && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                              {chat.messages[chat.messages.length - 1].message}
                            </p>
                          )}
                        </div>
                        {user.role === 'customer' && !chat.isReadByCustomer && (
                          <span className="w-2 h-2 bg-secondary rounded-full"></span>
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
                onClose={() => setSelectedChatId(null)}
                onMessageSent={() => {
                  queryClient.invalidateQueries(['my-chats']);
                }}
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

