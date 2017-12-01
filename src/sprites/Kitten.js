import Phaser from 'phaser'

import {randomDoor, randomPos} from '../helpers'

export default class extends Phaser.Sprite {
  constructor ({ game, p }) {
    super(game, 0, 0, 'kitten')
    this.p = p
    const pos = randomDoor()
    this.position.x = pos[0]
    this.position.y = pos[1]
    this.anchor.setTo(0.5, 0.5)
    this.game.physics.enable(this, Phaser.Physics.ARCADE)
    this.speed = 20
    this.scale.setTo(1, 1)
    this.animations.add('idle', [0], 8, true)
    this.animations.add('walk', [1, 2], 8, true)
    this.animations.add('dead', [3], 8, true)
    this.startMoving()
    this.isShot = false
  }

  update () {

    if (this.isShot) {
      if (this.position.x < 0) this.kill()
      return
    }

    const lost = (this.x < 8 || this.x > 150 || this.y < 24 || this.y > 180)
    const arrived = (this.to[0] === ~~this.position.x && this.to[1] === ~~this.position.y)

    if (lost || arrived) {
      this.body.velocity.setTo(0, 0)
      this.animations.play('idle')
      this.wait -= 1
      if (this.wait <= 0) {
        this.startMoving()
      }
      return
    }
  }

  startMoving () {
    this.to = randomPos()
    if (this.to[0] <= this.position.x) {
      this.scale.x *= -1
    }
    this.wait = 200
    this.game.physics.arcade.moveToXY(this, this.to[0], this.to[1], this.speed)
    this.animations.play('walk')
  }

  getShot (o) {
    if (this.isShot) return
    this.p.sfx.kittiedie.play()
    this.isShot = true
    this.animations.play('dead')
    this.game.physics.arcade.moveToXY(this, 0, 0, this.speed * 4)
  }
}
