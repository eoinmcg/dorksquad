import Phaser from 'phaser'
import Data from '../data'

import {randomDoor} from '../helpers'

export default class extends Phaser.Sprite {
  constructor ({ game, p, type = false }) {
    super(game, 0, 0, 'baddies')
    this.p = p
    const pos = randomDoor()
    this.baddie = this.getData(type)
    this.health = this.baddie.health
    this.position.x = pos[0]
    this.position.y = pos[1]
    this.scale.setTo(this.baddie.scale, this.baddie.scale)
    this.anchor.setTo(0.5, 0.5)
    this.game.physics.enable(this, Phaser.Physics.ARCADE)
    this.speed = this.baddie.speed

    this.animations.add('idle', this.baddie.idle, 8, true)
    this.animations.add('walk', this.baddie.walk, 8, true)
    this.animations.add('kill', this.baddie.kill, 5, false)

    this.animations.play('walk')
    this.dude = this.findDude()
    this.iskilling = false
  }

  findDude () {
    const dudes = this.p.getDudes()
    return dudes[Math.floor(Math.random() * dudes.length)]
  }

  killDude () {
    this.animations.play('kill')
    this.animations.currentAnim.onComplete.add(() => {
      this.dude = this.findDude()
      this.animations.play(this.dude ? 'walk' : 'idle')
    })
  }

  receiveDamage (o) {
    this.health += -5
    if (this.baddie.getAngry) {
      this.tint = 0xff00ff
      this.x += o.body.velocity.x / 50
      this.y += o.body.velocity.y / 50
      this.speed *= 1.4
    }
    if (this.health < 0) {
      this.explode(o)
    }
  }

  explode (o) {
    if (o && o.owner) {
      this.p.claimKill(o.owner)
    }
    this.p.makeBoom(this.x, this.y)
    this.p.sfx.boom.play()
    console.log(this.baddie.powerupFreq)
    if (Math.random() > this.baddie.powerupFreq) {
      this.p.spawnPowerup(~~this.x, ~~this.y)
    }
    this.kill()
  }

  update () {
    const pos = this.position
    if (!this.dude || this.animations.currentAnim.name === 'kill') {
      this.body.velocity.setTo(0, 0)
      return
    }
    const dudePos = this.dude.position

    this.game.physics.arcade.moveToObject(this, this.dude, this.speed)

    if (pos.x <= ~~dudePos.x) {
      if (this.scale.x < 0) this.scale.x *= -1
    } else {
      if (this.scale.x > 0) this.scale.x *= -1
    }
  }

  randomPos (maxX, maxY) {
    const points = [
      [0, maxY / 2],
      [maxX, maxY / 2],
      [maxX / 2, 16]
    ]
    return points[Math.floor(Math.random() * points.length)]
  }

  getData (type) {
    if (!type) {
      const types = Object.keys(Data.baddies)
      type = types[Math.floor(Math.random() * types.length)]
    }
    let baddie = Data.baddies[type]
    baddie.name = type
    return baddie
  }
}
