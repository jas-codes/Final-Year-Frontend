import { JobSearchPipe } from './job-search.pipe';
import { Job } from '../models/job';
import { CompletionState } from '../enums/completionState';
import { TradeType } from '../enums/trade-types';

describe('JobSearchPipe', () => {
  it('create an instance', () => {
    const pipe = new JobSearchPipe();
    expect(pipe).toBeTruthy();
  });

  let jobs: Job[] = [
    { id: '1', 
      address: '', 
      budget: 1, 
      completionState: CompletionState.closed, 
      conclusionDate: 1, 
      description: '', 
      issueDate: 1, 
      issueUid: '', 
      lngLat: {lat:1, lng:1}, 
      postcode: '', 
      quotes: [], 
      reviewScore: 1, 
      reviewed: { trader: true, user: true }, 
      timeframe: '', 
      title: 'test Title 1', 
      trade: TradeType.builder, 
      userReviewScore: '1', 
      workCandidates: [],
    },
    { id: '1', 
      address: '', 
      budget: 1, 
      completionState: CompletionState.closed, 
      conclusionDate: 1, 
      description: '', 
      issueDate: 1, 
      issueUid: '', 
      lngLat: {lat:1, lng:1}, 
      postcode: '', 
      quotes: [], 
      reviewScore: 1, 
      reviewed: { trader: true, user: true }, 
      timeframe: '', 
      title: 'test Title 2', 
      trade: TradeType.builder, 
      userReviewScore: '1', 
      workCandidates: [],
    },
    { id: '1', 
      address: '', 
      budget: 1, 
      completionState: CompletionState.closed, 
      conclusionDate: 1, 
      description: '', 
      issueDate: 1, 
      issueUid: '', 
      lngLat: {lat:1, lng:1}, 
      postcode: '', 
      quotes: [], 
      reviewScore: 1, 
      reviewed: { trader: true, user: true }, 
      timeframe: '', 
      title: 'test Title 2.5', 
      trade: TradeType.builder, 
      userReviewScore: '', 
      workCandidates: [],
    },
  ]

  it('should return whole list if search term is empty', () => {
    let pipe = new JobSearchPipe();
    expect(pipe.transform(jobs, '')).toEqual(jobs);
  });

  it('should return all of list when searched with term "title"', () => {
    let pipe = new JobSearchPipe()  
    expect(pipe.transform(jobs, 'Title')).toEqual(jobs);
  });

  it('should return search despite case mismatch',() => {
    let pipe = new JobSearchPipe()  
    expect(pipe.transform(jobs, 'tITLE')).toEqual(jobs);
  });

  it('should return empty if no match on search term',() => {
    let pipe = new JobSearchPipe()  
    expect(pipe.transform(jobs, '4')).toEqual([]);
  });

  it('should return list with 1 term',() => {
    let pipe = new JobSearchPipe()  
    expect(pipe.transform(jobs, '1').length).toEqual(1);
    expect(pipe.transform(jobs, '1')[0]).toEqual(jobs[0]);
  });

  it('should return list with 2 terms',() => {
    let pipe = new JobSearchPipe()  
    expect(pipe.transform(jobs, '2').length).toEqual(2);
    expect(pipe.transform(jobs, '2')[0]).toEqual(jobs[1]);
  });
});
