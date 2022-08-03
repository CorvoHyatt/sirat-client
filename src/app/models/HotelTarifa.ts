export class HotelTarifa{
    idHotelTarifa: number;
    idCiudad: number;
    turista: number;
    turistaSup: number;
    premium: number;
    lujo: number;
    turistaT: string;
    turistaSupT: string;
    premiumT: string;
    lujoT: string;

    constructor() { 	
    this.idHotelTarifa = 0;
    this.idCiudad = 0;
    this.turista = 0;
    this.turistaSup = 0;
    this.premium = 0;
    this.lujo = 0;
    this.turistaT = ``;
    this.turistaSupT = ``;
    this.premiumT = ``;
    this.lujoT = ``;
    }
}