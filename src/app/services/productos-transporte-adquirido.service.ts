import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ProductoTransporteAdquirido } from "../models/productoTransporteAdquirido";
import { environment } from "src/environments/environment";
import { ProductoTransporte } from '../models/productoTransporte';

@Injectable({
  providedIn: "root",
})
export class ProductosTransporteAdquiridoService {
  constructor(private http: HttpClient) {}

  create(    idProductoAdquirido: number,
    productoTransporteAdquirido: ProductoTransporteAdquirido) {
    return this.http.post(
      `${environment.API_URI}/productosTransporteAdquirido/create/${idProductoAdquirido}`,
      productoTransporteAdquirido
    );
  }

  create_list(
    idProductoAdquirido: number,
    productoTransporte: ProductoTransporte[]
  ) {
    return this.http.post(
      `${environment.API_URI}/productosTransporteAdquirido/create_list/${idProductoAdquirido}`,
      productoTransporte
    );
  }

  listByIdProductoAdquirido(idProductoAdquirido: number) {
    return this.http.get(`${environment.API_URI}/productosTransporteAdquirido/listByIdProductoAdquirido/${idProductoAdquirido}`);
  }
}
