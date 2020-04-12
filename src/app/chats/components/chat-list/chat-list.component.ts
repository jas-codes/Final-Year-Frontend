import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chat } from 'src/app/models/chat';
import { ChatService } from '../../services/chat.service';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { IUser } from 'src/app/services/user.model';
import { Subscription } from 'rxjs';
import { UserTypes } from 'src/app/enums/user-types';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.css']
})
export class ChatListComponent implements OnInit, OnDestroy {
  chatCollection: AngularFirestoreCollection<Chat>;
  chatList: Chat[] = [];
  searchTerm: string = "";
  showTraderTable: boolean = false;

  //user variables
  user: IUser;
  userSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public chatService: ChatService,
  ) { }

  ngOnInit(): void {

    if (this.authService.user$) { //get the user
      this.userSub = this.authService.user$.subscribe((user) => {
        if(user != null) {
          this.user = user;
          if(user.accountType == UserTypes.trader)
            this.showTraderTable = true;
          this.getChatPageInformation();
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  //get the chats for that user
  getChatPageInformation() { 
    this.chatCollection = this.chatService.getChatsForUser(this.user.uid, this.user.accountType);
    this.chatCollection.valueChanges().subscribe((chats) => {
      this.chatList = chats;
    });
  }

  //open a chat
  loadChat(id: number){
    this.router.navigate([
      { outlets: { navLinks: ['chats', id] } }
    ],
      { relativeTo: this.activatedRoute.parent });
  }


}
