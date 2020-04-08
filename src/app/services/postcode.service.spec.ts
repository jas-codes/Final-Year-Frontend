import { TestBed } from '@angular/core/testing';

import { PostcodeService } from './postcode.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('PostcodeService', () => {
  let service: PostcodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HttpClient,
        HttpHandler
      ]
    });
    service = TestBed.inject(PostcodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
