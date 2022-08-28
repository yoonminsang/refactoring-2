interface IProducer {
  name: string;
  cost: number;
  production: number;
}
interface IConvinceData {
  name: string;
  producers: IProducer[];
  demand: number;
  price: number;
}

export class Province {
  private _name: string;
  private _producers: Producer[];
  private _totalProduction: number;
  private _demand: number;
  private _price: number;
  constructor(convinceData: IConvinceData) {
    this._name = convinceData.name;
    this._producers = [];
    this._totalProduction = 0;
    this._demand = convinceData.demand;
    this._price = convinceData.price;
    convinceData.producers.forEach((producer) =>
      this.addProducer(new Producer(this, producer))
    );
  }
  addProducer(arg: Producer) {
    this._producers.push(arg);
    this._totalProduction += arg.production;
  }
  get name() {
    return this._name;
  }
  get producers() {
    return this._producers.slice();
  }
  get totalProduction() {
    return this._totalProduction;
  }
  set totalProduction(arg: number) {
    this._totalProduction = arg;
  }
  get demand() {
    return this._demand;
  }
  set demand(arg: number) {
    this._demand = arg;
  }
  get price() {
    return this._price;
  }
  set price(arg: number) {
    this._price = arg;
  }
  get shortfall() {
    return this._demand - this.totalProduction;
  }
  get profit() {
    return this.demandValue - this.demandCost;
  }
  get demandValue() {
    return this.satisfiedDemand * this.price;
  }
  get satisfiedDemand() {
    return Math.min(this._demand, this.totalProduction);
  }
  get demandCost() {
    let remainingDemand = this.demand;
    let result = 0;
    this.producers
      .sort((a, b) => a.cost - b.cost)
      .forEach((producer) => {
        const contribution = Math.min(remainingDemand, producer.production);
        remainingDemand -= contribution;
        result += contribution * producer.cost;
      });
    return result;
  }
}

export function sampleProvinceData(): IConvinceData {
  return {
    name: 'Asia',
    producers: [
      { name: 'Byzantium', cost: 10, production: 9 },
      { name: 'Attalia', cost: 12, production: 10 },
      { name: 'Sinope', cost: 10, production: 6 },
    ],
    demand: 30,
    price: 20,
  };
}

export class Producer {
  private _province: Province;
  private _cost: number;
  private _name: string;
  private _production: any;
  constructor(province: Province, producer: IProducer) {
    this._province = province;
    this._cost = producer.cost;
    this._name = producer.name;
    this._production = producer.production || 0;
  }
  get name() {
    return this._name;
  }
  get cost() {
    return this._cost;
  }
  set cost(arg: number) {
    this._cost = arg;
  }

  get production() {
    return this._production;
  }
  set production(amountStr) {
    const amount = parseInt(amountStr);
    const newProduction = Number.isNaN(amount) ? 0 : amount;
    this._province.totalProduction += newProduction - this._production;
    this._production = newProduction;
  }
}
