CREATE TABLE clientes (
    cliente_id INT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    endereco VARCHAR(MAX),
    telefone VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    data_criacao DATETIME DEFAULT GETDATE(),
    status_cliente VARCHAR(50) DEFAULT 'Ativo',
    data_atualizacao DATETIME DEFAULT GETDATE()
);

CREATE TABLE consumidores (
    consumidor_id INT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telefone VARCHAR(20),
    endereco VARCHAR(MAX),
    tipo_documento VARCHAR(20),
    numero_documento VARCHAR(20),
    data_criacao DATETIME DEFAULT GETDATE(),
    status_consumidor VARCHAR(50) DEFAULT 'Ativo',
    data_atualizacao DATETIME DEFAULT GETDATE()
);

CREATE TABLE produtos (
    produto_id INT IDENTITY(1,1) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao VARCHAR(MAX),
    categoria VARCHAR(100),
    preco DECIMAL(10, 2),
    cliente_id INT FOREIGN KEY REFERENCES clientes(cliente_id) ON DELETE CASCADE,
    quantidade_em_estoque INT DEFAULT 0,
    status_produto VARCHAR(50) DEFAULT 'Disponível',
    data_criacao DATETIME DEFAULT GETDATE(),
    data_atualizacao DATETIME DEFAULT GETDATE()
);

CREATE TABLE reclamacoes (
    reclamacao_id INT IDENTITY(1,1) PRIMARY KEY,
    consumidor_id INT FOREIGN KEY REFERENCES consumidores(consumidor_id) ON DELETE CASCADE,
    produto_id INT FOREIGN KEY REFERENCES produtos(produto_id) ON DELETE CASCADE,
    motivo VARCHAR(MAX) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pendente',
    forma_solucao VARCHAR(50) CHECK (forma_solucao IN ('Troca', 'Reembolso')),
    data_reclamacao DATETIME DEFAULT GETDATE(),
    data_resolucao DATETIME,
    descricao_situacao VARCHAR(MAX),
    prioridade VARCHAR(50) DEFAULT 'Média',
    data_atualizacao DATETIME DEFAULT GETDATE()
);

CREATE TABLE status_reclamacao (
    status_id INT IDENTITY(1,1) PRIMARY KEY,
    reclamacao_id INT FOREIGN KEY REFERENCES reclamacoes(reclamacao_id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    data_status DATETIME DEFAULT GETDATE(),
    descricao VARCHAR(MAX)
);

CREATE TABLE solucoes (
    solucao_id INT IDENTITY(1,1) PRIMARY KEY,
    reclamacao_id INT FOREIGN KEY REFERENCES reclamacoes(reclamacao_id) ON DELETE CASCADE,
    tipo_solucao VARCHAR(50) CHECK (tipo_solucao IN ('Troca', 'Reembolso')),
    descricao VARCHAR(MAX),
    status_solucao VARCHAR(50) DEFAULT 'Em andamento',
    data_solicitacao DATETIME DEFAULT GETDATE(),
    data_conclusao DATETIME,
    data_atualizacao DATETIME DEFAULT GETDATE()
);

CREATE TABLE logs (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    usuario VARCHAR(255) NOT NULL,
    acao VARCHAR(MAX) NOT NULL,
    tabela_afetada VARCHAR(50),
    id_registro_afetado INT,
    data_acao DATETIME DEFAULT GETDATE()
);

CREATE TABLE historico_alteracoes (
    audit_id INT IDENTITY(1,1) PRIMARY KEY,
    usuario VARCHAR(255) NOT NULL,
    tabela_afetada VARCHAR(50),
    acao VARCHAR(10) CHECK (acao IN ('INSERT', 'UPDATE', 'DELETE')),
    dados_anteriores VARCHAR(MAX),
    dados_novos VARCHAR(MAX),
    data_acao DATETIME DEFAULT GETDATE()
);

CREATE TABLE contato_chat (
    chat_id INT IDENTITY(1,1) PRIMARY KEY,
    consumidor_id INT FOREIGN KEY REFERENCES consumidores(consumidor_id) ON DELETE CASCADE,
    usuario VARCHAR(255) NOT NULL,
    mensagem VARCHAR(MAX) NOT NULL,
    data_mensagem DATETIME DEFAULT GETDATE()
);

INSERT INTO clientes (nome, cnpj, endereco, telefone, email)
VALUES 
('Empresa Alfa Ltda', '12345678000199', 'Av. Central, 1000, Centro, São Paulo - SP', '1133224455', 'contato@empresa-alfa.com');

INSERT INTO consumidores (nome, email, telefone, endereco, tipo_documento, numero_documento)
VALUES 
('Carlos Pereira', 'carlos.p@email.com', '11987654321', 'Rua A, 200, Apto 12, São Paulo - SP', 'CPF', '12345678901');

INSERT INTO produtos (nome, descricao, categoria, preco, cliente_id, quantidade_em_estoque)
VALUES 
('Smartphone X', 'Celular de última geração com 128GB', 'Eletrônicos', 1899.90, 1, 50);

INSERT INTO reclamacoes (consumidor_id, produto_id, motivo, forma_solucao, descricao_situacao, prioridade)
VALUES 
(1, 1, 'Produto chegou danificado', 'Troca', 'Tela rachada ao abrir a caixa', 'Alta');

INSERT INTO status_reclamacao (reclamacao_id, status, descricao)
VALUES 
(1, 'Em análise', 'Aguardando avaliação do setor de qualidade');

INSERT INTO solucoes (reclamacao_id, tipo_solucao, descricao)
VALUES 
(1, 'Troca', 'Será enviada uma nova unidade do produto após análise.');

INSERT INTO logs (usuario, acao, tabela_afetada, id_registro_afetado)
VALUES 
('admin@logpass.com', 'INSERT em reclamacoes', 'reclamacoes', 1);

INSERT INTO historico_alteracoes (usuario, tabela_afetada, acao, dados_anteriores, dados_novos)
VALUES 
('admin@logpass.com', 'reclamacoes', 'INSERT', NULL, 'consumidor_id=1, produto_id=1, motivo=Produto danificado');

INSERT INTO contato_chat (consumidor_id, usuario, mensagem)
VALUES 
(1, 'atendente@logpass.com', 'Olá Carlos, recebemos sua reclamação e já estamos analisando.');
