import * as main from "./app.js";



/*

	Funções da view de Pesquisa de Campanhas

*/
export function montar_view(){
	
	main.carregarTemplate('#pesquisa_da_campanha','#/campanhas/pesquisa');
	
	//Configura o botão que envia os dados necessários para pesquisar as campanhas p/ o backend
	let botao = document.querySelector('#botao_pesquisar_campanha');
	botao.addEventListener('click',	enviar_pesquisa);

}

//Função que envia os dados necessários p/ o backend
function enviar_pesquisa(){

	let campo_pesquisa = document.querySelector("#campo_pesquisa").value;	
	let checkbox = document.querySelector("#filtro_pesquisa");
	let filtro;

	if(checkbox.checked)
		filtro = "?todos=true";
	else
		filtro = "?todos=false";
	
	(async function fetch_pesquisa(){
		console.log(main.URI + '/pesquisa/' + campo_pesquisa + filtro)
		let resposta = await fetch(main.URI + '/campanhas/pesquisa/' + campo_pesquisa + filtro,
		{
			"method":"GET",
			"headers":{"Content-Type":"application/json","Authorization":`Bearer ${main.getToken()}`
			}
		});
		console.log(resposta)
		let div_resultado = document.querySelector('#resultado');
		div_resultado.innerHTML = "";
		if(resposta.status == 202){
			let dados = await resposta.json();
			/* Inserindo o começo da tabela que mostra o resultado da busca */
			
			let resultado_pesquisa = document.querySelector('#resultado_pesquisa');
			
			div_resultado.innerHTML = resultado_pesquisa.innerHTML;
		
			/* Inserindo os dados na tabela */
			let tabela = document.querySelector('table');

			dados.forEach(campanha => {

				let nome_campanha = criarCelula(campanha.nomeCurto);
				let data_limite = criarCelula(campanha.dataLimite);
				let status = criarCelula(campanha.status);
				let meta = criarCelula(calcularTotalDoacoes(campanha.doacoes) + '/' + campanha.meta);
			
				/* Criando botao de visualizar a campanha encontrada */
				let visualizar = document.createElement('td');
				let botao = document.createElement('button');
				botao.innerText = 'Visualizar campanha';

				botao.addEventListener('click', 
					function visualizar_campanha(){
						main.mudarView(main.rotas.VIEW_CAMPANHAS + campanha.identificadorURL);
                        						
					}				
				);

				visualizar.appendChild(botao);
				
				
				let celulas = [nome_campanha, data_limite, status, meta, visualizar];
				let linha = criarLinha(celulas);

				tabela.appendChild(linha);
		});

	}
	else if(resposta.status == 401){
		alert('É necessário fazer login para utilizar essa função');
	}else if(resposta.status == 400){
		alert('Nenhuma campanha foi encontrada');
	}
	else
		console.log(resposta);

	})();
	
}
//Funções para ajudar na criação da tabela resultado
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
export function calcularTotalDoacoes(listaDeDoacoes){
	let total = 0.0;
	listaDeDoacoes.forEach(doacao =>{
		total += doacao.valorDoado;
	});
	return total;
}