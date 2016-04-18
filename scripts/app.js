var app;
(function (app) {
    var ScoreController = (function () {
        function ScoreController($scope, $mdToast, $mdDialog) {
            this.game = new ScoreBoard();
            this.scope = $scope;
            this.toast = $mdToast;
            this.dialog = $mdDialog;
        }
        ScoreController.prototype.add = function (name) {
            if (name == undefined)
                return;
            if (this.game.add(name)) {
                this.scope.name = "";
                this.showNotification("Player " + name + " added.");
            }
            else {
                this.showNotification("Player " + name + " exists.");
            }
        };
        ScoreController.prototype.showNotification = function (text) {
            this.toast.show(this.toast.simple()
                .position('top right')
                .textContent(text)
                .hideDelay(3000));
        };
        ScoreController.prototype.reset = function ($event) {
            var _this = this;
            var confirm = this.dialog.confirm()
                .title('Reset game?')
                .textContent('All players will be deleted and the points will be lost.')
                .ariaLabel('Lucky day')
                .targetEvent($event)
                .ok('Reset')
                .cancel('Cancel');
            this.dialog.show(confirm).then(function () {
                _this.game.initial();
                _this.showNotification("Game is reset.");
            });
        };
        return ScoreController;
    }());
    var ScoreBoard = (function () {
        function ScoreBoard() {
            this.initial();
            this.add("Jeff");
        }
        ScoreBoard.prototype.initial = function () {
            this.players = {};
        };
        ScoreBoard.prototype.registerHit = function (name, hit) {
            this.get(name).registerHit(hit);
        };
        ScoreBoard.prototype.get = function (name) {
            return this.players[name];
        };
        ScoreBoard.prototype.add = function (name) {
            if (this.get(name) == null) {
                this.players[name] = new Player(name);
                return true;
            }
            return false;
        };
        return ScoreBoard;
    }());
    var Player = (function () {
        function Player(name) {
            this.name = name;
            this.name = name;
            this.initial();
        }
        Player.prototype.initial = function () {
            this.hits = [];
            this.points = 0;
        };
        Player.prototype.registerHit = function (hit) {
            this.hits = this.hits.concat(hit);
        };
        return Player;
    }());
    // var player = new Player("Jeff");
    // console.log(player);
    // player.registerHit(20);
    // console.log(player);
    // var scoreBoard = new ScoreController();
    // console.log(scoreBoard);
    // console.log(scoreBoard.get("Jeff"));
    // scoreBoard.registerHit("Jeff",19);
    // console.log(scoreBoard.get("Jeff"));
    angular.module("Cricket", ['ngMaterial'])
        .controller("ScoreController", ScoreController);
})(app || (app = {}));
