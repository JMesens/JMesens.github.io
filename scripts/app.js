var app;
(function (app) {
    var ScoreController = (function () {
        function ScoreController($scope, $mdToast, $mdDialog) {
            this.scope = $scope;
            this.toast = $mdToast;
            this.dialog = $mdDialog;
            this.game = new ScoreBoard();
            //TODO: Remove
            this.add("Jeff");
            this.add("Bram");
        }
        ScoreController.prototype.add = function (name) {
            if (name == "") {
                return;
            }
            var isAdded = this.game.add(name);
            if (isAdded) {
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
        ScoreController.prototype.hit = function (hit) {
            this.game.registerHit(this.selectedPlayer, hit);
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
                _this.game = new ScoreBoard();
                _this.showNotification("Game is reset.");
            });
        };
        ScoreController.prototype.selectPlayer = function (name) {
            this.selectedPlayer = name;
        };
        return ScoreController;
    }());
    var ScoreBoard = (function () {
        function ScoreBoard() {
            this.players = new HashMap();
        }
        ScoreBoard.prototype.registerHit = function (name, hit) {
            var _this = this;
            if (!this.get(name).registerHit(hit)) {
                this.players.forEach(function (v, k) {
                    if (k != name) {
                        _this.get(k).registerScore(hit);
                    }
                });
            }
        };
        ScoreBoard.prototype.get = function (name) {
            return this.players.get(name);
        };
        ScoreBoard.prototype.add = function (name) {
            if (this.get(name) == null) {
                this.players.set(name, new Player(name));
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
            this.hits = new Array();
        }
        Player.prototype.initial = function () {
            this.hits = [];
            this.points = 0;
        };
        Player.prototype.registerHit = function (hit) {
            if (this.countHits(hit) == 3) {
                return false;
            }
            this.hits = this.hits.concat(hit);
            return true;
        };
        Player.prototype.registerScore = function (hit) {
            if (this.countHits(hit) < 3) {
                this.points += hit;
            }
        };
        Player.prototype.countHits = function (hit) {
            var count = 0;
            this.hits.forEach(function (v, k) {
                if (v == hit) {
                    count++;
                }
            });
            return count;
        };
        return Player;
    }());
    angular.module("Cricket", ['ngMaterial'])
        .controller("ScoreController", ScoreController);
})(app || (app = {}));
