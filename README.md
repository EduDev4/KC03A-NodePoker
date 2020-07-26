# KC03A-NodePoker     
  
## Solución aplicada  
  
  Partida de Póker automática de 1 a 10 jugadores con 5 cartas cada uno.  
  Para añadir o eliminar jugadores se deben añadir o eliminar sus nombres del array 'players'.
  Tres funciones para guardar en fichero la partida. loggerStream, loggerSync y loggerAsync. 
  
### Clases:  
#### Player  
  - Tiene la info del jugador y es donde se almacenan las cartas de su mano y sus puntuaciones. Puede:  
    - Ordenar sus cartas por valor  
    - Decir qué jugada alta tienen y cuáles son sus cartas Pool (cartas que complementan la jugada) junto con sus puntuaciones      
    - Calcular el punto de su mano (del 1 al 9 desde Carta alta a Escalera de Color)  
    - Revelar su mano     
  
#### Deck  
  - Genera todas las cartas para formar una baraja.  
  - Permite robar una carta sacándola del mazo  
  
#### Card  
  - Tiene un id, palo (símbolo y valor) y un valor (símbolo y valor). Ej: Simbólico: 'T' '♠' - Valor: '10' 'S'    
  
#### Croupier  
  - Recibe una baraja y una lista de jugadores y puede:  
    - Mezclar las cartas  
    - Repartir  
    - Resolver la jugada (en base al puntuaje que cada jugador tiene decide quién gana)  
    - Revelar las cartas de la baraja  
    - Revelar las cartas de todos los jugadores  
  
## Áreas de mejora:  
  - En caso de empate se evalúa la suma de las cartas de la jugada. Si empatan de nuevo, se evalúa la suma de las cartas del Pool (cartas que complementan la jugada). Debería revisarse carta a carta de mayor a menor.  
  - El AS no cuenta como 1. Solo está siendo evaluado como carta más alta (su valor es 14). Debería poder contabilizarse tanto como 1 como 14.  
  - Todo está empaquetado en el archivo index.js. Deberían separarse las clases en ficheros independientes.

## Ejemplo de Salida del ejericio:  
  
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*  
Croupier opens a new Deck:  
  
 \[2♠\] \[3♠\] \[4♠\] \[5♠\] \[6♠\] \[7♠\] \[8♠\] \[9♠\] \[T♠\] \[J♠\] \[Q♠\] \[K♠\] \[A♠\] \[2♥\] \[3♥\] \[4♥\] \[5♥\] \[6♥\] \[7♥\] \[8♥\] \[9♥\] \[T♥\] \[J♥\] \[Q♥\] \[K♥\] \[A♥\] \[2♣\] \[3♣\] \[4♣\] \[5♣\] \[6♣\] \[7♣\] \[8♣\] \[9♣\] \[T♣\] \[J♣\] \[Q♣\] \[K♣\] \[A♣\] \[2♦\] \[3♦\] \[4♦\] \[5♦\] \[6♦\] \[7♦\] \[8♦\] \[9♦\] \[T♦\] \[J♦\] \[Q♦\] \[K♦\] \[A♦\]  
  
Croupier shuffles Deck...  
  
  
Croupier dealing...  
  
  
Players reveal hands...  
  
Carlos  
 \[A♦\] \[J♦\] \[7♣\] \[5♠\] \[2♦\]  
Laura  
 \[T♣\] \[7♦\] \[6♥\] \[6♦\] \[2♥\]  
Inés  
 \[A♣\] \[J♥\] \[7♠\] \[3♣\] \[3♥\]  
Rubén  
 \[T♥\] \[9♣\] \[9♠\] \[9♥\] \[5♦\]  
María  
 \[A♥\] \[Q♣\] \[T♠\] \[5♥\] \[3♦\]  
Eduardo  
 \[K♥\] \[K♠\] \[6♠\] \[4♥\] \[4♦\]  
  
Croupier resolves game:  
  
Carlos has High Card \[Game Score: 1\] \[Game Points: 14\] \[Pool Points: 25\]  
Laura has Pair \[Game Score: 2\] \[Game Points: 12\] \[Pool Points: 19\]  
Inés has Pair \[Game Score: 2\] \[Game Points: 6\] \[Pool Points: 32\]  
Rubén has Three of a Kind \[Game Score: 4\] \[Game Points: 27\] \[Pool Points: 15\]  
María has High Card \[Game Score: 1\] \[Game Points: 14\] \[Pool Points: 30\]  
Eduardo has Two Pairs \[Game Score: 3\] \[Game Points: 34\] \[Pool Points: 6\]  
  
  
 \*\*\*\*\* -> Rubén Wins with Three of a Kind: \[9♣\]\[9♠\]\[9♥\] \[T♥\]\[5♦\] <- \*\*\*\*\*  
  
  
Croupier reveals remaining Cards in Deck:  
  
 \[4♠\] \[Q♦\] \[K♣\] \[6♣\] \[Q♥\] \[2♠\] \[K♦\] \[Q♠\] \[8♠\] \[A♠\] \[7♥\] \[2♣\] \[4♣\] \[8♦\] \[8♥\] \[3♠\] \[8♣\] \[5♣\] \[T♦\] \[J♠\] \[J♣\] \[9♦\]  
  
## Definición del ejercicio - Poker (OOP)  
  
Partiendo de una baraja de 52 objetos, generamos 2 manos aleatorias  
Las comparamos y establecemos la ganadora  
El resultado, además de mostrarlo por consola, lo guardamos en un fichero.  
Hacemos 2 versiones, con las operaciones de ficheros síncronas y asíncronas.  
  
Una baraja de póker completa continente 52 cartas.  
  
Cada carta se define por 2 características:  
  
Palo (suit) que pueden ser los siguientes:  
  
- picas/spades (S)  
- corazones/hearts (H)  
- tréboles/clubs (C)  
- diamantes/diamonds (D)  
  
Valor  
2, 3, 4, 5, 6, 7, 8, 9, T (10/Ten), J (Jack), Q (Queen) K (King), A (1/As)   
  
una mano es un conjunto de 5 cartas  
estamos jugando con una baraja por lo que no puede haber cartas repetidas   
las manos de póker se ordenan de menor a mayor dependiendo de una serie de reglas asociadas a la mano  
  
- High Card (carta más alta): para manos que no entran en ninguna de las manos superiores el ganador es aquel que tiene la carta más alta. Si se produce un empate entonces se compara la siguiente carta más alta y así sucesivamente hasta que 1 es ganador o si empatan en todas las cartas es empate.  
- Pair (pareja): Dos de las 5 cartas de la mano tienen el mismo valor. Si las dos manos tienen pareja entonces gana la que tenga la pareja más alta. Si ambas parejas son iguales entonces gana el que tenga la carta más alta.  
- Two pairs (dobles parejas):  la mano contiene dos parejas diferentes si las dos manos tienen dobles parejas diferentes entonces gana aquella que tenga la pareja más alta. Si las dos manos tienen las mismas parejas entonces se compara la otra pareja. Si ambos tienen las mismas parejas entonces gana el que tenga la carta más alta restante.  
- Three of a kind (el trío): 3 cartas de la mano tienen el mismo valor. gana la mano que tiene las 3 cartas con mayor valor.  
- Straight (escalera): la mano contiene 5 cartas consecutivas. Si las dos manos tienen escalera entonces gana la que tiene la carta mas alta.  
- Flush (color): la mano tiene 5 cartas con el mismo palo. Si ambas manos tienen color entonces gana el que tenga la carta más alta.  
- Full House (full): la mano tiene un trío y una pareja. E n caso de tener ambas manos full entonces gana el que tenga el trío más alto.  
- Four of a kind (póker): 4 cartas del mismo valor. En caso de tener ambas manos póker gana el que tenga el valor más alto.  
- Straight Flush (escalera de color): 5 cartas con el mismo palo pero con valores consecutivos en caso de tener escaleras las 2 manos entonces gana el que tenga el valor más alto.  
  
Entrada: Jugador I: 2H 3D 5S 9C KD Jugador 2: 2C 3H 4S 8C AH  
Salida : Jugador 2 gana, carta más alta:  
  
Entrada: Jugador 1: 2H 4S 4C 2D 4H Jugador 2: 2S 8S AS QS 3S  
Salida: Jugador 1 gana, full  
  
Entrada: Jugador I: 2H 3D 5S 9C KD Jugador 2: 2C 3H 4S 8C KH  
Salida : Jugador 1 gana, carta más alta  
  
Entrada: Jugador I: 2H 3D 5S 9C KD Jugador 2: 2D 3H 5C 9S KH  
Salida : Empate  
  
