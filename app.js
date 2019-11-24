import * as login from "./login.js";
import * as cadastro_usuario from "./cadastro_usuario.js";
import * as cadastro_campanha from "./cadastro_campanha.js";
import * as pesquisa_campanha from "./pesquisa_campanha.js";
import * as view_campanha from "./view_campanha.js";
import * as homepage from "./homepage.js";

/* 

	Variaveis comuns para todas as views, a serem usadas nos fetchs 

*/
export let viewer = document.getElementById("viewer");
export const URI = "http://localhost:8080";
//ENUM com as rotas das views
export const rotas = {
	HOMEPAGE:'',
	CADASTRO_USUARIOS:'/usuarios/cadastro',
	LOGIN:'/login',
	CADASTRO_CAMPANHAS:'/campanha',
	PESQUISA_CAMPANHAS:'/campanha/pesquisa/',
	VIEW_CAMPANHAS:'/campanhas/'
};


/*

	Funções que manipulam dados da sessão

*/
export function salvarToken(token){
	window.sessionStorage.setItem('token', token);
}

export function getToken(){
	return window.sessionStorage.getItem('token');
}

export function getEmail(){
	return window.sessionStorage.getItem('email');
}

export function salvarEmail(email){
	window.sessionStorage.setItem('email', email);
}


//Nome do ID do template com o #
export function carregarTemplate(templateID, rotaDaView){
	//atualiza o URL
	location.hash = rotaDaView;

	//seleciona o template e insere na div viewer
	let template = document.querySelector(templateID);
	viewer.innerHTML = template.innerHTML;
}
/* 
    Função de mudança de view
        - Ativam o evento hashchange e a função carregaPagina
        do app.js executa a função de criar a view correspondente

*/
// Em caso de view da campanha, usar location.hash direto com = rotas['VIEW_CAMPANHAS'] + identificadorURL
export function mudarView(nomeDaView){
	console.log(nomeDaView)
	location.hash = nomeDaView;
}


//Botões de Navegação
let navHomepage = document.querySelector('#nav_homepage');
let navCadastroUsuario = document.querySelector('#nav_cadastrar_usuario');
let navLogin = document.querySelector('#nav_login');
let navCadastroCampanha = document.querySelector('#nav_cadastrar_campanha');
let navPesquisarCampanha = document.querySelector('#nav_pesquisar_campanha');

navHomepage.addEventListener('click', function(){mudarView(rotas.HOMEPAGE)});
navCadastroUsuario.addEventListener('click', function(){mudarView(rotas.CADASTRO_USUARIOS)});
navLogin.addEventListener('click', function(){mudarView(rotas.LOGIN)});
navCadastroCampanha.addEventListener('click', function(){mudarView(rotas.CADASTRO_CAMPANHAS)});
navPesquisarCampanha.addEventListener('click', function(){mudarView(rotas.PESQUISA_CAMPANHAS)});


/*
	Funcao que escolhe a view a ser renderizada com base 
	no link (carrega a pagina quando alguem digita o link direto)
*/
async function carregaPagina(){
	let hash = location.hash;
	let endereco = hash.substring(1,hash.length);
	console.log('endereco : ' + endereco);
	switch(endereco){
		case rotas.HOMEPAGE:
			homepage.montar_view();
			break;
		case rotas.CADASTRO_USUARIOS: 
			cadastro_usuario.montar_view();
			break;
		case rotas.LOGIN: 
			login.montar_view();
			break;
		case rotas.CADASTRO_CAMPANHAS:
			cadastro_campanha.montar_view();
			break;
		case rotas.PESQUISA_CAMPANHAS:
			pesquisa_campanha.montar_view();
			break;
		default: 
			let identificadorURL = endereco.substring(11, endereco.length);
			await view_campanha.montar_view(identificadorURL);
			break;
	}
		
}

carregaPagina();

window.addEventListener("hashchange", carregaPagina);
