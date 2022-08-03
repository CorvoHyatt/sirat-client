import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Producto } from '../models/Producto';
import { ProductoInfo } from '../models/ProductoInfo';
import { ProductoTarifa } from '../models/ProductoTarifa';
import { ProductoOpcion } from '../models/ProductoOpcion';
import { ProductoHorario } from '../models/productoHorarios';
import { ProductoDiaCerrado } from '../models/ProductoDiaCerrado';
import { ProductoEntrada } from '../models/ProductoEntrada';
import { ProductoTransporte } from '../models/productoTransporte';
import { Subcategoria } from '../models/Subcategoria';

@Injectable({
  providedIn: "root",
})
export class ProductosService {
  constructor(private http: HttpClient) {}

  createTPAP(producto: Producto, productoInfo: ProductoInfo, tarifasPersonas: ProductoTarifa[],entradas: ProductoEntrada[], opciones: ProductoOpcion[], horarios: ProductoHorario[], diasCerrados: ProductoDiaCerrado[], subcategorias: Subcategoria[]) {
    return this.http.post(`${environment.API_URI}/productos/createTPAP`, [producto,productoInfo, tarifasPersonas,entradas, opciones, horarios, diasCerrados,subcategorias]);
  }
  agregarEmpresa(dato)
  {
    console.log(dato);
    return this.http.post(`${environment.API_URI}/productos/agregarEmpresa`, dato);
  }
  createTPAP_fromList(tourPrivadosAPie: any[]) {
    return this.http.post(`${environment.API_URI}/productos/createTPAP_fromList`, tourPrivadosAPie);
  }
  
  createTPET(producto: Producto, productoInfo: ProductoInfo, tarifasPersonas: ProductoTarifa[],entradas: ProductoEntrada[], opciones: ProductoOpcion[], horarios: ProductoHorario[], diasCerrados: ProductoDiaCerrado[], transportes: ProductoTransporte[], subcategorias: Subcategoria[]) {
    return this.http.post(`${environment.API_URI}/productos/createTPET`, [producto,productoInfo, tarifasPersonas,entradas, opciones, horarios, diasCerrados,transportes,subcategorias]);
  }

  createTEG_fromList(toursEnTransporte: any[]) {
    return this.http.post(`${environment.API_URI}/productos/createTEG_fromList`,toursEnTransporte);
  }

  createTEG(producto: Producto, productoInfo: ProductoInfo, opciones: ProductoOpcion[], horarios: ProductoHorario[], diasCerrados: ProductoDiaCerrado[], transportes: ProductoTransporte[], subcategorias: Subcategoria[]) {
    return this.http.post(`${environment.API_URI}/productos/createTEG`, [producto,productoInfo,opciones, horarios, diasCerrados,transportes,subcategorias]);
  }

  createTPET_fromList(tourPrivadosEnTransporte: any[]) 
  {
    console.log(tourPrivadosEnTransporte);
    return this.http.post(`${environment.API_URI}/productos/createTPET_fromList`,tourPrivadosEnTransporte);
  }



  createActividad(producto: Producto, productoInfo: ProductoInfo, opciones: ProductoOpcion[], horarios: ProductoHorario[], diasCerrados: ProductoDiaCerrado[], transportes: ProductoTransporte[], subcategorias: Subcategoria[]) {
    return this.http.post(`${environment.API_URI}/productos/createActividad`, [producto,productoInfo,opciones, horarios, diasCerrados,transportes, subcategorias]);
  }


  createActividad_fromList(actividades: any[]) {
    return this.http.post(`${environment.API_URI}/productos/createActividad_fromList`,actividades);
  }




  listByCiudadCategoriaSubcategoria(
    idCiudad: number,
    categoria: number,
    subCatergoria: number
  ) {
    return this.http.get(
      `${environment.API_URI}/productos/listByCiudadCategoriaSubcategoria/${idCiudad}/${categoria}/${subCatergoria}`
    );
  }

  listProductoByIdProducto(idProducto: number) {
    return this.http.get(
      `${environment.API_URI}/productos/listProductoByIdProducto/${idProducto}`
    );
  }


  listProductoByIdProducto_vista(idProducto: number) {
    return this.http.get(
      `${environment.API_URI}/productos/listProductoByIdProducto_vista/${idProducto}`
    );
  }

  listImagenesExistentes(idProducto: number) {
    return this.http.get(
      `${environment.API_URI}/productos/listImagenesExistentes/${idProducto}`
    );
  }

  listProductoInfoByIdProducto(idProducto: number) {
    return this.http.get(
      `${environment.API_URI}/productos/listProductoInfoByIdProducto/${idProducto}`
    );
  }

  listProductoInfoByIdProducto_vista(idProducto: number) {
    return this.http.get(
      `${environment.API_URI}/productos/listProductoInfoByIdProducto_vista/${idProducto}`
    );
  }

  listDiasCerradosByIdProducto(idProducto: number) {
    return this.http.get(
      `${environment.API_URI}/productos/listDiasCerradosByIdProducto/${idProducto}`
    );
  }

  listHorariosProducto(idProducto: number) {
    return this.http.get(
      `${environment.API_URI}/productos/listHorariosProducto/${idProducto}`
    );
  }

  listEntradasByIdProducto(idProducto: number) {
    return this.http.get(
      `${environment.API_URI}/productos/listEntradasByIdProducto/${idProducto}`
    );
  }

  listOpcionesByIdProducto(idProducto: number) {
    return this.http.get(
      `${environment.API_URI}/productos/listOpcionesByIdProducto/${idProducto}`
    );
  }

  listTarifasIdProducto(idProducto: number) {
    return this.http.get(
      `${environment.API_URI}/productos/listTarifasIdProducto/${idProducto}`
    );
  }

  incrementoByFecha(id, fecha) {
    return this.http.get(
      `${environment.API_URI}/productos/incrementoByFecha/${id}/${fecha}`
    );
  }
  incrementoByFechaVariable(id, fecha) {

    return this.http.get(
      `${environment.API_URI}/productos/incrementoByFechaVariable/${id}/${fecha}`
    );
  }
  incrementoByHora(id, hora) {
    return this.http.get(
      `${environment.API_URI}/productos/incrementoByHora/${id}/${hora}`
    );
  }

  listProductosRelacionados(titulo, categoria) {
    console.log("listProductosRelacionados");
    return this.http.get(
      `${environment.API_URI}/productos/listProductosRelacionados/${titulo}/${categoria}`
    );
  }

  listTransporteByProducto(idProducto, tipo) {
    console.log("listTransporteByProducto");
    console.log(`************************************`, tipo);
    return this.http.get(
      `${environment.API_URI}/productos/listTransporteByProducto/${idProducto}/${tipo}`
    );
  }

  listTransportesIdProducto_vista(idProducto) {
    console.log("listTransportesIdProducto_vista");
    return this.http.get(
      `${environment.API_URI}/productos/listTransportesIdProducto_vista/${idProducto}`
    );
  }


  listByPaisCiudad_vista(idPais: number, idCiudad: number, categoria: number) {
    return this.http
      .get(`${environment.API_URI}/productos/listByPais_vista/${idPais}/${idCiudad}/${categoria}`);
  }

  list_subcategoriasByIdProducto(idProducto: number) {
    return this.http
    .get(`${environment.API_URI}/productos/list_subcategoriasByIdProducto/${idProducto}`);
  }

  actualizarTPAP(producto: Producto, productoInfo: ProductoInfo, tarifasPersonas: ProductoTarifa[],entradas: ProductoEntrada[], opciones: ProductoOpcion[], horarios: ProductoHorario[], diasCerrados: ProductoDiaCerrado[],subcategorias: Subcategoria[]) {
    return this.http.put(`${environment.API_URI}/productos/actualizarTPAP`, [producto,productoInfo, tarifasPersonas,entradas, opciones, horarios, diasCerrados, subcategorias]);
  }

  actualizarTPET(producto: Producto, productoInfo: ProductoInfo, tarifasPersonas: ProductoTarifa[],entradas: ProductoEntrada[], opciones: ProductoOpcion[], horarios: ProductoHorario[], diasCerrados: ProductoDiaCerrado[],transportes: ProductoTransporte[],subcategorias: Subcategoria[]) {
    return this.http.put(`${environment.API_URI}/productos/actualizarTPET`, [producto,productoInfo, tarifasPersonas,entradas, opciones, horarios, diasCerrados, transportes, subcategorias]);
  }

  actualizarTEG(producto: Producto, productoInfo: ProductoInfo, opciones: ProductoOpcion[], horarios: ProductoHorario[], diasCerrados: ProductoDiaCerrado[],transportes: ProductoTransporte[],subcategorias: Subcategoria[]) {
    return this.http.put(`${environment.API_URI}/productos/actualizarTEG`, [producto,productoInfo, opciones, horarios, diasCerrados, transportes,subcategorias]);
  }


  actualizarActividad(producto: Producto, productoInfo: ProductoInfo, opciones: ProductoOpcion[], horarios: ProductoHorario[], diasCerrados: ProductoDiaCerrado[],transportes: ProductoTransporte[],subcategorias: Subcategoria[]) {
    return this.http.put(`${environment.API_URI}/productos/actualizarActividad`, [producto,productoInfo, opciones, horarios, diasCerrados, transportes, subcategorias]);
  }



  delete(idProducto: number)
  {
    return this.http.delete(`${environment.API_URI}/productos/delete/${idProducto}`);
  }

}
