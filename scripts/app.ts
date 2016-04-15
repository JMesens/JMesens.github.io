interface IScoreModel{
    players: any[];
    
}

class ScoreController implements IScoreModel{
    players: any[];
    
    constructor(){
        this.players = [{"name":"Jeff"}]
    }
    
}


angular.module("Cricket", [ 'ngMaterial' ] )
    .controller("ScoreController",  ScoreController);
    