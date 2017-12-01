/* global Phaser */
import BaseGame from './BaseGame'

export default class extends BaseGame {
  create () {
    const text = this.game.add.bitmapText(0, 0, 'cpc464', this.text(), 8)
    text.anchor.setTo(0, 0)

    this.keys = {
      k1: this.game.input.keyboard.addKey(Phaser.Keyboard.ONE),
      k2: this.game.input.keyboard.addKey(Phaser.Keyboard.TWO),
      k3: this.game.input.keyboard.addKey(Phaser.Keyboard.THREE),
      k4: this.game.input.keyboard.addKey(Phaser.Keyboard.FOUR),
      k5: this.game.input.keyboard.addKey(Phaser.Keyboard.FIVE),
      esc: this.game.input.keyboard.addKey(Phaser.Keyboard.ESC)
    }
  }

  text () {
    return `\n
    PLAYER 1:\n
    CURSORS TO MOVE\n
    SHIFT TO FIRE \n\n
    PLAYER 2:\n
    WASD TO MOVE\n
    SHIFT TO FIRE \n\n\n
    -OR USE JOYPADS- \n
    [esc] to title
    `
  }

  update () {
    if (this.keys.esc.isDown) {
      this.state.start('Title')
    }
  }
}
