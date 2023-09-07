import { Notifier, JSON, Ledger, Subscription } from '@klave/sdk';
import { WriteMessageOutput, ClearChatOutput, Chat, ChatMessage } from './types';

const chatRoomName = 'demo_chat';

/**
 * @query
 */
export function getChat(): void {

    Subscription.setReplayStart();
    const chat = Ledger.getTable(chatRoomName).get('messages');
    if (chat.length === 0) {
        Notifier.sendJson<Chat>({
            messages: []
        });
        return;
    }

    const msgs = JSON.parse<ChatMessage[]>(chat);
    Notifier.sendJson<Chat>({
        messages: msgs
    });

};

/**
 * @transaction
 */
export function writeMessage(messageText: string, senderName: string): void {

    const newMessage: ChatMessage = {
        sender: senderName,
        message: messageText,
        timestamp: 0
    }

    const chatTable = Ledger.getTable(chatRoomName);
    const list = chatTable.get('messages');

    if (list.length === 0) {
        chatTable.set('messages', JSON.stringify<ChatMessage[]>([newMessage]));
    } else {
        const existingMessages = JSON.parse<ChatMessage[]>(list);
        existingMessages.push(newMessage);
        chatTable.set('messages', JSON.stringify<ChatMessage[]>(existingMessages));
    }

    Notifier.sendJson<WriteMessageOutput>({
        success: true,
        message: 'Done'
    });

};

/**
 * @transaction
 */
// export function clearChat(): void {

//     const chatTable = Ledger.getTable(chatRoomName);
//     chatTable.set('messages', JSON.stringify<ChatMessage[]>([]));

//     Notifier.sendJson<ClearChatOutput>({
//         success: true,
//         message: 'Done'
//     });

// };
