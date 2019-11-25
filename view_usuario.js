import * as main from "./app.js";

export function montar_view(emailUsuario){
    main.carregarTemplate("#view_usuario", main.rotas.VIEW_USUARIOS + emailUsuario);
    (async function fetchViewUsuario(){
        let resposta = await fetch(main.URI + main.rotas.VIEW_USUARIOS + emailUsuario,
            {
                "method":"GET",
                "headers":{"Content-Type":"application/json","Authorization":`Bearer ${main.getToken()}`
                }
            }
        );

        if(resposta.status == 200){
            let usuario = await resposta.json();

            /* Preenche informações do Usuário */
            let nomeUsuario = document.querySelector("#nomeUsuario");
            let emailUsuario = document.querySelector("#emailUsuario");

            nomeUsuario.innerHTML+= usuario.primeiroNome + " " + usuario.ultimoNome;
            emailUsuario.innerHTML += usuario.email;
            
            


            /* Cria a tabela inicial com as campanhas */
            let divBusca = document.querySelector("#buscaResultado");
            let requisicao = await fetch(main.URI + "/usuarios/campanhas/"+ usuario.email);
     
            if(requisicao.status == 200){
                let listaCampanhas = await requisicao.json();

                let tabela = factoryTabela(listaCampanhas);
                divBusca.appendChild(tabela.tabela);

                /* Configura o botao de filtrar campanhas */
                let pesquisa = document.querySelector("#buscaCampanhas");
                let botaoFitlrar = document.querySelector('#enviarBusca');
                botaoFitlrar.addEventListener("click", function(){
                    let listaFiltrada = [];
                    listaCampanhas.forEach(campanha =>{
                        if(campanha.nomeCurto.includes(pesquisa.value) || campanha.descricao.includes(pesquisa.value))
                            listaFiltrada.push(campanha);
                    });

                    divBusca.innerHTML = "";
                    let novaTabela = factoryTabela(listaFiltrada);
                    divBusca.appendChild(novaTabela.tabela);
      

            });

            }
            else{
                console.log(listaTabelas);
            }
        }else{
            console.log(resposta);
        }

    })();

}

function factoryLinhaTabela(campanha){

    let l = {
        campanha: campanha
    };
    /* Criando a linha da tabela */
    l.linha = document.createElement('tr');
    l.nomeCampanha = document.createElement('td');
    l.visualizar = document.createElement("td");    
    l.botaoVisualizar = document.createElement("button");

    l.linha.appendChild(l.nomeCampanha);
    l.linha.appendChild(l.visualizar);
    l.visualizar.appendChild(l.botaoVisualizar);

    /* Preenchendo o conteúdo da linha */
    l.nomeCampanha.innerHTML = l.campanha.nomeCurto;
    l.botaoVisualizar.innerText = "Visualizar Campanha"
    l.botaoVisualizar.addEventListener("click",function(){
        main.mudarView(main.rotas.VIEW_CAMPANHAS + l.campanha.identificadorURL);
    });

    return l;
}

function factoryTabela(listaDeCampanhas){
    /* Criando linha inicial da tabela */
    let t = {
        lista: listaDeCampanhas,
        linhasCampanhas: [],
        tabela: document.createElement("table")

    };
    t.linha = document.createElement("tr");
    t.nomeCampanha = document.createElement("td");

    t.linha.appendChild(t.nomeCampanha);
    t.tabela.appendChild(t.linha);

    t.nomeCampanha.innerText = "Nome da Campanha";

    /* Função que cria as outras linhas da tabela */
    if(t.lista.length > 0){
        t.lista.forEach(campanha =>{
            let c = factoryLinhaTabela(campanha);
            t.linhasCampanhas.push(c);
            t.tabela.appendChild(c.linha);
        });

    }
    
    return t;
}

