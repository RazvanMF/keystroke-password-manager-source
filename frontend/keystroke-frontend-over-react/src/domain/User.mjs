export class User {
    constructor(ID, email, username, masterkey) {
        this.ID = ID;
        this.email = email;
        this.username = username;
        this.masterkey = masterkey;
    }
}

export class IDLessUserDTO {
    constructor(email, username, masterkey) {
        this.email = email;
        this.username = username;
        this.masterkey = masterkey;
    }
}