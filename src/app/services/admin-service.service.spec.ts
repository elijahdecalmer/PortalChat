import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminServiceService } from './admin-service.service';
import { AuthService } from './auth-service.service';

describe('AdminServiceService', () => {
  let service: AdminServiceService;
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
        AdminServiceService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(AdminServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call promoteToGroupAdmin', () => {
    service.promoteToGroupAdmin('testUser').subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/admin/promoteToGroupAdmin');
    expect(req.request.method).toBe('POST');
    req.flush({}); // Respond with an empty object to simulate success
  });

  it('should call promoteToSuperAdmin', () => {
    service.promoteToSuperAdmin('testUser').subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/admin/promoteToSuperAdmin');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call deleteUser', () => {
    service.deleteUser('123').subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/admin/deleteUser');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call getAllUsers', () => {
    service.getAllUsers().subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/admin/allUsers');
    expect(req.request.method).toBe('POST');
    req.flush([]);
  });

  it('should call reportUser', () => {
    service.reportUser('123', 'This is a test message').subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/admin/reportUser');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should call getMyGroups', () => {
    service.getMyGroups().subscribe();

    const req = httpMock.expectOne('http://localhost:4000/api/admin/myGroups');
    expect(req.request.method).toBe('POST');
    req.flush([]);
  });
});
