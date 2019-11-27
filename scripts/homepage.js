import * as main from "./app.js";

const FetchsURI = {
	META: "/ordenacao/meta",
	DATA: "/ordenacao/data",
	CURTIDA: "/ordenacao/curtida"
};

/* 

	Funções da Homepage

*/
export function montar_view(){
	main.carregarTemplate('#homepage','');

	fetchCampanhaMeta(FetchsURI.META);

	let botaoMeta = document.querySelector("#ordenacao_meta");
	let botaoData = document.querySelector("#ordenacao_data");
	let botaoCurtida = document.querySelector("#ordenacao_curtida");

	botaoMeta.addEventListener("click", function(){
		fetchCampanhaMeta(FetchsURI.META);
	});
	botaoData.addEventListener("click", function(){
		fetchCampanhaMeta(FetchsURI.DATA);
	});
	botaoCurtida.addEventListener("click", function(){
		fetchCampanhaMeta(FetchsURI.CURTIDA);
	});


}
async function fetchCampanhaMeta(FetchURI) {
	let requisicao = {
		"method":"GET",
		"headers":{"Content-Type":"application/json","Authorization":`Bearer ${main.getToken()}`}
	};
	let resposta = await fetch(main.URI + FetchURI, requisicao);

	if(resposta.status == 200){
		let listaCampanhas = await resposta.json();
		let ranking = criarTabela(listaCampanhas);

		let divRanking = document.querySelector("#top_campanhas");
		divRanking.innerHTML ="";
		divRanking.appendChild(ranking.tabela);
	}
	else alert('Problema no Servidor. Tente novamente mais tarde');
}


function criarTabela(listaDeCampanhas) {
	
	let t = {
		listaCampanhas: listaDeCampanhas
	};

	t.tabela = document.createElement("table");

	/* Criando a linha inicial */
	t.linha = document.createElement("tr");
	t.nomeCurto = document.createElement("td");
	t.quantoFalta = document.createElement("td");
	t.curtidas = document.createElement("td");
	t.dataLimite = document.createElement("td");

	t.linha.appendChild(t.nomeCurto);
	t.linha.appendChild(t.quantoFalta);
	t.linha.appendChild(t.curtidas);
	t.linha.appendChild(t.dataLimite);
	
	t.tabela.appendChild(t.linha);

	t.nomeCurto.innerText = "Nome da Campanha";
	t.quantoFalta.innerText = "Doação/Meta";
	t.curtidas.innerText = "Curtidas";
	t.dataLimite.innerText = "Data de Vencimento";

	listaDeCampanhas.forEach( campanha =>{
		let linhaDaTabela = criarLinha(campanha);
		t.tabela.appendChild(linhaDaTabela.linha);
	});
	
	return t;
}

function criarLinha(campanha) {
	let l ={
		campanha: campanha
	};
	/* Criando as células */
	l.linha = document.createElement("tr");
	
	l.nomeCurto = document.createElement("td");
	l.quantoFalta = document.createElement("td");
	l.curtidas = document.createElement("td");
	l.dataLimite = document.createElement("td");
	l.visualizar = document.createElement("td");

	l.linha.appendChild(l.nomeCurto);
	l.linha.appendChild(l.quantoFalta);
	l.linha.appendChild(l.curtidas);
	l.linha.appendChild(l.dataLimite);
	l.linha.appendChild(l.visualizar);


	/* Preenchendo com conteúdo */
	l.nomeCurto.innerText = campanha.nomeCurto;
	l.quantoFalta.innerText = campanha.arrecadado + " / " + campanha.meta  + "R$";
	l.curtidas.innerText = campanha.curtidas.length;
	l.dataLimite.innerText = campanha.dataLimite;
	
	/* Colocando a função de Visualizar Campanha */
	l.botaoVisualizar = document.createElement("button");
	l.botaoVisualizar.innerText = "Visualizar Campanha";

	l.visualizar.appendChild(l.botaoVisualizar);
	
	l.botaoVisualizar.addEventListener("click", function(){
		main.mudarView(main.rotas.VIEW_CAMPANHAS + campanha.identificadorURL);
	});

	return l;
}
