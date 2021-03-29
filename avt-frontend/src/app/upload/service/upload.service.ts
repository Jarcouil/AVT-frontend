import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessagesService } from 'src/app/shared/messages/messages.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'http://localhost:3000/v1/file/upload-file';

  constructor(
    private http: HttpClient,
    private messagesService: MessagesService
  ) { }
}
