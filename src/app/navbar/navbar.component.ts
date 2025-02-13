import { Component } from '@angular/core';
import { CarrelloService } from '../services/carrello.service';
import { SearchService } from '../services/search.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  searchBarForm:FormGroup; //form della barra di ricerca

  constructor(private carrelloService:CarrelloService, private searchService:SearchService, private formBuilder:FormBuilder){
    this.searchBarForm=this.formBuilder.group({
      keyword:['']
    })
  }

  //serve per far apparire / scomparire l'elemento Html relativo al Carrello
  togglePopup(){
    document.getElementById("cart1")?.classList.toggle("active")
  }

  //serve a settare il numero visualizzato sopra l'icona del Carrello nel Html
  getTotProd():number{
    return this.carrelloService.getTotProd()
  }

  setKeyword():void{
    if(this.searchBarForm.value.keyword=="")
      this.searchService.setKeyword("all")
    else
      this.searchService.setKeyword(this.searchBarForm.value.keyword)
  }
}
