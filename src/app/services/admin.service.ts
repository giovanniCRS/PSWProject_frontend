import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { API } from '../constants';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthResponseDto } from '../dataTypes';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  isAdminLoggedIn = new BehaviorSubject<boolean>(false); //verifica che l'Admin sia loggato (per validare alcune operazioni)

  errorMessage!:String //messaggio di errore

  constructor(private apiService:ApiService, private router:Router) { }

  //invia una richiesta di Login al be
  login(data:object):void{

    //richiesta
    let response=this.apiService.makeRequest("POST", API.auth+API.login, data)
    response.subscribe((res)=>{

      //riceviamo dal be un AuthResponseDto
      let auth:AuthResponseDto = res as AuthResponseDto

      //check che chi si logga da questo punto sia un Admin
      auth.utente.authorities.forEach((elem)=>{
        if(elem.authority.includes("ADMIN"))
        {
          //caso positivo -> salviamo un oggetto Utente nel localStorage
          localStorage.setItem('admin',JSON.stringify(auth.utente))

          //salviamo il Token per autorizzare le richieste
          localStorage.setItem('admin-token',auth.jwt as string)

          this.isAdminLoggedIn.next(true)
          this.router.navigate(['admin-home']);
        }
        else{
          //caso negativo -> stampa a schermo
          this.errorMessage = "Accesso negato!"
        }
      })
      return
    },
    error=>{
      this.errorMessage = error.error
    })
  }

  //operazioni nel ricarimento della pagina
  reloadAdmin():void{

    //se Admin presente nel localStorage, esegue le operazioni
    if(localStorage.getItem('admin')){
      this.isAdminLoggedIn.next(true)
      this.router.navigate(['admin-home']);
    }
  }

  //elimina traccia dei dati Admin nel localStorage
  signOut():void{
    localStorage.removeItem('admin')
    localStorage.removeItem('admin-token')
    this.router.navigate([''])
  }
}
