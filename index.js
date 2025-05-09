const { select, input, checkbox } = require("@inquirer/prompts");
const fs = require("fs").promises;

let mensagem = "Bem-vindo ao App Gerenciador de Metas!";

let metas;

const carregarMetas = async () => {
  try {
    const dados = await fs.readFile("metas.json", "utf8");
    metas = JSON.parse(dados);
  } catch (erro) {
    metas = [];
  }
};

const salvarMetas = async () => {
  await fs.writeFile("metas.json", JSON.stringify(metas, null, 2));
};

carregarMetas();

const cadastrarMeta = async () => {
  const meta = await input({ message: "Digite a meta:" });

  if (meta.length == 0) {
    mensagem = "A meta não pode ser vazia.";
    return;
  }

  metas.push({
    value: meta,
    checked: false,
    createdAt: new Date().toISOString(),
  });

  mensagem = "Meta cadastrada com sucesso!";
};

const listarMetas = async () => {
  if (metas.length == 0) {
    mensagem = "Não existem metas!";
    return;
  }

  const respostas = await checkbox({
    message:
      "Use as setas para mudar de meta, o espaço para marcar/desmarcar, e o Enter para finalizar essa etapa.",
    choices: metas.map((meta) => ({
      name: `${meta.value} (criada em ${new Date(
        meta.createdAt
      ).toLocaleString()})`,
      value: meta.value,
      checked: meta.checked,
    })),
    instructions: false,
  });

  metas.forEach((m) => {
    m.checked = false;
  });

  if (respostas.length == 0) {
    mensagem = "Nenhuma meta selecionada!";
    return;
  }

  respostas.forEach((resposta) => {
    const meta = metas.find((m) => {
      return m.value == resposta;
    });

    meta.checked = true;
  });

  mensagem = "Meta(s) marcada(s) como concluída(s)!";
};

const filtrarMetas = async () => {
  if (metas.length === 0) {
    mensagem = "Não existem metas!";
    return;
  }

  const palavraChave = await input({
    message: "Digite a palavra-chave para filtrar:",
  });

  const resultados = metas.filter((meta) =>
    meta.value.toLowerCase().includes(palavraChave.toLowerCase())
  );

  if (resultados.length === 0) {
    mensagem = "Nenhuma meta corresponde à palavra-chave!";
    return;
  }

  await select({
    message: `Metas contendo "${palavraChave}":`,
    choices: resultados.map((meta) => ({
      name: `${meta.value} (criada em ${new Date(
        meta.createdAt
      ).toLocaleString()})`,
      value: meta.value,
    })),
  });

  mensagem = `${resultados.length} meta(s) encontrada(s).`;
};

const metasRealizadas = async () => {
  if (metas.length == 0) {
    mensagem = "Não existem metas!";
    return;
  }
  const realizadas = metas.filter((meta) => {
    return meta.checked;
  });

  if (realizadas.length == 0) {
    mensagem = "Não existem metas realizadas! :(";
    return;
  }

  await select({
    message: "Metas realizadas: " + realizadas.length,
    choices: [...realizadas],
  });
};

const metasAbertas = async () => {
  if (metas.length == 0) {
    mensagem = "Não existem metas!";
    return;
  }
  const abertas = metas.filter((meta) => {
    return meta.checked != true;
  });

  if (abertas.length == 0) {
    mensagem = "Não existem metas abertas! :)";
    return;
  }

  await select({
    message: "Metas abertas: " + abertas.length,
    choices: [...abertas],
  });
};

const deletarMetas = async () => {
  if (metas.length == 0) {
    mensagem = "Não existem metas!";
    return;
  }
  const metasDesmarcadas = metas.map((meta) => {
    return { value: meta.value, checked: false };
  });

  const itemsADeletar = await checkbox({
    message: "Selecione um item para deletar.",
    choices: [...metasDesmarcadas],
    instructions: false,
  });

  if (itemsADeletar.length == 0) {
    mensagem = "Nenhum item para ser deletado!";
    return;
  }

  itemsADeletar.forEach((item) => {
    metas = metas.filter((meta) => {
      return meta.value != item;
    });
  });

  mensagem = "Meta(s) deletada(s) com sucesso!";
};

const mostrarMensagem = () => {
  console.clear();

  if (mensagem != "") {
    console.log(mensagem);
    console.log("");
    mensagem = "";
  }
};

const start = async () => {
  await carregarMetas();

  while (true) {
    mostrarMensagem();
    await salvarMetas();

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
          name: "Filtrar metas por palavra-chave",
          value: "filtrar",
        },
        {
          name: "Metas realizadas",
          value: "realizadas",
        },
        {
          name: "Metas abertas",
          value: "abertas",
        },
        {
          name: "Deletar metas",
          value: "deletar",
        },
        {
          name: "Sair",
          value: "sair",
        },
      ],
    });

    switch (opcao) {
      case "cadastrar":
        await cadastrarMeta();
        break;
      case "listar":
        await listarMetas();
        break;
      case "filtrar":
        await filtrarMetas();
        break;
      case "realizadas":
        await metasRealizadas();
        break;
      case "abertas":
        await metasAbertas();
        break;
      case "deletar":
        await deletarMetas();
        break;
      case "sair":
        console.log("Até a próxima!");
        return;
    }
  }
};

start();
