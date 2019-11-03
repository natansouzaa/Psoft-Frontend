
let $viewer = document.getElementById("viewer");


// Renderiza o formulario de login na página
function login(){
	//seleciona o template do login e insere ele na div reservada pro formulário
	let $template = document.querySelector("#login");
	$viewer.innerHTML = $template.innerHTML;

	//Configura o botao p/ voltar pro formulario de cadastro
	let $botao = document.querySelectorAll("button")[1];
	$botao.addEventListener('click', cadastro);

}

//Renderiza o formulario de cadastro na página
function cadastro(){
	//Recupera o template do login e insere ele na div reservada pro formulário
	let $template = document.querySelector("#cadastro");
	$viewer.innerHTML = $template.innerHTML;

	//Configura o botao p/ voltar pro formulario de login
	let $login = document.querySelectorAll("button")[1];
	$login.addEventListener('click', login);

	// ainda nao funciona, falta ajeitar coisas no backend
	//Configura o botao p/ mandar os dados para o cadastro
	let $cadastrar = document.querySelectorAll("button")[0];
	$cadastrar.addEventListener('click',

		function enviar_cadastro(){
			console.log('enviando cadastro')
			let $formulario = document.querySelector("form");
			let primeiro_nome = $formulario.primeiro_nome.value;
			let ultimo_nome = $formulario.ultimo_nome.value;
			let email = $formulario.email.value;
			let cartao = $formulario.cartao.value;
			let senha = $formulario.senha.value;

			fetch(URI + '/usuarios',{
				'method': 'POST',
				// Precisa ser tudo na msm linha?
				'body':`{'primeiroNome':'${primeiro_nome}',
						 'ultimoNome': '${ultimo_nome}',
						 'email': ${email},
						 'cartaoDeCredito': ${cartao},
						 'senha': ${senha}
						}`,
				'headers': {'Content-Type':'application/json'}

			})
			.then(resposta => resposta.json())
			// Ajeitar o tratamento da resposta, coloca um aviso de usuario criado (ou nao)
			.then(console.log(resposta))

		}







	);
}

//apenas para testes, enquanto nao tem deploy
login();
