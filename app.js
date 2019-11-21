import * as render from "/render.js";

//Botões de Navegação
let navHomepage = document.querySelector('#nav_homepage');
let navCadastroUsuario = document.querySelector('#nav_cadastrar_usuario');
let navLogin = document.querySelector('#nav_login');
let navCadastroCampanha = document.querySelector('#nav_cadastrar_campanha');
let navPesquisarCampanha = document.querySelector('#nav_pesquisar_campanha');

navHomepage.addEventListener('click', render.homepage);
navCadastroUsuario.addEventListener('click', render.cadastro_usuarios);
navLogin.addEventListener('click', render.login);
navCadastroCampanha.addEventListener('click', render.cadastro_campanha);
navPesquisarCampanha.addEventListener('click', render.pesquisa_campanha);


/*
	Funcao que escolhe a view a ser renderizada com base 
	no link (carrega a pagina quando alguem digita o link direto)
*/
(async function carregaPagina(){
	let hash = location.hash;
	let endereco = hash.substring(1,hash.length);
	console.log('endereco : ' + endereco);
	switch(endereco){
		case '':
			render.homepage();
			break;
		case '/usuarios/cadastro': 
			render.cadastro_usuarios();
			break;
		case '/login': 
			render.login();
			break;
		case '/campanha':
			render.cadastro_campanha();
			break;
		case '/campanha/pesquisa/':
			render.pesquisa_campanha();
			break;
		default: 
			let url_campanha = endereco.substring(11, endereco.length);
			await render.view_campanha(url_campanha);
			break;
	}
		
})();

//window.addEventListener("hashchange", carregaPagina);
