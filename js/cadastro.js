document.getElementById('formCadastro').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const tipoUsuario = document.querySelector('input[name="tipoUsuario"]:checked')?.value;
    const mensagemErro = document.getElementById('mensagemErro');

    if (!nome || !email || !senha || !tipoUsuario) {
        mensagemErro.textContent = 'Por favor, preencha todos os campos.';
        return;
    }

    try {
        const response = await fetch('/auth/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha, tipoUsuario })
        });

        const resultado = await response.json();

        if (resultado.sucesso) {
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            window.location.href = '/html/login.html';
        } else {
            mensagemErro.textContent = resultado.mensagem || 'Erro ao realizar cadastro.';
        }
    } catch (erro) {
        console.error('Erro ao tentar cadastrar:', erro);
        mensagemErro.textContent = 'Erro ao conectar com o servidor.';
    }
});