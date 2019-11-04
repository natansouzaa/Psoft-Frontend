
let $viewer = document.getElementById("viewer");
let URI = "http://localhost:8080"

// Renderiza o formulario de login na página
function login(){
	//seleciona o template do login e insere ele na div reservada pro formulário
	let $template = document.querySelector("#login");
	$viewer.innerHTML = $template.innerHTML;

	//Configura o botao p/ voltar pro formulario de cadastro
	let $botao = document.querySelectorAll("button")[1];
	$botao.addEventListener('click', cadastro);

	//Configura o botao p/ mandar os dados de login
	let $cadastrar = document.querySelectorAll("button")[0];
	$cadastrar.addEventListener('click',

		function fazer_login(){
			console.log('fazendo login');
			let $formulario = document.querySelector("form");
			let email = $formulario.email.value;
			let senha = $formulario.senha.value;

			fetch(URI + '/auth/login', 
				{
					"method": "POST",
					"body": `{"email":"${email}",
							  "senha":"${senha}"}`,
					"headers":{"Content-Type":"application/json"}
				}
			)
			.then(resposta =>resposta.json())
			/* Mudar para: if codigo = ok, aparecer o usuario logado em algum canto da tela e armazenar o token jwt paras as futuras requisicoes */
			.then(r =>{console.log(r)}) 
		}
	)	
}	

//Renderiza o formulario de cadastro na página
function cadastro(){
	//Recupera o template do login e insere ele na div reservada pro formulário
	let $template = document.querySelector("#cadastro");
	$viewer.innerHTML = $template.innerHTML;

	//Configura o botao p/ voltar pro formulario de login
	let $login = document.querySelectorAll("button")[1];
	$login.addEventListener('click', login);

	//Configura o botao p/ mandar os dados para o cadastro
	let $cadastrar = document.querySelectorAll("button")[0];
	$cadastrar.addEventListener('click',

		function enviar_cadastro(){
			console.log('enviando cadastro');
			let $formulario = document.querySelector("form");
			let primeiro_nome = $formulario.primeiro_nome.value;
			let ultimo_nome = $formulario.ultimo_nome.value;
			let email = $formulario.email.value;
			let cartao = $formulario.cartao.value;
			let senha = $formulario.senha.value;

			fetch(URI + '/usuarios',
				{
					"method":"POST",
					"body":`{"primeiroNome":"${primeiro_nome}",
							 "ultimoNome":"${ultimo_nome}",
							 "email":"${email}",
							 "cartaoDeCredito":"${cartao}",
							 "senha": "${senha}"}`,
					"headers":{"Content-Type":"application/json"}
				})
			.then(resposta => resposta.json())
			// Ajeitar o tratamento da resposta, coloca um aviso de usuario criado (ou nao)
			// como tratar a excecao pra só aparecer um aviso de usuario ja existente?
			.then(r => {console.log(r)})

		}







	);
}

//apenas para testes, enquanto nao tem o mapeamento das rotas
login();
