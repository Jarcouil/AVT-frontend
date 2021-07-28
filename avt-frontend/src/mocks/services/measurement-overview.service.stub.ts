import * as faker from 'faker';
import { of } from 'rxjs/internal/observable/of';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { Measurement } from 'src/app/measurement-overview/measurement';

export class MeasurementOverviewServiceStub {

    measurements: Measurement[] = [
        {
            id: 1,
            name: faker.lorem.word(),
            description: faker.lorem.words(5),
            createdAt: faker.date.past().toDateString(),
            samplingRate: faker.datatype.number(6400),
            username: faker.name.firstName(),
        },
        {
            id: 2,
            name: faker.lorem.word(),
            description: faker.lorem.words(5),
            createdAt: faker.date.past().toDateString(),
            samplingRate: faker.datatype.number(6400),
            username: faker.name.firstName(),
        },
        {
            id: 3,
            name: faker.lorem.word(),
            description: faker.lorem.words(5),
            createdAt: faker.date.past().toDateString(),
            samplingRate: faker.datatype.number(6400),
            username: faker.name.firstName(),
        },
        {
            id: 4,
            name: faker.lorem.word(),
            description: faker.lorem.words(5),
            createdAt: faker.date.past().toDateString(),
            samplingRate: faker.datatype.number(6400),
            username: faker.name.firstName(),
        },
    ];

    /**
   * Get all the measurments
   *
   */
  getMeasurementsOfUser(sort: string, order: string, page: number, perPage: number) {
    return of({
        data: this.measurements,
        pagination: {
            currentPage: page,
            total: Math.ceil(this.measurements.length / perPage),
        }
    });
  }

  /**
   * Get all the measurments
   *
   */
  getMeasurements(sort: string, order: string, page: number, perPage: number){
    return of({
        data: this.measurements,
        pagination: {
            currentPage: page,
            total: Math.ceil(this.measurements.length / perPage),
        }
    });
  }

  /**
   * Get measurement of given id
   *
   * @param id number
   *
   */
  getMeasurement(id: number) {
    return of({
        id: id,
        name: faker.lorem.word(),
        description: faker.lorem.words(5),
        createdAt: faker.date.past().toDateString(),
        samplingRate: faker.datatype.number(6400),
        username: faker.name.firstName(),
    });
  }

  /**
   * Delete measurement of given id
   *
   * @param id number
   *
   */
  deleteMeasurement(id: number) {
    return of({
        message: `Meting ${this.measurements[1].name} is succesvol verwijderd`
    })
  }
}