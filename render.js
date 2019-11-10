/* 
    Funcoes que renderizam as views da pagina
*/
let $viewer = document.getElementById("viewer");
let URI = "http://localhost:8080";

function salvarToken(token){
	window.sessionStorage.setItem('token', token);
}
function recuperarToken(){
	return window.sessionStorage.getItem('token');
}


// Homepage vai ser implementada no caso 9
export function homepage(){
    let $template = document.querySelector("#homepage");
	$viewer.innerHTML = $template.innerHTML;
}



export function login(){
    
    //muda o url
	location.hash = "#/login";

	//seleciona o template do login e insere ele na div reservada pro formulário
    let $template = document.querySelector("#login");
	$viewer.innerHTML = $template.innerHTML;

	//Configura o botao p/ voltar pro formulario de cadastro
	let $botao = document.querySelectorAll("button")[1];
	$botao.addEventListener('click', cadastro_usuarios);

	//Configura o botao p/ mandar os dados de login
	let $cadastrar = document.querySelectorAll("button")[0];
	$cadastrar.addEventListener('click',

		function fazer_login(){
			console.log('fazendo login');
			let $formulario = document.querySelector("form");
			let email = $formulario.email.value;
			let senha = $formulario.senha.value;

			fetch(URI + '/auth/login', 
				{
					"method": "POST",
					"body": `{"email":"${email}",
							  "senha":"${senha}"}`,
					"headers":{"Content-Type":"application/json"}
				}
			)
			.then(resposta =>{ //ver qual é o status no backend
                /* Mudar para: if codigo = ok, aparecer o usuario logado
             em algum canto da tela e armazenar o token jwt paras 
             as futuras requisicoes */
                
                if(resposta.status == "200")
                    console.log(resposta)

                })
            
			
			
		}
	)	
}	

//Renderiza o formulario de cadastro na página
export function cadastro_usuarios(){
	//muda o link 
	location.hash = "#/usuarios/cadastro";

	//Recupera o template do login e insere ele na div reservada pro formulário
    let $template = document.querySelector("#cadastro");
	$viewer.innerHTML = $template.innerHTML;

	//Configura o botao p/ voltar pro formulario de login
	let $login = document.querySelectorAll("button")[1];
	$login.addEventListener('click', login);

	//Configura o botao p/ mandar os dados para o cadastro
	let $cadastrar = document.querySelectorAll("button")[0];
	$cadastrar.addEventListener('click',

		function enviar_cadastro(){
			console.log('enviando cadastro');
			let $formulario = document.querySelector("form");
			let primeiro_nome = $formulario.primeiro_nome.value;
			let ultimo_nome = $formulario.ultimo_nome.value;
			let email = $formulario.email.value;
			let cartao = $formulario.cartao.value;
			let senha = $formulario.senha.value;

			fetch(URI + '/usuarios',
				{
					"method":"POST",
					"body":`{"primeiroNome":"${primeiro_nome}",
							 "ultimoNome":"${ultimo_nome}",
							 "email":"${email}",
							 "cartaoDeCredito":"${cartao}",
							 "senha": "${senha}"}`,
					"headers":{"Content-Type":"application/json"}
				})
			.then(resposta => {
				if(resposta.status == "201"){cadastro_usuario_realizado()}

				else{console.log(resposta)}
			});

		}


	);
}

export function cadastro_usuario_realizado(){
    let $template = document.querySelector("#cadastro_realizado");
	$viewer.innerHTML = $template.innerHTML;

	let $login = document.querySelector("button");
	$login.addEventListener('click', login);
}


export function cadastro_campanha(){
    
    //atualiza o link
    location.hash = "#/campanha/cadastro"

    //Recupera o template do login e insere ele na div reservada pro formulário
    let $template = document.querySelector("#cadastro_campanha");
    console.log($template)
    $viewer.innerHTML = $template.innerHTML;

    //Configura o botao p/ mandar os dados para o cadastro da campanha
    let $cadastrar = document.querySelectorAll("button")[0];
    $cadastrar.addEventListener('click',

    function envia_cadastro_campanha(){
       console.log('enviando o cadastro da campanha');
       let $formulario = document.querySelectorAll("form");
       let nome_curto = $formulario.nome_curto.value;
       let descricao = $formulario.descricao.value;
       let data_limite = $formulario.data_limite.value;
       let meta = $formulario.meta.value;
       let identificadorURL = criaURL(nome_curto);

       fetch(URI + '/campanhas',
               {
                   "method":"POST",
                   "body":`{"nomeCurto":"${nome_curto}",
                            "Meta":"${meta}",
                            "Descricao":"${descricao}",
                            "identificadorURL":"${identificadorURL},
                            "DataLimite":"${data_limite}"`,
                   "headers":{"Content-Type":"application/json"}
               })
           .then(resposta => {
               if(resposta.status == "201"){cadastro_campanha_realizado()}

               else{console.log(resposta)}
           });

       }


   );
}

export function cadastro_campanha_realizado(){
   let $template = document.querySelector("#cadastro_campanha_realizado");
   $viewer.innerHTML = $template.innerHTML;
}