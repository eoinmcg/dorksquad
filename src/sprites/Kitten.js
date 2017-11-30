import Phaser from 'phaser'

export default class extends Phaser.Sprite {
  constructor ({ game, p }) {
    super(game, 0, 0, 'kitten')
    const start = [10, 10]
    const to = [100, 100]
    this.p = p
    this.position.x = start[0]
    this.position.y = start[1]
    this.anchor.setTo(0.5, 0.5)
    this.game.physics.enable(this, Phaser.Physics.ARCADE)
    this.speed = 20
    this.animations.add('idle', [0], 8, true)
    this.animations.add('walk', [1, 2], 8, true)
    this.animations.play('walk')
    this.game.physics.arcade.moveToXY(this, to[0], to[1], this.speed)
  }

  receiveDamage (o) {
    this.kill()
  }

  randomPos (maxX, maxY) {
    const points = [
      [0, maxY / 2],
      [maxX, maxY / 2],
      [maxX / 2, 16]
    ]
    return points[Math.floor(Math.random() * points.length)]
  }
}
