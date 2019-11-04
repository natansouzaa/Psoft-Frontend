let disciplinas = [];
const URI = 'https://lab01-projsw-ufcg.herokuapp.com/api/disciplinas';
let $button = document.querySelector("button");
$button.addEventListener('click', adicionar_disciplina);


fetch(URI)
.then(response => response.json())
.then(dados => {
    console.log("carregando disciplinas do servidor...");
    console.log(dados);
    disciplinas = Array.from(dados);
    fetch_disciplinas(disciplinas);

})

 
function fetch_disciplinas(disciplinas){
    let $div = document.querySelector('div');
    
    disciplinas.forEach(element => {
        let $disciplina = document.createElement('p');
        let $botao = document.createElement('button');
        $botao.innerText = "Excluir disciplina";
        $botao.addEventListener('click', function deletar_disciplinas(){
            console.log("disciplina a ser excluida:"+ element.nome);
            
            fetch(URI + `/${element.id}`, {
                "method": "DELETE"
            })
            .then(resposta => resposta.json())
            .then(d =>{
                var indice = disciplinas.indexOf(element);
                disciplinas.splice(indice,1);
                $div.removeChild($disciplina);
            })

        });
        $disciplina.innerText = "Disciplina: " + element.nome + " | Nota: " + element.nota + "  ";
        $disciplina.classList.add('disciplina');
        $disciplina.appendChild($botao);   
        $div.appendChild($disciplina);    
    });

    
}

function adicionar_disciplina(){
    let nome = document.querySelector("#nome").value;
    let nota = document.querySelector("#nota").value;
    fetch(URI , {
        "method": "POST",
        "body": `{"nome": "${nome}", "nota": "${nota}"}`,
        "headers": {"Content-Type": "application/json"}
    })
    .then(resposta => resposta.json())
    .then(disciplina =>{
        let $div = document.querySelector('div');
            $div.innerHTML = "";
            disciplinas.push(disciplina);
            fetch_disciplinas(disciplinas);
            console.log("disciplina recebida:"+ disciplina.nome);
            

    })
}



