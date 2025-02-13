import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ApiService { //traduce le richieste dagli altri Services e le inoltra a un HttpClient (che effettua la vera e propria richieste al be)

  constructor(private http:HttpClient) { }

  makeRequest(type:string, url:string, body?:any, params?:any): Observable<any>{
    let baseUrl=API.baseUrl
    url=baseUrl+url //serve per aggiungere il resto del percorso (es. http://localhost:8081 + /users/add)

    let options={}

    //se ci sono parametri -> vogliamo settare degli headers
    if(params){
      let httpHeaders=new HttpHeaders()
      Object.keys(params).forEach((key)=>{
        httpHeaders=httpHeaders.append(key,params[key])
      })
      options={headers:httpHeaders}
    }

    //se il body è presente differenziamo il tipo di richiesta Http
    if(body){

      if(type.toLocaleLowerCase()=='put')
        return this.http.put(url,body,options);

      else if(type.toLocaleLowerCase()=='post')
        return this.http.post(url,body,options);
    }

    //altrimenti sarà una delle seguenti
    if(type.toLocaleLowerCase()=='delete')
      return this.http.delete(url,options);

    return this.http.get(url,options);
  }
}
