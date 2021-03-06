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
        CREDITS\n\n
    1 CODE:\n      @eoinmcg\n
    2 MUSIC:\n      ULTRASYSD\n
    3 SFX:\n      SubspaceAudio\n
    4 BUILT WITH\n      PHASERJS\n
    5 AMSTRAD FONT\n\n
    [esc] to title
    `
  }

  update () {
    if (this.keys.esc.isDown) {
      this.state.start('Title')
    }
    if (this.keys.k1.isDown) {
      window.open('https://twitter.com/eoinmcg')
    }
    if (this.keys.k2.isDown) {
      window.open('https://soundcloud.com/ultrasyd/1488-morons-amstrad-cpc')
    }
    if (this.keys.k3.isDown) {
      window.open('https://opengameart.org/content/512-sound-effects-8-bit-style')
    }
    if (this.keys.k4.isDown) {
      window.open('https://phaser.io')
    }
    if (this.keys.k5.isDown) {
      window.open('https://fonts2u.com/amstrad-cpc464-regular.font')
    }
  }
}
