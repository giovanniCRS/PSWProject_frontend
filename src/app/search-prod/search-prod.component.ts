import { Component, OnInit } from '@angular/core';
import { Categoria, Prodotto } from '../dataTypes';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { SearchService } from '../services/search.service';
import { PageEvent } from '@angular/material/paginator';
import { CarrelloService } from '../services/carrello.service';

@Component({
  selector: 'app-search-prod',
  templateUrl: './search-prod.component.html',
  styleUrls: ['./search-prod.component.css']
})
export class SearchProdComponent implements OnInit{

  categoryList!:Categoria[] //contiene tutte le categorie

  public productList!:Prodotto[] //contiene tutte i prodotti
  public pageSlice!:Prodotto[] //contiene una pagina di prodotti, definita dai parametri nel html

  currentPage=0 //pagina iniziale

  constructor(private categoryService:CategoryService, private productSercive:ProductService, private searchService:SearchService, private carrelloService:CarrelloService){}
  
  //operazioni che avvengono a caricamento pagina
  ngOnInit(): void {

    //facciamo richiesta per tutti i prodotti e dividiamoli in pagine
    this.searchService.search().subscribe((result)=>{
      this.productList=result
      this.pageSlice = this.productList?.slice(0,12);
    },
    error=>{ //i casi di errori sono attribuiti ad una ricerca sbagliata, quindi verrà caricata una vista vuota
      this.productList=[]
      this.pageSlice=[]
    })

    //facciamo richiesta per tutte le categorie
    this.categoryService.getAllCategories().subscribe((res)=>{
      this.categoryList=res
    })
  }

  //funzione del paginatore, seleziona una nuova porzione della lista prodotti da far visualizzare
  OnPageChange(event:PageEvent){
    this.currentPage=event.pageIndex
    const startIndex=event.pageIndex*event.pageSize
    let endIndex=startIndex+event.pageSize
    if( endIndex>this.productList.length )
      endIndex=this.productList.length
    this.pageSlice=this.productList.slice(startIndex,endIndex)
  }

  //funzione del paginatore che fa richiesta per la lista dei prodotti ogni volta che serve
  onFetchData(){
    this.searchService.search().subscribe((res)=>{
      this.productList=res
    })
  }

  //recupera dal searchService la lista dei prodotti e suddivide i prodotti da visualizzare
  setKeyword(key:String):void{
    this.searchService.setKeyword(key)
    this.searchService.search().subscribe((res)=>{
      this.productList=res
      this.pageSlice = this.productList?.slice(0,12);
    })
  }

  addProduct(prod:Prodotto):void{
    this.carrelloService.addProduct(prod)
  }

  updateQuantity(pos:number,num:number):void{
    this.carrelloService.updateQuantity(pos, num)
  }
}
