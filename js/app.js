$(document).ready(function() {    
    function cambioColor(){  //si la etiqueta h1 contiene la clase main titulo, la elimina y crea main titulo II
        $("h1.main-titulo").switchClass("main-titulo","main-tituloII",500);
        $("h1.main-tituloII").switchClass("main-tituloII","main-titulo",500);
    }
    setInterval(cambioColor, 1000);
})

var reset = 0
function start(){ //inicio o reinicio del juego
	if (reset==1){
	window.location.reload();
	} else{
	reset = reset + 1;
	$(".btn-reinicio").html("Reiniciar");
	$(".jewel").fadeIn(1000)
	$(".btn-reinicio").html("Reiniciar");
	conteo(); //Inicio del contador
	setTimeout(_buscarCombo,1000);
	}
}
	var seg=59;
	var min=1;

function conteo(){ //Contador de tiempo
	
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
	$('.panel-tablero').remove();
	$('.time').remove();
	$('.panel-score').prepend("<h2 class='main-titulo'>Juego Terminado</h2>");
	$('.panel-score').animate({
		width:"90%"
	},1000);
	}
	if (seg>=0){
	conteo();	
	}

}
 var elimina = [] //array para almacenar dulces a eliminar
 var rows = 7; //dimensiones de rejilla
 var cols = 7; 
 
 var jewelsType=[]; //ruta de imagenes
   	jewelsType[0]= "./image/1.png";
   	jewelsType[1]= "./image/2.png";
   	jewelsType[2]= "./image/3.png"; 
   	jewelsType[3]= "./image/4.png";

function pickRandomJewel() //funcion para escojer un dulce al azar
    {
      var pickInt = Math.floor((Math.random()*4));
      return jewelsType[pickInt];
     }    	

  var width = $('.panel-tablero').width(); //dimensiones del tablero y de imagenes
  var height = $('.panel-tablero').height(); 
  var cellWidth = width / (cols); 
  var cellHeight = height / (rows);


  for (var c=0; c<cols; c++) {//visualizar el objeto en el tablero
    for (var r=0; r<rows; r++) {
    var cell = $("<img class='jewel' id='jewel_"+r+"_"+c+"' r='"+r+"' c='"+c+"'ondrop='_onDrop(event)' ondragstart='_ondragstart(event)' ondragover='_onDragOverEnabled(event)'src='"+pickRandomJewel()+"' style='padding-right:10px;width:"+(cellWidth)+"px;height:"+(cellHeight)+"px;position:relative;display:none'/>");
    $(".col-"+(c+1)).append(cell);
    }
  }

  function _ondragstart(a) {// funcion de arrastrar el dulce
    a.dataTransfer.setData("text/plain", a.target.id);
   }
   
  function _onDragOverEnabled(e) { // funcion de soltar el dulce
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
 	var src1 = $("#jewel_"+sr+"_"+sc).attr("src");
 	var src2 = $("#jewel_"+dr+"_"+dc).attr("src");
 	 $("#jewel_"+sr+"_"+sc).attr("src",src2);
 	 $("#jewel_"+dr+"_"+dc).attr("src",src1);
 	 $("#movimientos-text").html(mov);
    mov = mov+1
 	_buscarCombo();  //funcion de buscar y destruir 
}
puntua=0

function _buscarCombo(){
for (var r = 0; r < rows; r++){ //busqueda de combo en filas
		var prevCell = null;
		var figureLen = 0;
		var figureStart = null;
		var figureStop = null;
			for (var c=0; c< cols; c++){
			if (prevCell==null){ // primer dulce en combo
				console.log("FirstCell: " + r + "," + c);
				prevCell = $("#jewel_"+r+"_"+c).attr("src");
				figureStart = c;
				figureLen = 1;
				figureStop = null;
				continue;
			} 
			else {
				var curCell = $("#jewel_"+r+"_"+c).attr("src"); //seguir buscando el combo
				if ((prevCell!=curCell && figureLen<3)){ // escoger el nuevo inicio del combo
					console.log("New FirstCell: " + r + "," + c);
					prevCell = $("#jewel_"+r+"_"+c).attr("src");
					figureStart = c;
					figureStop=null;
					figureLen = 1;
					continue;
				}
				else {// si hay cambio de imagen en combo entonces destruir el actual
				figureLen+=1;
				if ((prevCell!=curCell) && figureLen>=3){ //eliminiar si el combo es mayor a 3
					figureStop = c-1;
					console.log("Combo from " + figureStart + " to " + figureStop + "!");
						for (var ci=figureStart;ci<=figureStop;ci++){
						$("#jewel_"+r+"_"+ci).parent().addClass("Incompleto");	
						$("#jewel_"+r+"_"+ci).addClass("Eliminar");
						puntua = puntua + 10;
						}
						prevCell = $("#jewel_"+r+"_"+c).attr("src");
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
						$("#jewel_"+r+"_"+ci).parent().addClass("Incompleto");	
						$("#jewel_"+r+"_"+ci).addClass("Eliminar");
						puntua = puntua + 10;
						}
						prevCell = $("#jewel_"+r+"_"+c).attr("src");
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
for (var c = 0; c < cols; c++){ //busqueda de combo en columnas
		var prevCell = null;
		var figureLen = 0;
		var figureStart = null;
		var figureStop = null;
			for (var r=0; r< rows; r++){
			if (prevCell==null){ // primer dulce en combo
				console.log("FirstCell: " + r + "," + c);
				prevCell = $("#jewel_"+r+"_"+c).attr("src");
				figureStart = r;
				figureLen = 1;
				figureStop = null;
				continue;
			} 
			else {
				var curCell = $("#jewel_"+r+"_"+c).attr("src"); //seguir buscando el combo
				if ((prevCell!=curCell && figureLen<3)){ // escoger el nuevo inicio del combo
					console.log("New FirstCell: " + r + "," + c);
					prevCell = $("#jewel_"+r+"_"+c).attr("src");
					figureStart = r;
					figureStop=null;
					figureLen = 1;
					continue;
				}
				else {// si hay cambio de imagen en combo entonces destruir el actual
				figureLen+=1;
				if ((prevCell!=curCell) && figureLen>=3){ //eliminiar si el combo es mayor a 3
					figureStop = r-1;
					console.log("Combo from " + figureStart + " to " + figureStop + "!");
						for (var ri=figureStart;ri<=figureStop;ri++){
						$("#jewel_"+ri+"_"+c).parent().addClass("Incompleto");	
						$("#jewel_"+ri+"_"+c).addClass("Eliminar");
						}
						prevCell = $("#jewel_"+r+"_"+c).attr("src");
						figureStart = r;
						figureStop = null; // reiniciar contadores
						figureLen = 1;
						$("#score-text").html(puntua);
    					continue;
                        }
                else{
                    if (r==6 && figureLen>=3){
					figureStop = r;
						console.log("Combo from " + figureStart + " to " + figureStop + "!");
						for (var ri=figureStart;ri<=figureStop;ri++){
						$("#jewel_"+ri+"_"+c).parent().addClass("Incompleto");	
						$("#jewel_"+ri+"_"+c).addClass("Eliminar");
						}
						prevCell = $("#jewel_"+r+"_"+c).attr("src");
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
_eliminar();
}
	
function _eliminar(){
	var eliminados = $(".Eliminar").length
for (var i = 1; i < 9; i++) {
	$(".Eliminar").fadeToggle(400);
	console.log("Eliminando!"+eliminados);
	setTimeout(erase,2000)
}
	function erase(){
	$(".Eliminar").remove();
	setTimeout(create,1000);
	}
	function create(){
	for (var c = 0; c < cols; c++) {
	var creados = 7-$(".col-"+(c+1)).children().length
		for (var i = 0; i < creados; i++) {
		var newcell = $("<img class='jewel' id='jewel_"+i+"_"+c+"' r='"+i+"' c='"+c+"'ondrop='_onDrop(event)' ondragstart='_ondragstart(event)' ondragover='_onDragOverEnabled(event)'src='"+pickRandomJewel()+"' style='padding-right:10px;width:"+(cellWidth)+"px;height:"+(cellHeight)+"px;position:relative;display:initial'/>");
    	$(".col-"+(c+1)).prepend(newcell);
    	}
	}
	for (var c=0; c<7; c++) {
		for (var i=0; i<7; i++){
		$(".col-"+(c+1)+" img:nth-child("+(i+1)+")").attr("id","jewel_"+i+"_"+c);	
		}
	}
	setTimeout(_dobleKill,1000);
	}
	
}

function _dobleKill(){
	var ciclo = $(".Incompleto").length;
	if (ciclo!=0) {
	$(".Incompleto").removeClass("Incompleto");
	_buscarCombo();
	}
}