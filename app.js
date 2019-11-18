import * as render from "/render.js";

//para lidar com o token: pesquisar sobre
//localStorage ou indexedDB


//Funcao que escolhe a view a ser renderizada com base no link
function carregaPagina(){
	let hash = location.hash;
	let endereco = hash.substring(1,hash.length);
	
	switch(endereco){
		case '/usuarios/cadastro': 
			render.cadastro_usuarios();
			break;
		case '/login': 
			render.login();
			break;
		case '/campanha':
			render.cadastro_campanha();
			break;
		case '/campanha/pesquisa':
			render.pesquisa_campanha();
			break;
		default: 
			render.homepage();
			break;
	}
		
}
/* 
	Sem essa execução, ao colocar um link com /login, o app nao ia abrir na
	pagina de login
*/
carregaPagina(); 

window.addEventListener("hashchange", carregaPagina);



