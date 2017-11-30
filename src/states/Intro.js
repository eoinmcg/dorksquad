import BaseGame from './BaseGame'

export default class extends BaseGame {
  preload () {
    super.preload()
  }

  create () {
    this.text = this.game.add.bitmapText(2, 2, 'cpc464', 'CREDITS', 8)
  }

  update () {
  }
}
