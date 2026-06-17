"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type TicketMessage = {
  id: string;
  sender_type: string;
  content: string;
  page_url: string | null;
  created_at: string;
};

function getMessagesSignature(messages: TicketMessage[]) {
  return messages.map((message) => message.id).join("|");
}

export function TicketMessagesPanel({
  ticketId,
  initialMessages,
}: {
  ticketId: string;
  initialMessages: TicketMessage[];
}) {
  const supabase = useMemo(() => createClient(), []);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const hasInitialScrolled = useRef(false);
  const messagesSignatureRef = useRef(getMessagesSignature(initialMessages));

  const [messages, setMessages] = useState<TicketMessage[]>(initialMessages);

  const scrollToBottom = useCallback(() => {
    const container = scrollRef.current;

    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, []);

  const isNearBottom = useCallback(() => {
    const container = scrollRef.current;

    if (!container) return true;

    return (
      container.scrollHeight - container.scrollTop - container.clientHeight < 180
    );
  }, []);

  const dispatchMessagesUpdated = useCallback(
    (nextMessages: TicketMessage[]) => {
      const nextSignature = getMessagesSignature(nextMessages);

      if (nextSignature === messagesSignatureRef.current) {
        return;
      }

      messagesSignatureRef.current = nextSignature;

      window.dispatchEvent(
        new CustomEvent("pulsedesk:messages-updated", {
          detail: {
            ticketId,
            signature: nextSignature,
          },
        })
      );
    },
    [ticketId]
  );

  const mergeMessages = useCallback(
    (incoming: TicketMessage[]) => {
      setMessages((current) => {
        const map = new Map<string, TicketMessage>();

        [...current, ...incoming].forEach((message) => {
          map.set(message.id, message);
        });

        const nextMessages = Array.from(map.values()).sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        dispatchMessagesUpdated(nextMessages);

        return nextMessages;
      });
    },
    [dispatchMessagesUpdated]
  );

  const fetchMessages = useCallback(async () => {
    const shouldScroll = isNearBottom();

    const { data } = await supabase
      .from("ticket_messages")
      .select("id, sender_type, content, page_url, created_at")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });

    if (data) {
      mergeMessages(data as TicketMessage[]);

      if (shouldScroll) {
        setTimeout(scrollToBottom, 50);
      }
    }
  }, [isNearBottom, mergeMessages, scrollToBottom, supabase, ticketId]);

  useEffect(() => {
    if (!hasInitialScrolled.current) {
      hasInitialScrolled.current = true;
      setTimeout(scrollToBottom, 80);
    }
  }, [scrollToBottom]);

  useEffect(() => {
    const channel = supabase
      .channel(`ticket-messages-${ticketId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ticket_messages",
          filter: `ticket_id=eq.${ticketId}`,
        },
        (payload) => {
          const shouldScroll = isNearBottom();
          const newMessage = payload.new as TicketMessage;

          mergeMessages([newMessage]);

          if (shouldScroll) {
            setTimeout(scrollToBottom, 50);
          }
        }
      )
      .subscribe();

    const interval = window.setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => {
      window.clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [
    fetchMessages,
    isNearBottom,
    mergeMessages,
    scrollToBottom,
    supabase,
    ticketId,
  ]);

  return (
    <div ref={scrollRef} className="min-h-0 overflow-y-auto p-8">
      <div className="space-y-6">
        {messages.map((message) => {
          const isCustomer = message.sender_type === "customer";

          return (
            <div
              key={message.id}
              className={`flex w-full ${
                isCustomer ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`w-fit max-w-2xl rounded-[28px] px-6 py-5 shadow-sm ${
                  isCustomer ? "bg-white" : "bg-black text-white"
                }`}
              >
                <div className="mb-3 text-xs font-semibold uppercase tracking-wide opacity-50">
                  {isCustomer ? "Клиент" : "Оператор"}
                </div>

                <div className="leading-relaxed">{message.content}</div>

                {message.page_url ? (
                  <div className="mt-4 border-t border-black/5 pt-3 text-xs text-zinc-400">
                    Страница обращения:
                    <div className="mt-1 break-all">{message.page_url}</div>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}