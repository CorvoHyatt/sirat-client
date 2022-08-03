export class RentaVehiculo {
    public idRentaVehiculo: number;
    public idDestino: number;
    public comision: number;
    public comisionAgente: number;
    public nombre: string;
    public tipoTransmision: string;
    public lugarPickUp: string;
    public fechaPickUp: string;
    public horaPickUp: string;
    public lugarDropOff: string;
    public fechaDropOff: string;
    public horaDropOff: string;
    public tarifa: number;
    public diasRentado: number;
    public notas: string;
    public imagen: string;
    public opcional: number;
  
    constructor() {
        this.idRentaVehiculo = 0;
        this.idDestino = 0;
        this.comision = 0;
        this.comisionAgente = 0;
        this.nombre = '';
        this.tipoTransmision = '';
        this.lugarPickUp = '';
        this.fechaPickUp = '';
        this.horaPickUp = '';
        this.lugarDropOff = '';
        this.fechaDropOff = '';
        this.horaDropOff = '';
        this.tarifa = 0;
        this.diasRentado = 1;
        this.notas = '';
        this.imagen = '';
        this.opcional = 0;
    }
}
  