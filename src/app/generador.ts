import { TestComponentRenderer } from "@angular/core/testing"
import { AlignmentType,     HorizontalPositionAlign,VerticalPositionAlign,	Border, BorderStyle, Document, Header, HeightRule, HorizontalPositionRelativeFrom, ImageRun, ISectionOptions, LevelForOverride, Paragraph, SectionType, ShadingType, Table, TableCell, TableRow, TextRun, TextWrappingSide, TextWrappingType, VerticalAlign, VerticalPositionRelativeFrom, WidthType } from "docx"

// Estilos globales
const fuente = 'Arial'
const colorAzul = '241837'
const colorAzulClaro = 'dfe7e9'
const colorBlanco = 'ffffff'

const bordeAzul = {
	style: BorderStyle.SINGLE,
	size: 1,
	color: colorAzul
}
const bordesCeldaAzul = {
	top: bordeAzul,
	bottom: bordeAzul,
	left: bordeAzul,
	right: bordeAzul
}
const rellenoAzul = {
	type: ShadingType.CLEAR,
	color: colorAzul,
	fill: colorAzul
}

const bordeAzulClaro = {
	style: BorderStyle.SINGLE,
	size: 1,
	color: colorAzulClaro
}
const bordesCeldaAzulClaro = {
	top: bordeAzulClaro,
	bottom: bordeAzulClaro,
	left: bordeAzulClaro,
	right: bordeAzulClaro
}
const rellenoAzulClaro = {
	type: ShadingType.CLEAR,
	color: colorAzulClaro,
	fill: colorAzulClaro
}

const bordeBlanco = {
	style: BorderStyle.NONE,
	size: 0,
	color: colorBlanco
}
const bordesCeldaBlanco = {
	top: bordeBlanco,
	bottom: bordeBlanco,
	left: bordeBlanco,
	right: bordeBlanco
}

const margenesCeldaInformacion = {
	top: 100,
	bottom: 100,
	left: 100,
	right: 100
}
const margenesCeldaLugar = {
	top: 250,
	bottom: 250,
	left: 100,
	right: 100
}
const margenesCeldaDia = {
	top: 300,
	bottom: 300,
	left: 300,
	right: 300
}
const lineaPunteada = {
	top: {
		style: BorderStyle.DASH_SMALL_GAP,
		size: 14,
		color: '000000'
	},
	bottom: bordeBlanco,
	left: bordeBlanco,
	right: bordeBlanco
}

const bordeBlancoVuelo = {
	style: BorderStyle.SINGLE,
	size: 12,
	color: colorBlanco
}
const bordesCeldaBlancoVuelo = {
	top: bordeBlancoVuelo,
	bottom: bordeBlancoVuelo,
	left: bordeBlancoVuelo,
	right: bordeBlancoVuelo
}

export class GeneradorWord {

	public crear(vista: any,imagenes: any[], destinos: any[]): Document {

		const documento = new Document({
			// Estilos para todo el documento
			styles: {
				default: {
					document: {
						run: {
							font: fuente,
						}
					},
				},
			},
			sections: [
				{
					properties: {
						type: SectionType.EVEN_PAGE,
						page: {
							margin: {
								top: '1.27cm',
								right: '1.27cm',
								bottom: '1.27cm',
								left: '1.27cm'
							}
						}
					},
					children: [
						// Primer Página
						new Paragraph({
							children: [
								new TextRun({
									text: vista.nombreCliente.toUpperCase(),
								})
							],
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: vista.titulo.toUpperCase(),
									bold: true,
									size: 120,
								})
							],
							alignment: AlignmentType.CENTER,
							spacing: {
								before: 250
							}
						}),
						new Paragraph({
							text: vista.lista_destinos.toUpperCase(),
							alignment: AlignmentType.CENTER,
							spacing: {
								before: 250
							}
						}),						
						new Paragraph({
							children: [
								new ImageRun({
									data: imagenes[0],
									transformation: {
										width: 700,
										height: 700
									},
									floating: {
										zIndex: 5,
										horizontalPosition: {
											relative: HorizontalPositionRelativeFrom.PAGE,
											align: HorizontalPositionAlign.RIGHT,
										},
										verticalPosition: {
											relative: VerticalPositionRelativeFrom.PAGE,
											align: VerticalPositionAlign.BOTTOM,
										},
									},
								}),
								new Paragraph({
									children: [
										new TextRun({
											text: vista.agencia.toUpperCase()+'\t\t'+vista.fecha.toUpperCase()+'\t\t\t'+vista.agente.toUpperCase()
										})
									],
									spacing: {
										before: 250
									}
								}),
							],
							spacing: {
								before: 250
							}
						}),


						// Segunda Página

						new Paragraph({
							children: [
								new TextRun({
									text: vista.nombreCliente.toUpperCase(),
								})
							],
							alignment: AlignmentType.CENTER,
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: vista.titulo.toUpperCase(),
									bold: true,
									size: 120,
								})
							],
							alignment: AlignmentType.CENTER,
							spacing: {
								before: 250
							}
						}),
						new Paragraph({
							text: vista.lista_destinos.toUpperCase(),
							alignment: AlignmentType.CENTER,
							spacing: {
								before: 250
							}
						}),
						new Paragraph({
							children: [
								new ImageRun({
									data: imagenes[0],
									transformation: {
										width: 700,
										height: 512.5
									},
								})
							],
							spacing: {
								before: 250
							}
						}),
						new Paragraph({
							children: [
								new TextRun({
									text: vista.agencia.toUpperCase()+'\t\t'+vista.fecha.toUpperCase()+'\t\t\t'+vista.agente.toUpperCase()
								})
							],
							spacing: {
								before: 250
							}
						}),
						new Paragraph({
							children: [
								new ImageRun({
									data: imagenes[1],
									transformation: {
										width: 700,
										height: 233
									}
								})
							],
							spacing: {
								before: 250,
								after: 600
							}
						}),
						
						// Tabla de itinerarios
						
					],
				},
				// Páginas de itinerario según destino
			//	...this.crearPaginasDestinos(destinos)
			]
		})

		return documento
	}

	// Crea Secciones Para cada Destino
	private crearPaginasDestinos(destinos: any[]): ISectionOptions[] {
		let paginas: ISectionOptions[] = []

		destinos.forEach(destino => {
			destino.itinerario.forEach((actividad: any) => {
				paginas.push(this.crearPaginaActividad(destino.destino, actividad))
			})
		})

		return paginas
	}

	// Crea una sección para cada actividad del itinerario
	private crearPaginaActividad(destino: string, actividad: any): ISectionOptions {
		const pagina: ISectionOptions = {
			properties: {
				type: SectionType.NEXT_PAGE,
				page: {
					margin: {
						top: '1.27cm',
						right: '1.27cm',
						bottom: '1.27cm',
						left: '1.27cm'
					}
				}
			},
			children:
				// Muestra cosas diferentes dependiendo si es un vuelo o una actividad
				(actividad.vuelo == undefined ? [
					// Actividad
					new Paragraph({
						children: [
							new TextRun({
								text: destino,
								bold: true,
								size: 30,
								allCaps: true
							}),
							new TextRun({ break: 1 })
						],
						alignment: AlignmentType.CENTER,
						spacing: {
							before: 250,
						}
					}),
					new Paragraph({
						children: [
							new TextRun({
								text: `${('0' + actividad.fecha.dia).slice(-2)} DE ${actividad.fecha.mes} DE ${actividad.fecha.año}`,
								allCaps: true
							}),
							new TextRun({ break: 1 })
						],
						alignment: AlignmentType.CENTER,
					}),
					new Table({
						rows: [
							new TableRow({
								children: [
									new TableCell({
										borders: lineaPunteada,
										children: [
											new Paragraph({
												text: `¡Bienvenido a ${destino}!`
											})
										]
									})
								]
							})
						],
						width: {
							size: 100,
							type: WidthType.PERCENTAGE
						}
					}),
					new Paragraph({
						children: [
							new TextRun({
								text: actividad.instruccionInicial,
							}),
							new TextRun({ break: 1 })
						],
						spacing: {
							before: 150
						}
					}),
					...(actividad.hospedaje !== '' ? [
						new Paragraph({
							children: [
								new TextRun({
									text: 'Hospedaje: ',
									bold: true
								}),
								new TextRun({
									text: actividad.hospedaje
								}),
								new TextRun({ break: 1 })
							]
						})
					] : []),
					new Paragraph({
						children: [
							new ImageRun({
								data: actividad.imagen,
								transformation: {
									width: 700,
									height: 150
								}
							})
						]
					}),
					new Table({
						rows: [
							new TableRow({
								children: [
									new TableCell({
										shading: rellenoAzulClaro,
										borders: bordesCeldaAzulClaro,
										children: [
											new Paragraph({
												children: [
													new TextRun({
														text: 'Duración'
													}),
													new TextRun({ break: 1 }),
													new TextRun({
														text: `${actividad.duracion} horas`
													})
												],
												alignment: AlignmentType.CENTER
											})
										],
										verticalAlign: VerticalAlign.CENTER,
										margins: margenesCeldaDia
									}),
									new TableCell({
										shading: rellenoAzulClaro,
										borders: bordesCeldaAzulClaro,
										children: [
											new Paragraph({
												text: 'Incluye:',
												alignment: AlignmentType.CENTER
											}),
											...this.arregloABulletList(actividad.incluye)
										],
										verticalAlign: VerticalAlign.CENTER,
										margins: margenesCeldaDia
									})
								]
							})
						],
						width: {
							size: 100,
							type: WidthType.PERCENTAGE
						}
					}),
					new Paragraph({
						children: this.textoAParrafo(actividad.descripcion),
						spacing: {
							before: 500
						}
					}),
					new Paragraph({
						text: actividad.mensajeExtra,
						spacing: {
							before: 500
						}
					})
				] : [
					// Vuelo
					new Paragraph({
						children: [
							new TextRun({
								text: destino,
								bold: true,
								size: 30,
								allCaps: true
							}),
							new TextRun({ break: 1 })
						],
						alignment: AlignmentType.CENTER,
						spacing: {
							before: 250,
						}
					}),
					new Paragraph({
						children: [
							new TextRun({
								text: `${('0' + actividad.fecha.dia).slice(-2)} DE ${actividad.fecha.mes} DE ${actividad.fecha.año}`,
								allCaps: true
							}),
							new TextRun({ break: 1 })
						],
						alignment: AlignmentType.CENTER,
					}),
					new Table({
						rows: [
							new TableRow({
								children: [
									new TableCell({
										borders: lineaPunteada,
										children: [
											new Paragraph({
												text: `¡Bienvenido a ${destino}!`
											})
										]
									})
								]
							})
						],
						width: {
							size: 100,
							type: WidthType.PERCENTAGE
						}
					}),
					new Paragraph({
						children: [
							new TextRun({
								text: actividad.instruccionInicial,
							}),
							new TextRun({ break: 1 })
						],
						spacing: {
							before: 150
						}
					}),
					new Table({
						rows: [
							new TableRow({

								children: [
									new TableCell({
										shading: rellenoAzul,
										borders: bordesCeldaBlancoVuelo,
										children: [
											new Paragraph({
												children: [
													new ImageRun({
														data: actividad.imagen,
														transformation: {
															width: 80,
															height: 80
														},
													})
												],
												alignment: AlignmentType.CENTER
											})
										],
										verticalAlign: VerticalAlign.CENTER,
										rowSpan: 2
									}),
									new TableCell({
										shading: rellenoAzul,
										borders: bordesCeldaBlancoVuelo,
										children: [
											new Paragraph({
												text: 'ORIGEN',
												alignment: AlignmentType.CENTER
											})
										],
										verticalAlign: VerticalAlign.TOP,
										margins: margenesCeldaInformacion
									}),
									new TableCell({
										shading: rellenoAzul,
										borders: bordesCeldaBlancoVuelo,
										children: [
											new Paragraph({
												text: 'DESTINO',
												alignment: AlignmentType.CENTER
											})
										],
										verticalAlign: VerticalAlign.TOP,
										margins: margenesCeldaInformacion
									}),
									new TableCell({
										shading: rellenoAzul,
										borders: bordesCeldaBlancoVuelo,
										children: [
											new Paragraph({
												text: 'SALIDA',
												alignment: AlignmentType.CENTER
											})
										],
										verticalAlign: VerticalAlign.TOP,
										margins: margenesCeldaInformacion
									}),
									new TableCell({
										shading: rellenoAzul,
										borders: bordesCeldaBlancoVuelo,
										children: [
											new Paragraph({
												text: 'LLEGADA',
												alignment: AlignmentType.CENTER
											})
										],
										verticalAlign: VerticalAlign.TOP,
										margins: margenesCeldaInformacion
									}),
									new TableCell({
										shading: rellenoAzul,
										borders: bordesCeldaBlancoVuelo,
										children: [
											new Paragraph({
												text: 'COMPAÑÍA',
												alignment: AlignmentType.CENTER
											})
										],
										verticalAlign: VerticalAlign.TOP,
										margins: margenesCeldaInformacion
									}),
									new TableCell({
										shading: rellenoAzul,
										borders: bordesCeldaBlancoVuelo,
										children: [
											new Paragraph({
												text: 'CANTIDAD',
												alignment: AlignmentType.CENTER
											})
										],
										verticalAlign: VerticalAlign.TOP,
										margins: margenesCeldaInformacion
									})
								],
								height: {
									value: 900,
									rule: HeightRule.EXACT
								}
							}),
							new TableRow({
								children: [
									new TableCell({
										shading: rellenoAzul,
										borders: bordesCeldaBlancoVuelo,
										children: [
											new Paragraph({
												children: [
													new TextRun({
														text: actividad.vuelo.origen,
														allCaps: true
													})
												],
												alignment: AlignmentType.CENTER,
											})
										],
										verticalAlign: VerticalAlign.TOP,
										margins: margenesCeldaInformacion
									}),
									new TableCell({
										shading: rellenoAzul,
										borders: bordesCeldaBlancoVuelo,
										children: [
											new Paragraph({
												children: [
													new TextRun({
														text: actividad.vuelo.destino,
														allCaps: true
													})
												],
												alignment: AlignmentType.CENTER
											})
										],
										verticalAlign: VerticalAlign.TOP,
										margins: margenesCeldaInformacion
									}),
									new TableCell({
										shading: rellenoAzul,
										borders: bordesCeldaBlancoVuelo,
										children: [
											new Paragraph({
												text: actividad.vuelo.salida,
												alignment: AlignmentType.CENTER
											})
										],
										verticalAlign: VerticalAlign.TOP,
										margins: margenesCeldaInformacion
									}),
									new TableCell({
										shading: rellenoAzul,
										borders: bordesCeldaBlancoVuelo,
										children: [
											new Paragraph({
												text: actividad.vuelo.llegada,
												alignment: AlignmentType.CENTER
											})
										],
										verticalAlign: VerticalAlign.TOP,
										margins: margenesCeldaInformacion
									}),
									new TableCell({
										shading: rellenoAzul,
										borders: bordesCeldaBlancoVuelo,
										children: [
											new Paragraph({
												text: actividad.vuelo.compañia,
												alignment: AlignmentType.CENTER
											})
										],
										verticalAlign: VerticalAlign.TOP,
										margins: margenesCeldaInformacion
									}),
									new TableCell({
										shading: rellenoAzul,
										borders: bordesCeldaBlancoVuelo,
										children: [
											new Paragraph({
												text: '' + actividad.vuelo.cantidad,
												alignment: AlignmentType.CENTER
											})
										],
										verticalAlign: VerticalAlign.TOP,
										margins: margenesCeldaInformacion
									})
								],
								height: {
									value: 800,
									rule: HeightRule.ATLEAST
								}
							})
						],
						width: {
							size: 100,
							type: WidthType.PERCENTAGE
						}
					}),
					new Paragraph({
						children: this.textoAParrafo(actividad.descripcion),
						spacing: {
							before: 500
						}
					}),
					...(actividad.hospedaje !== '' ? [
						new Paragraph({
							children: [
								new TextRun({
									text: 'Hospedaje: ',
									bold: true
								}),
								new TextRun({
									text: actividad.hospedaje
								}),
								new TextRun({ break: 1 })
							]
						})
					] : [])
				])
		}

		return pagina
	}

	// Crea un lista a partir de un arreglo de texto
	private arregloABulletList(elementos: any[]): Paragraph[] {
		let lista: Paragraph[] = []
		elementos.forEach(elemento => {
			lista.push(
				new Paragraph({
					text: elemento,
					bullet: {
						level: 0
					},
					alignment: AlignmentType.LEFT
				})
			)
		})

		return lista
	}

	// Convierte un texto plano a parrafos de word para mostrar los saltos de línea correctamente
	private textoAParrafo(texto: string): TextRun[] {
		let parrafo: TextRun[] = []

		let lineas = texto.split('\n')
		lineas.forEach(linea => {
			parrafo.push(
				new TextRun({ text: linea })
			)
			parrafo.push(
				new TextRun({ break: 1 })
			)
		})

		return parrafo
	}

}