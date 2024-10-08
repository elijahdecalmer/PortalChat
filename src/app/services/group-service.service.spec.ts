import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GroupServiceService } from './group-service.service';
import { AuthService } from './auth-service.service';

describe('GroupServiceService', () => {
  let service: GroupServiceService;
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
        GroupServiceService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(GroupServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all groups', () => {
    const mockResponse = [{ id: 'groupId1', name: 'Test Group' }];
    service.getAllGroups().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/groups/all');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should approve a user\'s request to join a group', () => {
    const mockResponse = { success: true };
    service.approveUser('groupId123', 'userId456').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/groups/acceptAccess');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should remove a user from a group', () => {
    const mockResponse = { success: true };
    service.removeUser('groupId123', 'userId456').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/groups/removeUser');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should ban a user from a channel', () => {
    const mockResponse = { success: true };
    service.banUser('groupId123', 'channelId789', 'userId456').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/groups/banUser');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should create a new group', () => {
    const mockResponse = { success: true };
    service.createGroup('Test Group', 'Test Description').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/groups/createGroup');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should request to join a group', () => {
    const mockResponse = { success: true };
    service.requestAccess('groupId123').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/groups/requestAccess');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should reject a user\'s request to join a group', () => {
    const mockResponse = { success: true };
    service.rejectUser('groupId123', 'userId456').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/groups/rejectAccess');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get group details', () => {
    const mockResponse = { id: 'groupId123', name: 'Test Group' };
    service.getGroupDetails('groupId123').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/groups/details');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should leave a group', () => {
    const mockResponse = { success: true };
    service.leaveGroup('groupId123').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/groups/leaveGroup');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
