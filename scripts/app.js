var ScoreController = (function () {
    function ScoreController() {
        this.players = [{ "name": "Jeff" }];
    }
    return ScoreController;
}());
angular.module("Cricket", ['ngMaterial'])
    .controller("ScoreController", ScoreController);
