import * as main from "./app.js";



export function construirAreaComentarios(listaComentarios){
	let area_comentarios = document.querySelector('#area_comentarios');
	area_comentarios.innerHTML = '';
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
	c.nomeUsuario.innerText = comentario.usuario.primeiroNome + " " + comentario.usuario.ultimoNome;
	c.textoComentario.innerHTML = comentario.texto;

	criaFuncaoResponderComentario(nivel, c);

	/* 
		Cria funcao de mostrar respostas
		foi definido como atributo porque
		vai ser chamada mais tarde quando 
		um novo comentário for feito
	*/
	c.mostrar_respostas = function(listaRespostas){
	
		if(listaRespostas.length > 0){
			if(c.botaoMostrarRespostas == null){
				c.botaoMostrarRespostas = document.createElement('button');
				c.botaoMostrarRespostas.innerText = 'Mostrar Respostas';
	
				c.div_lista_respostas = document.createElement('div');
				c.caixa.insertAdjacentElement('beforeend', c.div_lista_respostas);
			}
	
			
			c.botaoMostrarRespostas.addEventListener('click', 
				
				function exibir_respostas(){
					c.div_lista_respostas.innerHTML = '';
					
					c.div_lista_respostas.innerHTML = '<hr><br>';
					listaRespostas.forEach(resposta =>{
						let div_resposta = factoryComentario(resposta, nivel+1);
						c.div_lista_respostas.appendChild(div_resposta.caixa);
					});
					this.removeEventListener('click', exibir_respostas);
					this.innerText ='Esconder Respostas';
					this.addEventListener('click', function(){
						c.div_lista_respostas.innerHTML = '';
						c.botaoMostrarRespostas.innerText = 'Mostrar Respostas'; 
						c.botaoMostrarRespostas.addEventListener('click', exibir_respostas);
					});
				}
			);
	
			c.botoes.appendChild(c.botaoMostrarRespostas);
	
		}
	};
	
	c.mostrar_respostas(c.objetoComentario.respostas);
	
	criaFuncaoDeletarComentario(c);

	return c;

}


function criaFuncaoResponderComentario(nivel, comentario){
	/*
		Esse if impede que a recursão dos comentários fique infinita
		Se quiser permitir que o usuario 
		faça a resposta da resposta da resposta... infinitamente, é 
		só tirar esse if
	*/
		if(nivel < 4){
			comentario.botaoResponderComentario = document.createElement('button');
			comentario.botaoResponderComentario.innerText = 'Responder Comentário';
			comentario.botoes.appendChild(comentario.botaoResponderComentario);
		
			comentario.botaoResponderComentario.addEventListener('click',function mostrarTelaNovoComentario(){			
				let novo_comentario = factoryNovoComentario(comentario, true);
				comentario.caixa.insertAdjacentElement('afterend', novo_comentario.caixa);
			});
		}

}


function criaFuncaoDeletarComentario(comentario){
	if(main.getEmail() == comentario.objetoComentario.usuario.email){
		let deletar_comentario = document.createElement('button');
		deletar_comentario.innerText = 'Deletar Comentário';
		comentario.botaoDeletarComentario = deletar_comentario;
		comentario.botoes.appendChild(deletar_comentario);

		comentario.botaoDeletarComentario.addEventListener('click', function(){
			let idComentario = comentario.objetoComentario.id;
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
}


// alvoComentario é a campanha em si ou o objeto que contem a postagem de comentario (gerado pelo factoryComentario)
export function factoryNovoComentario(alvoComentario, ehResposta){

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
		}else alert('Você não enviar um comentário vazio!')

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


function adicionarClasseCSS(caixa, nivel){
	let classesCSS=['comentario','resposta','respostaN2'];
	caixa.classList.add(classesCSS[nivel % 3]);
}