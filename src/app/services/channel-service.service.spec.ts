import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChannelServiceService } from './channel-service.service';
import { AuthService } from './auth-service.service';

describe('ChannelServiceService', () => {
  let service: ChannelServiceService;
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
        ChannelServiceService,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    service = TestBed.inject(ChannelServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new channel', () => {
    const mockResponse = { success: true };
    service.createChannel('groupId123', 'channelName', 'channelDescription').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/channels/createChannel');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should delete a channel', () => {
    const mockResponse = { success: true };
    service.deleteChannel('groupId123', 'channelId456').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/channels/deleteChannel');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should ban a user from a channel', () => {
    const mockResponse = { success: true };
    service.banUser('groupId123', 'channelId456', 'userId789').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/channels/banUser');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should load channel details', () => {
    const mockResponse = { id: 'channelId456', name: 'Test Channel' };
    service.getChannelDetails('channelId456').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/channels/details');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should upload a file', () => {
    const mockResponse = { success: true };
    const mockFile = new FormData();
    mockFile.append('file', new Blob(['file content']), 'testFile.txt');

    service.uploadFile(mockFile).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:4000/api/channels/uploadFile');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
