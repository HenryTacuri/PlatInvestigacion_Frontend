import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAaEVumiZ6JRH7YbKRsYz8Pl4zLRprWhZ4",
  authDomain: "plataforma-investigacion.firebaseapp.com",
  projectId: "plataforma-investigacion",
  storageBucket: "plataforma-investigacion.firebasestorage.app",
  messagingSenderId: "596259855992",
  appId: "1:596259855992:web:0a24b79a286b127806978d"
};

// Configuración de la aplicación
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    importProvidersFrom(
      HttpClientModule,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFirestoreModule,
      AngularFireAuthModule,
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideStorage(() => getStorage())
    ),
    provideAnimationsAsync()
  ]
};
