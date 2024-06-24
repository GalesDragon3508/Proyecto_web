let victoryState = {
    preload: loadVictoryAssets,
    create: doVictory,
    update: updateVictory
};

function loadVictoryAssets() {
    game.load.image('win', 'assets/imgs/fondo_victoria.png');
}

function doVictory() {
    musicanivel.stop();
    game.add.image(0,0, 'win').scale.setTo(1.1,1);

    let textTitle = 'LEVEL COMPLETED!!!';
    let textTime = 'TIME PLAYED: ' + timeElapsed/1000;
    let textScore = 'SCORE: ' + score;
    let textHP = 'HP LEFT: ' + lifeCounter;
    let textMoney = 'TOTAL MONEY COLLECTED: ' + dinero;
    let textWood = 'TOTAL WOOD COLLECTED:' + madera;
    let textRestart = 'USE ENTER TO RESTART';
    let textMenu = 'MENU';

    let styleText = {
        font: 'TranscendsGames',
        fontSize: '40px',
        fill: 'Black'
    };

    game.add.text(GAME_WIDTH/3.5, 40, textTitle, styleText);
    game.add.text(GAME_WIDTH/3.5, 100, textTime, styleText);
    game.add.text(GAME_WIDTH/3.5, 160, textScore, styleText);
    game.add.text(GAME_WIDTH/3.5, 220, textHP, styleText);
    game.add.text(GAME_WIDTH/3.5, 280, textMoney, styleText);
    game.add.text(GAME_WIDTH/3.5, 340, textWood, styleText);
    game.add.text(GAME_WIDTH/3.5, 400, textRestart, styleText);

    let btnMenu = game.add.button(GAME_WIDTH / 2, GAME_HEIGHT - 150, 'btn', goMainMenu);
    btnMenu.scale.setTo(0.5, 0.5);
    btnMenu.anchor.setTo(0.5, 0.5);
    game.add.text(btnMenu.centerX, btnMenu.centerY-2, textMenu, styleText).anchor.setTo(0.5, 0.5);

    timeElapsedEndScreen = 0;
}

function updateVictory() {
    timeElapsedEndScreen += game.time.elapsed;

    if(timeElapsedEndScreen / 1000 >= 20){
        goMainMenu();
    }

    let enterK = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    if(enterK.justDown) {
        game.state.start('partA')
    }
}