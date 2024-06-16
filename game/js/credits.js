let creditsState = {
    create: doCredits
};

function doCredits() {
    game.add.image(0, 0, 'bg');

    let textCredits = 'CREDITS GO TO:';
    let JaviCr = 'Javi Alba';
    let AlexCr = 'Ángel Julián';
    let RaulCr = 'Mark Ivaylov Karamihov';
    let textBack = 'BACK';

    let styleText = {
        font: 'Vintage Propagandist Regular',
        fontSize: '20pt',
        fill: 'white'
    };

    game.add.text(GAME_WIDTH/2, 40, textCredits, styleText).anchor.setTo(0.5,0.5);
    game.add.text(GAME_WIDTH/2, 120, JaviCr, styleText).anchor.setTo(0.5,0.5);
    game.add.text(GAME_WIDTH/2, 200, RaulCr, styleText).anchor.setTo(0.5,0.5);
    game.add.text(GAME_WIDTH/2, 280, AlexCr, styleText).anchor.setTo(0.5,0.5);


    let btnCreditM = game.add.button(GAME_WIDTH/2, GAME_HEIGHT*0.8, 'btn', goMainMenu);
    btnCreditM.scale.setTo(0.5,0.5);
    btnCreditM.anchor.setTo(0.5,0.5);

    game.add.text( GAME_WIDTH/2,btnCreditM.centerY-2, textBack, styleText).anchor.setTo(0.5,0.5);
}