import * as main from "./app.js";

export function montar_view(){
	
	main.carregarTemplate('#cadastro_campanha', '#/campanhas/cadastro');

    //Configura o botao p/ mandar os dados para o cadastro da campanha
	let botaoSalvar = document.querySelector('#salvar_campanha');
    botaoSalvar.addEventListener('click', envia_cadastro_campanha);
}


function envia_cadastro_campanha(){
	let nome_curto = document.querySelector("#nome_curto").value;
	let descricao = document.querySelector("#descricao").value;
	let data_limite = document.querySelector("#data_limite").value;
	let meta = document.querySelector("#meta").value.replace(",", ".");

	if(nome_curto != "" && data_limite != "" && meta != "" && meta > 0 && !Number.isNaN(Number(meta))){
		let identificadorURL = criaURL(nome_curto);
		let data = new Date();
		let agora = data.getFullYear() + '-' + (data.getUTCMonth()+1) + '-' + data.getDate();
		meta = Number(meta);
		
		if(data_limite > agora)
			fetch_cadastro_campanha(nome_curto,descricao,data_limite,meta,identificadorURL);
		else{
			alert("Insira uma data válida")
		}
	}else{
		alert("Preencha todos os campos corretamente");
	}	
}

async function fetch_cadastro_campanha(nome_curto,descricao,data_limite,meta,identificadorURL){
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

		 let novaCampanha = await resposta.json();
		 
		 /* Muda para a view da campanha */
		 main.mudarView(main.rotas.VIEW_CAMPANHAS + novaCampanha.identificadorURL);
		 alert('Campanha cadastrada! Para compartilhar a campanha use o link:\n' + main.URI + "#/campanhas/"+novaCampanha.identificadorURL);
		 
	}else if (resposta.status == 400)
		 alert('Já existe campanha com esse nome');

	else if (resposta.status == 401) 
		alert('É necessário fazer login para usar essa função');

	else if(resposta.status == 500){
		alert("Problemas no servidor. Tente novamente mais tarde");	
		console.log(resposta);
	}

};	



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
	text = text.replace(new RegExp('\\s+','gi'), ' ');
    text = text.replace(new RegExp('[ ]','gi'), '-');
    text = text.replace(new RegExp('[,]','gi'), '');
    return text;
}


