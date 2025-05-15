document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const searchInput = document.getElementById('searchInput');
    const filterType = document.getElementById('filterType');
    const searchButton = document.getElementById('searchButton');
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');
    const noResults = document.getElementById('noResults');
    const loading = document.getElementById('loading');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    
    // Variáveis de estado
    let currentPage = 1;
    let totalPages = 1;
    let pageSize = 10;
    let currentSearchTerm = '';
    let currentFilterType = 'todos';
    
    // Definição dos cabeçalhos para cada tipo de consulta
    const headers = {
        'todos': ['ID', 'Nome', 'Tipo', 'Data'],
        'usuarios': ['ID', 'Nome', 'Email', 'Tipo', 'Data de Cadastro'],
        'produtos': ['ID', 'Nome', 'Descrição', 'Preço', 'Estoque'],
        'pedidos': ['ID', 'Cliente', 'Data', 'Valor Total', 'Status']
    };
    
    // Inicializar a página
    init();
    
    // Função de inicialização
    function init() {
        // Adicionar event listeners
        searchButton.addEventListener('click', () => {
            currentPage = 1;
            currentSearchTerm = searchInput.value.trim();
            currentFilterType = filterType.value;
            updateTableHeaders();
            fetchData();
        });
        
        filterType.addEventListener('change', () => {
            updateTableHeaders();
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
        
        prevPage.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                fetchData();
            }
        });
        
        nextPage.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                fetchData();
            }
        });
        
        // Configurar cabeçalhos iniciais
        updateTableHeaders();
        
        // Carregar dados iniciais
        fetchData();
    }
    
    // Função para atualizar os cabeçalhos da tabela
    function updateTableHeaders() {
        const type = filterType.value;
        const headerRow = document.createElement('tr');
        
        headers[type].forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        
        tableHead.innerHTML = '';
        tableHead.appendChild(headerRow);
    }
    
    // Função para buscar dados
    async function fetchData() {
        try {
            showLoading(true);
            
            // Construir a URL com os parâmetros de consulta
            const url = `/api/consulta?page=${currentPage}&limit=${pageSize}&search=${currentSearchTerm}&type=${currentFilterType}`;
            
            // Fazer a requisição para a API com timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
            
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Atualizar a tabela com os resultados
            updateTable(data.items || [], currentFilterType);
            
            // Atualizar a paginação
            updatePagination(data.totalPages || 1, data.currentPage || 1);
            
        } catch (error) {
            console.error('Erro:', error);
            showNoResults(true);
            
            if (error.name === 'AbortError') {
                showError('A requisição excedeu o tempo limite. Verifique sua conexão e tente novamente.');
            } else {
                showError('Erro ao conectar com o servidor. Tente novamente mais tarde.');
            }
        } finally {
            showLoading(false);
        }
    }
    
    // Função para atualizar a tabela com os resultados
    function updateTable(items, type) {
        tableBody.innerHTML = '';
        
        if (!items || items.length === 0) {
            showNoResults(true);
            return;
        }
        
        showNoResults(false);
        
        items.forEach(item => {
            const row = document.createElement('tr');
            
            // Criar células com base no tipo de consulta
            if (type === 'todos') {
                row.innerHTML = `
                    <td>${item.id || '-'}</td>
                    <td>${item.nome || '-'}</td>
                    <td>${item.tipo || '-'}</td>
                    <td>${formatDate(item.data) || '-'}</td>
                `;
            } else if (type === 'usuarios') {
                row.innerHTML = `
                    <td>${item.idUsuario || '-'}</td>
                    <td>${item.nome || '-'}</td>
                    <td>${item.email || '-'}</td>
                    <td>${item.tipoUsuario || '-'}</td>
                    <td>${formatDate(item.dataCadastro) || '-'}</td>
                `;
            } else if (type === 'produtos') {
                row.innerHTML = `
                    <td>${item.idProduto || '-'}</td>
                    <td>${item.nome || '-'}</td>
                    <td>${item.descricao || '-'}</td>
                    <td>R$ ${formatPrice(item.preco) || '-'}</td>
                    <td>${item.estoque || '-'}</td>
                `;
            } else if (type === 'pedidos') {
                row.innerHTML = `
                    <td>${item.idPedido || '-'}</td>
                    <td>${item.cliente || '-'}</td>
                    <td>${formatDate(item.data) || '-'}</td>
                    <td>R$ ${formatPrice(item.valorTotal) || '-'}</td>
                    <td>${item.status || '-'}</td>
                `;
            }
            
            tableBody.appendChild(row);
        });
    }
    
    // Função para atualizar a paginação
    function updatePagination(total, current) {
        totalPages = total;
        currentPage = current;
        
        pageInfo.textContent = `Página ${current} de ${total}`;
        
        prevPage.disabled = current <= 1;
        nextPage.disabled = current >= total;
    }
    
    // Função para mostrar/esconder o indicador de carregamento
    function showLoading(show) {
        loading.style.display = show ? 'block' : 'none';
        
        if (show) {
            tableBody.innerHTML = '';
            noResults.style.display = 'none';
        }
    }
    
    // Função para mostrar/esconder a mensagem de "nenhum resultado"
    function showNoResults(show) {
        noResults.style.display = show ? 'block' : 'none';
    }
    
    // Função para formatar data
    function formatDate(dateString) {
        if (!dateString) return '-';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        
        return date.toLocaleDateString('pt-BR');
    }
    
    // Função para formatar preço
    function formatPrice(price) {
        if (!price) return '-';
        
        return Number(price).toFixed(2).replace('.', ',');
    }

    // Adicione esta função para mostrar mensagens de erro
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message || 'Ocorreu um erro ao processar sua solicitação.';
        errorDiv.style.color = '#ff6b6b';
        errorDiv.style.padding = '15px';
        errorDiv.style.margin = '10px 0';
        errorDiv.style.backgroundColor = '#1a3b5d';
        errorDiv.style.borderRadius = '4px';
        errorDiv.style.textAlign = 'center';
        
        // Remover mensagens de erro anteriores
        const existingErrors = document.querySelectorAll('.error-message');
        existingErrors.forEach(el => el.remove());
        
        // Inserir a nova mensagem de erro antes da tabela
        const resultsDiv = document.querySelector('.results');
        resultsDiv.parentNode.insertBefore(errorDiv, resultsDiv);
        
        // Definir um timeout para remover a mensagem após 5 segundos
        setTimeout(() => {
            errorDiv.style.opacity = '0';
            errorDiv.style.transition = 'opacity 0.5s';
            setTimeout(() => errorDiv.remove(), 500);
        }, 5000);
    }
});
