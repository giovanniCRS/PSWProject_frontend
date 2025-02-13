import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { userGGuard } from './user-g.guard';

describe('userGGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => userGGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
