import { ChatListPipe } from './chat-list.pipe';
import { Chat } from '../models/chat';

describe('ChatListPipe', () => {
  it('create an instance', () => {
    const pipe = new ChatListPipe();
    expect(pipe).toBeTruthy();
  });

  let chats: Chat[] = [
    {jobTitle: 'test Title 1', companyName: 'test compName', jobId: 'jobId 1', traderUid: '1', id: '1', lastContact: 4, messages: [], userUid: '2'},
    {jobTitle: 'test Title 2', companyName: 'test compName', jobId: 'jobId 1', traderUid: '1', id: '1', lastContact: 4, messages: [], userUid: '2'},
    {jobTitle: 'test Title 2.5', companyName: 'test compName', jobId: 'jobId 1', traderUid: '1', id: '1', lastContact: 4, messages: [], userUid: '2'},
    {jobTitle: 'test Title 3', companyName: 'test compName', jobId: 'jobId 1', traderUid: '1', id: '1', lastContact: 4, messages: [], userUid: '2'},
  ];

  it('should return whole list if search term is empty', () => {
    let pipe = new ChatListPipe();
    expect(pipe.transform(chats, '')).toEqual(chats);
  });

  it('should return all of list when searched with term "title"', () => {
    let pipe = new ChatListPipe()  
    expect(pipe.transform(chats, 'Title')).toEqual(chats);
  });

  it('should return search despite case mismatch',() => {
    let pipe = new ChatListPipe()  
    expect(pipe.transform(chats, 'tITLE')).toEqual(chats);
  });

  it('should return empty if no match on search term',() => {
    let pipe = new ChatListPipe()  
    expect(pipe.transform(chats, '4')).toEqual([]);
  });

  it('should return list with 1 term',() => {
    let pipe = new ChatListPipe()  
    expect(pipe.transform(chats, '1').length).toEqual(1);
    expect(pipe.transform(chats, '1')[0]).toEqual(chats[0]);
  });

  it('should return list with 2 terms',() => {
    let pipe = new ChatListPipe()  
    expect(pipe.transform(chats, '2').length).toEqual(2);
    expect(pipe.transform(chats, '2')[0]).toEqual(chats[1]);
  });
});
