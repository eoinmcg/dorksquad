/* global Phaser */
const padZeros = (num, zeros = 6) => {
  let initial = ''
  for (let i = 0; i < zeros; i += 1) {
    initial += '0'
  }
  if (num.toString().length <= zeros) {
    return (initial + num).slice(-zeros)
  }
}

const outOfArena = (x, y) => {
  return ((x < 8) || 
    (x > 160 - 8) ||
    (y < 20) ||
    (y > 180))
}

const randomDoor = () => {
  const maxX = 156
  const maxY = 180
  const points = [
    [8, (maxY / 4) * 1],
    [8, (maxY / 4) * 3],
    [maxX - 8, (maxY / 4) * 1],
    [maxX - 8, (maxY / 4) * 3],
    [maxX / 2, 16]
  ]
  return points[Math.floor(Math.random() * points.length)]
}

const controls = (keys, pad) => {
  let vy = 0
  let vx = 0
  let dir = false
  let fire = false

  if (keys.up.isDown ||
    (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1)) {
    vy = -1
    dir = 'up'
  }
  if (keys.down.isDown ||
    (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1)) {
    vy = 1
    dir = 'down'
  }
  if (keys.left.isDown ||
    (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1)) {
    vx = -1
    dir = 'left'
  }
  if (keys.right.isDown ||
    (pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT) || pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1)) {
    vx = 1
    dir = 'right'
  }

  if (keys.shoot.isDown || pad.justPressed(Phaser.Gamepad.XBOX360_A)) {
    fire = 1
  }

  return { dir, vx, vy, fire }
}

export {
  padZeros,
  outOfArena,
  randomDoor,
  controls
}
