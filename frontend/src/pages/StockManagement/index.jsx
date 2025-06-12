import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getStockSummary,
  getStockHistory,
  updateProduct,
} from "../../services/productService";
import "./Styles/style.css";

const StockManagementPage = () => {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const summaryData = await getStockSummary();
      const historyData = await getStockHistory();
      setSummary(summaryData);
      setHistory(historyData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddStock = async (product) => {
    const { value: quantityToAdd } = await Swal.fire({
      title: `Adicionar estoque para ${product.name}`,
      input: "number",
      inputLabel: "Quantidade a adicionar",
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: "Adicionar",
      confirmButtonColor: "#1E1E1E",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value || parseInt(value, 10) <= 0) {
          return "Por favor, insira uma quantidade válida!";
        }
      },
    });

    if (quantityToAdd) {
      const newQuantity = product.quantity + parseInt(quantityToAdd, 10);
      const updatedData = { ...product, quantity: newQuantity };

      try {
        await updateProduct(product.id, updatedData);
        Swal.fire("Sucesso!", "Estoque atualizado com sucesso!", "success");
        fetchData();
      } catch (err) {
        Swal.fire(
          "Erro!",
          `Falha ao atualizar o estoque: ${err.message}`,
          "error"
        );
      }
    }
  };

  const formatCurrency = (value) => {
    if (typeof value !== "number") return "R$ 0,00";
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  };

  const formatTimestamp = (ts) => {
    return new Date(ts).toLocaleString("pt-BR");
  };

  const MovementBadge = ({ type, change }) => {
    let text = type;
    let className = "movement-type-badge";

    if (type === "ENTRADA_INICIAL") {
      text = "Entrada";
      className += " badge-entrada";
    } else if (type === "SAIDA_VENDA") {
      text = "Venda";
      className += " badge-saida";
    } else if (type === "AJUSTE_MANUAL") {
      text = change > 0 ? "Ajuste (Entrada)" : "Ajuste (Saída)";
      className += " badge-ajuste";
    }

    return <span className={className}>{text}</span>;
  };

  if (isLoading) {
    return (
      <div className="stock-management-page-mono">
        <p>Carregando dados de estoque...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-management-page-mono" style={{ color: "red" }}>
        <p>Erro: {error}</p>
      </div>
    );
  }

  return (
    <div className="stock-management-page-mono">
      <div className="stock-page-header-mono">
        <h2>Gestão de Estoque</h2>
        <Link to="/" className="button-mono secondary-button-mono">
          Voltar para Home
        </Link>
      </div>

      <section className="dashboard-grid-mono">
        <div className="dashboard-card-mono">
          <h3>Valor Total do Inventário</h3>
          <p className="value-mono">
            {formatCurrency(summary?.totalInventoryValue)}
          </p>
        </div>
        <div className="dashboard-card-mono">
          <h3>Total de Unidades</h3>
          <p className="value-mono">{summary?.totalUnits}</p>
        </div>
        <div className="dashboard-card-mono">
          <h3>Produtos com Baixo Estoque</h3>
          <p className="value-mono low-stock-value">
            {summary?.lowStockProducts?.length || 0}
          </p>
        </div>
      </section>

      <section className="stock-section-mono">
        <div className="stock-section-header-mono">
          <h3>Alerta de Baixo Estoque (&lt;5 unidades)</h3>
        </div>
        {summary?.lowStockProducts?.length > 0 ? (
          <table className="stock-table-mono">
            <thead>
              <tr>
                <th>Produto</th>
                <th className="align-right">Qtd. Atual</th>
                <th className="align-center">Ação</th>
              </tr>
            </thead>
            <tbody>
              {summary.lowStockProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td className="align-right quantity-low">{p.quantity}</td>
                  <td className="align-center">
                    <button
                      className="button-mono light-button-mono"
                      onClick={() => handleAddStock(p)}
                    >
                      Adicionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-section-message">
            Nenhum produto com baixo estoque.
          </p>
        )}
      </section>

      <section className="stock-section-mono">
        <div className="stock-section-header-mono">
          <h3>Histórico Recente de Movimentações</h3>
        </div>
        {history.length > 0 ? (
          <table className="stock-table-mono">
            <thead>
              <tr>
                <th>Data</th>
                <th>Produto</th>
                <th className="align-center">Tipo</th>
                <th className="align-right">Alteração</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td>{formatTimestamp(h.timestamp)}</td>
                  <td>{h.productName}</td>
                  <td className="align-center">
                    <MovementBadge type={h.type} change={h.quantityChange} />
                  </td>
                  <td
                    className={`align-right ${
                      h.quantityChange > 0 ? "quantity-normal" : "quantity-low"
                    }`}
                  >
                    {h.quantityChange > 0
                      ? `+${h.quantityChange}`
                      : h.quantityChange}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-section-message">
            Nenhuma movimentação de estoque registrada.
          </p>
        )}
      </section>
    </div>
  );
};

export default StockManagementPage;
