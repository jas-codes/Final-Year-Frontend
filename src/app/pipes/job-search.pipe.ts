import { Pipe, PipeTransform } from '@angular/core';
import { Job } from '../models/job';

@Pipe({
  name: 'jobSearch'
})
export class JobSearchPipe implements PipeTransform {

  transform(jobs: Job[], jobTitleFilter: string): any {
    if(!jobs || !jobTitleFilter )
      return jobs;
    
      return jobs.filter((job: Job) => {
        return job.title.toLowerCase().includes(jobTitleFilter.toLowerCase());
      })
  }
}
