import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private baseUrl = 'http://127.0.0.1:8000/';


  constructor(private http: HttpClient) { }

  uploadFiles(files: File[]): Observable<any> {
    const url = `${this.baseUrl}upload/`;  // Asegúrate que esta URL es la correcta en tu servidor Flask
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    }
  );


    return this.http.post<any>(url, formData, {
      reportProgress: true,  // Opcional: para el progreso de la carga
      observe: 'events'      // Opcional: si quieres manejar eventos como el progreso de carga
    });
  }

  deleteAllFiles(): Observable<any> {
    const url = `${this.baseUrl}delete-all-files/`;
    return this.http.post<any>(url, {}, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  listarDocumentos(): Observable<{ titulos: string[] }> {
    return this.http.get<{ titulos: string[] }>(`${this.baseUrl}listar-documentos/`);
  }
  

  buscarArticulos(search_query: string, repositorios: string[], cantidad: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { search_query: search_query, repositorios: repositorios, cantidad : cantidad };
    return this.http.post<any>(`${this.baseUrl}buscar-articulos/`, body, { headers: headers });
  }

  preprocesamiento(searchQuery: string, contenidoBusqueda: string): Observable<any> {
    const url = `${this.baseUrl}/preprocesamiento/`;
    const body = { search_query: searchQuery, contenidoBusqueda: contenidoBusqueda };
    return this.http.post<any>(url, body);
  }
 
  machineLearning(searchQuery: string, num_topics: number, num_palabras: number, n_docs: number, n_palabras: number, apiKey: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { search_query: searchQuery, num_topics: num_topics, num_palabras: num_palabras , n_docs: n_docs, n_palabras: n_palabras, apiKey: apiKey};
    return this.http.post<any>(`${this.baseUrl}encontrar-temas/`, body, { headers: headers });
  }

  diagrama(searchQuery: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { search_query: searchQuery };

    console.log({headers, body})
    return this.http.post<string>(`${this.baseUrl}generar-diagrama/`, body, { headers: headers, responseType: 'text' as 'json' });
  }

  generarTxt(search_query: string, lineas_investigacion: string, areas_interesidad: string, max_words: number, max_keywords: number, link: string, apiKey: string): Observable<Blob> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      search_query: search_query,
      lineas_investigacion: lineas_investigacion,
      areas_interesidad: areas_interesidad,
      max_words: max_words,
      max_keywords: max_keywords,
      link: link,
      apiKey: apiKey
    };
  
    return this.http.post(`${this.baseUrl}generar_txt/`, body, {
      headers: headers,
      responseType: 'blob' // La respuesta sigue siendo un blob ya que es un archivo.
    });
  }  

  apikeyProve(apiKey: string): Observable<any> {
    const url = `${this.baseUrl}verificar-conexion/`;  // Asegúrate de no tener doble barra
    const body = { apiKey };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.post<any>(url, body, { headers });
  }

  obtenerImagen() {
    const url = `${this.baseUrl}api/imagen/`;
    return this.http.get(url, { responseType: 'blob' }); // Recibir la imagen como Blob
  }
  
}
