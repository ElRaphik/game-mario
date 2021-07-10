// init kaboom
export {
    init,
}

function init(){
    // init kaboom window
    kaboom({
        global: true,
        fullscreen: true,
        scale: 1,
        debug: true,
        clearColor: [0, 0, 0, 1]
    })



    // ***** load resources ***** \\

    loadRoot('https://i.imgur.com/')
    // player
    loadSprite('mario', 'Wb1qfhK.png')
    // ennemies
    loadSprite('goomba', 'KPO3fR9.png')
    loadSprite('blue-goomba', 'SvV4ueD.png')
    // entities
    loadSprite('coin', 'wbKxhcd.png')
    loadSprite('mushroom', '0wMd92p.png')
    // walls and stuff
    loadSprite('brick', 'pogC9x5.png')
    loadSprite('block', 'M6rwarW.png')
    loadSprite('surprise', 'gesQ1KP.png')
    loadSprite('unboxed', 'bdrLpi6.png')
    loadSprite('pipe-top-left', 'ReTPiWY.png')
    loadSprite('pipe-top-right', 'hj2GK4n.png')
    loadSprite('pipe-bottom-left', 'c1cYSbt.png')
    loadSprite('pipe-bottom-right', 'nqQ79eI.png')
    loadSprite('blue-block', 'fVscIbn.png')
    loadSprite('blue-brick', '3e5YRQd.png')
    loadSprite('blue-steel', 'gqVoI2b.png')
    loadSprite('blue-surprise', 'RMqCc1G.png')
}
