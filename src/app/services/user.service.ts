import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AuthResponseDto, CarrelloDto, Utente } from '../dataTypes';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { API } from '../constants';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  isUserLoggedIn = new BehaviorSubject<boolean>(false); //verifica che l'Utente sia loggato (per validare alcune operazioni)
  errorMessage!:String; //messaggio di errore

  constructor(private apiService:ApiService, private router:Router, private httpClient:HttpClient) {
    if(localStorage.getItem('user')) {
      this.isUserLoggedIn.next(true);
    }
  }

  // Metodo per ottenere gli headers di autenticazione dinamicamente
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('user-token'); // Sostituisci con la tua logica
    if (!token || token==null) {
      throw new Error('Token non disponibile');
    }
    return new HttpHeaders({
      Authorization : 'Bearer ${token}'
    });
  }

  headers = {'Authorization':'Bearer '+localStorage.getItem('user-token')};

  //invia una richiesta di Registrazione al be
  signUp(data:object): Observable<AuthResponseDto> {
    localStorage.clear();
    
    return this.apiService.makeRequest("POST", API.auth + API.register, data).pipe(
      tap((res: AuthResponseDto) => {
        localStorage.setItem('user', JSON.stringify(res.utente));
        localStorage.setItem('user-token', res.jwt as string);
        localStorage.setItem('email', res.utente.email);
        this.isUserLoggedIn.next(true);
        this.router.navigate(['user-home']);
      }),
      catchError((error) => {
        this.errorMessage = error.error;
        return throwError(() => error);
      })
    );
  }
  

  //invia una richiesta di Login al be
  login(data:object): Observable<AuthResponseDto> {
    return this.apiService.makeRequest("POST", API.auth + API.login, data).pipe(
      tap((res: AuthResponseDto) => {
        res.utente.authorities.forEach((elem) => {
          if(elem.authority.includes("USER")) {
            localStorage.setItem('user', JSON.stringify(res.utente));
            localStorage.setItem('user-token', res.jwt as string);
            localStorage.setItem('email', res.utente.email);
            this.isUserLoggedIn.next(true);
            this.router.navigate(['user-home']);
          } else {
            this.errorMessage = "Accedi alla tua pagina admin!";
          }
        });
      }),
      catchError((error) => {
        this.errorMessage = error.error;
        return throwError(() => error);
      })
    );
  }
  

  //operazioni nel ricarimento della pagina
  reloadUser():void {
    //se Utente presente nel localStorage, esegue le operazioni
    if(localStorage.getItem('user')) {
      this.isUserLoggedIn.next(true);
      this.router.navigate(['user-home']);
    }
  }

  //elimina traccia dei dati Utente nel localStorage
  signOut():void {
    localStorage.removeItem('user');
    this.isUserLoggedIn.next(false);
    localStorage.removeItem('email');
    localStorage.removeItem('user-token');
    localStorage.removeItem('carrello');
    this.router.navigate(['']);
  }
/*
  signOut(): void {
    this.httpClient.post('http://localhost:8080/api/auth/logout', {}, { responseType: 'text' })
      .subscribe(() => {
        localStorage.clear();  // Pulisce tutto, incluso il carrello
        this.isUserLoggedIn.next(false);
        this.router.navigate(['']).then(() => {
          window.location.reload();  // Forza un refresh per eliminare tutti i dati in memoria
        });
      }, error => {
        console.error("Errore nel logout:", error);
      });
  }
*/
  //fa richiesta al be per ricevere un Utente a partire dalla mail
  getByEmail(email:String|null):Observable<Utente> {
    return this.apiService.makeRequest("GET", API.users + API.byEmail + "/" + email, null, this.getAuthHeaders());
  }

  //fa richiesta al be per ricevere lista Ordini di un Utente a partire dalla mail
  getOrdini(email: string | null): Observable<CarrelloDto[]> {
    if (!email) {
      return throwError(() => new Error('Email non valida'));
    }
    
    const headers = this.headers
    
    return this.apiService
      .makeRequest("GET", API.carts + API.byUser + "/" + email, null, headers)
      .pipe(
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  //fa richiesta al be per aggiornare un Utente a partire dalla mail
  updateUser(email:String|undefined, update:Utente):Observable<Utente> {
    return this.apiService.makeRequest("PUT", API.users + "/" + email, update, this.getAuthHeaders());
  }

  //fa richiesta al be per eliminare un Utente a partire dalla mail
  deleteUser(email:String|null):Observable<Utente> {
    return this.apiService.makeRequest("DELETE", API.users + "/" + email, null, this.getAuthHeaders());
  }

}
