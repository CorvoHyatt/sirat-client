export class Notificacion{

    idNotificacion: number;
    emisor: number;
    receptor: number;
    asunto: string;
    data: any;
    tipo: number;
    prioridad: number;
    estatus: number;
    caducidad: string;

    constructor() {
        this.idNotificacion = 0;
        this.emisor=0;
        this.receptor = 0;
        this.asunto = ``;
        this.data={};
        this.tipo=0;
        this.prioridad=1;
        this.estatus=0;
        this.caducidad=``;
    
    }
}