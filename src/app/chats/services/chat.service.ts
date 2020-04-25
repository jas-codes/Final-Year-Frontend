import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Chat } from 'src/app/models/chat';
import { of } from 'rxjs';
import { UserTypes } from 'src/app/enums/user-types';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatCollection: AngularFirestoreCollection<Chat>;

  constructor(
    private afireStore: AngularFirestore
  ) { }

  createChat(chat: Chat) {
    var id = this.afireStore.createId();
    chat.id =id;
    return this.afireStore.collection('chats')
      .doc(id)
      .set({...chat})
      .then(() => {return id})
      .catch(error => this.errorHandler(error));
  }

  getChat(chatId: string) {
    return this.afireStore.doc<Chat>(`chats/${chatId}`);
  }

  getChatsForUser(uid: string, userType: string) {
    if(userType == UserTypes.trader)
      return this.chatCollection = this.afireStore.collection('chats', 
        ref => ref.where('traderUid', '==', uid));
    else 
      return this.chatCollection = this.afireStore.collection('chats', 
        ref => ref.where('userUid', '==', uid));
  }

  updateChat(chat: Chat) {
    return of(this.afireStore.doc<Chat>(`chats/${chat.id}`).update(chat)
    .catch(error => this.errorHandler(error)));
  }

  openExistingChat(jobId: string, issueUid: string, traderId: string) {
    return this.chatCollection = this.afireStore.collection('chats',
      ref => {
        return ref
          .where('jobId', '==', jobId)
          .where('traderUid', '==', traderId)
          .where('userUid', '==', issueUid)
      })
  }

  errorHandler(error) {
    console.log(error);
  }
}
