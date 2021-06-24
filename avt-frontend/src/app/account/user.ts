import { Pagination } from '../models/pagination';

export interface User {
    id: number;
    username: string;
    email: string;
    createdAt: Date;
    isAdmin: number;
}

export interface UserResponse {
    data: User[];
    pagination: Pagination;
}
