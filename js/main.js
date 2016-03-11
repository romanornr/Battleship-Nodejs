/**
 * Created by Wim on 11-3-2016.
 */
var Title = function(posX, posY, height, width, id){
    this.posX = posX;
    this.posY = posY;
    this.height = height;
    this.width = width;

    this.elem = document.createElement("div");
    this.elem.className = "title";
    this.elem.id = id;
    this.elem.style.width = (this.width - 4) + "px";
    this.elem.style.height = (this.height -4) + "px";

    this.draw = function(parent){
        parent.appendChild(this.elem);
    }
};

var Grid = function(height, width, titleX, titleY){
    this.titleWidth = width / titleX;
    this.titleHeight = height / titleY;
    
    this.titles = [];
    for(var i = 0; i < titleY; i++){
        this.titles[i] = [];
    }

    this.container = document.createElement("div");
    this.container.id = "grid";
    this.container.style.width = width + "px";
    this.container.style.height = height + "px";

    this.draw = function(){
        document.body.appendChild(this.container);

        var id = 0;
        for(var y = 0; y < titleY; y++){
            for(var x = 0; x < titleX; x++){
                var title = new Title(x, y, this.titleHeight, this.titleWidth, id);
                title.draw(this.container);
                this.titles[x][y] = title;
                id++;
            }
        }
    }
};

var grid = new Grid(960, 960, 15, 15);
grid.draw();

