// src/pages/ProductRegistrationPage.js
import React, { useState } from "react";
import { Link } from "react-router-dom"; // Importado
import "./Styles/style.css"; // Recomendo usar um CSS específico para esta página, ex: './ProductRegistrationPage.css'

const ProductRegistrationPage = ({ onAddProduct, onCancel }) => {
  // onCancel pode ser removida se não for mais usada
  const [nome, setNome] = useState("");
  const [textoDescritivo, setTextoDescritivo] = useState("");
  const [cor, setCor] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [imagens, setImagens] = useState([""]);

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!nome || !fabricante || !preco || !quantidade) {
      alert(
        "Por favor, preencha os campos obrigatórios: Nome, Fabricante, Preço e Quantidade."
      );
      return;
    }
    const novoProduto = {
      id: `tech${Date.now()}${Math.floor(Math.random() * 100)}`,
      nome,
      textoDescritivo,
      cor,
      fabricante,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade, 10),
      imagens: imagens.filter((img) => img.trim() !== ""),
    };
    onAddProduct(novoProduto);
    setNome("");
    setTextoDescritivo("");
    setCor("");
    setFabricante("");
    setPreco("");
    setQuantidade("");
    setImagens([""]);
  };

  return (
    <div className="product-registration-page-mono">
      <div className="registration-header-mono">
        <h2>Cadastrar Novo Produto</h2>
        {/* Botão modificado para Link */}
        <Link
          to="/"
          className="button-mono secondary-button-mono cancel-button-mono"
        >
          {" "}
          {/* Usei secondary-button-mono para um visual de "cancelar/voltar" */}
          Voltar para Home
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="product-form-mono">
        <div className="form-group-mono">
          <label htmlFor="nome">
            Nome do Produto <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="form-group-mono">
          <label htmlFor="textoDescritivo">Descrição Detalhada</label>
          <textarea
            id="textoDescritivo"
            value={textoDescritivo}
            onChange={(e) => setTextoDescritivo(e.target.value)}
            rows="4"
          />
        </div>

        <div className="form-row-mono">
          <div className="form-group-mono">
            <label htmlFor="cor">Cor</label>
            <input
              type="text"
              id="cor"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
            />
          </div>
          <div className="form-group-mono">
            <label htmlFor="fabricante">
              Fabricante <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="fabricante"
              value={fabricante}
              onChange={(e) => setFabricante(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row-mono">
          <div className="form-group-mono">
            <label htmlFor="preco">
              Preço (R$) <span className="required-star">*</span>
            </label>
            <input
              type="number"
              id="preco"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="form-group-mono">
            <label htmlFor="quantidade">
              Quantidade em Estoque <span className="required-star">*</span>
            </label>
            <input
              type="number"
              id="quantidade"
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
              {imagens.length > 1 && (
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
            Cadastrar Produto
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductRegistrationPage;
