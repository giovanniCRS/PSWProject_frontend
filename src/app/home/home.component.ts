import { Component, OnInit } from '@angular/core';
import { Categoria, Prodotto } from '../dataTypes';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { API } from '../constants';
import { SearchService } from '../services/search.service';
import { CarrelloService } from '../services/carrello.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  categoryList:undefined | Categoria[] //tutte le categorie
  previewProductList:undefined | Prodotto[] //tutti i prodotti

  constructor(private categoryService:CategoryService, private productSercive:ProductService, private searchService:SearchService, private carrelloService:CarrelloService){}

  //operazioni che avvengono a caricamento pagina
  ngOnInit(): void {

    //facciamo richiesta per caricare tutte le categorie
    this.categoryService.getAllCategories().subscribe((result)=>{
      if(result){this.categoryList=result}
    })
    
    //facciamo richiesta per caricare tutti i prodotti
    this.productSercive.getPages(API.nPage,API.nSize,API.sort).subscribe((result)=>{
      this.previewProductList=result
    })
  }

  setKeyword(key:String):void{
    this.searchService.setKeyword(key)
  }

  addProduct(prod:Prodotto):void{
    this.carrelloService.addProduct(prod)
  }

}
