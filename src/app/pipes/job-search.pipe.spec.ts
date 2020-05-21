import { JobSearchPipe } from './job-search.pipe';
import { Job } from '../models/job';
import { CompletionState } from '../enums/completionState';
import { TradeType } from '../enums/trade-types';
import { JobTestData } from '../testing/job-testing-data';

describe('JobSearchPipe', () => {
  it('create an instance', () => {
    const pipe = new JobSearchPipe();
    expect(pipe).toBeTruthy();
  });

  let jobsData: JobTestData = new JobTestData();

  it('should return whole list if search term is empty', () => {
    let pipe = new JobSearchPipe();
    expect(pipe.transform(jobsData.jobs, '')).toEqual(jobsData.jobs);
  });

  it('should return all of list when searched with term "title"', () => {
    let pipe = new JobSearchPipe()  
    expect(pipe.transform(jobsData.jobs, 'Title')).toEqual(jobsData.jobs);
  });

  it('should return search despite case mismatch',() => {
    let pipe = new JobSearchPipe()  
    expect(pipe.transform(jobsData.jobs, 'tITLE')).toEqual(jobsData.jobs);
  });

  it('should return empty if no match on search term',() => {
    let pipe = new JobSearchPipe()  
    expect(pipe.transform(jobsData.jobs, '4')).toEqual([]);
  });

  it('should return list with 1 term',() => {
    let pipe = new JobSearchPipe()  
    expect(pipe.transform(jobsData.jobs, '1').length).toEqual(1);
    expect(pipe.transform(jobsData.jobs, '1')[0]).toEqual(jobsData.jobs[0]);
  });

  it('should return list with 2 terms',() => {
    let pipe = new JobSearchPipe()  
    expect(pipe.transform(jobsData.jobs, '2').length).toEqual(2);
    expect(pipe.transform(jobsData.jobs, '2')[0]).toEqual(jobsData.jobs[1]);
  });
});
