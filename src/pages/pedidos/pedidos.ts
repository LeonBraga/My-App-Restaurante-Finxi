import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLiteObject, SQLite } from "@ionic-native/sqlite";
import { HomePage } from "../home/home";

/**
 * Generated class for the PedidosPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-pedidos',
  templateUrl: 'pedidos.html',
})
export class PedidosPage {

  numCodMesa: string;
  pedido: string;
  valor: number;
  db: SQLiteObject;
  numMesa: string;
  mesas: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqlite: SQLite) {
  }

  ionViewDidLoad() {
    ////Nota:passagem de parametros de HomePage para PedidosPage desnecessario na abordagem atual
    //this.numCodMesa = this.navParams.get('teste');
    //console.log('Recebido numMesa em PedidosPage: '+this.numCodMesa);
    //alert(this.numCodMesa+' recebido');
    this.statusMesas();
    console.log('ionViewDidLoad PedidosPage');

 
  }

  public fazerPedido(){
    this.db.executeSql(`SELECT * FROM MesaStatus WHERE numMesa=? AND (status='disponivel' OR status='ocupado') `, 
        [this.numMesa])    
    .then((data)=>{
 //     this.db.executeSql(`UPDATE MesaStatus SET status = 'ocupado' WHERE codMesa=? `, 
 //         [data.codMesa]);
      this.db.executeSql(`INSERT INTO Pedidos (codMesa, pedido, valorPedido) VALUES (?,?,?); `, 
          [data.codMesa, this.pedido, this.valor]);
      console.log('DADOS DE DATA (em fazer pedido) ===== '+data);
      console.log('dados adicionados a table Pedidos =>'+data.codMesa+' '+this.pedido+' '+this.valor );
      alert('Feito pedido de '+this.pedido+' para a mesa '+this.numMesa+' no valor de R$ '+this.valor);
    })
    .catch(e => console.log(e));    
  }

  //get and show the status of all tables (ocupada, disponivel)
  public statusMesas(){
    //limpa/reinicializa 'mesas' para que nao sejam exibidos dados repetidos na tela
    this.mesas=[];
    this.db.executeSql('SELECT * FROM MesaStatus WHERE status="ocupado" OR status="disponivel" ', [])
    .then((data)=>{
      if (data==null){
        console.log("Banco vazio!!!")
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

}
