import * as main from "./app.js";
import {montarAreaDoacao} from "./area_doacao.js";
import {construirAreaComentarios, factoryNovoComentario} from "./area_comentario.js";

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

			montarAreaDoacao(campanha);
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
			

			criarAreaCurtir(campanha);
		



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

function criarAreaCurtir(campanha){

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

			}else if(resposta.status == 401){
				alert('É necessário fazer login para usar essa função');
			}else if(resposta.status == 500){
				console.log(resposta);
				alert('Problema no servidor. Tente novamente mais tarde');
			}

		})();

	});
}




function preencherInformacoesCampanha(campanha){

	document.querySelector("#nome_curto").innerText = campanha.nomeCurto;	
	document.querySelector("#status").innerText = campanha.status;	
	document.querySelector("#data_limite").innerText = campanha.dataLimite;
	
	document.querySelector("#descricao").value = campanha.descricao;
	let doacoes = document.querySelector('#doacoes_meta');

	doacoes.innerText = campanha.arrecadado + '/' + campanha.meta;
	document.querySelector('#usuario_dono').innerText+= campanha.usuarioDono.primeiroNome + ' ' + campanha.usuarioDono.ultimoNome;
			

	if(campanha.usuarioDono.email == main.getEmail()){
		habilitarEdicaoCampanha(campanha);
	}

}


/*
	Cria um botao que habilita a descricao e altera a funcao
	 a propria funcao para fazer um fetch pra api
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

