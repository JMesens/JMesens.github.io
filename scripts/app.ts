module app{
    
    interface IScope extends ng.IScope{
        name: string;
        players: { [name: string]: Player; };
        reset(): void;
    }
    
    class ScoreController{
        game: IScoreBoard;
        scope: IScope;
        toast: angular.material.IToastService;
        dialog: angular.material.IDialogService;
        selectedPlayer: string;
        
        constructor($scope: IScope, $mdToast: angular.material.IToastService, $mdDialog: angular.material.IDialogService){
            this.scope = $scope;
            this.toast = $mdToast;
            this.dialog = $mdDialog;
            this.game = new ScoreBoard();
            
            //TODO: Remove
            this.add("Jeff");
            this.add("Bram");
        }
        add(name:string){
            if(name==""){
                return;
            }
            var isAdded = this.game.add(name);
            if(isAdded){
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
        hit(hit: number){
            this.game.registerHit(this.selectedPlayer,hit);
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
                    this.game = new ScoreBoard();
                    this.showNotification("Game is reset.");
            });
        }
        selectPlayer(name: string){
            this.selectedPlayer = name;
        }

    }

    interface IScoreBoard{
        registerHit(IPlayer, number): void;
        add(name: string): boolean;
    }
   
    class ScoreBoard implements IScoreBoard{
        players: HashMap<string,IPlayer>;
        
        constructor(){
            this.players = new HashMap<string,Player>();
        }
        registerHit(name: string, hit: number): void{
            if(!this.get(name).registerHit(hit)){
                this.players.forEach((v,k) => {
                    if(k!=name){
                        this.get(k).registerScore(hit);
                    }
                });
            }
        }
        get(name:string){
            return this.players.get(name);
        }
        add(name:string){
            if(this.get(name)==null){
                this.players.set(name, new Player(name));
                return true;
            }
            return false;
        }
        
        
    }
    
    interface IPlayer{
        registerHit(hit: number): boolean;
        registerScore(hit: number): void;
    }

    class Player implements IPlayer{
        private hits: Array<number>;
        private points: number;
        
        constructor(public name: string){
            this.name=name;
            this.initial();
            this.hits = new Array<number>();
        }
        private initial(){
            this.hits = [];
            this.points = 0;
        }
        registerHit(hit: number){
            if(this.countHits(hit)==3){
                return false;
            }
            this.hits = this.hits.concat(hit);
            return true;
        }
        registerScore(hit: number){
            if(this.countHits(hit)<3){
                this.points += hit;
            }
        }
        private countHits(hit:number){
            var count = 0;
            this.hits.forEach((v,k)=>{
                if(v==hit){
                    count++;
                }
            })
            return count;
        }
    }

    angular.module("Cricket", [ 'ngMaterial' ] )
        .controller("ScoreController",  ScoreController);
}