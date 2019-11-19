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

function getEmail(){
	return window.sessionStorage.getItem('email');
}
function salvarEmail(email){
	window.sessionStorage.setItem('email', email);
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
						console.log(dados_resposta);
						//salva dados da sessão (token e email)
						salvarToken(dados_resposta.token);
						salvarEmail(email);
						console.log(sessionStorage);
						homepage();
					}else if(resposta.status == 400){
						alert('Email e/ou senha incorreto(s)!')
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

				else if(resposta.status == 400){
					alert('Email ja cadastrado!')
				}
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
	   //ano-mes-dia
       let data_limite = $formulario.data_limite.value;
       let meta = $formulario.meta.value;
	   let identificadorURL = criaURL(nome_curto);


	   console.log( data_limite);

	   //voltar com
	   (async () =>{
		   let resposta = await fetch(URI + '/campanhas',
				{
					"method":"POST",
					"body":`{"nomeCurto":"${nome_curto}",
								"Meta":"${meta}",
								"Descricao":"${descricao}",
								"identificadorURL":"${identificadorURL}",
								"emailDono":"${getEmail()}",
								"DataLimite":"${data_limite}"}`,
					"headers":{"Content-Type":"application/json","Authorization":`Bearer ${getToken()}`}
				});

		    if(resposta.status==201){
				let dados_resposta = await resposta.json();
				console.log(dados_resposta);
				alert('Campanha cadastrada! Para compartilhar a campanha use o link:\n' + URI + "#/campanha/"+identificadorURL);
				/* colocar acesso direto pra campanha */
		   } else if (resposta.status == 400)
				alert('Já existe campanha com esse nome');
		   else if(resposta.status == 401)
				alert('É necessário fazer login para usar esta função')
			else if(resposta.status == 500)
		   		console.log(resposta);

		   
	   

	   })();
	   
	   

       }


   );
}

/* Funcao que transforma uma string 
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
	location.hash = "#/campanha/pesquisa/";


	let template = document.querySelector('#pesquisa_da_campanha');
	$viewer.innerHTML = template.innerHTML;
	
	let botao = document.querySelector('#pesquisar_campanha');
	botao.addEventListener('click',
	
		function enviar_pesquisa(){
			console.log('enviando cadastro');
			let $formulario = document.querySelector("form");
			let pesquisa = $formulario.pesquisa.value;
			let checkbox = document.querySelector("#filtro_pesquisa");
			let filtro;

			if(checkbox.checked)
				filtro = "?todos=true";
			else
				filtro = "?todos=false";
			
			console.log(URI + '/pesquisa/' + pesquisa + filtro);
			(async ()=>{
				let resposta = await fetch(URI + '/pesquisa/' + pesquisa + filtro,
				{
					"method":"GET",
					'mode':'cors',
					"headers":{"Content-Type":"application/json","Authorization":`Bearer ${getToken()}`
					}
				});
				if(resposta.status == 202){
				console.log(resposta);
				let dados = await resposta.json();
				console.log(dados);

				let resultado_pesquisa = document.querySelector('#resultado_pesquisa');
				$viewer.innerHTML += resultado_pesquisa.innerHTML;
				
				let tabela = document.querySelector('table');
				dados.forEach(campanha => {
					let linha = document.createElement('tr');

					let nome_campanha = document.createElement('td');
					nome_campanha.innerText = campanha.nomeCurto;

					let data_limite = document.createElement('td');
					data_limite.innerText = campanha.dataLimite;

					let status = document.createElement('td');
					status.innerText = campanha.status;

					let meta = document.createElement('td');
					meta.innerText = campanha.doacoes + '/' + campanha.meta;
					
					//quando o caso 4 estiver pronto, colocar o link do botao
					let visualizar = document.createElement('td');
					let botao = document.createElement('button');
					botao.innerText = 'Visualizar campanha';
					visualizar.appendChild(botao);

					linha.appendChild(nome_campanha);
					linha.appendChild(data_limite);
					linha.appendChild(status);
					linha.appendChild(meta);
					linha.appendChild(visualizar);
					
					tabela.appendChild(linha);
				});
			}else

				console.log(resposta);

			})();
			
		}
	
	
	);



}

export function view_campanha(url_campanha){
	
	(async() =>{
		let resposta = await fetch(URI + url_campanha);
		
		if(resposta.status == 202){
			let campanha = await resposta.json();
			console.log(campanha);
			
			let template = document.querySelector('#view_campanha');
			$viewer.innerHTML = template.innerHTML;

			let formulario = document.querySelector('form');
			formulario.nome_curto.value = campanha.nomeCurto;
			formulario.status.value = campanha.status;
			
			formulario.meta.value = campanha.meta;
			formulario.data_limite.value = campanha.dataLimite;
			formulario.descricao.value = campanha.descricao;
			formulario.nome_usuario.value = campanha.usuarioDono.primeiroNome + ' ' + campanha.usuarioDono.ultimoNome;
			

			let editar_campanha = document.querySelector('#editar_campanha');
			editar_campanha.addEventListener('click', 
				function habilitar_formulario(){
					let inputs = document.querySelectorAll('form input');
					console.log(inputs)
					inputs.forEach(elemento =>{
						elemento.removeAttribute('readonly');

					});


				editar_campanha.innerText = "Salvar alterações";
				//fazer a funcao salvar alteracoes com metodo put
				editar_campanha.addEventListener('click', function salvar_alteracoes(){});



			});

			let num_likes = document.querySelector('#num_likes');
			num_likes.innerText += campanha.curtidas;

			let area_comentarios = document.querySelector('#area_comentarios');


			//trocar por um forEach que cria elementos e insere os comentários dentro da area
			area_comentarios.innerText = campanha.comentarios;




		}else{
			//trocar por uma view
			alert("Campanha nao encontrada");
			console.log(resposta);
		}



	})();






}

