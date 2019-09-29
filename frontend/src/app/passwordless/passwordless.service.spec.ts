import { TestBed } from '@angular/core/testing';

import { PasswordlessService } from './passwordless.service';

describe('PasswordlessService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PasswordlessService = TestBed.get(PasswordlessService);
    expect(service).toBeTruthy();
  });
});
