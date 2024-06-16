let defeatState = {
    preload: loadDefeatAssets,
    create: doDefeat,
    update: updateDefeat
};

function loadDefeatAssets() {
    game.load.image('fail', 'assets/imgs/fondoLose.png');
}

function doDefeat() {
    game.add.image(0,0, 'fail');

    let textTitle = 'YOU LOSE...';
    let textTime = 'TIME PLAYED: ' + timeElapsed/1000;
    let textScore = 'SCORE: ' + score;
    let textRestart = 'USE ENTER TO RESTART';
    let textMenu = 'MENU';

    let styleText = {
        font: 'Vintage Propagandist Regular',
        fontSize: '40px',
        fill: 'white'
    };

    texto = game.add.text(game.world.centerX, 50, textTitle, styleText).anchor.setTo(0.5, 0);
    tiempojugado = game.add.text(game.world.centerX, 150, textTime, styleText).anchor.setTo(0.5, 0);
    puntostotal = game.add.text(game.world.centerX, 250, textScore, styleText).anchor.setTo(0.5, 0);
    empezar = game.add.text(game.world.centerX, 350, textRestart, styleText).anchor.setTo(0.5, 0);

    let btnMenu = game.add.button(GAME_WIDTH / 2, GAME_HEIGHT - 150, 'btn', goMainMenu);
    btnMenu.scale.setTo(0.5, 0.5);
    btnMenu.anchor.setTo(0.5, 0.5);
    game.add.text(btnMenu.centerX, btnMenu.centerY-2, textMenu, styleText).anchor.setTo(0.5, 0.5);

    timeElapsedEndScreen = 0;
}

function updateDefeat() {
    timeElapsedEndScreen += game.time.elapsed;

    if(timeElapsedEndScreen / 1000 >= 20){
        goMainMenu();
    }

    let enterK = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    if(enterK.justDown) {
        game.state.start('partA')
    }
}
