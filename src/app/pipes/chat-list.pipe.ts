import { Pipe, PipeTransform } from '@angular/core';
import { Chat } from '../models/chat';

@Pipe({
  name: 'chatListSearch'
})
export class ChatListPipe implements PipeTransform {

  transform(chats: Chat[], jobTitleFilter: string): any {
    if(!chats || !jobTitleFilter )
      return chats;
    
      return chats.filter((chat: Chat) => {
        return chat.jobTitle.toLowerCase().includes(jobTitleFilter.toLowerCase());
      })
  }

}
