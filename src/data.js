const Data = {
  title: 'Dork Squad',
  baddies: {
      roboZombie: {
        health: 10,
        speed: 10,
        walk: [1, 2, 0],
        idle: [0],
        kill: [3, 4, 3, 4, 3, 4, 3, 4, 3, 4],
        powerups: ['donut', 'coin'],
        scale: 1,
        powerupFreq: 0.2,
        getAngry: true
      },
      stomper: {
        health: 20,
        speed: 20,
        walk: [7, 8],
        idle: [7, 8],
        kill: [7, 8],
        powerups: ['donut', 'coin'],
        scale: 1,
        powerupFreq: 0.5,
        getAngry: true
      },
      floater: {
        health: 20,
        speed: 10,
        walk: [11, 12],
        idle: [11, 12],
        kill: [11, 12],
        powerups: ['donut', 'coin'],
        scale: 1,
        powerupFreq: 0.5,
        getAngry: false
      },
      professor: {
        health: 1,
        speed: 25,
        walk: [9, 10],
        idle: [9, 10],
        kill: [9, 10],
        powerups: ['donut', 'coin'],
        scale: 1,
        powerupFreq: 0.5,
        getAngry: true
      }
  }
}

export default Data
