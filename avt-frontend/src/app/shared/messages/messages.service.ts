import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  messages: Message[] = [];

  /**
   * Add message to messages
   *
   * @param message Message
   *
   * @returns void
   */
  add(message: Message): void {
    if (message.message == "undefined") {
      message.message = "Er is een probleem opgetreden."
    }
    this.messages.push(message);
  }

  /**
   * Clear all messages
   *
   * @returns void
   */
  clear(): void {
    this.messages = [];
  }
}

export interface Message {
  message: string;
  code: number;

}
