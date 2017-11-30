import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, p, x, y, type = false }) {
    super(game, 0, 0, 'powerups')
    this.p = p
    this.game = game
    this.position.x = x
    this.position.y = y
    this.scale.setTo(1, 1)
    this.anchor.setTo(0.5, 0.5)
    this.game.physics.enable(this, Phaser.Physics.ARCADE)

    this.types = ['coin', 'donut', 'bomb', 'bullet', 'boot']
    if (!type) {
      type = this.types[Math.floor(Math.random() * this.types.length)]
    }

    this.animations.add('coin', [0], 8, true)
    this.animations.add('donut', [1], 8, true)
    this.animations.add('bomb', [2], 8, true)
    this.animations.add('bullet', [3], 8, true)
    this.animations.add('boot', [4], 8, true)

    this.animations.play(type)
    this.collected = false
  }

  receiveDamage (o) {
    if (this.collected) return
    this.p.sfx.collect.play()
    this.collected = true
    o.consumePowerup(this.animations.currentAnim.name)
    const tween = this.game.add.tween(this)
    tween.to({x: o.name === 'dude' ? 0 : this.game.world.width, y: 20}, 400, Phaser.Easing.None)
    tween.start()
    tween.onComplete.add(() => {
      this.kill()
    })
  }
}
