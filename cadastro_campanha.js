import * as main from "./app.js";



/*

	Funções da view de Cadastro de Campanhas

*/
export function montar_view(){
	
	main.carregarTemplate('#cadastro_campanha', '#/campanha');

    //Configura o botao p/ mandar os dados para o cadastro da campanha
	let botaoSalvar = document.querySelector('#salvar_campanha');
    botaoSalvar.addEventListener('click', envia_cadastro_campanha);
}


function envia_cadastro_campanha(){
	let nome_curto = document.querySelector("#nome_curto").value;
	let descricao = document.querySelector("#descricao").value;
	let data_limite = document.querySelector("#data_limite").value;
	let meta = document.querySelector("#meta").value;

	let identificadorURL = criaURL(nome_curto);

	(async function fetch_cadastro_campanha(){
		let resposta = await fetch(main.URI + '/campanhas',
			 {
				 "method":"POST",
				 "body":`{"nomeCurto":"${nome_curto}",
							 "meta":"${meta}",
							 "descricao":"${descricao}",
							 "identificadorURL":"${identificadorURL}",
							 "emailDono":"${main.getEmail()}",
							 "dataLimite":"${data_limite}"}`,
				 "headers":{"Content-Type":"application/json","Authorization":`Bearer ${main.getToken()}`}
			 });

		if(resposta.status==201){

			 let dados_resposta = await resposta.json();
             console.log(dados_resposta);
             /* Muda para a view da campanha */
			 main.mudarView(main.rotas.VIEW_CAMPANHAS + identificadorURL);
			 alert('Campanha cadastrada! Para compartilhar a campanha use o link:\n' + main.URI + "#/campanha/"+identificadorURL);
			 
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


