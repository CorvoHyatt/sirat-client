import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChoferService } from '../../services/chofer.service';


@Component({
  selector: 'app-chofer-validar',
  templateUrl: './chofer-validar.component.html',
  styleUrls: ['./chofer-validar.component.css']
})
export class ChoferValidarComponent implements OnInit {
  correo: string;
  idChofer: number;
  listaTraslados: any;
  listaTrasladosAceptados: any;
  listaTrasladosRechazados: any;

  fecha: String;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private choferService: ChoferService,

  ) {
    this.idChofer = 0;
    let hoy = new Date();
    this.fecha = hoy.getFullYear() + '-' + ((hoy.getMonth() + 1) < 10 ? '0' + (hoy.getMonth() + 1) : '' + (hoy.getMonth() + 1)) + '-' + (hoy.getDate() < 10 ? '0' + hoy.getDate() : '' + hoy.getDate());
    console.log(this.fecha);
  }
  DarInfoDesde(datos: any) {
    if (datos.tipoDesde == 2)
      return datos.nombreDesde + ": " + datos.direccionDesde;
    if (datos.tipoDesde == 3)
      return datos.direccionDesde;
  }
  DarInfoHacia(datos: any) {
    if (datos.tipoHacia == 2)
      return datos.nombreHacia + ": " + datos.direccionHacia;
    if (datos.tipoHacia == 3)
      return datos.direccionHacia;
  }
  infoDesde(datos) {
    if (datos.tipoDesde == 1) //Aeropuerto
      return 'Aeropuerto';
    if (datos.tipoDesde == 2) //Hotel
      return 'Hotel';
    else if (datos.tipoDesde == 3) //Dir específica
      return 'Dirección específica';
    else if (datos.tipoDesde == 4) // Estación de tren
      return 'Estación de tren';
    else
      return 'Muelle';
  }
  infoHacia(tipoHacia) {
    if (tipoHacia == 1) //Aeropuerto
      return 'Aeropuerto';
    if (tipoHacia == 2) //Hotel
      return 'Hotel';
    else if (tipoHacia == 3) //Dir específica
      return 'Dirección específica';
    else if (tipoHacia == 4) // Estación de tren
      return 'Estación de tren';
    else
      return 'Muelle';
  }
  DarInfoSuplementariaHacia(datos: any) {
    if (datos.tipoHacia == 1)
      return datos.nombreHacia + " - Vuelo:" + datos.numeroServicioHacia;
    if (datos.tipoHacia == 2) {
      return this.DarInfoHacia(datos);
    }
    if (datos.tipoHacia == 3)
      return this.DarInfoHacia(datos);
    if (datos.tipoHacia == 4) {
      return datos.nombreHacia + " - Línea:" + datos.numeroServicioHacia;
    }
    if (datos.tipoHacia == 5) {
      return datos.nombreHacia + " - Muelle:" + datos.numeroServicioHacia;
    }
    else {
      return "";

    }
  }
  DarInfoSuplementariaDesde(datos: any) {
    if (datos.tipoDesde == 1)
      return datos.nombreDesde + " - Vuelo:" + datos.numeroServicioDesde;
    if (datos.tipoDesde == 2)
      return this.DarInfoDesde(datos);
    if (datos.tipoDesde == 3)
      return this.DarInfoDesde(datos);
    if (datos.tipoDesde == 4) {
      return datos.nombreDesde + " - Línea:" + datos.numeroServicioDesde;
    }
    if (datos.tipoDesde == 5)
      return datos.nombreDesde + " - Muelle:" + datos.numeroServicioDesde;
    else
      return "";

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let token = params.get('correoChofer');
      console.log(token);
      this.authService.decodificarMail(token).subscribe(
        (res1: any) => {
          this.correo = res1;
          console.log(this.correo);
          this.choferService.listTrasladosChofer15MenosAddDel(this.correo).subscribe(
            (resChofer: any) => {
              this.listaTraslados = resChofer;
              this.choferService.listTrasladosChofer15Aceptados(this.correo).subscribe(
                (resTrasladosAceptados: any) => {
                  this.listaTrasladosAceptados = resTrasladosAceptados;
                  console.log(this.listaTrasladosAceptados);
                  this.choferService.listTrasladosChofer15Rechazados(this.correo).subscribe(
                    (resTrasladosRechazados: any) => {
                      this.listaTrasladosRechazados = resTrasladosRechazados;
                      console.log(this.listaTrasladosRechazados);
                      this.choferService.listOne(this.correo).subscribe(
                        (resChoferOne: any) => {
                          this.idChofer = resChoferOne.idChofer;
                        }, err =>
                        console.error(err));

                    }, err =>
                    console.error(err));

                }, err =>
                console.error(err));
            }, err =>
            console.error(err));
        }, err =>
        console.error(err)
      );
    });
  }
  addChoferTraslado(idTrasladoAdquirido) {
    let currentUrl = this.router.url;
    var choferTrasladoObjeto =
    {
      "idTrasladoAdquiridoInfo": idTrasladoAdquirido,
      "idChofer": this.idChofer,
      "fecha": this.fecha
    };
    this.choferService.addChoferTraslado(choferTrasladoObjeto).subscribe(
      res => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });
      });

  }
  deleteChoferTraslado(idTrasladoAdquirido) {
    let currentUrl = this.router.url;
    var choferTrasladoObjeto =
    {
      "idTrasladoAdquiridoInfo": idTrasladoAdquirido,
      "idChofer": this.idChofer,
      "fecha": this.fecha
    };
    this.choferService.deleteChoferTraslado(choferTrasladoObjeto).subscribe(
      res => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });

      });

  }
}
