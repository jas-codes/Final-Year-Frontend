import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { Chat } from 'src/app/models/chat';
import { Message } from 'src/app/models/message';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/services/user.model';
import { UserTypes } from 'src/app/enums/user-types';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  //component variables
  chatId: string;
  chat: Chat = new Chat();
  chatMessage: string;
  windowHeight: string = window.innerHeight + 'px';
  trader: boolean =false;

  //user variables
  userSub: Subscription;
  user: IUser;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService
  ) { }

  ngOnInit(): void {
    this.chatId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.authService.user$) { //get the user
      this.userSub = this.authService.user$.subscribe((user) => {
        if(user != null) {
          this.user = user;
          if(this.user.accountType == UserTypes.trader)
            this.trader = true;
        }
      })
      
      this.chatService.getChat(this.chatId).valueChanges().subscribe((chat) => {
        this.chat = chat;
      });
    }
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  postChat() { //post a new chat
    var message = new Message();
    message.message = this.chatMessage;
    message.posterUid = this.user.uid;
    message.sentDate = Date.now();
    this.chat.lastContact = message.sentDate;
    this.chat.messages[this.chat.messages.length] = {...message};

    this.chatService.updateChat(this.chat).toPromise() //clear the send field once updated
      .then(() => {
        this.chatMessage = '';
      });
  }

}
