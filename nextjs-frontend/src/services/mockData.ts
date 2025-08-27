export interface Edital {
  id: number;
  titulo: string;
  descricao: string;
  origem: string;
  prazo_inscricao: string;
  valor_disponivel: number;
  url: string;
  status: string;
  data_publicacao: string;
}

export const mockEditais: Edital[] = [
  {
    id: 1,
    titulo: "Edital de Cultura 2024 - Mock",
    descricao: "Edital para projetos culturais",
    origem: "SalicWeb",
    prazo_inscricao: "2024-12-31T23:59:59Z",
    valor_disponivel: 50000,
    url: "https://example.com/edital1",
    status: "ABERTO",
    data_publicacao: "2024-01-15T00:00:00Z"
  },
  {
    id: 2,
    titulo: "Edital de Esporte Jovem - Mock",
    descricao: "Apoio a iniciativas esportivas para jovens",
    origem: "MaisBrasil",
    prazo_inscricao: "2024-11-15T23:59:59Z",
    valor_disponivel: 75000,
    url: "https://example.com/edital2",
    status: "ABERTO",
    data_publicacao: "2024-02-01T00:00:00Z"
  },
  {
    id: 3,
    titulo: "Lei de Incentivo à Arte Local - Mock",
    descricao: "Fomento à produção artística local",
    origem: "Portal Estadual",
    prazo_inscricao: "2024-10-01T23:59:59Z",
    valor_disponivel: 120000,
    url: "https://example.com/edital3",
    status: "ENCERRANDO_BREVE",
    data_publicacao: "2024-03-10T00:00:00Z"
  }
];

export const getEditais = async (): Promise<Edital[]> => {
  try {
    const response = await fetch("https://8000-i83ezger1yrrrpsdax61j-e54c7ca7.manusvm.computer/editais/");
    if (!response.ok) {
      throw new Error("API não disponível ou erro na resposta");
    }
    const data = await response.json();
    // Se a API retornar um array vazio ou nulo, usa mock data
    if (!data || data.length === 0) {
      console.warn("API retornou dados vazios. Usando dados mock.");
      return mockEditais;
    }
    return data;
  } catch (error) {
    console.warn("Erro ao conectar com a API. Usando dados mock:", error);
    return mockEditais;
  }
};

export const getEditalById = async (id: string | number): Promise<Edital | null> => {
  try {
    const response = await fetch(`https://8000-i83ezger1yrrrpsdax61j-e54c7ca7.manusvm.computer/editais/${id}`);
    if (!response.ok) {
      throw new Error("API não disponível ou erro na resposta");
    }
    const data = await response.json();
    if (!data) {
      console.warn("API não encontrou o edital. Usando dados mock.");
      return mockEditais.find(edital => edital.id == id) || null;
    }
    return data;
  } catch (error) {
    console.warn("Erro ao conectar com a API para detalhes. Usando dados mock:", error);
    return mockEditais.find(edital => edital.id == id) || null;
  }
};

