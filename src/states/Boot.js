import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    document.body.style.backgroundColor = '#000'
  }

  preload () {
    const text = this.add.text(
      this.world.centerX,
      this.world.centerY, 'LOADING',
      { font: '16px Arial', fill: '#ff0', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    let link = document.querySelector("link[rel*='icon']") || document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'shortcut icon'
    link.href = 'favicon.png'
    document.getElementsByTagName('head')[0].appendChild(link)

    this.load.image('loaderBg', './a/i/loader-bg.png')
    this.load.image('loaderBar', './a/i/loader-bar.png')

    this.load.tilemap('level1', 'a/maps/level1.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('tiles', 'a/i/tiles.png')
    this.load.audio('loading', ['a/sfx/loading.mp3'])
    this.load.audio('titleMusic', ['a/sfx/1488morons.mp3'])
    this.load.audio('thud', ['a/sfx/thud.mp3'])
    this.load.audio('combo', ['a/sfx/combo.mp3'])
    this.load.audio('collect', ['a/sfx/collect.mp3'])
    this.load.audio('die', ['a/sfx/die.mp3'])
    this.load.audio('hit1', ['a/sfx/hit1.mp3'])
    this.load.audio('hit3', ['a/sfx/hit3.mp3'])
    this.load.audio('boom', ['a/sfx/boom.mp3'])
    this.load.audio('kittiedie', ['a/sfx/kittiedie.mp3'])
    this.load.audio('gameover', ['a/sfx/gameover.mp3'])
    this.load.audio('wavecomplete', ['a/sfx/wavecomplete.mp3'])
  }

  render () {
    // this.state.start('Loading')
    this.state.start('Title')
  }
}
