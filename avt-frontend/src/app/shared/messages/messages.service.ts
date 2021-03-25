import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  messages: Message[] = [];

  add(message: Message) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }
}

export interface Message {
  message: string;
  code: number;

}
