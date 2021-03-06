class Player {
  constructor (name) {
    this.name = name
    this.hand = []
    this.game = []
    this.pool = []
    this.game_score = 0
    this.pool_score = 0
    this.gameName = ''
    this.chips = 500
  }

  getGameScale () {
    let scale = 0
    switch (this.gameName) {
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
    this.hand.sort((a, b) => b.rankValue - a.rankValue)
  }

  showHand () {
    let handString = ''
    this.hand.forEach(function (card) {
      handString = `${handString} ${card.toString()}`
    })
    return handString + '\n'
  }

  getCardsByRank (rank) {
    const rankCards = []
    const otherCards = []
    const hand = this.hand
    for (let i = 0; i < hand.length; i++) {
      const card = hand[i]
      if (card.rankValue === rank) {
        rankCards.push(card)
      } else {
        otherCards.push(card)
      }
    }
    return { rankCards, otherCards }
  }

  getHighCard () {
    const hand = this.hand
    let high
    const otherCards = []
    for (let i = 0; i < hand.length; i++) {
      const card = hand[i]
      if (i === 0) {
        high = card
      } else {
        if (card.rankValue > high.rankValue) {
          otherCards.push(high)
          high = card
        } else {
          otherCards.push(card)
        }
      }
    }
    return { high, otherCards }
  }

  hasStraight () {
    this.sortHandByValue()
    this.game = []
    this.pool = []
    let result = true
    this.gameName = 'Straight'
    let compareCardRank
    const hand = this.hand
    for (let i = 0; i < hand.length; i++) {
      const card = hand[i]
      this.game_score = this.game_score + card.rankValue
      if (compareCardRank) {
        if (card.rankValue !== (compareCardRank - 1)) {
          result = false
          this.game_score = 0
        } else {
          this.game.push(card)
          compareCardRank = card.rankValue
        }
      } else {
        this.game.push(card)
        compareCardRank = card.rankValue
      }
    }
    return result
  }

  hasFlush () {
    this.sortHandByValue()
    this.game = []
    this.pool = []
    let result = true
    this.gameName = 'Flush'
    let previousCardSuit = ''
    const hand = this.hand
    for (let i = 0; i < hand.length; i++) {
      const card = hand[i]
      if (previousCardSuit !== '') {
        if (previousCardSuit !== card.suitKey) {
          result = false
          this.gameName = ''
          this.game_score = 0
        }
      }
      this.game_score = this.game_score + card.rankValue
      this.game.push(card)
      previousCardSuit = card.suitKey
    }
    return result
  }

  hasStraightFlush () {
    const result = (this.hasStraight() && this.hasFlush())
    if (result) {
      this.gameName = 'Straight Flush'
    }
    return result
  }

  hasSameOfAKind () {
    function getUnique (arr, comp) {
      // store the comparison  values in array
      const unique = arr.map(e => e[comp])
        // store the indexes of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)
        // eliminate the false indexes & return unique objects
        .filter((e) => arr[e]).map(e => arr[e])
      return unique
    }
    this.sortHandByValue()
    this.game = []
    this.pool = []
    const output = {
      result: false,
      pool: [],
      hand: []
    }
    let pairsCount = 0
    let threeCount = 0
    let fourCount = 0
    for (let i = 0; i < 15; i++) {
      const rankCardsAndOtherCards = this.getCardsByRank(i)
      // Four of a Kind
      if (rankCardsAndOtherCards.rankCards.length === 4) {
        fourCount++
        for (let j = 0; j < 4; j++) {
          output.hand.push(rankCardsAndOtherCards.rankCards[j])
        }
        for (let c = 0; c < 1; c++) {
          output.pool.push(rankCardsAndOtherCards.otherCards[c])
        }
      } else {
        // Three of a Kind
        if (rankCardsAndOtherCards.rankCards.length === 3) {
          threeCount++
          for (let j = 0; j < 3; j++) {
            output.hand.push(rankCardsAndOtherCards.rankCards[j])
          }
          for (let c = 0; c < 2; c++) {
            output.pool.push(rankCardsAndOtherCards.otherCards[c])
          }
        } else {
          // Pair
          if (rankCardsAndOtherCards.rankCards.length === 2) {
            pairsCount++
            for (let j = 0; j < 2; j++) {
              output.hand.push(rankCardsAndOtherCards.rankCards[j])
            }
            for (let c = 0; c < 3; c++) {
              output.pool.push(rankCardsAndOtherCards.otherCards[c])
            }
          }
        }
      }
    }
    this.game = output.hand
    this.pool = getUnique(output.pool, 'id').filter(x => !output.hand.filter(y => y.id === x.id).length)
    for (let i = 0; i < this.game.length; i++) {
      this.game_score = this.game_score + this.game[i].rankValue
    }
    for (let i = 0; i < this.pool.length; i++) {
      this.pool_score = this.pool_score + this.pool[i].rankValue
    }

    if (pairsCount === 1 && threeCount === 1) {
      output.result = true
      output.game = 'Full House'
    } else {
      if (pairsCount === 1) {
        output.result = true
        output.game = 'Pair'
      } else {
        if (pairsCount === 2) {
          output.result = true
          output.game = 'Two Pairs'
        } else {
          if (threeCount === 1) {
            output.result = true
            output.game = 'Three of a Kind'
          } else {
            if (fourCount === 1) {
              output.result = true
              output.game = 'Four of a Kind'
            } else {
              output.game = 'High Card'
              output.result = true
              // High Card
              const highCardsAndOthers = this.getHighCard()
              output.hand.push(highCardsAndOthers.high)
              this.game_score = highCardsAndOthers.high.rankValue
              for (let c = 0; c < 4; c++) {
                this.pool_score = this.pool_score + highCardsAndOthers.otherCards[c].rankValue
                output.pool.push(highCardsAndOthers.otherCards[c])
              }
              this.game = output.hand
              this.pool = getUnique(output.pool, 'id').filter(x => !output.hand.filter(y => y.id === x.id).length)
            }
          }
        }
      }
    }
    this.gameName = output.game
    return output
  }

  toString () {
    return `[${this.name} (${this.chips}): ${this.hand}]\n`
  }
}

class Deck {
  constructor () {
    this.cards = []
    this.ranks = new Map([
      ['2', 2],
      ['3', 3],
      ['4', 4],
      ['5', 5],
      ['6', 6],
      ['7', 7],
      ['8', 8],
      ['9', 9],
      ['T', 10],
      ['J', 11],
      ['Q', 12],
      ['K', 13],
      ['A', 14]
    ])
    this.suits = new Map([
      ['S', '♤'],
      ['H', '♥'],
      ['C', '♧'],
      ['D', '♢']
    ])
  }

  init () {
    for (const [suitKey, suitValue] of this.suits) {
      for (const [rankKey, rankValue] of this.ranks) {
        const card = new Card(suitKey, suitValue, rankKey, rankValue)
        this.cards.push(card)
      }
    }
  }

  draw () {
    return this.cards.pop()
  }

  showDeck () {
    let deckString = ''
    this.cards.forEach(function (card) {
      deckString = `${deckString} ${card.toString()}`
    })
    return deckString + '\n'
  }
}

class Card {
  constructor (suitKey, suitValue, rankKey, rankValue) {
    this.id = suitKey + rankKey
    this.suitKey = suitKey
    this.suitValue = suitValue
    this.rankKey = rankKey
    this.rankValue = rankValue
  }

  toString () {
    return `[${this.rankKey}${this.suitValue}]`
  }
}

class Croupier {
  constructor (deck, players) {
    this.deck = deck
    this.players = players
    this.gameLog = ''
  }

  shuffle () {
    let currentIndex = this.deck.cards.length
    let temporaryValue
    let randomIndex

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--

      // And swap it with the current element.
      temporaryValue = this.deck.cards[currentIndex]
      this.deck.cards[currentIndex] = this.deck.cards[randomIndex]
      this.deck.cards[randomIndex] = temporaryValue
    }
  }

  deal () {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < this.players.length; j++) {
        this.players[j].hand.push(this.deck.draw())
        this.players[j].sortHandByValue()
      }
    }
  }

  resolveGame () {
    function printWinnerHand (player) {
      let gameText = ''
      let poolText = ''
      for (let i = 0; i < player.game.length; i++) {
        gameText = gameText + player.game[i].toString()
      }
      for (let i = 0; i < player.pool.length; i++) {
        poolText = poolText + player.pool[i].toString()
      }
      return `\n\n ***** -> ${player.name} Wins with ${player.gameName}: ${gameText}\t${poolText} <- *****\n`
      // loggerSync(`\n\n ***** -> ${player.name} Wins with ${player.gameName}: ${gameText}\t${poolText} <- *****\n`)
    }

    let winner
    for (let j = 0; j < this.players.length; j++) {
      if (!this.players[j].hasStraightFlush()) {
        if (!this.players[j].hasFlush()) {
          if (!this.players[j].hasStraight()) {
            if (!this.players[j].hasSameOfAKind().result) {
              // Results stored in Player object. You can print them out here if needed
            }
          }
        }
      }
      this.gameLog = this.gameLog + `${this.players[j].name} has ${this.players[j].gameName} [Game Score: ${this.players[j].getGameScale()}] [Game Points: ${this.players[j].game_score}] [Pool Points: ${this.players[j].pool_score}]\n`
      // loggerSync(`${this.players[j].name} has ${this.players[j].gameName} [Game Score: ${this.players[j].getGameScale()}] [Game Points: ${this.players[j].game_score}] [Pool Points: ${this.players[j].pool_score}]`)
      if (j === 0) {
        winner = this.players[j]
      } else {
        if (this.players[j].getGameScale() === winner.getGameScale()) {
          if (this.players[j].game_score === winner.game_score) {
            if (this.players[j].pool_score > winner.pool_score) {
              winner = this.players[j]
            }
          } else {
            if (this.players[j].game_score > winner.game_score) {
              winner = this.players[j]
            }
          }
        } else {
          if (this.players[j].getGameScale() > winner.getGameScale()) {
            winner = this.players[j]
          }
        }
        if (this.players[j].getGameScale() > winner.getGameScale()) {
          winner = this.players[j]
        }
      }
    }
    this.gameLog = this.gameLog + printWinnerHand(winner)
    return winner
  }

  revealHands () {
    for (let j = 0; j < this.players.length; j++) {
      this.gameLog = this.gameLog + this.players[j].name + '\n'
      this.gameLog = this.gameLog + this.players[j].showHand() + '\n'
    }
  }

  revealDeck () {
    this.gameLog = this.gameLog + this.deck.showDeck()
  }
}

function loggerStream (text) {
  const fs = require('fs')
  console.log(text)
  var stream = fs.createWriteStream('stream_game-results.txt', { flags: 'a' })
  stream.write(text + '\n')
  stream.end()
}

function loggerAsync (text) {
  const fs = require('fs')
  console.log(text)
  fs.writeFile('async_game-results.txt', text, function (err) {
    if (err) return console.log(err)
  })
}

function loggerSync (text) {
  const fs = require('fs')
  console.log(text)
  fs.writeFileSync('sync_game-results.txt', text, function (err) {
    if (err) return console.log(err)
  })
}

function playGame () {
  //  GAME START
  const playersNames = [
    'Carlos',
    'Laura'
    /* 'Inés',
    'Rubén',
    'María',
    'Eduardo',
    'Pedro',
    'Iker',
    'Noelia',
    'Miren' */
  ]

  const players = []
  for (let i = 0; i < playersNames.length; i++) {
    const player = new Player(playersNames[i])
    players.push(player)
  }

  const deck = new Deck()
  deck.init()
  const croupier = new Croupier(deck, players)
  croupier.gameLog = croupier.gameLog + '****************************************\nCroupier opens a new Deck:\n'
  croupier.revealDeck()
  croupier.gameLog = croupier.gameLog + '\nCroupier shuffles Deck...\n'
  croupier.shuffle()
  croupier.gameLog = croupier.gameLog + '\nCroupier dealing...\n'
  croupier.deal()
  croupier.gameLog = croupier.gameLog + '\nPlayers reveal hands...\n'
  croupier.revealHands()
  croupier.gameLog = croupier.gameLog + '\nCroupier resolves game:\n'
  const winner = croupier.resolveGame()
  croupier.gameLog = croupier.gameLog + '\nCroupier reveals remaining Cards in Deck:\n'
  croupier.revealDeck()
  // Write to file
  loggerAsync(croupier.gameLog)
  loggerSync(croupier.gameLog)
  loggerStream(croupier.gameLog)
  return winner.gameName
}

playGame()

/*  Loop until a game is won with a specific score
let game = playGame()
while (game !== 'Pair') {
  game = playGame()
} */
