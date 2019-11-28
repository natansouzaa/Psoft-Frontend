import * as main from "./app.js";
import {calcularTotalDoacoes} from "./pesquisa_campanha.js";


/* Funções da area de doacao */

export function montarAreaDoacao(campanha){

	let areaNovaDoacao = document.querySelector("#nova_doacao");
	let areaListaDoacoes = document.querySelector("#lista_doacoes");
	let caixa = document.querySelector("#area_doacoes");
	
	let areaDoacao = {
		caixa: caixa,
		areaNovaDoacao: areaNovaDoacao,
		areaListaDoacoes: areaListaDoacoes,
		
	};
	areaListaDoacoes.innerHTML = "";
	areaDoacao.botaoMostrar = areaDoacao.caixa.children[0];
	areaDoacao.botaoDoar = areaDoacao.caixa.children[1];
	
	areaDoacao.botaoDoar.addEventListener("click", function mostrarAreaDoacao(){
		criarAreaNovaDoacao(areaNovaDoacao);
		criarBotaoCancelarDoacao(areaNovaDoacao);
		criarBotaoConfirmaDoacao(areaNovaDoacao, campanha);
	
	});

	areaDoacao.botaoMostrar.addEventListener("click", function mostrarLista(){
		let lista = criarListaDoadores(campanha.doacoes);
		areaListaDoacoes.appendChild(lista.tabela);

		/* Funcao de esconder a lista */
		areaDoacao.botaoMostrar.innerText = "Esconder Lista";
		this.removeEventListener("click", mostrarLista);
		areaDoacao.botaoMostrar.addEventListener("click", function esconderLista(){
			areaListaDoacoes.innerHTML = "";

			areaDoacao.botaoMostrar.innerText = "Ver Doações";
			this.removeEventListener("click", esconderLista);
			areaDoacao.botaoMostrar.addEventListener("click", mostrarLista);
		});

	});

	return areaDoacao;

}

function criarListaDoadores(listaDoacao){
	let t = {};

	/* Criando a estrutura da lista */
	t.tabela = document.createElement("table");
	t.primeiraLinha = document.createElement("tr");
	t.valorDoacao = document.createElement("td");
	t.nomeUsuario = document.createElement("td");

	t.primeiraLinha.appendChild(t.valorDoacao);
	t.primeiraLinha.appendChild(t.nomeUsuario);
	t.tabela.appendChild(t.primeiraLinha);
	t.primeiraLinha.setAttribute("style","background:grey");
	
	/* Preenchendo com conteúdo */
	t.valorDoacao.innerText = "Valor Doado (em R$)";
	t.nomeUsuario.innerText = "Doador";


	listaDoacao.forEach(doacao => {
		let linha = criarLinha(doacao);
		t.tabela.appendChild(linha.linha);
	});

	return t;
}

function criarLinha(doacao){
	let l = {};

	/* Criando a estrutura da linha */
	l.linha = document.createElement("tr");
	l.valorDoacao = document.createElement("td");
	l.nomeUsuario = document.createElement("td");
	l.visualizarPerfil = document.createElement("td");
	l.botaoVisualizarPerfil = document.createElement("button");

	l.linha.appendChild(l.valorDoacao);
	l.linha.appendChild(l.nomeUsuario);
	l.linha.appendChild(l.visualizarPerfil);
	l.visualizarPerfil.appendChild(l.botaoVisualizarPerfil);
	l.linha.setAttribute("style","background:#363636");
	
	/* Preencher conteúdo */
	l.valorDoacao.innerText = doacao.valorDoado;
	l.nomeUsuario.innerText = doacao.usuario.primeiroNome + " " + doacao.usuario.primeiroNome;
	l.botaoVisualizarPerfil.innerText = "Visualizar Perfil";
	
	/* Configurar botão de visualizar perfil */
	l.botaoVisualizarPerfil.addEventListener("click", function(){
		main.mudarView(main.rotas.VIEW_USUARIOS + doacao.usuario.email);
	});

	return l;
};


/* Funções auxiliares da area de doacao */
function criarAreaNovaDoacao(areaNovaDoacao){
	let templateNovaDoacao = document.querySelector("#area_nova_doacao");
	areaNovaDoacao.innerHTML = templateNovaDoacao.innerHTML;
}

function criarBotaoCancelarDoacao(areaNovaDoacao){
	let botaoCancelarDoacao = areaNovaDoacao.querySelector('#cancelar_doacao');
	botaoCancelarDoacao.addEventListener('click', function() {
		areaNovaDoacao.innerHTML = "";
	});
}

function criarBotaoConfirmaDoacao(areaNovaDoacao, campanha){
	let botaoConfirmarDoacao = areaNovaDoacao.querySelector('#confirmar_doacao');

	botaoConfirmarDoacao.addEventListener('click',function enviarDoacao(){
		let valorDoacao = areaNovaDoacao.querySelector('#valor_doacao').value;
		let agora = new Date();
		let data = agora.getFullYear() + '-' + (agora.getUTCMonth()+1) + '-' + agora.getDate();

		if(valorDoacao > 0){
			fetchDoacao(valorDoacao, campanha, data);
			areaNovaDoacao.innerHTML = "";
		}
		else alert("Digite um valor válido");

	});
}

async function fetchDoacao(valorDoacao, campanha, data){
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

		let valorDoacoes = calcularTotalDoacoes(campanha.doacoes);
		let campanhaFinalizada = campanha.meta <= valorDoacoes;
		/*
			O motivo de se usar o valor que está na página e nao o atualizado é porque
			dessa forma duas pessoas que estão doando ao mesmo tempo receberão essa mensagem.
			Essa ideia me pareceu mais interessante ao invés de deixar isso pra apenas 1 pessoa 
		*/
		if((valorDoacoes + valorDoacao >= campanha.meta) && !campanhaFinalizada){
			alert('Graças a sua contribuição, a campanha pôde ser concluída! Muito Obrigado!');
			campanhaFinalizada = true;
		}
		

		let campanhaAtualizada = await resposta.json();


		let doacoes = document.querySelector('#doacoes_meta');
		doacoes.innerText = calcularTotalDoacoes(campanhaAtualizada.doacoes) + '/' + campanhaAtualizada.meta;
		
		montarAreaDoacao(campanhaAtualizada);
	}
	else if(resposta.status == 401){
		alert('É necessário fazer login para usar essa função');
	}else if(resposta.status == 500){
		console.log(resposta);
		alert('Problema no servidor. Tente novamente mais tarde');
	}

}