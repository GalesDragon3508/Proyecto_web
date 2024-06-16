let initState = {
    preload: preloadInit,
    create: createInit
};

function preloadInit() {
    game.load.image('bg', 'assets/imgs/fondo_menu.png');
    game.load.image('btn', 'assets/imgs/BotonSL.png');
    game.load.image('hoja', 'assets/imgs/Hoja.png')
}

function createInit()
{
    let bg = game.add.image(0, 0, 'bg');
    bg.scale.setTo(0.5, 0.45)

    let hojas = game.add.group();

    for (let i = 0; i < 10; i++) {
        let startX = 0;
        let startY = game.rnd.between(game.width / 5 - 50, game.width / 4);;

        let hoja = hojas.create(startX, startY, 'hoja');
        hoja.scale.setTo(0.15, 0.15);

        let endX = game.width +200;
        let endY = game.rnd.between(game.height/1.5, game.height + 100);

        let controlPoint1X = game.rnd.between(0, game.width / 2);
        let controlPoint1Y = game.rnd.between(game.height / 2, game.height);

        // Crear un tween para cada hoja con movimiento curvo (Bezier)
        let tween = game.add.tween(hoja).to(
            { x: [controlPoint1X, endX], y: [controlPoint1Y, endY] },
            game.rnd.between(4000, 5000), 
            Phaser.Easing.Quadratic.InOut,true
        );
        tween.interpolation(Phaser.Math.bezierInterpolation);
    }

    let titulo = 'ESTROPAJOS DORADOS';
    let textSD = 'PARTS';
    let textInst = 'INSTRUCTIONS';
    let textCrd = 'CREDITS';

    let styleTextTitle = {
        font:'Vintage Propagandist Regular',
        fontSize: '40px',
    };

    let styleTextButtons = {
        font: 'Vintage Propagandist Regular',
        fontSize: '14pt',
        fill: 'White'
    };

    game.add.text(GAME_WIDTH/2,50,titulo, styleTextTitle).anchor.setTo(0.5, 0);

    game.input.enabled = true;
    let vSpace = (GAME_HEIGHT + 750 ) / 4;

    let btnDifficultySelec = game.add.button(GAME_WIDTH / 2, vSpace / 2 + 50, 'btn', startSelectDifficulty);
    let btnInstruction = game.add.button(GAME_WIDTH / 2, vSpace / 2 + 150, 'btn', startInstruction);
    let btnCredits = game.add.button(GAME_WIDTH / 2, vSpace / 2 + 250, 'btn', startCredits);

    btnDifficultySelec.scale.setTo(0.5,0.5);
    btnInstruction.scale.setTo(0.5,0.5);
    btnCredits.scale.setTo(0.5,0.5);

    btnDifficultySelec.anchor.setTo(0.5, 0.5);
    btnInstruction.anchor.setTo(0.5, 0.5);
    btnCredits.anchor.setTo(0.5, 0.5);

    game.add.text(btnDifficultySelec.centerX,btnDifficultySelec.centerY-2,textSD, styleTextButtons).anchor.setTo(0.5, 0.5);
    game.add.text(btnInstruction.centerX,btnInstruction.centerY-2,textInst, styleTextButtons).anchor.setTo(0.5, 0.5);
    game.add.text(btnCredits.centerX,btnCredits.centerY-2,textCrd, styleTextButtons).anchor.setTo(0.5, 0.5);
}

function startSelectDifficulty() {
    game.state.start('difficultSelection');
}

function startInstruction() {                 
    game.state.start('instructions');
}

function startCredits() {
    game.state.start('credits');
}
