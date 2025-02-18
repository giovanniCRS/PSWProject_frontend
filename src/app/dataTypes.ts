export interface Categoria{
    idCategoria:number,
    nome:string
}

export interface Prodotto{
    idProdotto:number,
    ean:string,
    quantitaInMagazzino:number,
    prezzo:number,
    nome:string,
    marca:string,
    categoria:Categoria,
    versione?:number
}

export interface Role{
    id:number,
    authority:String
}

export interface Utente{
    id:number,
    nome:string,
    cognome:string,
    email:string,
    password:string,
    authorities:Role[]
}

export interface AuthResponseDto{
    utente:Utente,
    jwt:String
}

export class CarrelloDto{
    private email:String|null;
    public acquisti:Acquisto[];
    private indirizzo:String;
    private numeroDiTelefono:String;
    private metodoDiPagamento:String;

    public constructor(ut:String|null, ac:Acquisto[], ind:String, num:String, pag:String){
        this.email = ut
        this.acquisti = ac
        this.indirizzo = ind
        this.numeroDiTelefono = num
        this.metodoDiPagamento = pag
    }

    public getAcquisti():Acquisto[]{
        return this.acquisti
    }
}

export class Acquisto{
    public idAcquisto:number;
    public prodottoVenduto:Prodotto;
    public quantita:number;
    public prezzovendita?: number;

    public constructor(idAcquisto:number, prodottoVenduto:Prodotto, quantita:number, prezzovendita?:number){
        this.idAcquisto=idAcquisto;
        this.prezzovendita=prezzovendita || 0;
        this.prodottoVenduto=prodottoVenduto;
        this.quantita=quantita;
    }

    public getId():number{
        return this.idAcquisto
    }

    public getProd():Prodotto{
        return this.prodottoVenduto;
    }

    public getQuantita():number{
        return this.quantita;
    }

    public setQuantita(q:number){
        this.quantita = q;
    }
}

export interface CheckFormDto{
    indirizzo:String,
    numeroDiTelefono:String,
    metodoDiPagamento:String
}