document.getElementById('formLogin').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    const tipoUsuario = document.querySelector('input[name="tipoUsuario"]:checked')?.value;
    const mensagemErro = document.getElementById('mensagemErro');

    if (!email || !senha || !tipoUsuario) {
        mensagemErro.textContent = 'Por favor, preencha todos os campos.';
        return;
    }

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha, tipoUsuario })
        });

        const resultado = await response.json();

        if (resultado.sucesso) {
            // Armazena as informações do usuário no localStorage
            localStorage.setItem('usuario', JSON.stringify(resultado.usuario));

            // Redireciona de acordo com o tipo de usuário
            if (resultado.usuario.tipoUsuario === 'empresa') {
                window.location.href = '/html/painel_empresa.html';
            } else if (resultado.usuario.tipoUsuario === 'consumidor') {
                window.location.href = '/html/painel_consumidor.html';
            }
        } else {
            mensagemErro.textContent = resultado.mensagem || 'Email ou senha inválidos.';
        }
    } catch (erro) {
        console.error('Erro ao tentar logar:', erro);
        mensagemErro.textContent = 'Erro ao conectar com o servidor.';
    }
});