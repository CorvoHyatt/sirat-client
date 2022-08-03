export class Usuario{
    idUsuario: number;
    correo: string;
    password: string;
    nombre: string;
    idArea: number;

    constructor() {
        this.idUsuario = 0;
        this.correo = ``;
        this.password = ``;
        this.nombre = ``;
        this.idArea = 1;

    }
}