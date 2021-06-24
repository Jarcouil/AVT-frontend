import { Pagination } from '../models/pagination';

export interface Measurement {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    username: string;
}

export interface MeasurementResponse {
    data: Measurement[];
    pagination: Pagination;
}
