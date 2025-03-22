const { select } = require("@inquirer/prompts");
const start = async () => {
  // Inicia o menu de opções
  while (true) {
    // Pergunta ao usuário qual operação deseja realizar
    const opcao = await select({
      message: "Menu >",
      choices: [
        {
          name: "Cadastrar meta",
          value: "cadastrar",
        },
        {
          name: "Listar metas",
          value: "listar",
        },
        {
          name: "Sair",
          value: "sair",
        },
      ],
    });

    switch (opcao) {
      case "cadastrar":
        console.log("Vamos cadastrar");
        break;
      case "listar":
        console.log("Vamos listar");
        break;
      case "sair":
        console.log("Até a próxima!");
        return;
    }
  }
};

start();
