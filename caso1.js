let $viewer = document.getElementById("viewer");
let URI = "http://localhost:8080";


// Renderiza o formulario de login na página
function login(){
	//muda o url
	location.hash = "#login";

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
			.then(r =>{console.log(r)}
			
			) 
		}
	)	
}	

//Renderiza o formulario de cadastro na página
function cadastro(){
	//muda o link 
	//window.history.replaceState(null, "", "#login");
	location.hash = "#cadastro";

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
			.then(resposta => {
				if(resposta.status == "201"){cadastro_realizado()}

				else{console.log(resposta)}
			});

		}


	);
}

function cadastro_realizado(){
	let $template = document.querySelector("#cadastro_realizado");
	$viewer.innerHTML = $template.innerHTML;

	let $login = document.querySelector("button");
	$login.addEventListener('click', login);
}

//apenas para testes, enquanto nao tem o mapeamento das rotas
 login();

function cadastro_campanha(){

 	//Recupera o template do login e insere ele na div reservada pro formulário
	let $template = document.querySelector("#cadastro_campanha");
	$viewer.innerHTML = $template.innerHTML;

	//Configura o botao p/ mandar os dados para o cadastro da campanha
	let $cadastrar = document.querySelectorAll("button")[0];
	$cadastrar.addEventListener('click',

	function envia_cadastro_campanha(){
		console.log('enviando o cadastro da campanha');
		let $formulario = document.querySelectorAll("form");
		let nome_curto = $formulario.nome_curto.value;
		let descricao = $formulario.descricao.value;
		let data_limite = $formulario.data_limite.value;
		let meta = $formulario.meta.value;
		let identificadorURL = criaURL(nome_curto);

		fetch(URI + '/campanhas',
				{
					"method":"POST",
					"body":`{"nomeCurto":"${nome_curto}",
							 "Meta":"${meta}",
							 "Descricao":"${descricao}",
							 "identificadorURL":"${identificadorURL},
							 "DataLimite":"${data_limite}"`,
					"headers":{"Content-Type":"application/json"}
				})
			.then(resposta => {
				if(resposta.status == "201"){cadastro_campanha_realizado()}

				else{console.log(resposta)}
			});

		}


	);
}

function cadastro_campanha_realizado(){
	let $template = document.querySelector("#cadastro_campanha_realizado");
	$viewer.innerHTML = $template.innerHTML;
}

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
//para lidar com o token: pesquisar sobre
//localStorage ou indexedDB
function carregaPagina(){
	let hash = location.hash;
	console.log(hash);
	let endereco = hash.substring(1,hash.length);
	this.console.log("endereco: " + endereco);
	/* Estruturar esse if com
		const paginas={
			home: function homepage,
			cadastro: function cadastro,
			


		}
		paginas[homepage]()
		ou callback( paginas[homepage] )


	*/
	if(endereco == "login")
		login();
	else if(endereco == "cadastro")
		cadastro();
	/* Caso nao tenha nada, carrega a pagina inicial
		Tá comentado pq eu nao fiz a homepage ainda
	else
		homepage();
	*/
}
carregaPagina();

async function carregaLink(){
	await window.addEventListener("hashchange", carregaPagina)
}
carregaLink();