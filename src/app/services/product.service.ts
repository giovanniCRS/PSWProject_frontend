import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Prodotto } from '../dataTypes';
import { Observable, throwError } from 'rxjs';
import { API } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  headers = {'Authorization':'Bearer '+localStorage.getItem('admin-token')}; //costante che definisce l'header di autorizzazione delle richieste (SOLO ADMIN)

  constructor(private apiService:ApiService) { 
    this.headers = {'Authorization':'Bearer '+localStorage.getItem('admin-token')};
  }

  //invia una richiesta per ricevere tutti i Prodotti al be
  getAllProducts():Observable<Prodotto[]>{
    return this.apiService.makeRequest("GET", API.products+API.all)
  }

  //invia una richiesta per ricevere una pagina di Prodotti al be
  getPages(nPage:String, nSize:String, sort:String):Observable<Prodotto[]>{
    return this.apiService.makeRequest("GET", API.products+API.page+nPage+nSize+sort)
  }

  //invia una richiesta per aggiungere un Prodotto al be
  addProduct(product:Prodotto):Observable<any> {
    if(localStorage.getItem('admin-token')!=null) {
      const currentHeaders = {'Authorization':'Bearer '+localStorage.getItem('admin-token')};
      return this.apiService.makeRequest("POST", API.products+API.add, product, currentHeaders);
    }
    return throwError(() => new Error("Admin token non presente. Operazione non consentita."));
  }

  //invia una richiesta per aggiornare un Prodotto al be
  updateProduct(product:Prodotto, lastUpdate:undefined|String):Observable<any> {
    if(localStorage.getItem('admin-token')!=null) {
      const currentHeaders = {'Authorization':'Bearer '+localStorage.getItem('admin-token')};
      return this.apiService.makeRequest("PUT", API.products+"/"+lastUpdate, product, currentHeaders);
    }
    return throwError(() => new Error("Admin token non presente. Operazione non consentita."));
  }

  //invia una richiesta per rimuovere un Prodotto al be
  removeProduct(ean:String):Observable<any> {
    if(localStorage.getItem('admin-token')!=null) {
      const currentHeaders = {'Authorization':'Bearer '+localStorage.getItem('admin-token')};
      return this.apiService.makeRequest("DELETE", API.products+"/"+ean, null, currentHeaders);
    }
    return throwError(() => new Error("Admin token non presente. Operazione non consentita."));
  }
}
