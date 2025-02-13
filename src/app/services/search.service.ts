import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Prodotto } from '../dataTypes';
import { API } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  keyword!: String   //rappresenta il nome della Categoria per cui vogliamo fare richiesta (se null ci si aspetta che la booleana isAll=true)
  isAll:boolean=true //ricerca di tutti i prodotti -> SI / NO

  constructor(private apiService:ApiService, private router:Router) { }

  //ci si aspetta che venga passato un nome di una Categoria, se 'all' la booleana diventa true
  setKeyword(key:String):void{
    if(key=='all')
      this.isAll=true
    else
    {
      this.isAll=false
      this.keyword=key
    }
  }

  //fa una richiesta al be per ricevere i Prodotti secondo il meccanismo scelto in base alla keyword
  search():Observable<Prodotto[]>{
    if(this.isAll)
      return this.apiService.makeRequest("GET", API.products+API.all)
    else
      return this.apiService.makeRequest("GET", API.products+API.byCategory+"/"+this.keyword)
  }
}
