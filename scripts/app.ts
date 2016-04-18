module app{
    
    interface IScope extends ng.IScope{
        name: string;
        players: { [name: string]: Player; };
        reset(): void;
    }
    
    class ScoreController{
        game = new ScoreBoard();
        scope: IScope;
        toast: angular.material.IToastService;
        dialog: angular.material.IDialogService;
        
        constructor($scope: IScope, $mdToast: angular.material.IToastService, $mdDialog: angular.material.IDialogService){
            this.scope = $scope;
            this.toast = $mdToast;
            this.dialog = $mdDialog;
        }
        add(name:string){
            if(name==undefined)
                return;
            if(this.game.add(name)){
                this.scope.name="";
                this.showNotification("Player " + name + " added.");
            }else{
                this.showNotification("Player " + name + " exists.");
            }
        }
        showNotification(text: string){
            this.toast.show(
                this.toast.simple()
                    .position('top right')
                    .textContent(text)
                    .hideDelay(3000)
            );
        }
        reset($event: MouseEvent){
            var confirm = this.dialog.confirm()
                .title('Reset game?')
                .textContent('All players will be deleted and the points will be lost.')
                .ariaLabel('Lucky day')
                .targetEvent($event)
                .ok('Reset')
                .cancel('Cancel');
            this.dialog.show(confirm).then(
                () => {
                    this.game.initial();
                    this.showNotification("Game is reset.");
            });
        }
            

    }

    interface IScoreBoard{
        players: { [name: string]: Player; };
        registerHit(Player, number): void;
        initial(): void;
        get(name: string): Player;
        add(name: string): boolean;
        
    }

    class ScoreBoard implements IScoreBoard{
        players:  { [name: string]: Player; };
        
        constructor(){
            this.initial();
            this.add("Jeff");
        }
        initial(): void{
            this.players = {};
        }
        registerHit(name: string, hit: number): void{
            this.get(name).registerHit(hit);
        }
        get(name:string){
            return this.players[name];
        }
        add(name:string){
            if(this.get(name)==null){
                this.players[name] = new Player(name);
                return true;
            }
            return false;
            
        }
        
    }

    class Player{
        hits: any[];
        points: number;
        
        constructor(public name: string){
            this.name=name;
            this.initial();
        }
        initial(){
            this.hits = [];
            this.points = 0;
        }
        registerHit(hit: number){
            this.hits = this.hits.concat(hit);
        }
    }

    // var player = new Player("Jeff");
    // console.log(player);
    // player.registerHit(20);
    // console.log(player);

    // var scoreBoard = new ScoreController();
    // console.log(scoreBoard);
    // console.log(scoreBoard.get("Jeff"));
    // scoreBoard.registerHit("Jeff",19);
    // console.log(scoreBoard.get("Jeff"));

    angular.module("Cricket", [ 'ngMaterial' ] )
        .controller("ScoreController",  ScoreController);
}