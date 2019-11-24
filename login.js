import * as main from "./app.js";

/* 

	Funções da View de Login

*/
export function montar_view(){
	main.carregarTemplate('#login', '#/login');

	//Configura o botao p/ voltar pro formulario de cadastro de usuarios
	let botao = document.querySelector("#ir_para_cadastro");
	botao.addEventListener('click', function(){main.mudarView(main.rotas.CADASTRO_USUARIOS);});

	//Configura o botao p/ mandar os dados de login
	let botaoLogin = document.querySelector("#logar");
	botaoLogin.addEventListener('click', fazer_login);	
		
}	

function fazer_login(){
	console.log('fazendo login');
	let email = document.querySelector('#email_usuario').value;
	let senha = document.querySelector('#senha').value;

	(async function fetch_login(){
		let resposta = await fetch(main.URI + '/auth/login', 
		{
			"method": "POST",
			"body": `{"email":"${email}",
					  "senha":"${senha}"}`,
			"headers":{"Content-Type":"application/json"}
		});
			
		if(resposta.status == 200){

			alert('Login realizado com sucesso!');
			let dados_resposta = await resposta.json();

			main.salvarToken(dados_resposta.token);
			main.salvarEmail(email);

			//retorna para a view da pagina inicial
			main.mudarView(main.rotas.HOMEPAGE);

		}else if(resposta.status == 400)
			alert('Email e/ou senha incorreto(s)!')
		
   })();
}


