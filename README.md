# Psoft-Frontend
Repositório criado para a parte de frontend do projeto AquiJUntosDoandoEsperança, da disciplina Projeto de Software.

[Link para o site](https://projetoajude.netlify.com/#)
[Link do vídeo](https://www.youtube.com/watch?v=ilmd-ZU1wcM)

Credenciais do usuário fictício:
email:professores@psoft.com
senha:professores123

	No frontend, todos os arquivos exceto os scripts estão na pasta principal. O arquivo index.HTML contém o html da página base e os templates das views.
	Na pasta de scripts, os casos da especificação estão separados nos arquivos de forma que:
- app.js: Contém as funções de roteamento do frontend, responsáveis por selecionar qual das views será renderizada e atualizar os links da página. Além disso, possui algumas constantes que são usadas em todas as views.

	Views:  Possuem funções que carregam a view na página e formulários que enviam as informações necessárias para o backend.

- Caso 1: login.js e cadastro_usuario.js. Renderizam os formulários de cadastro/login e os botões para alternar entre um e outro.

- Caso 2: cadastro_campanha.js. Renderiza o formulário de campanha que simula a view da campanha. Os botões de curtir e comentar não funcionam, só servem ajudar na simulação da view da campanha.

- Caso 3: pesquisar_campanha.js. Renderiza o campo de pesquisa da campanha e a listagem dos resultados.

- Caso 4 e 7: view_campanha.js. Possui funções para renderizar a view com informações da campanha e a área de curtidas, e também chama funções de outros arquivos para construir as outras partes que compõem a view da campanha.

- Caso 5 e 6: area_comentario.js. Renderiza, dentro da view de campanha, a area de comentarios que consiste em: exibição dos comentarios/respostas e menu que abre quando for escrever um novo comentario/resposta.

- Caso 8: area_doacao.js. Renderiza a lista de doações e o menu de fazer doação dentro da view de campanha.

- Caso 9: homepage.js. Renderiza o ranking das campanhas e os botões que escolhem o critério de classificação.

- Caso 10: view_usuario.js. Renderiza as informações do perfil e a listagem das campanhas que o usuario participou.

	Tecnologias e biblotecas usadas: sessionStorage e fetchAPI.




