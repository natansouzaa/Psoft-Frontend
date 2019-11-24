import * as main from "./app.js";
/* 

	Funções da View de Cadastro de Usuários

*/

export function montar_view(){

	main.carregarTemplate('#cadastro_usuarios','#/usuarios/cadastro');
	
	//Configura o botao p/ voltar pro formulario de login
	let botaoirLogin = document.querySelector("#ir_para_login");
	botaoirLogin.addEventListener('click', function(){main.mudarView(main.rotas.LOGIN)});

	//Configura o botao p/ mandar os dados para o cadastro
	let botaoCadastrar = document.querySelector("#cadastrar");
	botaoCadastrar.addEventListener('click', enviar_cadastro);
}

function enviar_cadastro(){
	let primeiro_nome = document.querySelector("#primeiro_nome").value;
	let ultimo_nome = document.querySelector("#ultimo_nome").value;
	let email = document.querySelector("#email").value;
	let cartao = document.querySelector("#cartao").value;
	let senha = document.querySelector("#senha").value;

	(async function fetch_cadastro_usuario(){
		let resposta = await fetch(main.URI + '/usuarios',
		{
			"method":"POST",
			"body":`{"primeiroNome":"${primeiro_nome}",
					 "ultimoNome":"${ultimo_nome}",
					 "email":"${email}",
					 "cartaoDeCredito":"${cartao}",
					 "senha": "${senha}"}`,
			"headers":{"Content-Type":"application/json"}
		});

		if(resposta.status == 201)
			cadastro_usuario_realizado();

		else if(resposta.status == 400)
			alert('Email ja cadastrado!');
		
	})();
	
}

function cadastro_usuario_realizado(){

    let template = document.querySelector("#cadastro_usuario_realizado");
	viewer.innerHTML = template.innerHTML;

	let botaoLogin = document.querySelector("#ir_para_login");
	botaoLogin.addEventListener('click', function(){
		main.mudarView(main.rotas.LOGIN);
	});

}