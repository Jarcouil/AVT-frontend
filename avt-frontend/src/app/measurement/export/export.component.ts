import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Measurement } from 'src/app/measurement-overview/measurement';
import { MeasurementService } from '../service/measurement.service';
import { ExportService } from './service/export.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
  fileName!: string;
  measurement!: Measurement;
  subscription: Subscription;

  constructor(
    private exportService: ExportService,
    private measurementService: MeasurementService,
  ) {
    this.subscription = measurementService.measurement$.subscribe(
      measurement => {
        this.measurement = measurement;
        if (this.measurement) {
          this.exportService.getDadFileName(this.measurement.id).subscribe(file => this.fileName = file.fileName);
        }
      });
  }

  ngOnInit(): void {
  }

  /**
   * Download original DAD file
   *
   * @returns void
   */
  downloadFile(): void {
    this.exportService.downloadDadFile(this.measurement.id).subscribe(blob => saveAs(blob, this.fileName));
  }

}
