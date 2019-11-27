import * as main from "./app.js";
import {calcularTotalDoacoes} from "./pesquisa_campanha.js";
/*

	Funções da View de Acesso direto à campanha 

*/

// url_campanha = campanha.identificadorURL
export function montar_view(url_campanha){

	(async function fetch_view_campanha(){
		let resposta = await fetch(main.URI + '/campanhas/'+ url_campanha,
		{
			"method":"GET",
			"headers":{"Content-Type":"application/json","Authorization":`Bearer ${main.getToken()}`
			}
		});
		
		if(resposta.status == 202){
			let campanha = await resposta.json();

			main.carregarTemplate('#view_campanha', '/campanhas/' + url_campanha);
			preencherInformacoesCampanha(campanha);

			/*
				BOTAO DOACOES - quando clicado abre uma div 
				com input e botoes necessarios para se fazer
				a doacao 
			*/
			let botao_doacoes = document.querySelector('#botao_doacoes');
			let divDoacao = document.querySelector('#nova_doacao');
			botao_doacoes.addEventListener('click', function(){
				divDoacao.setAttribute('style', "display:block");
				//quando clicado, faz a div de doacao desaparecer
				let botaoCancelarDoacao = document.querySelector('#cancelar_doacao');
				botaoCancelarDoacao.addEventListener('click', function() {
					divDoacao.setAttribute('style', "display:none");
				});

				//botao que envia os dados da doacao pro backend
				let botaoConfirmarDoacao = document.querySelector('#confirmar_doacao');
				botaoConfirmarDoacao.addEventListener('click',function enviarDoacao(){
					let valorDoacao = document.querySelector('#valor_doacao').value;
					let agora = new Date();
          			let data = agora.getFullYear() + '-' + (agora.getUTCMonth()+1) + '-' + agora.getDate();

					(async function fetchDoacao(){
						let resposta = await fetch(main.URI + '/doacoes', {
							"method":"POST",
							"body":`{"emailDono":"${main.getEmail()}",
									 "idCampanha":"${campanha.id}",
									 "valorDoado":"${valorDoacao}",
									 "dataPostagem":"${data}"
									}`,
							"headers":{"Content-Type":"application/json","Authorization":`Bearer ${main.getToken()}`}

						});
						if(resposta.status == 200){
							alert('Sua doação foi registrada com sucesso');
							divDoacao.setAttribute('style', "display:none");
							let valorDoacoes = calcularTotalDoacoes(campanha.doacoes);

							let campanhaFinalizada = campanha.meta <= valorDoacoes;
							
							let campanhaAtualizada = await resposta.json();
							// O motivo de se usar o valor que está na página e nao o atualizado é porque
							// dessa forma duas pessoas que estão doando ao mesmo tempo receberão essa mensagem
							// Essa ideia me pareceu mais interessante ao invés de deixar isso pra apenas 1 pessoa
							if((valorDoacoes + valorDoacao >= campanha.meta) && !campanhaFinalizada){
								alert('Graças a sua contribuição, a campanha pôde ser concluída! Muito Obrigado!');
								campanhaFinalizada = true;
							}
								let doacoes = document.querySelector('#doacoes_meta');
								doacoes.innerText = calcularTotalDoacoes(campanhaAtualizada.doacoes) + '/' + campanha.meta;
						}
						else{
							console.log(resposta);
						}

					})();

				});
			
			});
			/* 

				Botões e Funções relacionados à Área de Comentários 

			*/
			let botaoComentar = document.querySelector('#botao_comentar');
			botaoComentar.addEventListener('click', function mostrarTelaNovoComentario(){	

				let novo_comentario = factoryNovoComentario(campanha, false);
				area_comentarios.insertAdjacentElement('afterbegin', novo_comentario.caixa);
			});

			let area_comentarios = document.querySelector('#area_comentarios');
			
			construirAreaComentarios(campanha.comentarios);
			
			/* 

				Botão de curtidas

			*/
			console.log(campanha);
			let botaoCurtida = document.querySelector('#curtir');
			/*
				consultar se o usuario já curtiu a campanha
			*/
			let num_likes = document.querySelector('#num_likes');
			num_likes.innerText = campanha.curtidas.length;

			let curtiu = false;
			campanha.curtidas.forEach(curtida=>{
				if(curtida.usuario.email == main.getEmail()){
					curtiu = true
					botaoCurtida.setAttribute('style','color: blue;');
				}
					
			});
			/* Salvar a curtida do usuário */
			botaoCurtida.addEventListener('click', function(){

				(async function enviarCurtida(){
					let resposta = await fetch(main.URI + "/campanhas/curtida/" + campanha.id,
					{
						"method":"POST",
						"headers":{"Content-Type":"application/json","Authorization":`Bearer ${main.getToken()}`
						}
					});
					if(resposta.status == 202){ 
						/* Atualiza o botao de curtir e a contagem de curtidas */
						if(curtiu){
							botaoCurtida.removeAttribute('style');
							curtiu = false;
							
						}
						else{
							botaoCurtida.setAttribute('style','color: blue;');
							curtiu = true;
						}

						let campanhaAtualizada = await resposta.json();
						num_likes.innerText = '';
						num_likes.innerText = campanhaAtualizada.curtidas.length;

					}else{
						console.log(resposta);
					}

				})();

			});



		}else if (resposta.status == 404){
			//trocar por uma view
			alert("Campanha nao encontrada");
			console.log(resposta);
		}else if (resposta.status == 401){
			alert('É necessário fazer login para usar essa função');
		}else{
			console.log(resposta);

		}


	})();


}

function construirAreaComentarios(listaComentarios){
	let area_comentarios = document.querySelector('#area_comentarios');
	area_comentarios.innerHTML='';
	if(listaComentarios.length > 0){

		listaComentarios.forEach(comentario =>{

			let div_comentario = factoryComentario(comentario, 0);
			
			area_comentarios.appendChild(div_comentario.caixa);
		});
		
		

	}else{
		area_comentarios.innerHTML= '<p>&nbspEssa campanha ainda não possui nenhum comentário</p>';
	} 
	
}
/* 
	Cria um objeto que contém referências úteis:
		- referência para o objeto Comentário vindo do backend que conté, os dados de texto e usuario
		- referência para os elementos HTML que compõem a div que representa um comentário na DOM
		- referência para algumas funções que vão ser usadas por outros objetos/funções
*/
function factoryComentario(comentario, nivel){
	/* 
		Cria as referências dos elementos HTML
		Os atributos que começam em null dependem de alguma condição para existir
			Ex: Só existe botao de mostrar resposta se o comentário tiver pelo menos 1 resposta
	*/
	let template = document.querySelector('#formato_comentario');
	let caixa_comentario = document.createElement('div');
	caixa_comentario.innerHTML = template.innerHTML;

	let c = {
		objetoComentario: comentario,
		caixa: caixa_comentario.children[0],
		botaoResponderComentario: null,
		botaoMostrarRespostas: null,	
		botaoDeletarComentario: null,
		div_lista_respostas: null
	};

	c.nomeUsuario = c.caixa.children[0];
	c.textoComentario = c.caixa.children[2];
	c.botoes = c.caixa.children[5];


	adicionarClasseCSS(c.caixa, nivel);
	
	/* Coloca as informacoes do comentario dentro da caixa */
	(function preencherConteudo(){
		c.nomeUsuario.innerText = comentario.usuario.primeiroNome + " " + comentario.usuario.ultimoNome;
		c.textoComentario.innerHTML = comentario.texto;
	})();

	/* Faz a funcao de responder comentario */
	/*
		Esse if impede que a recursão dos comentários fique infinita
		Se quiser permitir que o usuario 
		faça a resposta da resposta da resposta... infinitamente, é 
		só tirar esse if
	*/
	if(nivel < 4){
		c.botaoResponderComentario = document.createElement('button');
		c.botaoResponderComentario.innerText = 'Responder Comentário';
		c.botoes.appendChild(c.botaoResponderComentario);
	
		c.botaoResponderComentario.addEventListener('click',function mostrarTelaNovoComentario(){			
			let novo_comentario = factoryNovoComentario(c, true);
			c.caixa.insertAdjacentElement('afterend', novo_comentario.caixa);
		});
	}

	/* 
		cria botao de mostrar respostas
	*/
	c.mostrar_respostas = function exibir_respostas(listaRespostas){
	
		if(listaRespostas.length > 0){
			if(c.botaoMostrarRespostas == null){
				c.botaoMostrarRespostas = document.createElement('button');
				c.botaoMostrarRespostas.innerText = 'Mostrar Respostas';
	
				c.div_lista_respostas = document.createElement('div');
				c.caixa.insertAdjacentElement('beforeend', c.div_lista_respostas);
			}
	
			
			c.botaoMostrarRespostas.addEventListener('click', 
				
				function mostrar_respostas(){
					c.div_lista_respostas.innerHTML = '';
					
					c.div_lista_respostas.innerHTML = '<hr><br>';
					listaRespostas.forEach(resposta =>{
						let div_resposta = factoryComentario(resposta, nivel+1);
						c.div_lista_respostas.appendChild(div_resposta.caixa);
					});
					this.removeEventListener('click', mostrar_respostas);
					this.innerText ='Esconder Respostas';
					this.addEventListener('click', function(){
						c.div_lista_respostas.innerHTML = '';
						c.botaoMostrarRespostas.innerText = 'Mostrar Respostas'; 
						c.botaoMostrarRespostas.addEventListener('click', mostrar_respostas);
					});
				}
			);
	
			c.botoes.appendChild(c.botaoMostrarRespostas);
	
		}
		};
	
		c.mostrar_respostas(c.objetoComentario.respostas);
	


	/*
		Cria o botao de deletar comentário
	*/
	if(main.getEmail() == comentario.usuario.email){
			let deletar_comentario = document.createElement('button');
			deletar_comentario.innerText = 'Deletar Comentário';
			c.botaoDeletarComentario = deletar_comentario;
			c.botoes.appendChild(deletar_comentario);



	
		c.botaoDeletarComentario.addEventListener('click', function(){
			let idComentario = c.objetoComentario.id;
			console.log(idComentario);
			(async function fetch_cadastro_usuario(){
				let resposta = await fetch(main.URI + '/comentarios/removerComentario/' + idComentario,
				{
					"method":"DELETE",
					"headers":{"Content-Type":"application/json","Authorization":`Bearer ${main.getToken()}`}
				});
				console.log(resposta)
				if(resposta.status == 201){
					alert('Comentário Excluído');
					let dados = await resposta.json();
					construirAreaComentarios(dados);
				}else{console.log(resposta)}


			})();

		});
	}


	
	return c;

}



// alvoComentario é a campanha em si ou o objeto que contem a postagem de comentario (gerado pelo factoryComentario)
function factoryNovoComentario(alvoComentario, ehResposta){
	let template = document.querySelector('#formato_novo_comentario');
	let caixa_comentario = document.createElement('div');
	caixa_comentario.innerHTML = template.innerHTML;

	let c = {
		alvoComentario: alvoComentario,
		caixa: caixa_comentario.children[0],
	};
	c.caixaTexto = c.caixa.children[1];
	c.botoes = c.caixa.children[3];
	c.botaoEnviarComentario = c.botoes.children[0];
	c.botaoCancelaComentario = c.botoes.children[1];

	/*
		Função do botão de enviar comentário
		1- enviar
		2- receber
		3- colocar novo comentario
		4- apagar a tela de escrever novo comentario
	*/

	c.botaoEnviarComentario.addEventListener('click',function enviarComentario(){

		let texto = c.caixaTexto.value;
		if(texto != ''){
			fetch_comentario(texto, ehResposta, alvoComentario,c.caixa);
		}else{alert('Você não enviar um comentário vazio!')}
		



	} );


	/* Botao de cancelar comentario */
	c.botaoCancelaComentario.addEventListener('click', function(){
		c.caixa.remove();
	});


	return c;
}
// Funcao que envia os dados do comentario pro backend
async function fetch_comentario(texto,ehResposta, alvoComentario, caixaDoComentario){
	
	let agora = new Date();
	let data = agora.getFullYear() + '-' + (agora.getUTCMonth()+1) + '-' + agora.getDate();

	if(ehResposta == true){  // Esse é o fetch quando o comentário criado é uma resposta
		let id = alvoComentario.objetoComentario.id;
		console.log(texto, data, id);
		let resposta = await fetch(main.URI + '/comentarios/adicionarResposta',
			{
				"method":"POST",
				"body":`{"texto":"${texto}",
						"dataPostagem":"${data}",
						"id": "${id}"}`,
				"headers":{"Content-Type":"application/json","Authorization":`Bearer ${main.getToken()}`}
			}
		);

		

		if(resposta.status == 201){
			let lista_atualizada = await resposta.json();
			caixaDoComentario.remove();
			alert('Seu comentário foi registrado');
			alvoComentario.mostrar_respostas(lista_atualizada);		
				
		}else{
			console.log(resposta);
		}

	}
	else{ //Esse é o fetch de quando o comentario for relacionado à campanha
		let id = alvoComentario.id; 
		let resposta = await fetch(main.URI + '/comentarios/adicionarComentario',
			{
				"method":"POST",
				"body":`{"texto":"${texto}",
						"dataPostagem":"${data}",
						"id": "${id}"}`,
				"headers":{"Content-Type":"application/json","Authorization":`Bearer ${main.getToken()}`}
			}
		);

		if(resposta.status == 201){

			let lista_atualizada = await resposta.json();
			alert('Seu comentário foi registrado');
			caixaDoComentario.parentNode.innerHTML= '';
			construirAreaComentarios(lista_atualizada);
		}else{
			console.log(resposta);
		}

	}
	



};

function preencherInformacoesCampanha(campanha){
			
	preencherCampo('nome_curto', campanha.nomeCurto);
	preencherCampo('status', campanha.status);
	preencherCampo('data_limite', campanha.dataLimite);
	preencherCampo('descricao', campanha.descricao);
	let doacoes = document.querySelector('#doacoes_meta');
	console.log(calcularTotalDoacoes(campanha.doacoes) )
	doacoes.innerText = calcularTotalDoacoes(campanha.doacoes) + '/' + campanha.meta;
	//preencherCampo('meta', campanha.meta);
	document.querySelector('#usuario_dono').innerText+= campanha.usuarioDono.primeiroNome + ' ' + campanha.usuarioDono.ultimoNome;
			

	if(campanha.usuarioDono.email == main.getEmail()){
		habilitarEdicaoCampanha(campanha);
	}

}


/*
	Cria um botao que habilita os inputs e altera a funcao
	 deste para fazer um fetch pra api
	 fazer botao de cancelar?
*/
function habilitarEdicaoCampanha(campanha){
	let botaoEditarCampanha = document.createElement('button');
	botaoEditarCampanha.setAttribute('id','#editar_campanha')
	botaoEditarCampanha.innerText = 'Editar Campanha';

	botaoEditarCampanha.addEventListener('click', 
		function habilitar_formulario(){
			let descricao = document.querySelector('#descricao');
			descricao.removeAttribute('readonly');
			botaoEditarCampanha.innerText = "Salvar alterações";
			//fazer a funcao salvar alteracoes com metodo put
			botaoEditarCampanha.addEventListener('click', function salvarAlteracoes(){



			(async function fetchEdicao(){
				console.log(descricao.value);
				console.log(campanha.identificadorURL);
					let resposta = await fetch(main.URI + "/campanhas/edicao", 
					{
							"method":"PUT",
							"body":`{"novaDescricao":"${descricao.value}",
									 "identificadorURL":"${campanha.identificadorURL}"
									}`,
							"headers":{"Content-Type":"application/json","Authorization":`Bearer ${main.getToken()}`}
					}	
					);
					
					if(resposta.status == 200){
						let campanhaAtualizada = await resposta.json();
						montar_view(campanhaAtualizada.identificadorURL);
					}
					else{
						console.log(resposta);
					}

			})();
		});

		}
	);
	let div_editar = document.querySelector('#edicao_campanha'); 
	div_editar.appendChild(botaoEditarCampanha);

}

// Só o nome do id, sem o #
function preencherCampo(idCampo, conteudo){
	document.querySelector('#' + idCampo).value = conteudo;
}



function adicionarClasseCSS(caixa, nivel){
	let classesCSS=['comentario','resposta','respostaN2'];
	caixa.classList.add(classesCSS[nivel % 3]);
}