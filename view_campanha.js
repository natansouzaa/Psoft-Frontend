import * as main from "./app.js";

/*

	Funções da View de Acesso direto à campanha 

*/

// url_campanha = campanha.identificador_unico
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

			/* Voltar a mexer nisso quando for o caso de listar doacoes */
			let botao_doacoes = document.querySelector('#botao_doacoes');
			let lista_doacoes = document.querySelector('#lista_doacoes');
			botao_doacoes.addEventListener('click', function(){
				lista_doacoes.setAttribute('style', 'display: block;')
			});

			let botaoComentar = document.querySelector('#botao_comentar');
			botaoComentar.addEventListener('click', function mostrarTelaNovoComentario(){			
				let novo_comentario = factoryNovoComentario(campanha, false);
				area_comentarios.insertAdjacentElement('afterbegin', novo_comentario.caixa);
			});

			let area_comentarios = document.querySelector('#area_comentarios');
			
			construirAreaComentarios(campanha.comentarios);
			
				



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
	if(listaComentarios.length > 0){
		listaComentarios.forEach(comentario =>{

			let div_comentario = Comentario(comentario, 'comentario');
			
			area_comentarios.appendChild(div_comentario.caixa);
		});
		
		

	}else{
		area_comentarios.innerHTML= '<p>&nbspEssa campanha ainda não possui nenhum comentário</p>';
	} 
	
}
/* isso aqui é uma outra forma de fazer os comentarios

	se eu tiver tempo eu experimento dessa forma
	senao, só excluir isso dps

*/
function Comentario(comentario, classe){
	let template = document.querySelector('#formato_comentario');
	let caixa_comentario = document.createElement('div');
	caixa_comentario.innerHTML = template.innerHTML;

	let c = {
		objetoComentario: comentario,
		caixa: caixa_comentario.children[0],
		nomeUsuario: caixa_comentario.children[0].children[0],
		textoComentario: caixa_comentario.children[0].children[2],
		botoes: caixa_comentario.children[0].children[5],
		botaoResponderComentario: caixa_comentario.children[0].children[5].children[0],
		botaoMostrarRespostas: caixa_comentario.children[0].children[5].children[1],	
		botaoDeletarComentario: null
	};


	c.caixa.classList.add(classe);
	/* Coloca as informacoes do comentario dentro da caixa */
	(function preencherConteudo(){
		c.nomeUsuario.innerText = comentario.usuario.primeiroNome + " " + comentario.usuario.ultimoNome;
		c.textoComentario.innerHTML = comentario.texto;
	})();
	/*
		Cria o botao de deletar comentário
	*/
	if(main.getEmail() == comentario.usuario.email){
			let deletar_comentario = document.createElement('button');
			deletar_comentario.innerText = 'Deletar Comentário';
			c.botaoDeletarComentario = deletar_comentario;
			c.botoes.appendChild(deletar_comentario);
	}
	/* 
		cria botao de mostrar respostas
	*/
	c.mostrar_respostas = function exibir_respostas(listaRespostas){
	
	if(listaRespostas.length > 0){

		let mostrar_respostas = document.createElement('button');
		mostrar_respostas.innerText = 'Mostrar Respostas';	
		mostrar_respostas.addEventListener('click', 
			
			function mostrar_respostas(){
				listaRespostas.forEach(resposta =>{
					let div_resposta = Comentario(resposta, 'resposta');
					c.caixa.insertAdjacentElement('afterend', div_resposta.caixa);
				});
				this.removeEventListener('click', mostrar_respostas);
			}
		);

		c.botoes.appendChild(mostrar_respostas);

	}
	};

	c.mostrar_respostas(c.objetoComentario.respostas);
	/* Faz a funcao de responder comentario */

	c.botaoResponderComentario.addEventListener('click',function mostrarTelaNovoComentario(){			
		let novo_comentario = factoryNovoComentario(c, true);
		c.caixa.insertAdjacentElement('afterend', novo_comentario.caixa);
	});

	return c;

}
// a campanha em si ou o objeto que contem a postagem de comentario
function factoryNovoComentario(alvoComentario,ehResposta){
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
		
		(async function fetch_comentario(){
			let texto = c.caixaTexto.value;
			let agora = new Date();
			let data = agora.getFullYear() + '-' + (agora.getUTCMonth()+1) + '-' + agora.getDate();
			 
			if(ehResposta == true){
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
					// let novoComentario = Comentario(lista_atualizada[lista_atualizada.length-1], 'resposta');
					// c.caixa.replaceWith(novoComentario.caixa);
					c.caixa.remove();
					alert('Seu comentário foi registrado');
					alvoComentario.mostrar_respostas(lista_atualizada);		
						
				}else{
					console.log(resposta);
				}

			}
			else{ //Esse é o fetch de quando o comentario for direto pra campanha
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
					c.caixa.parentNode.innerHTML= '';
					construirAreaComentarios(lista_atualizada);
				}else{
					console.log(resposta);
				}

			}
			



		})();



	} );




	return c;
}

function preencherInformacoesCampanha(campanha){
			
	preencherCampo('nome_curto', campanha.nomeCurto);
	preencherCampo('status', campanha.status);
	preencherCampo('data_limite', campanha.dataLimite);
	preencherCampo('descricao', campanha.descricao);
	preencherCampo('meta', campanha.meta);
	document.querySelector('#usuario_dono').innerText+= campanha.usuarioDono.primeiroNome + ' ' + campanha.usuarioDono.ultimoNome;
			

	if(campanha.usuarioDono.email == main.getEmail()){
		habilitarEdicaoCampanha();
	}

	let num_likes = document.querySelector('#num_likes');
	num_likes.innerText += campanha.curtidas;

	let num_comentarios = document.querySelector('#num_comentarios');
	num_comentarios.innerText += campanha.comentarios.length;

}






/*
	Cria um botao que habilita os inputs e altera a funcao deste para fazer um fetch pra api
		- Falta fazer a funcao que faz o fetch
*/
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
