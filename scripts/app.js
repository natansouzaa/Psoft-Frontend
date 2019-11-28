import * as login from "./login.js";
import * as cadastro_usuario from "./cadastro_usuario.js";
import * as cadastro_campanha from "./cadastro_campanha.js";
import * as pesquisa_campanha from "./pesquisa_campanha.js";
import * as view_campanha from "./view_campanha.js";
import * as homepage from "./homepage.js";
import * as view_usuario from "./view_usuario.js";


/* 

	Variaveis comuns para todas as views, a serem usadas nos fetchs 

*/
export let viewer = document.getElementById("viewer");
export const URI = "https://aquijuntosdoandoesperanca.herokuapp.com/";
//ENUM com as rotas das views
export const rotas = {
	HOMEPAGE:'',
	CADASTRO_USUARIOS:'/usuarios/cadastro',
	LOGIN:'/login',
	CADASTRO_CAMPANHAS:'/campanhas/cadastro',
	PESQUISA_CAMPANHAS:'/campanhas/pesquisa',
	VIEW_CAMPANHAS:'/campanhas/',
	VIEW_USUARIOS:'/usuarios/' 
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
// Em caso de view da campanha, usar com: rotas.['VIEW_CAMPANHAS'] + identificadorURL
export function mudarView(nomeDaView){
	location.hash = nomeDaView;
}


/*
	Funcao que escolhe a view a ser renderizada com base 
	no link (carrega a pagina quando alguem digita o link direto)
*/
async function carregaPagina(){
    let hash = location.hash;
    let endereco = hash.substring(1,hash.length);

    if (endereco === rotas.HOMEPAGE){
        homepage.montar_view();
    } else if (endereco === rotas.CADASTRO_USUARIOS){
        cadastro_usuario.montar_view();
    } else if (endereco === rotas.LOGIN){
        login.montar_view();
    } else if (endereco === rotas.CADASTRO_CAMPANHAS){
        cadastro_campanha.montar_view();
    } else if (endereco === rotas.PESQUISA_CAMPANHAS){
        pesquisa_campanha.montar_view();
    } else if (endereco.includes(rotas.VIEW_CAMPANHAS)){
        let identificadorURL = endereco.substring(11, endereco.length); 
        await view_campanha.montar_view(identificadorURL);
    } else if (endereco.includes(rotas.VIEW_USUARIOS)){
		let email = endereco.substring(10, endereco.length);
        await view_usuario.montar_view(email);
    }

}
carregaPagina();

window.addEventListener("hashchange", carregaPagina);
