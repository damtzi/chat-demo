import { Notifier, JSON, Ledger, Subscription, Context } from '@klave/sdk';
import { WriteMessageOutput, KVInput, Chat, ChatMessage } from './types';

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
        messages: msgs.map<ChatMessage>(function (m: ChatMessage) {
            return {
                sender: m.sender,
                message: m.message,
                timestamp: Context.get
            }
        })
    });

};

/**
 * @transaction
 */
export function writeMessage(message: string, sender: string): void {

    const newMessage: ChatMessage = {
        sender: sender,
        message: message,
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
export function clearChat(): void {

    const chatTable = Ledger.getTable(chatRoomName);
    chatTable.set('messages', JSON.stringify<ChatMessage[]>([]));

    Notifier.sendJson<WriteMessageOutput>({
        success: true,
        message: 'Done'
    });

};
