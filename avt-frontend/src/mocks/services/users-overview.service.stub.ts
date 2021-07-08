import { of } from 'rxjs';
import { User } from 'src/app/account/user';
import * as faker from 'faker';

export class UsersOverviewServiceStub {

    users: User[] = [
        {
            id: 1,
            username: faker.name.findName(),
            email: faker.internet.email(),
            createdAt: faker.date.past(),
            isAdmin: 1
        },
        {
            id: 2,
            username: faker.name.findName(),
            email: faker.internet.email(),
            createdAt: faker.date.past(),
            isAdmin: 0
        },
        {
            id: 3,
            username: faker.name.findName(),
            email: faker.internet.email(),
            createdAt: faker.date.past(),
            isAdmin: 0
        },
        {
            id: 4,
            username: faker.name.findName(),
            email: faker.internet.email(),
            createdAt: faker.date.past(),
            isAdmin: 0
        }
    ];

    getAllUsers(sort: string, order: string, page: number, perPage: number) {
        return of({
            data: this.users,
            pagination: {
                currentPage: page,
                total: Math.ceil(this.users.length / perPage),
            }
        });
    }

    getUser(id: number) {
        return of({
            id: id,
            username: faker.name.findName(),
            email: faker.internet.email(),
            createdAt: faker.date.past(),
            isAdmin: 1
        });
    }

    deleteUser(id: number) {
        return of({
            message: 'Succesvol verwijderd'
        })
    }

    toggleAdmin(id: number){
        var isAdmin;
        if (this.users[id-1].isAdmin === 1) {
            isAdmin = 0
        } else {
            isAdmin = 1
        }
        return of({
            message: 'Succesvol rechten gewijzigd'
        });
    }

}