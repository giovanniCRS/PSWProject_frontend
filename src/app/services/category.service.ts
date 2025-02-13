import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Categoria } from '../dataTypes';
import { Observable } from 'rxjs';
import { API } from '../constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  headers = {'Authorization':'Bearer '+localStorage.getItem('admin-token')}; //costante che definisce l'header di autorizzazione delle richieste (SOLO ADMIN)

  constructor(private apiService:ApiService, private http:HttpClient) { 
    this.headers = {'Authorization':'Bearer '+localStorage.getItem('admin-token')};
  }

  //invia una richiesta per ricevere tutte le Categorie al be
  getAllCategories():Observable<Categoria[]>{
    return this.apiService.makeRequest("GET", API.categories+API.all)
  }

  //invia una richiesta per aggiungere una Categoria al be
  addCategory(category:Categoria):Observable<Categoria>{
    if(localStorage.getItem('admin-token')!=null)
      console.log(API.baseUrl+API.categories)
      return this.apiService.makeRequest("POST", API.categories, category, this.headers)
    return new Observable<Categoria>
  }

  //invia una richiesta per aggiornare una Categoria al be
  updateCategory(category:Categoria, lastUpdate:undefined|String):Observable<Categoria>{
    if(localStorage.getItem('admin-token')!=null)
      return this.apiService.makeRequest("PUT", API.categories+"/"+lastUpdate, category, this.headers)
    return new Observable<Categoria>
  }

  //invia una richiesta per rimuovere una Categoria al be
  removeCategory(nome:String):Observable<Categoria>{
    if(localStorage.getItem('admin-token')!=null)
      return this.apiService.makeRequest("DELETE", API.categories+"/"+nome, null, this.headers)
    return new Observable<Categoria>
  }
}
