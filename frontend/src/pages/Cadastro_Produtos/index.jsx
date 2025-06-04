// src/pages/Cadastro_Produtos/index.jsx
import React, { useState, useRef } from 'react';
import './Styles/style.css';

function ProductForm() {
  // Estado inicial do produto
  const [product, setProduct] = useState({
    nome: 'Fone com Microfone',
    textoDescritivo: 'Fone de Ouvido com Microfone, Loop Way, P3',
    cor: 'Branco',
    fabricante: 'Philips',
    preco: 39.99,
    quantidade: 27,
    imagens: [
      'https://i.ibb.co/zhRPrqQS/01.jpg',
      'https://i.ibb.co/Vp0B2h2m/02.jpg',
      'https://i.ibb.co/nqXtTqG4/03.jpg'
    ]
  });

  // Criar array de refs para os inputs de arquivo (3 imagens)
  const fileInputRefs = Array(3).fill(null).map(() => useRef(null));

  // Função para lidar com mudanças nos inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  // Função para lidar com upload de imagens
  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...product.imagens];
        newImages[index] = reader.result;
        setProduct(prev => ({ ...prev, imagens: newImages }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para disparar o clique no input de arquivo
  const handleImageClick = (index) => {
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current.click();
    }
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Produto cadastrado:', product);
    // Aqui você faria a chamada para a API ou armazenamento
  };

  return (
    <div className="app-wrapper-monochrome">
      <h2>CADASTRO DE PRODUTOS</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="section-mono">
          <h3>INFORMAÇÕES BÁSICAS</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nome">Nome do Produto*</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={product.nome}
                onChange={handleInputChange}
                required
                placeholder="Ex: Fone com Microfone"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="cor">Cor*</label>
              <input
                type="text"
                id="cor"
                name="cor"
                value={product.cor}
                onChange={handleInputChange}
                required
                placeholder="Ex: Branco"
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fabricante">Fabricante*</label>
              <input
                type="text"
                id="fabricante"
                name="fabricante"
                value={product.fabricante}
                onChange={handleInputChange}
                required
                placeholder="Ex: Philips"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="preco">Preço* (R$)</label>
              <input
                type="number"
                id="preco"
                name="preco"
                value={product.preco}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
                placeholder="Ex: 39.99"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="textoDescritivo">Descrição do Produto*</label>
            <textarea
              id="textoDescritivo"
              name="textoDescritivo"
              value={product.textoDescritivo}
              onChange={handleInputChange}
              required
              placeholder="Descreva detalhadamente o produto"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="quantidade">Quantidade em Estoque*</label>
            <input
              type="number"
              id="quantidade"
              name="quantidade"
              value={product.quantidade}
              onChange={handleInputChange}
              min="0"
              required
              placeholder="Ex: 27"
            />
          </div>
        </div>
        
        <div className="section-mono product-image-section">
          <h3>IMAGENS DO PRODUTO</h3>
          <p className="collection-description">
            Adicione até 3 imagens do produto. A primeira imagem será a principal.
          </p>
          
          <div className="product-image-grid">
            {product.imagens.map((image, index) => (
              <div
                key={index}
                className="product-image-container"
                onClick={() => handleImageClick(index)}
              >
                {image ? (
                  <img src={image} alt={`Preview ${index + 1}`} />
                ) : (
                  <span>Adicionar Imagem</span>
                )}
                <input
                  type="file"
                  ref={fileInputRefs[index]}
                  accept="image/*"
                  className="file-input"
                  onChange={(e) => handleImageUpload(e, index)}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="button-container">
          <button
            type="button"
            className="button-mono"
            onClick={() => console.log('Cancelado')}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="button-mono primary-button-mono"
          >
            Cadastrar Produto
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;