let defeatState = {
    preload: loadDefeatAssets,
    create: doDefeat,
    update: updateDefeat
};

function loadDefeatAssets() {
    game.load.image('fail', 'assets/imgs/fondoLose.png');
}

function doDefeat() {
    let bg = game.add.image(0,0, 'fail');
    bg.scale.setTo(1.5,1.5)
    musicanivel.stop();

    let textTitle = 'YOU LOSE...';
    let textMoney = 'TOTAL MONEY COLLECTED: ' + dinero;
    let textWood = 'TOTAL WOOD COLLECTED: ' + madera;
    let textScore = 'ENEMIES DEFEATED: ' + score;
    let textRestart = 'USE ENTER TO RESTART';
    let textMenu = 'MENU';

    let styleText = {
        font: 'Vintage Propagandist Regular',
        fontSize: '40px',
        fill: 'white'
    };

    game.add.text(GAME_WIDTH/2, 50, textTitle, styleText).anchor.setTo(0.5, 0);
    game.add.text(GAME_WIDTH/2, 150, textMoney, styleText).anchor.setTo(0.5, 0);
    game.add.text(GAME_WIDTH/2, 250, textWood, styleText).anchor.setTo(0.5, 0);
    game.add.text(GAME_WIDTH/2, 350, textScore, styleText).anchor.setTo(0.5, 0);
    game.add.text(GAME_WIDTH/2, 450, textRestart, styleText).anchor.setTo(0.5, 0);

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
