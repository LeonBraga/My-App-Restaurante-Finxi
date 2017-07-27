Template de Aplicativo gerado em Ionic para controle de mesas e pedidos em restaurante. Disponivel somente para Android.

## Forma de funcionamento do App:

-O programa cadastra mesas que devem ser adicionadas pelo usuário através do número desejado para cada mesa.

-É gerado um cód único para cada mesa.Os códigos de cada mesa devem ser consultados em "Mesas disponiveis ou ocupadas"

-Cada mesa cadastrada pode estar em um dos 3 estados e somente Disponível e Ocupado podem ser visualizados: 
   --Disponível : Quando a mesa acaba de ser cadastrada mas não existe nenhum pedido feito para a mesma.
   --Ocupado: Quando uma mesa está criada e existe ao menos um pedido feito.
   --Finalizado: Quando ela é encerrada e fica guardada em arquivo

-Os pedidos devem ser cadastrados inserindo-se o código da mesa que realizou o pedido, o nome ou descrição do pedido e o valor do mesmo em "Fazer pedido".

-É gerado um código para cada pedido e este código está associado somente á um código de mesa.

-Os pedidos realizados para cada mesa podem ser consultados através do código da mesa em "Consultar pedidos".

-Para remover uma mesa em uso ou crida por engano, deve ser inserido o código da mesa em "Encerrar mesa".



