export class Account {
    constructor(ID, service, email, username, password, creationtype) {
        this.ID = ID;
        this.service = service;
        this.email = email;
        this.username = username;
        this.password = password;
        this.creationtype = creationtype;
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