import { Measurement } from './../../measurement-overview/measurement';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagesService } from 'src/app/shared/messages/messages.service';
import { TwodimensionalgraphService } from './service/twodimensionalgraph.service';
import { MeasurementService } from '../service/measurement.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-twodimensionalgraph',
  templateUrl: './twodimensionalgraph.component.html',
  styleUrls: ['./twodimensionalgraph.component.css']
})
export class TwodimensionalgraphComponent implements OnInit, OnDestroy {
  measurement!: Measurement;
  columns = [];
  ids = [];
  subscription: Subscription;

  constructor(
    private twodimensionalgraphService: TwodimensionalgraphService,
    private messagesService: MessagesService,
    private measurementService: MeasurementService,
  ) {

    this.subscription = measurementService.measurement$.subscribe(
      measurement => {
        this.measurement = measurement;
        this.getItems();
      }
    );
   }

  ngOnInit(): void {
    this.messagesService.clear();
  }

  getItems(): void {
    this.getColumns(this.measurement.name);
    this.getIds(this.measurement.name);
  }


  getColumns(name: string): void {
    this.twodimensionalgraphService.getAllColumns(name).subscribe(columns => this.columns = columns);
  }

  getIds(name: string): void {
    this.twodimensionalgraphService.getAllIds(name).subscribe(ids => this.ids = ids);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
