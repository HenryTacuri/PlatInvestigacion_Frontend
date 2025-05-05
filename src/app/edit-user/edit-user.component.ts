import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ServiceService } from '../services/service.service';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatSnackBarModule
    ],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit{

  
  authService = inject(AuthService);
  afAuth = inject(AngularFireAuth);

  apiKeyValid: boolean = false;
  modifiedFieldApiKey: boolean = false;

  auxValidateApiKey: boolean = false;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    institution: new FormControl('', [Validators.required, Validators.minLength(3)]),
    researchGroup: new FormControl('', [Validators.required, Validators.minLength(3)]),
    researchLines: new FormControl(''),
    interestAreas: new FormControl(''),
    apiKeyChatGPT: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  currentUserData: any = {
    email: '',
    displayName: '',
    institution: '',
    researchGroup: '',
    researchLines: [],
    interestAreas: [],
    apiKeyChatGPT: ''
  };

  apikey: ''

  ngOnInit(): void {
    this.form.get('apiKeyChatGPT')?.valueChanges.subscribe(() => {
      this.apiKeyValid = false;
    });
  }

  constructor(private service : ServiceService, private snackBar: MatSnackBar) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.form.patchValue({
          email: user.email,
          name: user.displayName
        });
        this.authService.getUserData(user.uid).subscribe(data => {
          if (data) {
            this.form.patchValue({
              name: data.name || '',
              institution: data.institution || '',
              researchGroup: data.researchGroup || '',
              researchLines: data.researchLines ? data.researchLines.join(', ') : '',
              interestAreas: data.interestAreas ? data.interestAreas.join(', ') : '',
              apiKeyChatGPT: data.apiKeyChatGPT || ''
            });
            this.currentUserData = {
              email: user.email,
              displayName: data.name || '',
              institution: data.institution || '',
              researchGroup: data.researchGroup || '',
              researchLines: data.researchLines || [],
              interestAreas: data.interestAreas || [],
              apiKeyChatGPT: data.apiKeyChatGPT || ''
            };
          }
        });
      }
    });
  }

  async submit() {
    if (this.form.valid) {
      const currentUser = await this.afAuth.currentUser;
      if (currentUser) {
        try {
          await this.authService.updateUser({
            name: this.form.value.name,
            institution: this.form.value.institution,
            researchGroup: this.form.value.researchGroup,
            researchLines: this.form.value.researchLines.split(',').map(line => line.trim()),
            interestAreas: this.form.value.interestAreas.split(',').map(area => area.trim()),
            apiKeyChatGPT: this.form.value.apiKeyChatGPT
          });
          this.snackBar.open('¡Usuario actualizado correctamente!', '', {
            duration: 3000, // Duración en milisegundos
            horizontalPosition: 'end', // Alineado a la derecha
            verticalPosition: 'top', // Alineado arriba
            panelClass: 'green'
          });

          // Actualizar currentUserData después de la actualización
          this.currentUserData.displayName = this.form.value.name;
          this.currentUserData.institution = this.form.value.institution;
          this.currentUserData.researchGroup = this.form.value.researchGroup;
          this.currentUserData.researchLines = this.form.value.researchLines.split(',').map(line => line.trim());
          this.currentUserData.interestAreas = this.form.value.interestAreas.split(',').map(area => area.trim());
          this.currentUserData.apiKeyChatGPT = this.form.value.apiKeyChatGPT;
        } catch (error) {
          console.error('Error updating user:', error);
          this.snackBar.open('¡Error al actualizar el usuario!', '', {
            duration: 3000, // Duración en milisegundos
            horizontalPosition: 'end', // Alineado a la derecha
            verticalPosition: 'top', // Alineado arriba
            panelClass: 'red'
          });
        }
      } else {
        console.error('No user is currently logged in.');
        this.snackBar.open('¡No hoy usuario logged!', '', {
          duration: 3000, // Duración en milisegundos
          horizontalPosition: 'end', // Alineado a la derecha
          verticalPosition: 'top', // Alineado arriba
          panelClass: 'red'
        });
      }
    } else {
      this.snackBar.open('¡Formulario no valido!', '', {
        duration: 3000, // Duración en milisegundos
        horizontalPosition: 'end', // Alineado a la derecha
        verticalPosition: 'top', // Alineado arriba
        panelClass: 'red'
      });
    }
  }

  proveApiKey() {
    // Obtiene el valor de apiKeyChatGPT desde el FormGroup
    const apiKey = this.form.get('apiKeyChatGPT')?.value;
    console.log(apiKey)
  
    // Verifica si hay una API key válida
    if (!apiKey) {
      this.snackBar.open('¡Ingrese una ApiKey!', '', {
        duration: 3000, // Duración en milisegundos
        horizontalPosition: 'end', // Alineado a la derecha
        verticalPosition: 'top', // Alineado arriba
        panelClass: 'red'
      });
      return;
    }
  
    console.log(apiKey);  // Verifica que el valor se obtenga correctamente
    

    this.service.apikeyProve(apiKey).subscribe(
      (response) => {
        this.apiKeyValid = true;

        this.form.get('apiKeyChatGPT')?.markAsPristine();
        
        console.log('Respuesta del servidor:', response);
        this.snackBar.open('¡Apikey Correcta!', '', {
          duration: 3000, // Duración en milisegundos
          horizontalPosition: 'end', // Alineado a la derecha
          verticalPosition: 'top', // Alineado arriba
          panelClass: 'green'
        });
      },
      (error) => {
        this.apiKeyValid = false;
        console.error('Error en la solicitud:', error);
        this.snackBar.open('¡Apikey Incorrecta!', '', {
          duration: 3000, // Duración en milisegundos
          horizontalPosition: 'end', // Alineado a la derecha
          verticalPosition: 'top', // Alineado arriba
          panelClass: 'red'
        });
        //this.form.get('apiKeyChatGPT')?.setValue('');
      }
    );
  }

  public isValidField(field: string): boolean | null {
    return this.form.controls[field].errors && this.form.controls[field].touched;
  }

  campoModificado(): boolean {
    const control = this.form.get('apiKeyChatGPT');
  
    if (control?.dirty && !control?.pristine) {
      // El campo fue modificado después de validar
      this.apiKeyValid = false;
      return false;
    }
  
    // Solo permitir si fue validado correctamente
    return this.apiKeyValid;
  }
}


