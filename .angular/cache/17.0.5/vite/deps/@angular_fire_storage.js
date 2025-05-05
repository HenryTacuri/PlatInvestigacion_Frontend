import {
  FbsBlob,
  Location,
  StorageError,
  StorageErrorCode,
  StringFormat,
  TaskEvent,
  TaskState,
  UploadTask,
  _getChild,
  connectStorageEmulator,
  dataFromString,
  deleteObject,
  getBlob,
  getBytes,
  getDownloadURL,
  getMetadata,
  getStorage,
  getStream,
  invalidArgument,
  invalidRootOperation,
  list,
  listAll,
  ref,
  updateMetadata,
  uploadBytes,
  uploadBytesResumable,
  uploadString
} from "./chunk-423TBHNG.js";
import {
  applyActionCode,
  beforeAuthStateChanged,
  checkActionCode,
  confirmPasswordReset,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  deleteUser,
  fetchSignInMethodsForEmail,
  getAdditionalUserInfo,
  getAuth,
  getIdToken,
  getIdTokenResult,
  getMultiFactorResolver,
  getRedirectResult,
  initializeAuth,
  initializeRecaptchaConfig,
  isSignInWithEmailLink,
  linkWithCredential,
  linkWithPhoneNumber,
  linkWithPopup,
  linkWithRedirect,
  multiFactor,
  onAuthStateChanged,
  onIdTokenChanged,
  parseActionCodeURL,
  reauthenticateWithCredential,
  reauthenticateWithPhoneNumber,
  reauthenticateWithPopup,
  reauthenticateWithRedirect,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  setPersistence,
  signInAnonymously,
  signInWithCredential,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signInWithPhoneNumber,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  unlink,
  updateCurrentUser,
  updateEmail,
  updatePassword,
  updatePhoneNumber,
  updateProfile,
  useDeviceLanguage,
  validatePassword,
  verifyBeforeUpdateEmail,
  verifyPasswordResetCode
} from "./chunk-OONDMBWN.js";
import {
  FirebaseApp,
  FirebaseApps
} from "./chunk-6TMFZGDC.js";
import {
  VERSION,
  ɵAngularFireSchedulers,
  ɵAppCheckInstances,
  ɵgetAllInstancesOf,
  ɵgetDefaultInstanceOf,
  ɵzoneWrap
} from "./chunk-MI724A4Z.js";
import {
  registerVersion
} from "./chunk-ASNGFGE3.js";
import {
  InjectionToken,
  Injector,
  NgModule,
  NgZone,
  Optional,
  setClassMetadata,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-TVAD33G6.js";
import {
  Observable,
  concatMap,
  distinct,
  from,
  map,
  of,
  switchMap,
  timer
} from "./chunk-SQYEX2RW.js";
import "./chunk-LHRTKJE6.js";
import "./chunk-JR5Z4LEE.js";

// node_modules/rxfire/auth/index.esm.js
function authState(auth) {
  return new Observable(function(subscriber) {
    var unsubscribe = onAuthStateChanged(auth, subscriber.next.bind(subscriber), subscriber.error.bind(subscriber), subscriber.complete.bind(subscriber));
    return { unsubscribe };
  });
}
function user(auth) {
  return new Observable(function(subscriber) {
    var unsubscribe = onIdTokenChanged(auth, subscriber.next.bind(subscriber), subscriber.error.bind(subscriber), subscriber.complete.bind(subscriber));
    return { unsubscribe };
  });
}
function idToken(auth) {
  return user(auth).pipe(switchMap(function(user3) {
    return user3 ? from(getIdToken(user3)) : of(null);
  }));
}

// node_modules/@angular/fire/fesm2022/angular-fire-auth.mjs
var AUTH_PROVIDER_NAME = "auth";
var Auth = class {
  constructor(auth) {
    return auth;
  }
};
var AuthInstances = class {
  constructor() {
    return ɵgetAllInstancesOf(AUTH_PROVIDER_NAME);
  }
};
var authInstance$ = timer(0, 300).pipe(concatMap(() => from(ɵgetAllInstancesOf(AUTH_PROVIDER_NAME))), distinct());
var PROVIDED_AUTH_INSTANCES = new InjectionToken("angularfire2.auth-instances");
function defaultAuthInstanceFactory(provided, defaultApp) {
  const defaultAuth = ɵgetDefaultInstanceOf(AUTH_PROVIDER_NAME, provided, defaultApp);
  return defaultAuth && new Auth(defaultAuth);
}
var AUTH_INSTANCES_PROVIDER = {
  provide: AuthInstances,
  deps: [[new Optional(), PROVIDED_AUTH_INSTANCES]]
};
var DEFAULT_AUTH_INSTANCE_PROVIDER = {
  provide: Auth,
  useFactory: defaultAuthInstanceFactory,
  deps: [[new Optional(), PROVIDED_AUTH_INSTANCES], FirebaseApp]
};
var AuthModule = class _AuthModule {
  constructor() {
    registerVersion("angularfire", VERSION.full, "auth");
  }
  static ɵfac = function AuthModule_Factory(t) {
    return new (t || _AuthModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _AuthModule
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [DEFAULT_AUTH_INSTANCE_PROVIDER, AUTH_INSTANCES_PROVIDER]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthModule, [{
    type: NgModule,
    args: [{
      providers: [DEFAULT_AUTH_INSTANCE_PROVIDER, AUTH_INSTANCES_PROVIDER]
    }]
  }], () => [], null);
})();
var authState2 = ɵzoneWrap(authState, true);
var user2 = ɵzoneWrap(user, true);
var idToken2 = ɵzoneWrap(idToken, true);
var applyActionCode2 = ɵzoneWrap(applyActionCode, true);
var beforeAuthStateChanged2 = ɵzoneWrap(beforeAuthStateChanged, true);
var checkActionCode2 = ɵzoneWrap(checkActionCode, true);
var confirmPasswordReset2 = ɵzoneWrap(confirmPasswordReset, true);
var connectAuthEmulator2 = ɵzoneWrap(connectAuthEmulator, true);
var createUserWithEmailAndPassword2 = ɵzoneWrap(createUserWithEmailAndPassword, true);
var deleteUser2 = ɵzoneWrap(deleteUser, true);
var fetchSignInMethodsForEmail2 = ɵzoneWrap(fetchSignInMethodsForEmail, true);
var getAdditionalUserInfo2 = ɵzoneWrap(getAdditionalUserInfo, true);
var getAuth2 = ɵzoneWrap(getAuth, true);
var getIdToken2 = ɵzoneWrap(getIdToken, true);
var getIdTokenResult2 = ɵzoneWrap(getIdTokenResult, true);
var getMultiFactorResolver2 = ɵzoneWrap(getMultiFactorResolver, true);
var getRedirectResult2 = ɵzoneWrap(getRedirectResult, true);
var initializeAuth2 = ɵzoneWrap(initializeAuth, true);
var initializeRecaptchaConfig2 = ɵzoneWrap(initializeRecaptchaConfig, true);
var isSignInWithEmailLink2 = ɵzoneWrap(isSignInWithEmailLink, true);
var linkWithCredential2 = ɵzoneWrap(linkWithCredential, true);
var linkWithPhoneNumber2 = ɵzoneWrap(linkWithPhoneNumber, true);
var linkWithPopup2 = ɵzoneWrap(linkWithPopup, true);
var linkWithRedirect2 = ɵzoneWrap(linkWithRedirect, true);
var multiFactor2 = ɵzoneWrap(multiFactor, true);
var onAuthStateChanged2 = ɵzoneWrap(onAuthStateChanged, true);
var onIdTokenChanged2 = ɵzoneWrap(onIdTokenChanged, true);
var parseActionCodeURL2 = ɵzoneWrap(parseActionCodeURL, true);
var reauthenticateWithCredential2 = ɵzoneWrap(reauthenticateWithCredential, true);
var reauthenticateWithPhoneNumber2 = ɵzoneWrap(reauthenticateWithPhoneNumber, true);
var reauthenticateWithPopup2 = ɵzoneWrap(reauthenticateWithPopup, true);
var reauthenticateWithRedirect2 = ɵzoneWrap(reauthenticateWithRedirect, true);
var reload2 = ɵzoneWrap(reload, true);
var sendEmailVerification2 = ɵzoneWrap(sendEmailVerification, true);
var sendPasswordResetEmail2 = ɵzoneWrap(sendPasswordResetEmail, true);
var sendSignInLinkToEmail2 = ɵzoneWrap(sendSignInLinkToEmail, true);
var setPersistence2 = ɵzoneWrap(setPersistence, true);
var signInAnonymously2 = ɵzoneWrap(signInAnonymously, true);
var signInWithCredential2 = ɵzoneWrap(signInWithCredential, true);
var signInWithCustomToken2 = ɵzoneWrap(signInWithCustomToken, true);
var signInWithEmailAndPassword2 = ɵzoneWrap(signInWithEmailAndPassword, true);
var signInWithEmailLink2 = ɵzoneWrap(signInWithEmailLink, true);
var signInWithPhoneNumber2 = ɵzoneWrap(signInWithPhoneNumber, true);
var signInWithPopup2 = ɵzoneWrap(signInWithPopup, true);
var signInWithRedirect2 = ɵzoneWrap(signInWithRedirect, true);
var signOut2 = ɵzoneWrap(signOut, true);
var unlink2 = ɵzoneWrap(unlink, true);
var updateCurrentUser2 = ɵzoneWrap(updateCurrentUser, true);
var updateEmail2 = ɵzoneWrap(updateEmail, true);
var updatePassword2 = ɵzoneWrap(updatePassword, true);
var updatePhoneNumber2 = ɵzoneWrap(updatePhoneNumber, true);
var updateProfile2 = ɵzoneWrap(updateProfile, true);
var useDeviceLanguage2 = ɵzoneWrap(useDeviceLanguage, true);
var validatePassword2 = ɵzoneWrap(validatePassword, true);
var verifyBeforeUpdateEmail2 = ɵzoneWrap(verifyBeforeUpdateEmail, true);
var verifyPasswordResetCode2 = ɵzoneWrap(verifyPasswordResetCode, true);

// node_modules/rxfire/storage/index.esm.js
function fromTask(task) {
  return new Observable(function(subscriber) {
    var lastSnapshot = null;
    var complete = false;
    var hasError = false;
    var error = null;
    var emit = function(snapshot) {
      lastSnapshot = snapshot;
      schedule();
    };
    var id = null;
    var schedule = function() {
      if (!id) {
        id = setTimeout(function() {
          id = null;
          if (lastSnapshot)
            subscriber.next(lastSnapshot);
          if (complete)
            subscriber.complete();
          if (hasError)
            subscriber.error(error);
        });
      }
    };
    subscriber.add(function() {
      if (id)
        clearTimeout(id);
    });
    emit(task.snapshot);
    subscriber.add(task.on("state_changed", emit));
    subscriber.add(from(task).subscribe({
      next: emit,
      error: function(err) {
        hasError = true;
        error = err;
        schedule();
      },
      complete: function() {
        complete = true;
        schedule();
      }
    }));
  });
}
function percentage(task) {
  return fromTask(task).pipe(map(function(snapshot) {
    return {
      progress: snapshot.bytesTransferred / snapshot.totalBytes * 100,
      snapshot
    };
  }));
}

// node_modules/@angular/fire/fesm2022/angular-fire-storage.mjs
var Storage = class {
  constructor(auth) {
    return auth;
  }
};
var STORAGE_PROVIDER_NAME = "storage";
var StorageInstances = class {
  constructor() {
    return ɵgetAllInstancesOf(STORAGE_PROVIDER_NAME);
  }
};
var storageInstance$ = timer(0, 300).pipe(concatMap(() => from(ɵgetAllInstancesOf(STORAGE_PROVIDER_NAME))), distinct());
var PROVIDED_STORAGE_INSTANCES = new InjectionToken("angularfire2.storage-instances");
function defaultStorageInstanceFactory(provided, defaultApp) {
  const defaultStorage = ɵgetDefaultInstanceOf(STORAGE_PROVIDER_NAME, provided, defaultApp);
  return defaultStorage && new Storage(defaultStorage);
}
function storageInstanceFactory(fn) {
  return (zone, injector) => {
    const storage = zone.runOutsideAngular(() => fn(injector));
    return new Storage(storage);
  };
}
var STORAGE_INSTANCES_PROVIDER = {
  provide: StorageInstances,
  deps: [[new Optional(), PROVIDED_STORAGE_INSTANCES]]
};
var DEFAULT_STORAGE_INSTANCE_PROVIDER = {
  provide: Storage,
  useFactory: defaultStorageInstanceFactory,
  deps: [[new Optional(), PROVIDED_STORAGE_INSTANCES], FirebaseApp]
};
var StorageModule = class _StorageModule {
  constructor() {
    registerVersion("angularfire", VERSION.full, "gcs");
  }
  static ɵfac = function StorageModule_Factory(t) {
    return new (t || _StorageModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _StorageModule
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [DEFAULT_STORAGE_INSTANCE_PROVIDER, STORAGE_INSTANCES_PROVIDER]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StorageModule, [{
    type: NgModule,
    args: [{
      providers: [DEFAULT_STORAGE_INSTANCE_PROVIDER, STORAGE_INSTANCES_PROVIDER]
    }]
  }], () => [], null);
})();
function provideStorage(fn, ...deps) {
  return {
    ngModule: StorageModule,
    providers: [{
      provide: PROVIDED_STORAGE_INSTANCES,
      useFactory: storageInstanceFactory(fn),
      multi: true,
      deps: [
        NgZone,
        Injector,
        ɵAngularFireSchedulers,
        FirebaseApps,
        // Defensively load Auth first, if provided
        [new Optional(), AuthInstances],
        [new Optional(), ɵAppCheckInstances],
        ...deps
      ]
    }]
  };
}
var fromTask2 = ɵzoneWrap(fromTask, true);
var percentage2 = ɵzoneWrap(percentage, true);
var connectStorageEmulator2 = ɵzoneWrap(connectStorageEmulator, true);
var deleteObject2 = ɵzoneWrap(deleteObject, true);
var getBlob2 = ɵzoneWrap(getBlob, true);
var getBytes2 = ɵzoneWrap(getBytes, true);
var getDownloadURL2 = ɵzoneWrap(getDownloadURL, true);
var getMetadata2 = ɵzoneWrap(getMetadata, true);
var getStorage2 = ɵzoneWrap(getStorage, true);
var getStream2 = ɵzoneWrap(getStream, true);
var list2 = ɵzoneWrap(list, true);
var listAll2 = ɵzoneWrap(listAll, true);
var ref2 = ɵzoneWrap(ref, true);
var updateMetadata2 = ɵzoneWrap(updateMetadata, true);
var uploadBytes2 = ɵzoneWrap(uploadBytes, true);
var uploadBytesResumable2 = ɵzoneWrap(uploadBytesResumable, true);
var uploadString2 = ɵzoneWrap(uploadString, true);
export {
  Storage,
  StorageError,
  StorageErrorCode,
  StorageInstances,
  StorageModule,
  StringFormat,
  FbsBlob as _FbsBlob,
  Location as _Location,
  TaskEvent as _TaskEvent,
  TaskState as _TaskState,
  UploadTask as _UploadTask,
  dataFromString as _dataFromString,
  _getChild,
  invalidArgument as _invalidArgument,
  invalidRootOperation as _invalidRootOperation,
  connectStorageEmulator2 as connectStorageEmulator,
  deleteObject2 as deleteObject,
  fromTask2 as fromTask,
  getBlob2 as getBlob,
  getBytes2 as getBytes,
  getDownloadURL2 as getDownloadURL,
  getMetadata2 as getMetadata,
  getStorage2 as getStorage,
  getStream2 as getStream,
  list2 as list,
  listAll2 as listAll,
  percentage2 as percentage,
  provideStorage,
  ref2 as ref,
  storageInstance$,
  updateMetadata2 as updateMetadata,
  uploadBytes2 as uploadBytes,
  uploadBytesResumable2 as uploadBytesResumable,
  uploadString2 as uploadString
};
/*! Bundled license information:

rxfire/auth/index.esm.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=@angular_fire_storage.js.map
