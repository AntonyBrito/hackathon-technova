// src/components/ProductForm.js
import React, { useState, useEffect } from "react";
// Importe o CSS do formulário aqui, se ele for específico para o formulário
// ou assuma que será estilizado globalmente ou pelo CSS da página que o usa.
// Ex: import './ProductForm.css'; ou importe o ProductRegistrationPage.css se ele se aplicar bem.
// Para este exemplo, vamos assumir que o ProductRegistrationPage.css é usado.
import "../../pages/ProductRegistration/Styles/style.css"; // Reutilizando o CSS existente

const ProductForm = ({
  initialData,
  onSubmit,
  submitButtonText,
  isEditMode = false,
}) => {
  const [nome, setNome] = useState("");
  const [textoDescritivo, setTextoDescritivo] = useState("");
  const [cor, setCor] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [imagens, setImagens] = useState([""]);
  const [id, setId] = useState(null); // Para manter o ID no modo de edição

  useEffect(() => {
    if (initialData) {
      setId(initialData.id || null);
      setNome(initialData.nome || "");
      setTextoDescritivo(initialData.textoDescritivo || "");
      setCor(initialData.cor || "");
      setFabricante(initialData.fabricante || "");
      setPreco(
        initialData.preco !== undefined ? String(initialData.preco) : ""
      );
      setQuantidade(
        initialData.quantidade !== undefined
          ? String(initialData.quantidade)
          : ""
      );
      setImagens(
        initialData.imagens && initialData.imagens.length > 0
          ? [...initialData.imagens]
          : [""]
      );
    } else {
      // Reseta o formulário se não houver dados iniciais (modo de cadastro)
      setId(null);
      setNome("");
      setTextoDescritivo("");
      setCor("");
      setFabricante("");
      setPreco("");
      setQuantidade("");
      setImagens([""]);
    }
  }, [initialData]);

  const handleImageChange = (index, value) => {
    const novasImagens = [...imagens];
    novasImagens[index] = value;
    setImagens(novasImagens);
  };

  const handleAddImageField = () => {
    setImagens([...imagens, ""]);
  };

  const handleRemoveImageField = (index) => {
    const novasImagens = imagens.filter((_, i) => i !== index);
    setImagens(novasImagens.length > 0 ? novasImagens : [""]);
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();
    if (!nome || !fabricante || !preco || !quantidade) {
      alert(
        "Por favor, preencha os campos obrigatórios: Nome, Fabricante, Preço e Quantidade."
      );
      return;
    }

    const productData = {
      nome,
      textoDescritivo,
      cor,
      fabricante,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade, 10),
      imagens: imagens.filter((img) => img && img.trim() !== ""),
    };

    if (isEditMode && id) {
      productData.id = id; // Adiciona o ID se estiver no modo de edição
    }

    onSubmit(productData); // Chama a função de submit passada (seja para criar ou atualizar)
  };

  return (
    <form onSubmit={handleSubmitForm} className="product-form-mono">
      {/* ID do Produto (informativo no modo de edição, não editável) */}
      {isEditMode && id && (
        <div className="form-group-mono">
          <label>ID do Produto (Não editável)</label>
          <input
            type="text"
            value={id}
            readOnly
            disabled
            style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
          />
        </div>
      )}

      <div className="form-group-mono">
        <label htmlFor="form-nome">
          Nome do Produto <span className="required-star">*</span>
        </label>
        <input
          type="text"
          id="form-nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>

      <div className="form-group-mono">
        <label htmlFor="form-textoDescritivo">Descrição Detalhada</label>
        <textarea
          id="form-textoDescritivo"
          value={textoDescritivo}
          onChange={(e) => setTextoDescritivo(e.target.value)}
          rows="4"
        />
      </div>

      <div className="form-row-mono">
        <div className="form-group-mono">
          <label htmlFor="form-cor">Cor</label>
          <input
            type="text"
            id="form-cor"
            value={cor}
            onChange={(e) => setCor(e.target.value)}
          />
        </div>
        <div className="form-group-mono">
          <label htmlFor="form-fabricante">
            Fabricante <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="form-fabricante"
            value={fabricante}
            onChange={(e) => setFabricante(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-row-mono">
        <div className="form-group-mono">
          <label htmlFor="form-preco">
            Preço (R$) <span className="required-star">*</span>
          </label>
          <input
            type="number"
            id="form-preco"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            step="0.01"
            min="0"
            required
          />
        </div>
        <div className="form-group-mono">
          <label htmlFor="form-quantidade">
            Quantidade em Estoque <span className="required-star">*</span>
          </label>
          <input
            type="number"
            id="form-quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            min="0"
            required
          />
        </div>
      </div>

      <div className="form-group-mono image-urls-group-mono">
        <label>URLs das Imagens</label>
        {imagens.map((imgUrl, index) => (
          <div key={index} className="image-url-field-mono">
            <input
              type="url"
              placeholder={`URL da Imagem ${index + 1}`}
              value={imgUrl}
              onChange={(e) => handleImageChange(index, e.target.value)}
            />
            {(imagens.length > 1 ||
              (imagens.length === 1 && imagens[0] !== "")) && (
              <button
                type="button"
                onClick={() => handleRemoveImageField(index)}
                className="button-mono remove-image-button-mono"
              >
                Remover
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddImageField}
          className="button-mono secondary-button-mono add-image-button-mono"
        >
          Adicionar mais uma imagem
        </button>
      </div>

      <div className="form-actions-mono">
        <button
          type="submit"
          className="button-mono primary-button-mono submit-product-button-mono"
        >
          {submitButtonText ||
            (isEditMode ? "Salvar Alterações" : "Cadastrar Produto")}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
