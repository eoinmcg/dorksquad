import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import LoadingState from './states/Loading'
import SplashState from './states/Splash'
import TitleState from './states/Title'
import PlayState from './states/Play'
import CreditsState from './states/Credits'
import IntroState from './states/Intro'
// import PlayMapState from './states/PlayMap'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight

    super(width, height, Phaser.CANVAS, 'content', null, true, false)


    this.state.add('Boot', BootState, false)
    this.state.add('Loading', LoadingState, false)
    this.state.add('Splash', SplashState, false)
    this.state.add('Title', TitleState, false)
    this.state.add('Play', PlayState, false)
    this.state.add('Credits', CreditsState, false)
    this.state.add('Intro', IntroState, false)

    this.state.start('Boot')
  }
}

(() => {
  window.game = new Game()
})()
