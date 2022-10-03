let defaultOwnerData = {
  firstName: '마틴',
  lastName: '파울러',
};

export function defaultOwner() {
  return new Person(defaultOwnerData);
}

export function setDefaultOwner(arg) {
  defaultOwnerData = arg;
}

class Person {
  constructor(data) {
    this._lastName = data.lastName;
    this._firstName = data.firstName;
  }

  get lastName() {
    return this._lastName;
  }

  get firstName() {
    return this._firstName;
  }
}

class OwnerManager {
  a = 10;
  static defaultOwnerData = { firstName: '마틴', lastName: '파울러' };
  static getDefaultOwnerData() {
    return this.defaultOwnerData;
  }
  static setDefaultOwner(arg) {
    this.defaultOwnerData = arg;
  }
}

OwnerManager.defaultOwnerData;
OwnerManager.getDefaultOwnerData;

defaultOwner();
