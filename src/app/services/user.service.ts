import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AuthResponseDto, CarrelloDto, Utente } from '../dataTypes';
import { BehaviorSubject, Observable } from 'rxjs';
import { API } from '../constants';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    const token = localStorage.getItem('user-token');
    return new HttpHeaders({
      'Authorization': token ? 'Bearer ' + token : ''
    });
  }

  //invia una richiesta di Registrazione al be
  signUp(data:object):void {
    //pulizia dati precedenti in localstorage
    localStorage.clear();
    
    //richiesta
    let response = this.apiService.makeRequest("POST", API.auth + API.register, data);
    response.subscribe((res) => {

      //riceviamo dal be un AuthResponseDto
      let auth: AuthResponseDto = res as AuthResponseDto;

      //salviamo un oggetto Utente nel localStorage
      localStorage.setItem('user', JSON.stringify(auth.utente));

      //salviamo il Token per autorizzare le richieste
      localStorage.setItem('user-token', auth.jwt as string);

      localStorage.setItem('email', auth.utente.email);

      this.isUserLoggedIn.next(true);
      this.router.navigate(['user-home']);
    },
    error => {
      this.errorMessage = error.error;
    });
  }

  //invia una richiesta di Login al be
  login(data:object):void {
    //richiesta
    let response = this.apiService.makeRequest("POST", API.auth + API.login, data);
    response.subscribe((res) => {

      //riceviamo dal be un AuthResponseDto
      let auth: AuthResponseDto = res as AuthResponseDto;

      //check che chi si logga da questo punto sia un Utente
      auth.utente.authorities.forEach((elem) => {
        if(elem.authority.includes("USER")) {

          //caso positivo -> salviamo un oggetto Utente nel localStorage
          localStorage.setItem('user', JSON.stringify(auth.utente));

          //salviamo il Token per autorizzare le richieste
          localStorage.setItem('user-token', auth.jwt as string);

          localStorage.setItem('email', auth.utente.email);

          this.isUserLoggedIn.next(true);
          this.router.navigate(['user-home']);
        } else {
          //caso negativo -> stampa a schermo
          this.errorMessage = "Accedi alla tua pagina admin!";
        }
      });
      return;
    },
    error => {
      this.errorMessage = error.error;
    });
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
  getOrdini(email:String|null):Observable<CarrelloDto[]> {
    return this.apiService.makeRequest("GET", API.carts + API.byUser + "/" + email, null, this.getAuthHeaders());
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
