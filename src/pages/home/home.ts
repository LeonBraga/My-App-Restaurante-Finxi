import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

//Cada mesa possui 3 status: disponivel, ocupado, finalizado
//O sistema exibe e altera somente as mesas com status disponivel e ocupado
//Cada mesa criada tem um numero e um codigo auto-incremental que é gerado quando uma nova mesa é adicionada ao sistema

const statusDisp: string = 'disponivel';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  mesas: any[] = [];
  pedidos: any[] = [];

  numeroMesa: string;
  endMesa: string;

  db: SQLiteObject;

  pedido: string;
  valor: number;
  codMesaPed: number;

  consPedido: string;


  constructor(public navCtrl: NavController, private sqlite: SQLite) {
    //call to create the DB at the start of the App
    this.createDatabaseFile();

  }

  //auto explains itself
  private createDatabaseFile(): void{
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        console.log('Banco de Dados Criado!');
        this.db = db;
        //create tables
        this.criarTabelas();
      })
      .catch(e => console.log(e));

  }

  //Create the two tables that I will use into the DB 
  private criarTabelas(): void{
       this.db.executeSql('CREATE TABLE IF NOT EXISTS MesaStatus (codMesa INTEGER PRIMARY KEY AUTOINCREMENT, numMesa INTEGER, status TEXT);', {})
      .then(() => {
        console.log('Tabela de Mesa-Status Criada!');
        //Note: codMesa is FK and REF to MesaStatus. Not implemented now for tests with independent tables.
        this.db.executeSql('CREATE TABLE IF NOT EXISTS Pedidos(codPedido INTEGER PRIMARY KEY AUTOINCREMENT , codMesa INTEGER, pedido TEXT, valorPedido REAL);', {})
        .then(() => console.log('Tabela Pedidos criada !'))
        .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

  //Create a new instance of MesaStatus.The user have to input a new number as a 'title' for each mesa. This number can be one that already exists.
  //Every new mesa will get the status: disponivel.
  //Note: Uses TwoWayBinding(AngularJS) with numeroMesa at home.html 
  public criarMesa(){
    console.log('Mesa salva -> '+ this.numeroMesa );
    this.db.executeSql(`INSERT INTO MesaStatus 
        (numMesa, status) VALUES (?, ?);`,       
        [this.numeroMesa, statusDisp ])
    .then(() => console.log('Inserido na base !'))
    .catch(e => console.log(e));
    alert('Mesa inserida no sistema: '+ this.numeroMesa + '  status: '+ statusDisp);
  }

  //get and show the status of all tables (ocupada, disponivel)
  //Nota: Não organizar a exibiçao das mesas com ORDER BY permite que as mesas sejam visualizadas na ordem em que foram adicionadas no sistema.
  public statusMesas(){
    //clean mesas needed, so it will not show x2 the same thing
    this.mesas=[];
    this.db.executeSql('SELECT * FROM MesaStatus WHERE status="ocupado" OR status="disponivel" ', [])
    .then((data)=>{
      if (data==null){
        console.log("Banco vazio!!!")
        alert("Não existem mesas disponiveis ou ocupadas. Adicione uma nova mesa no sistema.")
        return;
      }

      if (data.rows){
        if (data.rows.length){
          alert('Existem: '+data.rows.length+' mesas disponiveis ou ocupadas no momento')
          for( var i=0; i < data.rows.length; i++){
            this.mesas.push(data.rows.item(i));
            console.log(this.mesas)
          }
        }
      }
    })
  }

  //creates a new instance of Pedidos
  //It'll also change the status of the selected codMesa to 'ocupado' meaning that it is in use and not just created
  //NoteToImplement:Show on the screen a alert or something else confirming what was done to the user
  //NoteToImplement: clean the labels after the insert in table
  public fazerPedido(){
    this.db.executeSql(`INSERT INTO Pedidos (codMesa, pedido, valorPedido) VALUES (?,?,?); `, 
      [this.codMesaPed, this.pedido, this.valor])
    .then(()=>{
      this.db.executeSql(`UPDATE MesaStatus SET status = 'ocupado' WHERE codMesa=? `, 
      [this.codMesaPed])
      console.log('dados adicionados a table Pedidos =>'+this.codMesaPed+' '+this.pedido+' '+this.valor );
    })
    .catch(e => console.log(e));  
    alert('Feito pedido de '+this.pedido+' para a mesa Cod:'+this.codMesaPed+' no valor de R$ '+this.valor);      
  }

  //read the table Pedidos an search for every instance of the inserted id of mesa(codMesa) 
  consultarPedidos(){
    this.pedidos=[];
    this.db.executeSql('SELECT * FROM Pedidos WHERE codMesa=? ', [this.consPedido])
    .then((data)=>{
      if (data==null){
        console.log("Banco vazio!!!")
        alert("Não existem mesas disponiveis ou ocupadas. Adicione uma nova mesa no sistema.")
        return;
      }

      if (data.rows){
        if (data.rows.length){
          alert('Existem: '+data.rows.length+' pedidos para esta mesa, no momento')
          for( var i=0; i < data.rows.length; i++){
            this.pedidos.push(data.rows.item(i));
            console.log(this.pedidos)
          }
        }
      }
    })

  }

  //change the status of a instance at MesaStatus to 'finalizado'. A 'finalizado' will not be seen by the user anymore.
  liberarMesa(){
    this.db.executeSql(`UPDATE MesaStatus SET status = 'finalizado' WHERE numMesa=? AND (status='disponivel' OR status='ocupado') `, 
        [this.endMesa])
    .then(()=> alert("status da mesa "+ this.endMesa +" alterado para fizalizado"))
    .catch(e => console.log(e));    
  }



}


