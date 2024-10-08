import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { AuthService } from './auth-service.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(() => {
    // Mock the AuthService to always return a user with a token
    mockAuthService = {
      getUser: () => ({ token: 'fakeToken' })
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload an avatar file', () => {
    const mockResponse = { success: true };
    const mockFile = new FormData();
    mockFile.append('avatar', new Blob(['file content']), 'avatar.png');

    service.uploadAvatar(mockFile).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/users/updateAvatar');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update the user bio', () => {
    const mockResponse = { success: true };
    const bio = 'This is a test bio';

    service.updateBio(bio).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/users/bio');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ bio });
    req.flush(mockResponse);
  });
});
