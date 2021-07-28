import { User } from 'src/app/account/user';
import * as faker from 'faker';

export class AuthServiceStub {

    user: User = {
        id: 1,
        username: faker.name.findName(),
        email: faker.internet.email(),
        createdAt: faker.date.past(),
        isAdmin: 1
    };

    getUserDetails() {
        return this.user;
    }

    getUser() {
        return this.user;
    }

    isCurrentUserAdmin(): boolean {
        return this.getUserDetails().isAdmin === 1;
    }

    getToken(): any {
        return faker.datatype.string(20);
    }

    getTimer() {
        return faker.date.future()
    }

}