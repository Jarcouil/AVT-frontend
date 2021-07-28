import * as faker from 'faker';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { Measurement } from 'src/app/measurement-overview/measurement';

export class MeasurementServiceStub {
    private measurementSubject = new ReplaySubject<Measurement>();
    measurement$ = this.measurementSubject.asObservable();

    measurement: Measurement = {
        id: 1,
        name: faker.lorem.word(),
        description: faker.lorem.words(5),
        createdAt: faker.date.past().toDateString(),
        samplingRate: faker.datatype.number(6400),
        username: faker.name.firstName(),
    };

    setMeasurement(measurement: Measurement) {
        this.measurementSubject.next(measurement);
    }

    getWavelengths(id: number) {
        let data = [1,2,3,4,5,6,7,8,9];
        return data;
    }

    getTimestamps(id: number) {
        const data = [1,2,3,4,5,6,7,8,9];
        return data;
    }
}