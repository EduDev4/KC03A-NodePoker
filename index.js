class Player {
    constructor (name) {
      this.name = name
      this.hand = new Array()
      this.game = new Array()
      this.pool = new Array()
      this.game_score = 0      
      this.pool_score = 0
      this.game_name = ''
      this.chips = 500       
    }
    getGameScale(){
      let scale = 0      
      switch(this.game_name){
        case 'Straight Flush':
          scale = 9
          break
        case 'Four of a Kind':
          scale = 8
          break
        case 'Full House':
          scale = 7
          break
        case 'Flush':
          scale = 6
          break
        case 'Straight':
          scale = 5
          break
        case 'Three of a Kind':
          scale = 4
          break
        case 'Two Pairs':
          scale = 3
          break
        case 'Pair':
          scale = 2
          break
        case 'High Card':
          scale = 1
          break
        default:
          scale = 0
      }
      return scale
    }
    sortHandByValue () {      
      this.hand.sort((a, b) => b.rank_value - a.rank_value)    
    }
    showHand () {
      let hand_string = ''
      this.hand.forEach(function (card){
        hand_string = `${hand_string} ${card.toString()}`
      })
      console.log(hand_string)
    }
    getCardsByRank(rank){
      let rank_cards = new Array()
      let other_cards = new Array()
      let hand = this.hand
      for(let i=0;i<hand.length;i++){
        let card = hand[i]
        if (card.rank_value == rank){
          rank_cards.push(card)
        }else{          
          other_cards.push(card)
        }
      }
      return {rank_cards,other_cards}
    }
    getHighCard(){
      let hand = this.hand
      let high
      let other_cards = new Array()
      for(let i=0;i<hand.length;i++){        
        let card = hand[i]
        if(i==0){
          high = card
        }else{
          if (card.rank_value > high.rank_value){
            other_cards.push(high)
            high = card                        
          }else{
            other_cards.push(card)
          }
        }
      }
      return {high,other_cards}
    }
    hasStraight () {
      this.sortHandByValue()
      this.game = new Array()
      this.pool = new Array()
      let result = true
      this.game_name = 'Straight'
      let compare_card_rank
      let hand = this.hand
      for(let i=0;i<hand.length;i++){
        let card = hand[i]
        this.game_score = this.game_score + card.rank_value
        if (compare_card_rank) {          
          if (card.rank_value != (compare_card_rank - 1)) {            
            result = false
            this.game_score = 0
          } else {
            this.game.push(card)
            compare_card_rank = card.rank_value
          }
        }else{
          this.game.push(card)
          compare_card_rank = card.rank_value
        }
      }
      return result
    }
    hasFlush () {    
      this.sortHandByValue()
      this.game = new Array()
      this.pool = new Array()
      let result = true
      this.game_name = 'Flush'    
      let previous_card_suit = ''
      let hand = this.hand
      for(let i=0;i<hand.length;i++){
        let card = hand[i]
        if (previous_card_suit != ''){        
          if (previous_card_suit != card.suit_key){
            result = false
            this.game_name = ''
            this.game_score = 0
          }        
        }
        this.game_score = this.game_score + card.rank_value
        this.game.push(card)
        previous_card_suit = card.suit_key
      }
      return result
    }
    hasStraightFlush () {
      let result = (this.hasStraight() && this.hasFlush())
      if(result){
        this.game_name = 'Stright Flush'
      }
      return result
    }
    hasSameOfAKind () {  
      function getUnique(arr, comp) {
        // store the comparison  values in array
        const unique =  arr.map(e => e[comp])
              // store the indexes of the unique objects
              .map((e, i, final) => final.indexOf(e) === i && i)
              // eliminate the false indexes & return unique objects
            .filter((e) => arr[e]).map(e => arr[e])
        return unique;
      }      
      this.sortHandByValue()  
      this.game = new Array()
      this.pool = new Array()
      let output = {
        result:false,
        pool: new Array(),
        hand: new Array()
      }
      let pairs_count = 0
      let three_count = 0
      let four_count = 0
      for(let i=0;i<15;i++){
        let rank_cards_and_other_cards = this.getCardsByRank(i)        
        //Four of a Kind
        if(rank_cards_and_other_cards.rank_cards.length == 4){
          four_count++          
          for(let j=0;j<4;j++){
            output.hand.push(rank_cards_and_other_cards.rank_cards[j])            
          }
          for(let c=0;c<1;c++){            
            output.pool.push(rank_cards_and_other_cards.other_cards[c])            
          }
        }else{
          //Three of a Kind
          if(rank_cards_and_other_cards.rank_cards.length == 3){
            three_count++            
            for(let j=0;j<3;j++){
              output.hand.push(rank_cards_and_other_cards.rank_cards[j])            
            }
            for(let c=0;c<2;c++){            
              output.pool.push(rank_cards_and_other_cards.other_cards[c])            
            }
          }else{        
            //Pair
            if(rank_cards_and_other_cards.rank_cards.length == 2){
              pairs_count++
              for(let j=0;j<2;j++){
                output.hand.push(rank_cards_and_other_cards.rank_cards[j])            
              }
              for(let c=0;c<3;c++){            
                output.pool.push(rank_cards_and_other_cards.other_cards[c])            
              }          
            }
          }
        }
      }
      this.game = output.hand
      this.pool = getUnique(output.pool,'id').filter( x => !output.hand.filter( y => y.id === x.id).length);
      for(let i=0;i<this.game.length;i++){
        this.game_score = this.game_score + this.game[i].rank_value
      }
      for(let i=0;i<this.pool.length;i++){
        this.pool_score = this.pool_score + this.pool[i].rank_value
      }      

      if (pairs_count == 1 && three_count == 1) {
        output.result = true        
        output.game = 'Full House'
      }else{
        if (pairs_count == 1) {
          output.result = true        
          output.game = 'Pair'
        }else{
          if (pairs_count == 2) {
            output.result = true        
            output.game = 'Two Pairs'
          }else{
            if (three_count == 1) {
              output.result = true        
              output.game = 'Three of a Kind'
            }else{
              if (four_count == 1) {
              output.result = true        
              output.game = 'Four of a Kind'
              }else{
                output.game =  'High Card'
                output.result = true
                //High Card
                let high_cards_and_others = this.getHighCard()
                output.hand.push(high_cards_and_others.high)
                this.game_score = high_cards_and_others.high.rank_value
                for(let c=0;c<4;c++){            
                  this.pool_score = this.pool_score + high_cards_and_others.other_cards[c].rank_value
                  output.pool.push(high_cards_and_others.other_cards[c])            
                }
                this.game = output.hand
                this.pool = getUnique(output.pool,'id').filter( x => !output.hand.filter( y => y.id === x.id).length);
              }
            }
          }
        }
      }
      this.game_name = output.game
      return output
    }    
    toString () {    
      return `[${this.name} (${this.chips}): ${this.hand}]`
    }  
} 

class Deck{  
    constructor (){
      this.cards = new Array()
      this.ranks = new Map([
        ['2',2],
        ['3',3],
        ['4',4],
        ['5',5],
        ['6',6],
        ['7',7],
        ['8',8],
        ['9',9],
        ['T',10],
        ['J',11],
        ['Q',12],
        ['K',13],
        ['A',14]
      ])
      this.suits = new Map([
        ['S','♤'],
        ['H','♥'],
        ['C','♧'],
        ['D','♢']
      ])
    }
    init () { 
      for (let [suit_key, suit_value] of this.suits) {
        for (let [rank_key, rank_value] of this.ranks) {
          let card = new Card(suit_key, suit_value, rank_key, rank_value)
          this.cards.push(card)      
        }
      }    
    }    
    draw () {    
      return this.cards.pop()
    }    
    toString () {
      let deck_string = ''
      this.cards.forEach(function (card) {            
        deck_string = `${deck_string} ${card.toString()}`  
      })
      console.log(deck_string)
    } 
}
class Card {
    constructor (suit_key, suit_value, rank_key, rank_value) {
      this.id = suit_key+rank_key
      this.suit_key = suit_key
      this.suit_value = suit_value
      this.rank_key = rank_key
      this.rank_value = rank_value    
    }
    toString () {    
      return `[${this.rank_key}${this.suit_value}]`
    }  
}
class Croupier {
  constructor (deck, players) {
    this.deck = deck
    this.players = players            
  }
  shuffle () {
    var currentIndex = this.deck.cards.length, temporaryValue, randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1
  
      // And swap it with the current element.
      temporaryValue = this.deck.cards[currentIndex]
      this.deck.cards[currentIndex] = this.deck.cards[randomIndex]
      this.deck.cards[randomIndex] = temporaryValue;
    }           
  }
  deal () {
    for(let i=0;i<5;i++){
      for(let j=0;j<players.length;j++){     
        players[j].hand.push(this.deck.draw())            
        players[j].sortHandByValue()
      }
    }
  }  
  resolveGame () {
    function printWinnerHand(player){
      let game_text = ''
      let pool_text = ''
      for(let i=0;i<player.game.length;i++){
        game_text = game_text + player.game[i].toString()
      }
      for(let i=0;i<player.pool.length;i++){
        pool_text = pool_text + player.pool[i].toString()
      }
      console.log(`\n\n ***** -> ${player.name} Wins with ${player.game_name}: ${game_text}\t${pool_text} <- *****\n`)      
    }
    
    let winner
    for(let j = 0; j < players.length; j++){
      if(!players[j].hasStraightFlush()){
        if (!players[j].hasFlush()){
          if (!players[j].hasStraight()){            
            if (!players[j].hasSameOfAKind().result){              
            }            
          }
        }
      }
      console.log(`${players[j].name} has ${players[j].game_name} [Game Score: ${players[j].getGameScale()}] [Game Points: ${players[j].game_score}] [Pool Points: ${players[j].pool_score}]`)                        
      if (j == 0){
        winner = players[j]
      }else{
        if (players[j].getGameScale() == winner.getGameScale()){
          if(players[j].game_score == winner.game_score){
            if(players[j].pool_score > winner.pool_score){
              winner = players[j]
            }
          }else{
            if (players[j].game_score > winner.game_score){
                winner = players[j]
            }
          }
        }else{
          if (players[j].getGameScale() > winner.getGameScale()){
            winner = players[j]
        }
        }
         
        if (players[j].getGameScale() > winner.getGameScale()){
          winner = players[j]
        }
      }
      
      //console.log("[" +players[j].hasSameOfAKind().game + "]\tPair / Two Pairs / Three of a Kind / Four of a Kind / Full House")                  
    }
    printWinnerHand(winner)
  }
  revealHands () {
    this.players.forEach(function (player) {            
      console.log(player.name)      
      player.showHand()
    })    
  }
  revealDeck () {    
    return `${this.deck.toString()}`
  }  
}

function logger (text, mode) {
  fs = require('fs');
  switch(mode){
    case 'stream':
      var stream = fs.createWriteStream("stream_game-results.txt", {flags:'a'});  
      stream.write(text + "\n");   
      stream.end();
      break
    case 'append':
      break
    case 'async':
      break
    default:
      fs.writeFile('sync_game-results.txt', text, function (err) {
        if (err) return console.log(err);
        console.log('Saved in game-results.txt!');
      });
  }  
}

//  GAME START
const players_names = ['Carlos','Laura','Inés','Rubén','María','Eduardo','Pedro','Iker','Noelia','Miren']

let players = new Array()
for(let i=0;i<players_names.length;i++){    
    let player = new Player(players_names[i])    
    
    /* {//Cheat for testing purpose:      
      let straight_flush = new Array(
        new Card('S', '♤', 'A', 14),
        new Card('S', '♤', 'K', 13),
        new Card('S', '♤', 'Q', 12),
        new Card('S', '♤', 'J', 11),
        new Card('S', '♤', 'T', 10)
      )    
      let full_house = new Array(
        new Card('S', '♤', 'A', 14),
        new Card('H', '♥', 'A', 14),
        new Card('C', '♧', 'A', 14),
        new Card('H', '♥', 'T', 10),
        new Card('C', '♧', 'T', 10)
      )
      let flush = new Array(
        new Card('S', '♤', 'T', 10),
        new Card('S', '♤', '8', 8),
        new Card('S', '♤', '5', 5),
        new Card('S', '♤', '3', 3),
        new Card('S', '♤', '2', 2)
      )
      let straight = new Array(
        new Card('S', '♤', 'Q', 12),
        new Card('S', '♤', 'J', 11),
        new Card('H', '♥', 'T', 10),
        new Card('S', '♤', '9', 9),
        new Card('D', 'D', '8', 8)
      )    
      let three = new Array(
        new Card('S', '♤', '5', 5),
        new Card('H', '♥', '5', 5),
        new Card('C', '♧', '5', 5),
        new Card('D', '♢', '3', 3),
        new Card('S', '♤', '2', 2)
      )    
      let four = new Array(
        new Card('S', '♤', 'T', 10),
        new Card('S', '♤', 'K', 13),
        new Card('H', '♥', 'K', 13),
        new Card('C', '♧', 'K', 13),
        new Card('D', '♢', 'K', 13)
      )    
      let two_pairs = new Array(
        new Card('S', '♤', 'A', 14),
        new Card('S', '♤', 'K', 13),
        new Card('D', '♢', 'K', 13),
        new Card('S', '♤', '3', 3),
        new Card('H', '♥', '3', 3)
      )    
      let pair = new Array(
        new Card('H', '♥', 'A', 14),
        new Card('S', '♤', 'K', 13),
        new Card('D', '♢', 'K', 13),
        new Card('S', '♤', 'J', 11),
        new Card('D', '♢', '5', 5)
      )    
      let high_card = new Array(
        new Card('S', '♤', 'T', 10),
        new Card('H', '♥', '8', 8),
        new Card('C', '♧', '6', 6),
        new Card('C', '♧', '4', 4),
        new Card('D', '♢', '2', 2)
      )
      if(i==0){
        player.hand = straight
      }
      if(i==1){
        player.hand = four
      }
    } */

    players.push(player)
}

let deck = new Deck()
deck.init()
let croupier = new Croupier(deck, players)
console.log('****************************************\nCroupier opens a new Deck:\n')
croupier.revealDeck()
console.log('\nCroupier shuffles Deck...\n')
croupier.shuffle()
console.log('\nCroupier dealing...\n')
croupier.deal()
console.log('\nPlayers reveals hands...\n')
croupier.revealHands()
console.log('\nCroupier resolves game:\n')
croupier.resolveGame()
console.log('\nCroupier reveals remaining Cards in Deck:\n')
croupier.revealDeck()


