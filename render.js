/* 
    Funcoes que renderizam as views da pagina
*/
let $viewer = document.getElementById("viewer");
let URI = "http://localhost:8080";

function salvarToken(token){
	window.sessionStorage.setItem('token', token);
}
function getToken(){
	return window.sessionStorage.getItem('token');
}


// Homepage vai ser implementada no caso 9
export function homepage(){
    let $template = document.querySelector("#homepage");
	$viewer.innerHTML = $template.innerHTML;
}



export function login(){
    
    //muda o url
	location.hash = "#/login";

	//seleciona o template do login e insere ele na div reservada pro formulário
    let $template = document.querySelector("#login");
	$viewer.innerHTML = $template.innerHTML;

	//Configura o botao p/ voltar pro formulario de cadastro
	let $botao = document.querySelectorAll("button")[1];
	$botao.addEventListener('click', cadastro_usuarios);

	//Configura o botao p/ mandar os dados de login
	let $cadastrar = document.querySelectorAll("button")[0];
	$cadastrar.addEventListener('click',

		function fazer_login(){
			console.log('fazendo login');
			let $formulario = document.querySelector("form");
			let email = $formulario.email.value;
			let senha = $formulario.senha.value;


			(async ()=>{
				let resposta = await fetch(URI + '/auth/login', 
				{
					"method": "POST",
					"body": `{"email":"${email}",
							  "senha":"${senha}"}`,
					"headers":{"Content-Type":"application/json"}
				})
					console.log("resposta:");
					console.log(resposta);
					
					if(resposta.status == 200){
						alert('Login realizado com sucesso!');
						let dados_resposta = await resposta.json();
						//console.log(dados_resposta);
						//salva dados da sessão (token e email)
						salvarToken(dados_resposta.token);
						window.sessionStorage.setItem('email',email);
						//console.log(sessionStorage);
						location.hash=""
					}
		   })();
				
			
		}
	)	
}	

//Renderiza o formulario de cadastro na página
export function cadastro_usuarios(){
	//muda o link 
	location.hash = "#/usuarios/cadastro";

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
				if(resposta.status == 201){cadastro_usuario_realizado()}

				else{console.log(resposta)}
			});

		}


	);
}

export function cadastro_usuario_realizado(){
    let $template = document.querySelector("#cadastro_realizado");
	$viewer.innerHTML = $template.innerHTML;

	let $login = document.querySelector("button");
	$login.addEventListener('click', login);
}


export function cadastro_campanha(){
    
    //atualiza o link
    location.hash = "#/campanha"

    //Recupera o template do login e insere ele na div reservada pro formulário
    let $template = document.querySelector("#cadastro_campanha");
    $viewer.innerHTML = $template.innerHTML;

    //Configura o botao p/ mandar os dados para o cadastro da campanha
	let $salvar = document.querySelector('#salvar_campanha');
    $salvar.addEventListener('click',

    function envia_cadastro_campanha(){
       console.log('enviando o cadastro da campanha');
       let $formulario = document.querySelector("form");
       let nome_curto = $formulario.nome_curto.value;
       let descricao = $formulario.descricao.value;
       let data_limite = $formulario.data_limite.value;
       let meta = $formulario.meta.value;
	   let identificadorURL = criaURL(nome_curto);
	   console.log('identificadorURL:');

	   console.log(identificadorURL);
	   

	   (async ()=>{
			let resposta = await fetch(URI + '/campanhas',
			{
				"method":"POST",
				"body":`{"nomeCurto":"${nome_curto}",
						 "Meta":"${meta}",
						 "Descricao":"${descricao}",
						 "identificadorURL":"${identificadorURL}",
						 "DataLimite":"${data_limite}"}`,
				"headers":{"Content-Type":"application/json","Authorization":`Bearer ${getToken()}`}
			})
			if(resposta.status == 201){
				let dados_resposta = await resposta.json();
				console.log(dados_resposta);
			}else{
				console.log(resposta);
			}
	   })();

       }


   );
}

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

export function cadastro_campanha_realizado(){
   let $template = document.querySelector("#cadastro_campanha_realizado");
   $viewer.innerHTML = $template.innerHTML;
}


//falta terminar o template, trocar as rotas do backend, ver se envia a pesquisa como json ou no link
export function pesquisa_campanha(){
	location.hash = "#/campanha/pesquisa";


	let template = document.querySelector('#pesquisa_da_campanha');
	$viewer.innerHTML = template.innerHTML;
	
	let botao = document.querySelector('#pesquisar_campanha');
	botao.addEventListener('click',
	
		function enviar_pesquisa(){
			console.log('enviando cadastro');
			let $formulario = document.querySelector("form");
			let pesquisa = $formulario.pesquisa.value;

			fetch(URI + '/campanha/pesquisa',
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
				

				console.log(resposta)
			});



		}
	
	
	);

}