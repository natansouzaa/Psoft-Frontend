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
		case '/campanha/cadastro':
			render.cadastro_campanha();
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

//funcao que fica esperando alguem digitar alguma coisa no link da pagina
async function carregaLink(){
	await window.addEventListener("hashchange", carregaPagina)
}
carregaLink();

/* Funcao que, teoricamente, transforma uma string 
com o nome-curto da campanha p/ o formato de link */
function criaURL (text){
    text = text.toLowerCase();
    text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    text = text.replace(new RegExp('[Ç]','gi'), 'c');
    text = text.replace(new RegExp('[ ]','gi'), '-');
    text = text.replace(new RegExp('[,]','gi'), '');
    return text;
}