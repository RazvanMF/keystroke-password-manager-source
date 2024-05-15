export class Account {
    constructor(ID, service, email, username, password) {
        this.ID = ID;
        this.service = service;
        this.email = email;
        this.username = username;
        this.password = password;
    }
}

class IDLessAccountDTO {
    constructor(service, email, username, password) {
        this.service = service;
        this.email = email;
        this.username = username;
        this.password = password;
    }
}