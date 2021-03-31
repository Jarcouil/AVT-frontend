import { Component, OnInit } from '@angular/core';
import { MessagesService } from 'src/app/shared/messages/messages.service';

@Component({
  selector: 'app-rawdata',
  templateUrl: './rawdata.component.html',
  styleUrls: ['./rawdata.component.css']
})
export class RawdataComponent implements OnInit {

  constructor(
    private messagesService: MessagesService
  ) { }

  ngOnInit(): void {
    this.messagesService.clear();
  }

}
