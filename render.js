/* 
    Funcoes que renderizam as views da pagina
*/
let viewer = document.getElementById("viewer");
let URI = "http://localhost:8080";

/*

	Funções que manipulam dados da sessão

*/
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


//Só o nome do ID do template já serve, não precisa colocar o #
function carregarTemplate(templateID, locationHash){
	//atualiza o URL
	location.hash = locationHash;

	//seleciona o template e insere na div viewer
	let template = document.querySelector('#' + templateID);
	viewer.innerHTML = template.innerHTML;
}

/* 
	Funções que carregam as views, atualizando os links logo em seguida
*/

/* 

	Funções da View de Login
	Homepage vai ser implementada no caso 9

*/
export function homepage(){
    let $template = document.querySelector("#homepage");
	viewer.innerHTML = $template.innerHTML;
}




/* 

	Funções da View de Login

*/
export function login(){
	carregarTemplate('login', '#/login');

	//Configura o botao p/ voltar pro formulario de cadastro de usuarios
	let botao = document.querySelector("#ir_para_cadastro");
	botao.addEventListener('click', cadastro_usuarios);

	//Configura o botao p/ mandar os dados de login
	let botaoLogin = document.querySelector("#logar");
	botaoLogin.addEventListener('click', fazer_login);	
		
}	

function fazer_login(){
	console.log('fazendo login');
	let email = document.querySelector('#email_usuario').value;
	let senha = document.querySelector('#senha').value;

	(async function fetch_login(){
		let resposta = await fetch(URI + '/auth/login', 
		{
			"method": "POST",
			"body": `{"email":"${email}",
					  "senha":"${senha}"}`,
			"headers":{"Content-Type":"application/json"}
		});
			
		if(resposta.status == 200){

			alert('Login realizado com sucesso!');
			let dados_resposta = await resposta.json();

			salvarToken(dados_resposta.token);
			salvarEmail(email);

			//retorna para a view da pagina inicial
			homepage();

		}else if(resposta.status == 400)
			alert('Email e/ou senha incorreto(s)!')
		
   })();
}




/* 

	Funções da View de Cadastro de Usuários

*/
export function cadastro_usuarios(){

	carregarTemplate('cadastro_usuarios','#/usuarios/cadastro');
	
	//Configura o botao p/ voltar pro formulario de login
	let botaoirLogin = document.querySelector("#ir_para_login");
	botaoirLogin.addEventListener('click', login);

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
		let resposta = await fetch(URI + '/usuarios',
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

export function cadastro_usuario_realizado(){

    let template = document.querySelector("#cadastro_usuario_realizado");
	viewer.innerHTML = template.innerHTML;

	let botaoTesteLogin = document.querySelector("button");
	botaoTesteLogin.addEventListener('click', login);

}




/*

	Funções da view de Cadastro de Campanhas

*/
export function cadastro_campanha(){
	
	carregarTemplate('cadastro_campanha', '#/campanha');

    //Configura o botao p/ mandar os dados para o cadastro da campanha
	let botaoSalvar = document.querySelector('#salvar_campanha');
    botaoSalvar.addEventListener('click', envia_cadastro_campanha);
}


function envia_cadastro_campanha(){
	let nome_curto = document.querySelector("#nome_curto").value;
	let descricao = document.querySelector("#descricao").value;
	//configurar formato da data para : ano-mes-dia
	let data_limite = document.querySelector("#data_limite").value;
	let meta = document.querySelector("#meta").value;

	let identificadorURL = criaURL(nome_curto);


	console.log( data_limite);

	(async function fetch_cadastro_campanha(){
		let resposta = await fetch(URI + '/campanhas',
			 {
				 "method":"POST",
				 "body":`{"nomeCurto":"${nome_curto}",
							 "meta":"${meta}",
							 "descricao":"${descricao}",
							 "identificadorURL":"${identificadorURL}",
							 "emailDono":"${getEmail()}",
							 "dataLimite":"${data_limite}"}`,
				 "headers":{"Content-Type":"application/json","Authorization":`Bearer ${getToken()}`}
			 });

		if(resposta.status==201){

			 let dados_resposta = await resposta.json();
			 console.log(dados_resposta);
			 view_campanha(identificadorURL);
			 alert('Campanha cadastrada! Para compartilhar a campanha use o link:\n' + URI + "#/campanha/"+identificadorURL);
			 
		} else if (resposta.status == 400)
			 alert('Já existe campanha com esse nome');

		else if(resposta.status == 401)
			alert('É necessário fazer login para usar esta função');

		else if(resposta.status == 500)
			console.log(resposta);

	})();	

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




/*

	Funções da view de Pesquisa de Campanhas

*/
export function pesquisa_campanha(){
	
	carregarTemplate('pesquisa_da_campanha','#/campanha/pesquisa/');
	
	//Configura o botão que envia os dados necessários para pesquisar as campanhas p/ o backend
	let botao = document.querySelector('#botao_pesquisar_campanha');
	botao.addEventListener('click',	enviar_pesquisa);

}

//Função que envia os dados necessários p/ o backend
function enviar_pesquisa(){

	let campo_pesquisa = document.querySelector("#campo_pesquisa").value;	
	let checkbox = document.querySelector("#filtro_pesquisa");
	let filtro;
	//atualizar o endereco
	if(checkbox.checked)
		filtro = "?todos=true";
	else
		filtro = "?todos=false";
	
	(async function fetch_pesquisa(){
		console.log(URI + '/pesquisa/' + campo_pesquisa + filtro)
		let resposta = await fetch(URI + '/campanhas/pesquisa/' + campo_pesquisa + filtro,
		{
			"method":"GET",
			"headers":{"Content-Type":"application/json","Authorization":`Bearer ${getToken()}`
			}
		});
		console.log(resposta)

		if(resposta.status == 202){
			let dados = await resposta.json();
			/* Inserindo o começo da tabela que mostra o resultado da busca */
			let div_resultado = document.querySelector('#resultado');
			let resultado_pesquisa = document.querySelector('#resultado_pesquisa');
			div_resultado.innerHTML = resultado_pesquisa.innerHTML;
		
			/* Inserindo os dados na tabela */
			let tabela = document.querySelector('table');

			dados.forEach(campanha => {

				let nome_campanha = criarCelula(campanha.nomeCurto);
				let data_limite = criarCelula(campanha.dataLimite);
				let status = criarCelula(campanha.status);
				let meta = criarCelula(campanha.doacoes + '/' + campanha.meta);
			
				/* Criando botao de visualizar a campanha encontrada */
				let visualizar = document.createElement('td');
				let botao = document.createElement('button');
				botao.innerText = 'Visualizar campanha';

				botao.addEventListener('click', 
					function visualizar_campanha(){ // essa funcao tem que ficar aqui por causa do closure
						console.log(campanha.identificadorURL);
						view_campanha(campanha.identificadorURL);
						
					}				
				);

				visualizar.appendChild(botao);
				
				
				let celulas = [nome_campanha, data_limite, status, meta, visualizar];
				let linha = criarLinha(celulas);

				tabela.appendChild(linha);
		});

	}//else if(resposta.status == 404){
	// 	alert('Não foi encontrada nenhuma campanha com esses parâmetros');
	// }
	else

		console.log(resposta);

	})();
	
}
//Funções para ajudar na criação da tabela resultado
// testar só adicionando com o appendchild
function criarCelula(conteudo){
	let celula = document.createElement('td');
	celula.innerText = conteudo;
	return celula;
}

function criarLinha(arrayComCelulas){
	let linhaTabela = document.createElement('tr');

	arrayComCelulas.forEach(celula => {
		linhaTabela.appendChild(celula);
	});

	return linhaTabela;
}

/*

	Funções da View de Acesso direto à campanha 

*/

// url_campanha = campanha.identificador_unico
export function view_campanha(url_campanha){

	(async function fetch_view_campanha(){
		let resposta = await fetch(URI + '/campanhas/'+ url_campanha,
		{
			"method":"GET",
			"headers":{"Content-Type":"application/json","Authorization":`Bearer ${getToken()}`
			}
		});
		
		if(resposta.status == 202){
			let campanha = await resposta.json();

			carregarTemplate('view_campanha', '/campanhas/' + url_campanha);
			preencherInformacoesCampanha(campanha);

			let botaoComentar = document.querySelector('#botao_comentar');
			botaoComentar.addEventListener('click', function mostrarTelaNovoComentario(){
				
				let novo_comentario = criarNovoComentario(campanha.id);
				area_comentarios.insertAdjacentElement('afterbegin', novo_comentario);

			});

			let area_comentarios = document.querySelector('#area_comentarios');
			
			if(campanha.comentarios.length > 0){
				//mudar essa funcao pra ela ficar mais geral, pra executar ela denovo quando um novo comentario foi criado
				(function construirAreaComentarios(){
					campanha.comentarios.forEach(comentario =>{
						let div_comentario = criarComentario(comentario);
						div_comentario.classList.add('comentario');


						let respostas = document.createElement('div');

						if(comentario.respostas.length > 0){

							let mostrar_respostas = document.createElement('button');
							mostrar_respostas.innerText = 'Mostrar respostas';
							div_comentario.lastChild.appendChild(mostrar_respostas);

							mostrar_respostas.addEventListener('click', 
								
								function mostrar_respostas(){
									comentario.respostas.forEach(resposta =>{
										let div_resposta = criarComentario(resposta);
										div_resposta.classList.add('resposta');
										respostas.appendChild(div_resposta);
									});
									this.removeEventListener('click', mostrar_respostas);
								}
						);

						

					} 
					if(getEmail() == comentario.usuario.email){
						let deletar_comentario = document.createElement('button');
						deletar_comentario.innerText = 'Deletar Comentário';
						div_comentario.lastChild.appendChild(deletar_comentario);
					}

					area_comentarios.appendChild(div_comentario);
					area_comentarios.appendChild(respostas);
				});


			})();
			}else 
				area_comentarios.innerHTML= '<p>&nbspEssa campanha ainda não possui nenhum comentário</p>';

			let botao_doacoes = document.querySelector('#botao_doacoes');
			let lista_doacoes = document.querySelector('#lista_doacoes');
			botao_doacoes.addEventListener('click', function(){
				lista_doacoes.setAttribute('style', 'display: block;')
			});



		}else{
			//trocar por uma view
			alert("Campanha nao encontrada");
			console.log(resposta);
		}


	})();


}


function criarNovoComentario(idAlvoComentario){
	let div_comentario = document.createElement('div');
	div_comentario.setAttribute('id','novo_comentario');

	div_comentario.innerHTML += '<br>';

	let texto = document.createElement('textarea');
	texto.setAttribute('id','texto_novo_comentario');

	div_comentario.appendChild(texto);

	
	div_comentario.innerHTML += '<hr>';

	let botoes = document.createElement('div');
	div_comentario.appendChild(botoes);

	let enviar_comentario = document.createElement('button');
	enviar_comentario.setAttribute('id', 'enviar_comentario');
	botoes.appendChild(enviar_comentario);
	enviar_comentario.innerText='Enviar comentario';

	let cancelar_comentario = document.createElement('button');
	cancelar_comentario.setAttribute('id', 'cancelar_comentario');
	botoes.appendChild(cancelar_comentario);
	cancelar_comentario.innerText='Cancelar comentario';

	//funcao de enviar comentario
	enviar_comentario.addEventListener('click', function enviarComentario(){
		
		(async function fetch_comentario(){
			let texto = document.querySelector('#texto_novo_comentario').value;
			let agora = new Date();
			let data = agora.getFullYear() + '-' + (agora.getUTCMonth()+1) + '-' + agora.getDate();
			let id = idAlvoComentario; 

			let resposta = await fetch(URI + '/comentarios/adicionarComentario',
				{
					"method":"POST",
					"body":`{"texto":"${texto}",
							  "dataPostagem":"${data}",
							  "id": "${id}"}`,
					"headers":{"Content-Type":"application/json","Authorization":`Bearer ${getToken()}`}
				}
				
			);
			if(resposta.status == 201){
				let lista_atualizada = await resposta.json();
				//construirAreaComentarios();
			}else{
				console.log(resposta);
			}
			

		})();



	});

	return div_comentario;
}
function preencherInformacoesCampanha(campanha){
			
	preencherCampo('nome_curto', campanha.nomeCurto);
	preencherCampo('status', campanha.status);
	preencherCampo('data_limite', campanha.dataLimite);
	preencherCampo('descricao', campanha.descricao);
	preencherCampo('meta', campanha.meta);
	document.querySelector('#usuario_dono').innerText+= campanha.usuarioDono.primeiroNome + ' ' + campanha.usuarioDono.ultimoNome;
			

	if(campanha.usuarioDono.email == getEmail()){
		habilitarEdicaoCampanha();
	}

	let num_likes = document.querySelector('#num_likes');
	num_likes.innerText += campanha.curtidas;

	let num_comentarios = document.querySelector('#num_comentarios');
	num_comentarios.innerText += campanha.comentarios.length;




}

function criarComentario(comentario){
	let div_comentario = document.createElement('div');

	let nome_usuario = document.createElement('p');
	nome_usuario.innerHTML = comentario.usuario.primeiroNome + " " + comentario.usuario.ultimoNome;
	div_comentario.appendChild(nome_usuario);

	div_comentario.innerHTML += '<hr>';

	let texto = document.createElement('div');
	texto.innerHTML = comentario.texto;
	div_comentario.appendChild(texto);

	div_comentario.innerHTML += '<br>';
	div_comentario.innerHTML += '<hr>';

	let botoes = document.createElement('div');
	div_comentario.appendChild(botoes);

	let responder_comentario = document.createElement('button');
	botoes.appendChild(responder_comentario);
	responder_comentario.innerText='Responder comentario';
	responder_comentario.addEventListener('click', function enviar_reposta(){
		criarNovoComentario(comentario.id);
	});
	
	return div_comentario;
}

/* isso aqui é uma outra forma de fazer os comentarios

	se eu tiver tempo eu experimento dessa forma
	senao, só excluir isso dps

*/
function Comentario(comentario){
	let template = document.querySelector('#formato_comentario');
	let caixa_comentario = document.createElement('div');
	caixa_comentario.innerHTML = template.innerHTML;

	let c = {
		objetoComentario: comentario,
		caixa: caixa_comentario.children[0],
		//caixa: template.innerHTML,
		//preencherCaixa: function(){caixa.innerHTML = template.innerHTML},
		nomeUsuario: this.caixa.children[0],
		textoComentario: this.caixa.children[2],
		botoes: this.caixa.children[5],
		botaoResponderComentario: this.botoes.children[0],
		botaoMostrarRespostas: this.botoes.children[1],

		preencherConteudo : function(){
			this.nomeUsuario.innerText = comentario.usuarioDono.primeiroNome + " " + comentario.usuarioDono.ultimoNome;
			this.textoComentario.innerHTML = comentario.texto;

		},
		
	};
	/*
		Cria o botao de deletar comentário
	*/
	if(getEmail() == comentario.usuario.email){
			let deletar_comentario = document.createElement('button');
			deletar_comentario.innerText = 'Deletar Comentário';
			c.botaoDeletarComentario = deletar_comentario;
			c.botoes.lastChild.appendChild(deletar_comentario);
	}
	
	
	return c;

}





//Cria um botao que habilita os inputs e altera a funcao deste para fazer um fetch pra api
function habilitarEdicaoCampanha(){
	let botaoEditarCampanha = document.createElement('button');
	botaoEditarCampanha.setAttribute('id','#editar_campanha')
	botaoEditarCampanha.innerText = 'Editar Campanha';

	botaoEditarCampanha.addEventListener('click', 
		function habilitar_formulario(){

			let inputs = document.querySelectorAll('div input');
			console.log(inputs)
			inputs.forEach(elemento =>{
				elemento.removeAttribute('readonly');

			});

			let descricao = document.querySelector('#descricao');
			descricao.removeAttribute('readonly');
		botaoEditarCampanha.innerText = "Salvar alterações";
		//fazer a funcao salvar alteracoes com metodo put
		botaoEditarCampanha.addEventListener('click', function salvar_alteracoes(){});



		}
	);
	let div_editar = document.querySelector('#edicao_campanha'); 
	div_editar.appendChild(botaoEditarCampanha);

}

// Só o nome do id, sem o #
function preencherCampo(idCampo, conteudo){
	document.querySelector('#' + idCampo).value = conteudo;
}
