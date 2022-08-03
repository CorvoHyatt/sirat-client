import { Injectable } from "@angular/core";
import { ProductoOpcionesAdquirido } from "../models/ProductoOpcionesAdquirido";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ProductoOpcion } from "../models/ProductoOpcion";

@Injectable({
  providedIn: "root",
})
export class ProductosOpcionesAdquiridosService {
  constructor(private http: HttpClient) {}

  create(productoOpcionesAdquirido: ProductoOpcionesAdquirido) {
    return this.http.post(
      `${environment.API_URI}/productosOpcionesAdquiridos/create`,
      productoOpcionesAdquirido
    );
  }

  create_list(
    idProductoAdquirido: number,
    productoOpcionesAdquirido: ProductoOpcion[]
  ) {
    return this.http.post(
      `${environment.API_URI}/productosOpcionesAdquiridos/create_list/${idProductoAdquirido}`,
      productoOpcionesAdquirido
    );
  }

  listByIdProductoAdquirido(idProductoAdquirido: number) {
    return this.http.get(`${environment.API_URI}/productosOpcionesAdquiridos/listByIdProductoAdquirido/${idProductoAdquirido}`);
  }

}
