$(document).ready(function() {    
    function cambioColor(){  //si la etiqueta h1 contiene la clase main titulo, la elimina y crea main titulo II
        if ($("h1").hasClass("main-titulo")) {
            $("h1").removeClass("main-titulo");
            $("h1").addClass("main-tituloII");
        }
        else {
            $("h1").removeClass("main-tituloII");
            $("h1").addClass("main-titulo");
        }
        }
    setInterval(cambioColor, 1500);
    
})

var reset = 0
function start(){ //inicio o reinicio del juego
	if (reset==1){
	window.location.reload();
	} else{
	reset = reset + 1;
	$(".btn-reinicio").html("Reiniciar");
	$(".jewel").animate({
		opacity:1
	,duration:1000})
	setTimeout(_checkAndDestroy,1000)
	$(".btn-reinicio").html("Reiniciar");
	conteo(); //Inicio del contador
	}
}
	var seg=59;
	var min=1;
function conteo(){
	
	if (seg<10) {
	$("#timer").html("0"+min+":0"+seg);
	}	
	else {
	$("#timer").html("0"+min+":"+seg);
	}

	setTimeout(espera,1000)
	}

	function espera(){
	seg=seg-1;
	if (seg==0 && min==1) {
		seg=59;
		min=0;
		conteo();
	}
	
	if (seg==0 && min==0){ //Cambio de contenido de tablero
	$('.panel-tablero').replaceWith("<div class='panel-tablero'><h3 class='data-titulo'>Puntuación: <br></h3><h3 class='data-titulo'>"+puntua+"</h3><h3 class='data-titulo'>Movimientos: <br></h3><h3 class='data-titulo'>"+mov+"</h3></div>");
	}
	if (seg>=0){
	conteo();	
	}

}

 var rows = 7; 
 var cols = 7; 
 var grid = []; 
 fte="./image/"
 var jewelsType=[]; //ruta de imagenes
   	jewelsType[0]= fte+"1.png";
   	jewelsType[1]= fte+"2.png";
   	jewelsType[2]= fte+"3.png"; 
   	jewelsType[3]= fte+"4.png";

function jewel(r,c,obj,src)
    {
       return {
         r: r,  // fila del objeto
         c: c,  // columna del objeto 
         src:src, // recurso de la imagen
         locked:false, // bloqoear el objeto
         isInCombo:false, // estado de combo en el objeto
         o:obj,
       }
    }

function pickRandomJewel() //Escojer una gema al azar
    {
      var pickInt = Math.floor((Math.random()*4));
      return jewelsType[pickInt];
     }    	

	for (var r = 0; r < rows; r++)
   {
      grid[r]=[];
      for (var c =0; c< cols; c++) {
         grid[r][c]=new jewel(r,c,null,pickRandomJewel());
     }
   	}

  var width = $('.panel-tablero').width();
  var height = $('.panel-tablero').height(); // dimensiones del tablero
  var cellWidth = width / (cols+1);
  var cellHeight = height / rows;
  var marginWidth = cellWidth/cols;
  var marginHeight = cellHeight/rows+1;

   for (var c=0; c<cols; c++) //visualizar el objeto en el tablero
  {
    for (var r=0; r<rows; r++) {
      var cell = $("<img class='jewel' id='jewel_"+r+"_"+c+"' r='"+r+"' c='"+c+"'ondrop='_onDrop(event)' ondragover='_onDragOverEnabled(event)'src='"+grid[r][c].src+"' style='padding-right:10px;width:"+(cellWidth-20)+"px;height:"+cellHeight+"px;position:relative;opacity:0'/>");
      cell.attr("ondragstart","_ondragstart(event)");
      $(".col-"+(c+1)).append(cell);
      grid[r][c].o = cell;
    }
   }

  function _ondragstart(a) // funcion de arrastrar la gema
  {
    a.dataTransfer.setData("text/plain", a.target.id);
   }
   
  function _onDragOverEnabled(e) // funcion de soltar la gema
  {
     e.preventDefault();
     console.log("drag over " + e.target.id);
    }
 
 var mov = 1       
    function _onDrop(e){ // cambio de gema
     var src = e.dataTransfer.getData("text");   // recoger la gema fuente
     var sr = src.split("_")[1];
     var sc = src.split("_")[2];
     var dst = e.target.id;  // recoger la gema destino
     var dr = dst.split("_")[1];
     var dc = dst.split("_")[2];
     var ddx = Math.abs(parseInt(sr)-parseInt(dr)); // validar la distancia entre gemas
     var ddy = Math.abs(parseInt(sc)-parseInt(dc));
     	if (ddx > 1 || ddy > 1){
      		console.log("invalid! distance > 1");
       		return;
     	}
     	if (grid[dr][dc].locked || grid[sr][sc].locked){
      		console.log("elemento bloqueado");
       		return;
     	}
  
    var tmp = grid[sr][sc].src; // cambio de gemas
    grid[sr][sc].src = grid[dr][dc].src;
    grid[sr][sc].o.attr("src",grid[sr][sc].src);
    grid[dr][dc].src = tmp;
    grid[dr][dc].o.attr("src",grid[dr][dc].src);
    $("#movimientos-text").html(mov);
    mov = mov+1
 	_checkAndDestroy();  //funcion de buscar y destruit
}
puntua=0
function _checkAndDestroy(){
    for (var r = 0; r < rows; r++){ //busqueda de combo en filas
		var prevCell = null;
		var figureLen = 0;
		var figureStart = null;
		var figureStop = null;
			for (var c=0; c< cols; c++){
			if (grid[r][c].locked || grid[r][c].isInCombo) {// identificar si hay figuras en combo
				if (figureLen>=3){
					figureStop = c-1;
				}else{
				figureStart = null;
				figureStop = null;
				prevCell = null;
				figureLen = 1;
				continue;
				}
			}
			if (prevCell==null){ // primer gema en combo
				console.log("FirstCell: " + r + "," + c);
				prevCell = grid[r][c].src;
				figureStart = c;
				figureLen = 1;
				figureStop = null;
				continue;
			} 
			else {
				var curCell = grid[r][c].src; //seguir buscando el combo
				if ((prevCell!=curCell && figureLen<3)){ // escoger el nuevo inicio del combo
					console.log("New FirstCell: " + r + "," + c);
					prevCell = grid[r][c].src;
					figureStart = c;
					figureStop=null;
					figureLen = 1;
					continue;
				}
			else {// si hay cambio de imagen en combo entonces destruir el actual
				figureLen+=1;
				if ((prevCell!=curCell || grid[r][c].locked) && figureLen>=3){ //eliminiar si el combo es mayor a 3
						figureStop = c-1;
						console.log("Combo from " + figureStart + " to " + figureStop + "!");
							for (var ci=figureStart;ci<=figureStop;ci++){
								grid[r][ci].isInCombo=true;
								grid[r][ci].locked=true; //volver nulo y bloquear
								grid[r][ci].src=null;
								grid[r][ci].o.animate({ //eliminiar fuente de imagne y volver transparente
                                	opacity:0
                              		},800);
								puntua = puntua + 10;  
							}
						prevCell = grid[r][c].src;
						figureStart = c;
						figureStop = null; // reiniciar contadores
						figureLen = 1;
						$("#score-text").html(puntua);
    					continue;
                        }
                    else{
                    	if (c==6 && figureLen>=3){

						figureStop = c;
						console.log("Combo from " + figureStart + " to " + figureStop + "!");
							for (var ci=figureStart;ci<=figureStop;ci++){
								grid[r][ci].isInCombo=true;
								grid[r][ci].locked=true;
								grid[r][ci].src=null;

								grid[r][ci].o.animate({
                                	opacity:0
                              		},800); 
                              	puntua = puntua + 10;       
							}
						prevCell = grid[r][c].src;
						figureStart = c;
						figureStop = null;
						figureLen = 1;
						$("#score-text").html(puntua);
						continue;
                        }
                    }
                    }
                  }
                }
      }
      for (var c = 0; c < cols; c++){ //busqueda de combo en columnas (igual al paquete anterior de codigo)
		var prevCell = null;
		var figureLen = 0;
		var figureStart = null;
		var figureStop = null;
			for (var r=0; r< rows; r++){
				if (grid[r][c].locked || grid[r][c].isInCombo) {
				if (figureLen>=3){
					figureStop = c-1;
				}else{
				figureStart = null;
				figureStop = null;
				prevCell = null;
				figureLen = 1;
				continue;
			}}
			if (prevCell==null){ 
				console.log("FirstCell: " + r + "," + c);
				prevCell = grid[r][c].src;
				figureStart = r;
				figureLen = 1;
				figureStop = null;
				continue;
			}
			else {
				var curCell = grid[r][c].src; 
				if ((prevCell!=curCell && figureLen<3)){ 
					console.log("New FirstCell: " + r + "," + c);
					prevCell = grid[r][c].src;
					figureStart = r;
					figureStop=null;
					figureLen = 10;
					continue;
				}
				else{
					figureLen+=1;
					if (prevCell!=curCell && figureLen>=3){
						figureStop = r-1;
						console.log("Combo from " + figureStart + " to " + figureStop + "!");
							for (var ri=figureStart;ri<=figureStop;ri++){
								grid[ri][c].isInCombo=true;
								grid[ri][c].locked=true;
								grid[ri][c].src=null;
								grid[ri][c].o.animate({
                                	opacity:0
                              		},800);    
                              	puntua = puntua + 10;  
							}
						prevCell = grid[r][c].src;
						figureStart = r;
						figureStop = null;
						figureLen = 1;
						$("#score-text").html(puntua);
    					continue;
                             }
                    else{
                    	if (r==6 && figureLen>=3){
						figureStop = r;
						console.log("Combo from " + figureStart + " to " + figureStop + "!");
							for (var ri=figureStart;ri<=figureStop;ri++){
								grid[ri][c].isInCombo=true;
								grid[ri][c].locked=true;
								grid[ri][c].src=null;
								grid[ri][c].o.animate({
                                	opacity:0
                              		},800); 
                              	puntua = puntua + 1;     
							}
						prevCell = grid[r][c].src;
						figureStart = r;
						figureStop = null;
						figureLen = 1;
						$("#score-text").html(puntua);
    					continue;
                             }
                    }
                    }
                  }
                }
      }
	setTimeout(mover,1000); //funcion para mover gemas vacias
}


function mover(){ //  busqueda de gemas vacias y cambio hasta el primer puesto en la matriz
			for (var c=0;c<cols;c++){                                        
					for (var sn=1;sn<rows;sn++){
						if (grid[sn][c].src==null) { 
							for (var sr=sn;sr>0;sr--){

							grid[sr][c].locked=null;
							grid[sr-1][c].locked=true;
							
							grid[sr][c].isInCombo=null
							grid[sr-1][c].isInCombo=true;

							grid[sr][c].o.attr("src",grid[sr-1][c].src)
							grid[sr][c].o.animate({
                                	opacity:100
                              		});      

							grid[sr-1][c].o.attr("src",null)
							grid[sr-1][c].o.animate({
                                	opacity:0
                              		});     

							grid[sr][c].src=grid[sr-1][c].src;
							grid[sr-1][c].src=null;                       
						} 
						}  
					} 
			}	

 }