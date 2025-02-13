import { TestBed } from '@angular/core/testing';

import { CarrelloService } from './carrello.service';

describe('CarrelloService', () => {
  let service: CarrelloService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarrelloService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
