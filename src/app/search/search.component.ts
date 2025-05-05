import { Component, inject, OnInit } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ref, uploadBytesResumable, getDownloadURL, getStorage } from 'firebase/storage';
import { ServiceService } from '../services/service.service';

import JSZip from 'jszip';
import Swal from 'sweetalert2';

type BibliotecaVirtual = 'doaj' | 'arVix' | 'plox' | 'local';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatTooltipModule,
    MatTableModule,
    MatSnackBarModule
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  url: string = '';

  errorMessage: string = '';

  searchQuery: string = '';
  buscarArticulosResult: any;
  preprocesamientoResult: any;
  machineLearningResult: any;
  repositoriosSeleccionados: string[] = ['plos'];
  showAdvancedOptions = false;
  // loading = true;
  estado = false;
  searchDisabled: boolean = false;
  currentUser: any = null;
  isLoggedIn: boolean = false;

  htmlContent: string;

  checkboxes = {
    bibliotecasVirtuales: {
      doaj: true,
      arVix: false,
      plos: false,
      local: true,
    },
  };

  service1Completed: boolean = false;
  service2Completed: boolean = false;
  service3Completed: boolean = false;
  service4Completed: boolean = false;
  service5Completed: boolean = false;
  btnew: boolean = false;
  documentoDescargado: boolean = false;


  selectedBibliotecasVirtuales: string[] = [];

  // Nuevas propiedades para los desplegables
  cantidadDocumentos: number = 10;
  contenidoBusqueda: string = 'texto';
  maxPalabrasPorTema: number = 500;
  numDocumentos: number = 3;
  numTemas: number = 3;
  numKywords: number = 5;
  wt: number = 3;
  k: number = 3;

  authService = inject(AuthService);
  afAuth = inject(AngularFireAuth);
  httpClient = inject(HttpClient);

  //cargar html
  downloadURL$!: Observable<string>;
  uploadProgress$!: Observable<number>;
  private storage = getStorage();
  // Nuevas propiedades para la funcionalidad de subir archivos
  selectedFiles: File[] = [];
  uploadedFiles: { name: string; content: string }[] = [];
  uploadMessage: string = '';
  constructor(private service : ServiceService, private snackBar: MatSnackBar) { }

  documentos: string[] = []; // Lista para almacenar los títulos de los documentos

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.searchDisabled = false;
        this.authService.getUserData(user.uid).subscribe(data => {
          this.currentUser = {
            uid: user.uid,
            email: user.email,
            name: data?.name || '',
            institution: data?.institution || '',
            researchGroup: data?.researchGroup || '',
            researchLines: data?.researchLines || [],
            interestAreas: data?.interestAreas || [],
            apiKeyChatGPT: data?.apiKeyChatGPT || ''
          };
        });
      } else {
        this.isLoggedIn = false;
        this.searchDisabled = true;
      }
    });

    // Llamar a la API para listar documentos
    this.cargarDocumentos();
  }

  uploadFiles() {
      if (this.selectedFiles.length === 0) {
        console.log("No files selected");
        this.snackBar.open('¡Seleccione archivos para subir !', '', {
          duration: 3000, // Duración en milisegundos
          horizontalPosition: 'end', // Alineado a la derecha
          verticalPosition: 'top', // Alineado arriba
          panelClass: 'red'
        });
        
        return;
      }
    
      // Validar los tipos de archivo permitidos
      const allowedExtensions = ['pdf', 'bib'];
      const fileGroups: { [key: string]: string[] } = {};
    
      // Agrupar archivos por nombre sin extensión
      this.selectedFiles.forEach(file => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        const baseName = file.name.replace(/\.[^/.]+$/, ''); // Elimina la extensión
        if (allowedExtensions.includes(extension || '')) {
          if (!fileGroups[baseName]) {
            fileGroups[baseName] = [];
          }
          fileGroups[baseName].push(extension || '');
        }
      });
    
      // Validar que cada grupo tenga ambas extensiones
      const incompleteFiles = Object.entries(fileGroups)
        .filter(([_, extensions]) => !extensions.includes('pdf') || !extensions.includes('bib'))
        .map(([baseName]) => baseName);
    
      if (incompleteFiles.length > 0) {
        //this.uploadMessage = `Missing pair files: ${incompleteFiles.join(', ')}. Each file must have both .pdf and .bib versions.`;
        this.snackBar.open('¡Cada archivo debe tener versiones .pdf y .bib!', '', {
          duration: 3000, // Duración en milisegundos
          horizontalPosition: 'end', // Alineado a la derecha
          verticalPosition: 'top', // Alineado arriba
          panelClass: 'red'
        });
        console.log(this.uploadMessage);
        return;
      }
    
      // Crear FormData y subir los archivos
      const formData = new FormData();
      this.selectedFiles.forEach(file => {
        console.log("Adding file:", file.name);
        formData.append('files', file, file.name);
      });
    
      //this.uploadMessage = 'Uploading files...';
      console.log("Starting upload to server...");
    
      this.service.uploadFiles(this.selectedFiles).subscribe({
        next: (response) => {
          //this.uploadMessage = 'Files uploaded successfully!';
          this.snackBar.open('¡Archivos subidos exitosamente!', '', {
            duration: 3000, // Duración en milisegundos
            horizontalPosition: 'end', // Alineado a la derecha
            verticalPosition: 'top', // Alineado arriba
            panelClass: 'green'
          });
          console.log('Server response:', response);
        },
        error: (error) => {
          //this.uploadMessage = 'Failed to upload files.';
          this.snackBar.open('¡Error al cargar archivos!', '', {
            duration: 3000, // Duración en milisegundos
            horizontalPosition: 'end', // Alineado a la derecha
            verticalPosition: 'top', // Alineado arriba
            panelClass: 'red'
          });
          console.error('Error uploading files:', error);
        }
      }); 
  }

  onFileSelecteds(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }  

/*deleteAllFiles() {
  const confirmDelete = confirm("Estas Seguro de Borrar Todos los documentos del repositorio Local?");
  if (confirmDelete) {
    this.service.deleteAllFiles().subscribe({
      next: (response) => {
        alert(response.message);
        console.log("Archivos eliminados Correctamente", response);
      },
      error: (error) => {
        alert('No se pudieron eliminar archivos.');
        console.error('Error eliminando los archivos:', error);
      }
    });
  }
}*/

  deleteAllFiles() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Estas Seguro de Borrar Todos los documentos del repositorio Local?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',  // Azul
      cancelButtonColor: '#d33'       // Rojo
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Acción confirmada");
        this.service.deleteAllFiles().subscribe({
          next: (response) => {
            this.snackBar.open('¡Archivos eliminados!', '', {
              duration: 3000, // Duración en milisegundos
              horizontalPosition: 'end', // Alineado a la derecha
              verticalPosition: 'top', // Alineado arriba
              panelClass: 'green'
            });
            console.log("Archivos eliminados Correctamente", response);
          },
          error: (error) => {
            alert('No se pudieron eliminar archivos.');
            console.error('Error eliminando los archivos:', error);
          }
        });
      } else {
        console.log("Acción cancelada");
      }
    });
  }
  

// Método para cargar documentos cuando se presiona el botón
  cargarDocumentos() {
    this.service.listarDocumentos().subscribe({
      next: (response) => {
        this.documentos = response.titulos;
        console.log("Documentos cargados:", this.documentos);
      },
      error: (error) => {
        console.error('Error al obtener la lista de documentos:', error);
      }
    });
  }

  toggleAdvancedOptions() {
    this.showAdvancedOptions = !this.showAdvancedOptions;
  }

  async buscarArticulos() {
  
    const apiKey = this.currentUser.apiKeyChatGPT;
    console.log(apiKey)

    try {
      const response = await this.service.apikeyProve(apiKey).toPromise();
      console.log('Respuesta del servidor:', response);
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Please enter a valid API key');
      return; // Termina la ejecución si hay un error
    }


    if (!this.searchQuery.trim()) {
      alert('Por favor, llene el tema de búsqueda.');
      return;
    }

    this.searchDisabled = true; // Deshabilitar el input y los botones al iniciar la búsqueda
    this.showAdvancedOptions = false;

    this.selectedBibliotecasVirtuales = Object.keys(this.checkboxes.bibliotecasVirtuales)
      .filter((key) => this.checkboxes.bibliotecasVirtuales[key as BibliotecaVirtual]) as BibliotecaVirtual[];

    console.log(this.searchQuery);
    console.log(this.selectedBibliotecasVirtuales);
    console.log(this.cantidadDocumentos)
    this.estado = true;
    this.service.buscarArticulos(this.searchQuery, this.selectedBibliotecasVirtuales, this.cantidadDocumentos).subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        //this.loading = true;

        // Lógica de búsqueda de artículos
        this.service1Completed = true;
        this.preprocesarTexto();
      },
      error => {
        console.error('Error en la solicitud:', error);
        alert('Error');
        this.estado = false;
      }
    );
  }

  preprocesarTexto() {
    // Lógica de preprocesamiento de texto
    this.service.preprocesamiento(this.searchQuery, this.contenidoBusqueda).subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        //this.loading = true;
        this.service2Completed = true;
        this.machineLearning();
      },
      error => {
        console.error('Error en la solicitud:', error);
        alert('Error');
        this.estado = false;
      }
    );
  }

  machineLearning() {
    const apiKey = this.currentUser.apiKeyChatGPT;
    this.service.machineLearning(this.searchQuery,this.numTemas, this.wt, this.numDocumentos, this.k, apiKey).subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        //this.loading = true;
        this.service3Completed = true;
        this.generarDiagrama();
      },
      error => {
        console.error('Error en la solicitud:', error);
        alert('Error');
        this.estado = false;
      }
    );
  }

  generarDiagrama() {
    this.service.diagrama(this.searchQuery).subscribe(
      (response: string) => {
        this.htmlContent = response;
        this.createFileFromHtml(this.htmlContent);
      },
      (error) => {
        console.error('Error fetching HTML:', error);
        alert('Error');
        this.estado = false;
      }
    );
  }

  // Método para cargar el archivo HTML desde una ruta fija y subirlo a Firebase Storage
  createFileFromHtml(htmlContent: string){
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const file = new File([blob], 'archivo.html', { type: 'text/html' });
    this.generarPdf();
    //this.uploadFile(file);
  }

  async uploadFile(file: File): Promise<void> {
    const filePath = `archivos/${file.name}`;
    const fileRef = ref(this.storage, filePath);
    const uploadFile = uploadBytesResumable(fileRef, file);

    uploadFile.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Progreso de la carga:', progress);
      },
      (error) => {
        console.error('Error al cargar el archivo:', error);
      },
      async () => {
        console.log("El archivo se subió exitosamente!");
        this.url = await getDownloadURL(fileRef);
        console.log("URL del archivo: ", this.url);
        this.service4Completed = true;
        this.generarPdf()
      }
    );
  }

  generarPdf() {
    const lineasInvestigacion = this.currentUser.researchLines.join(', ');
    const areasInteres = this.currentUser.interestAreas.join(', ');
    const apiKey = this.currentUser.apiKeyChatGPT;

    this.service.generarTxt(this.searchQuery, lineasInvestigacion, areasInteres, this.maxPalabrasPorTema, this.numKywords, this.url, apiKey).subscribe(
        (txtBlob: Blob) => {
            const zip = new JSZip();
            zip.file('Document.tex', txtBlob);
            const imagenesFolder = zip.folder('Figures');

            // Función original para cargar imagen desde assets
            const agregarImagenDesdeAssets = (nombreArchivo: string, ruta: string) => {
                return fetch(ruta)
                    .then((response) => {
                        if (!response.ok) throw new Error(`No se pudo cargar la imagen ${nombreArchivo}`);
                        return response.blob();
                    })
                    .then((imagenBlob) => {
                        imagenesFolder?.file(nombreArchivo, imagenBlob);
                    })
                    .catch((error) => {
                        console.error(`Error cargando la imagen ${nombreArchivo}:`, error);
                        alert(`Error al incluir la imagen ${nombreArchivo} en el ZIP`);
                        this.estado = false;
                    });
            };

            // Promesa para obtener la imagen desde Django (lda_topic_graph_simplified.png)
            const obtenerImagenDesdeDjango = () => {
                return this.service.obtenerImagen().toPromise()
                    .then((imagenBlob: Blob) => {
                        imagenesFolder?.file('lda_topic_graph_simplified.png', imagenBlob);
                    })
                    .catch((error) => {
                        console.error('Error descargando la imagen lda_topic_graph_simplified.png:', error);
                        alert('Error al incluir la imagen lda_topic_graph_simplified.png en el ZIP');
                        this.estado = false;
                    });
            };

            // Combina la imagen original desde assets (method.png) y la imagen desde Django (lda_topic_graph_simplified.png)
            Promise.all([
                agregarImagenDesdeAssets('method.png', 'assets/method.png'),
                obtenerImagenDesdeDjango()
            ]).then(() => {
                zip.generateAsync({ type: 'blob' }).then((zipBlob) => {
                    const url = window.URL.createObjectURL(zipBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Documents.zip';
                    a.click();
                    window.URL.revokeObjectURL(url);
                    this.documentoDescargado = true;
                    this.service5Completed = true;
                    this.btnew = true;
                });
            });
        },
        (error) => {
            console.error('Error descargando el archivo .tex:', error);
            alert('Error al generar el archivo .tex');
            this.estado = false;
        }
    );
  }



  newSearch(){
    this.estado = false;
    this.service1Completed = false;
    this.service2Completed = false;
    this.service3Completed = false;
    this.service4Completed = false;
    this.service5Completed = false;
    this.searchDisabled = false;
    this.documentoDescargado = false;
    this.btnew = false;
  }

}
