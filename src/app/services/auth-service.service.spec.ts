import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth-service.service';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: Router;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a new user', () => {
    const mockResponse = { user: { id: 1, username: 'testUser' } };
    service.register('test@example.com', 'testUser', 'password123').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should log in a user', () => {
    const mockResponse = { user: { id: 1, username: 'testUser' } };
    service.login('testUser', 'password123').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should log out a user', () => {
    service.logout();
    expect(service.getUser()).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should refetch the user data', () => {
    // Set up a mock user with a token
    const mockUser = { id: 1, username: 'testUser', token: 'fakeToken' };
    sessionStorage.setItem('user', JSON.stringify(mockUser));
    service['userSubject'].next(mockUser); // Manually set the userSubject
  
    const mockResponse = { success: true, user: mockUser };
    service.refetchUser().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
  
    const req = httpMock.expectOne('http://localhost:4000/api/auth/refetchSelf');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
  

  it('should delete a user account', () => {
    // Set up a mock user with a token
    const mockUser = { id: 1, username: 'testUser', token: 'fakeToken' };
    sessionStorage.setItem('user', JSON.stringify(mockUser));
    service['userSubject'].next(mockUser); // Manually set the userSubject
  
    const mockResponse = { success: true };
    service.deleteAccount().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
  
    const req = httpMock.expectOne('http://localhost:4000/api/auth/deleteAccount');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
  


  it('should get the current user', () => {
    const mockUser = { id: 1, username: 'testUser' };
    sessionStorage.setItem('user', JSON.stringify(mockUser));
    service['userSubject'].next(mockUser);

    expect(service.getUser()).toEqual(mockUser);
  });
});
