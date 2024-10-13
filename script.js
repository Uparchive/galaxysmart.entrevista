// Função para salvar os dados no localStorage
function salvarDados() {
    const dados = {
        nome: document.getElementById("nome").value,
        sexo: document.getElementById("sexo").value,
        disponibilidade: document.getElementById("disponibilidade").value,
        vendas: document.getElementById("vendas").value,
        horasExtras: document.getElementById("horasExtras").value,
        onibus: document.getElementById("onibus").value,
        onibusPersonalizado: document.getElementById("onibusPersonalizado").value,
        tempo: document.getElementById("tempo").value,
        horarioAlterado: document.getElementById("horarioAlterado").value
    };
    localStorage.setItem('dadosEntrevista', JSON.stringify(dados));
}

// Função para carregar os dados salvos do localStorage
function carregarDados() {
    const dadosSalvos = JSON.parse(localStorage.getItem('dadosEntrevista'));
    if (dadosSalvos) {
        document.getElementById("nome").value = dadosSalvos.nome || '';
        document.getElementById("sexo").value = dadosSalvos.sexo || 'Masculino';
        document.getElementById("disponibilidade").value = dadosSalvos.disponibilidade || 'Sim';
        document.getElementById("vendas").value = dadosSalvos.vendas || 'Sim';
        document.getElementById("horasExtras").value = dadosSalvos.horasExtras || 'Sim';
        document.getElementById("onibus").value = dadosSalvos.onibus || '1';
        document.getElementById("onibusPersonalizado").value = dadosSalvos.onibusPersonalizado || '';
        document.getElementById("tempo").value = dadosSalvos.tempo || '';
        document.getElementById("horarioAlterado").value = dadosSalvos.horarioAlterado || 'Sim';
    }
}

// Chama a função para carregar os dados ao abrir a página
window.onload = carregarDados;

// Função para calcular a pontuação
function calcularPontuacao() {
    let pontuacao = 0;

    const disponibilidade = document.getElementById("disponibilidade").value;
    const vendas = document.getElementById("vendas").value;
    const horasExtras = document.getElementById("horasExtras").value;
    const onibus = document.getElementById("onibus").value;
    const horarioAlterado = document.getElementById("horarioAlterado").value;

    if (disponibilidade === "Sim") pontuacao += 2;
    if (disponibilidade === "Só pela manhã" || disponibilidade === "Só no período da tarde") pontuacao += 1;
    if (vendas === "Sim") pontuacao += 2;
    if (horasExtras === "Sim") pontuacao += 2;
    if (onibus === "1") pontuacao += 2;
    if (onibus === "2") pontuacao += 1;
    if (horarioAlterado === "Sim") pontuacao += 2;

    return pontuacao;
}

// Função para finalizar a entrevista e gerar o PDF
function finalizarEntrevista() {
    salvarDados(); // Salva os dados antes de finalizar

    const nome = document.getElementById("nome").value;
    const sexo = document.getElementById("sexo").value;
    const disponibilidade = document.getElementById("disponibilidade").value;
    const vendas = document.getElementById("vendas").value;
    const horasExtras = document.getElementById("horasExtras").value;
    const onibus = document.getElementById("onibus").value;
    const onibusPersonalizado = document.getElementById("onibusPersonalizado").value || "N/A";
    const tempo = document.getElementById("tempo").value || "N/A";
    const horarioAlterado = document.getElementById("horarioAlterado").value;

    const pontuacao = calcularPontuacao();

    // Iniciar o jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Definir a fonte
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(40, 44, 52);

    // Adicionar o título
    doc.text("Avaliação de Candidato", 105, 20, null, null, "center");

    // Linhas abaixo do título
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);

    // Definir a fonte normal e tamanho 12 para o conteúdo
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Definir margens, espaçamentos e limites da página
    const marginLeft = 20;
    const lineHeight = 10;
    let currentY = 35;
    const pageHeight = 297; // Altura da página A4 em mm (altura padrão)
    const pageWidth = 170;  // Reduzimos a largura para ter mais margem à direita (antes era 190)

    // Função para verificar se há espaço suficiente na página
    function verificarEspacoRestante() {
        if (currentY + lineHeight >= pageHeight - 20) { // Deixa uma margem de 20mm na parte inferior
            doc.addPage(); // Adiciona uma nova página
            currentY = 20; // Reinicia a posição Y na nova página
        }
    }

    // Função auxiliar para adicionar a pergunta e resposta formatada
    function adicionarPerguntaResposta(pergunta, resposta) {
        verificarEspacoRestante(); // Verifica se precisa adicionar uma nova página antes de adicionar conteúdo

        // Adiciona a pergunta
        doc.setFont("helvetica", "normal");
        doc.text(pergunta, marginLeft, currentY);
        currentY += lineHeight;

        verificarEspacoRestante(); // Verifica novamente após adicionar a pergunta

        // Adiciona "Resposta:" em negrito
        doc.setFont("helvetica", "bold");
        doc.text("Resposta: ", marginLeft, currentY, { baseline: 'alphabetic' });

        // Adiciona a resposta, dividindo em múltiplas linhas se for muito longa
        doc.setFont("helvetica", "normal");
        const linhasResposta = doc.splitTextToSize(resposta, pageWidth - marginLeft); // Ajusta para a nova largura
        doc.text(linhasResposta, marginLeft + 25, currentY); // desloca a resposta um pouco para a direita
        currentY += (linhasResposta.length * lineHeight) + 5; // ajusta a posição Y de acordo com o número de linhas
    }

    // Adiciona conteúdo ao PDF com perguntas e respostas formatadas
    adicionarPerguntaResposta("Nome do Candidato:", nome);
    adicionarPerguntaResposta("Sexo:", sexo);
    adicionarPerguntaResposta("Tem disponibilidade de horário?", disponibilidade);
    adicionarPerguntaResposta("Já trabalhou com vendas?", vendas);
    adicionarPerguntaResposta("Aceita fazer horas extras?", horasExtras);
    adicionarPerguntaResposta("Quantos ônibus para chegar no serviço?", onibus);
    adicionarPerguntaResposta("Resposta personalizada:", onibusPersonalizado);
    adicionarPerguntaResposta("Pretende ficar quanto tempo?", tempo);
    adicionarPerguntaResposta("O horário e escala podem ser alterados, você aceita?", horarioAlterado);

    // Adicionar pontuação final com destaque
    verificarEspacoRestante(); // Verifica se há espaço antes de adicionar a pontuação final
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`Pontuação Final: ${pontuacao}/10`, marginLeft, currentY);

    // Adicionar uma linha final decorativa
    currentY += lineHeight + 5;
    doc.setLineWidth(0.5);
    doc.line(20, currentY, 190, currentY);

    // Salvar o PDF
    doc.save(`${nome}_avaliacao.pdf`);
}

// Função para confirmar o descarte da entrevista
function confirmarDescartar() {
    if (confirm("Você tem certeza que deseja descartar?")) {
        localStorage.removeItem('dadosEntrevista');
        location.reload();
    }
}

// Eventos de salvamento automático
document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('input', salvarDados);
});
