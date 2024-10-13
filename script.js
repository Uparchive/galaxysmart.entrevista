// Função para salvar os dados no localStorage
function salvarDados() {
    const dados = {
        nome: document.getElementById("nome")?.value || '',
        sexo: document.getElementById("sexo")?.value || 'Masculino',
        disponibilidade: document.getElementById("disponibilidade")?.value || 'Sim',
        vendas: document.getElementById("vendas")?.value || 'Sim',
        horasExtras: document.getElementById("horasExtras")?.value || 'Sim',
        onibus: document.getElementById("onibus")?.value || '1',
        onibusPersonalizado: document.getElementById("onibusPersonalizado")?.value || '',
        tempo: document.getElementById("tempo")?.value || '',
        horarioAlterado: document.getElementById("horarioAlterado")?.value || 'Sim',
        comunicacao: document.getElementById("comunicacao")?.value || 'Comunicativo',
        consideracao: document.getElementById("consideracao")?.value || '',
        tipoPontuacao: document.getElementById("tipoPontuacao")?.value || 'Automatica',
        pontuacaoManual: document.getElementById("pontuacaoManual")?.value || ''
    };
    localStorage.setItem('dadosEntrevista', JSON.stringify(dados));
}

// Função para carregar os dados salvos do localStorage
function carregarDados() {
    const dadosSalvos = JSON.parse(localStorage.getItem('dadosEntrevista'));
    if (dadosSalvos) {
        document.getElementById("nome").value = dadosSalvos.nome;
        document.getElementById("sexo").value = dadosSalvos.sexo;
        document.getElementById("disponibilidade").value = dadosSalvos.disponibilidade;
        document.getElementById("vendas").value = dadosSalvos.vendas;
        document.getElementById("horasExtras").value = dadosSalvos.horasExtras;
        document.getElementById("onibus").value = dadosSalvos.onibus;
        document.getElementById("onibusPersonalizado").value = dadosSalvos.onibusPersonalizado;
        document.getElementById("tempo").value = dadosSalvos.tempo;
        document.getElementById("horarioAlterado").value = dadosSalvos.horarioAlterado;
        document.getElementById("comunicacao").value = dadosSalvos.comunicacao;
        document.getElementById("consideracao").value = dadosSalvos.consideracao;
        document.getElementById("tipoPontuacao").value = dadosSalvos.tipoPontuacao;
        document.getElementById("pontuacaoManual").value = dadosSalvos.pontuacaoManual;
        togglePontuacaoManual();
    }
}

// Chama a função para carregar os dados ao abrir a página
window.onload = carregarDados;

// Função para calcular a pontuação
function calcularPontuacao() {
    const tipoPontuacao = document.getElementById("tipoPontuacao")?.value;

    if (tipoPontuacao === "Manual") {
        const pontuacaoManual = parseInt(document.getElementById("pontuacaoManual")?.value, 10);
        if (!isNaN(pontuacaoManual) && pontuacaoManual >= 0 && pontuacaoManual <= 10) {
            return pontuacaoManual;
        } else {
            alert("Por favor, insira uma pontuação manual válida entre 0 e 10.");
            return 0;
        }
    }

    // Pontuação automática
    let pontuacao = 0;

    const disponibilidade = document.getElementById("disponibilidade")?.value;
    const vendas = document.getElementById("vendas")?.value;
    const horasExtras = document.getElementById("horasExtras")?.value;
    const onibus = document.getElementById("onibus")?.value;
    const horarioAlterado = document.getElementById("horarioAlterado")?.value;
    const comunicacao = document.getElementById("comunicacao")?.value;

    if (disponibilidade === "Sim") pontuacao += 2;
    if (disponibilidade === "Só pela manhã" || disponibilidade === "Só no período da tarde") pontuacao += 1;
    if (vendas === "Sim") pontuacao += 2;
    if (horasExtras === "Sim") pontuacao += 2;
    if (onibus === "1") pontuacao += 2;
    if (onibus === "2") pontuacao += 1;
    if (horarioAlterado === "Sim") pontuacao += 2;
    if (comunicacao === "Comunicativo") pontuacao += 2;
    else if (comunicacao === "Pouco comunicativo") pontuacao += 1;

    if (pontuacao > 10) pontuacao = 10; // Limitar pontuação máxima a 10

    return pontuacao;
}

// Função para finalizar a entrevista e gerar o PDF
function finalizarEntrevista() {
    salvarDados(); // Salva os dados antes de finalizar

    const nome = document.getElementById("nome")?.value;
    const sexo = document.getElementById("sexo")?.value;
    const disponibilidade = document.getElementById("disponibilidade")?.value;
    const vendas = document.getElementById("vendas")?.value;
    const horasExtras = document.getElementById("horasExtras")?.value;
    const onibus = document.getElementById("onibus")?.value;
    const onibusPersonalizado = document.getElementById("onibusPersonalizado")?.value || "N/A";
    const tempo = document.getElementById("tempo")?.value || "N/A";
    const horarioAlterado = document.getElementById("horarioAlterado")?.value;
    const comunicacao = document.getElementById("comunicacao")?.value;
    const consideracao = document.getElementById("consideracao")?.value || "N/A";

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
    const pageHeight = 297; // Altura da página A4 em mm

    // Função auxiliar para adicionar a pergunta e resposta formatada
    function adicionarPerguntaResposta(pergunta, resposta) {
        // Verificar se há espaço suficiente na página
        if (currentY + lineHeight * 2 >= pageHeight - 20) { // Deixa uma margem de 20mm na parte inferior
            doc.addPage(); // Adiciona uma nova página
            currentY = 20; // Reinicia a posição Y na nova página
        }

        // Adicionar pergunta
        doc.setFont("helvetica", "bold");
        doc.text(pergunta, marginLeft, currentY);
        currentY += lineHeight;

        // Adicionar descrição "Resposta:" em negrito e a resposta
        doc.setFont("helvetica", "bold");
        doc.text("Resposta:", marginLeft, currentY); currentY += lineHeight;
        doc.setFont("helvetica", "normal");
        const linhasResposta = doc.splitTextToSize(resposta, 160);
        doc.text(linhasResposta, marginLeft + 15, currentY);
        currentY += (linhasResposta.length * lineHeight) + 5;
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
    adicionarPerguntaResposta("Comunicação:", comunicacao);
    adicionarPerguntaResposta("Consideração do Avaliador:", consideracao);

    // Adicionar pontuação final com destaque
    currentY += lineHeight;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`Pontuação Final: ${pontuacao}/10`, marginLeft, currentY);

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

// Função para alternar entre pontuação automática e manual
function togglePontuacaoManual() {
    const tipoPontuacao = document.getElementById("tipoPontuacao")?.value;
    const pontuacaoManualDiv = document.getElementById("pontuacaoManualDiv");

    if (tipoPontuacao === "Manual") {
        pontuacaoManualDiv.style.display = "block";
    } else {
        pontuacaoManualDiv.style.display = "none";
    }
}

// Eventos de salvamento automático
document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('input', salvarDados);
});