import React, { useState, useEffect } from "react";
import "../../pages/ProductRegistration/Styles/style.css"; // Reutilizando o CSS existente

const ProductForm = ({
  initialData,
  onSubmit,
  submitButtonText,
  isEditMode = false,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [imageUrls, setImageUrls] = useState([""]);
  const [id, setId] = useState(null);

  useEffect(() => {
    if (initialData) {
      setId(initialData.id || null);
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setColor(initialData.color || "");
      setManufacturer(initialData.manufacturer || "");
      setPrice(
        initialData.price !== undefined ? String(initialData.price) : ""
      );
      setQuantity(
        initialData.quantity !== undefined ? String(initialData.quantity) : ""
      );
      setImageUrls(
        initialData.imageUrls && initialData.imageUrls.length > 0
          ? [...initialData.imageUrls]
          : [""]
      );
    } else {
      setId(null);
      setName("");
      setDescription("");
      setColor("");
      setManufacturer("");
      setPrice("");
      setQuantity("");
      setImageUrls([""]);
    }
  }, [initialData]);

  const handleImageChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
  };

  const handleAddImageField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const handleRemoveImageField = (index) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls.length > 0 ? newImageUrls : [""]);
  };

  const handleSubmitForm = (event) => {
    event.preventDefault();
    if (!name || !manufacturer || !price || !quantity) {
      alert(
        "Por favor, preencha os campos obrigatórios: Nome, Fabricante, Preço e Quantidade."
      );
      return;
    }

    const productData = {
      name,
      description,
      color,
      manufacturer,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      imageUrls: imageUrls.filter((img) => img && img.trim() !== ""),
    };

    if (isEditMode && id) {
      productData.id = id;
    }

    onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmitForm} className="product-form-mono">
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
        <label htmlFor="form-name">
          Nome do Produto <span className="required-star">*</span>
        </label>
        <input
          type="text"
          id="form-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group-mono">
        <label htmlFor="form-description">Descrição Detalhada</label>
        <textarea
          id="form-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
        />
      </div>

      <div className="form-row-mono">
        <div className="form-group-mono">
          <label htmlFor="form-color">Cor</label>
          <input
            type="text"
            id="form-color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div className="form-group-mono">
          <label htmlFor="form-manufacturer">
            Fabricante <span className="required-star">*</span>
          </label>
          <input
            type="text"
            id="form-manufacturer"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-row-mono">
        <div className="form-group-mono">
          <label htmlFor="form-price">
            Preço (R$) <span className="required-star">*</span>
          </label>
          <input
            type="number"
            id="form-price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            min="0"
            required
          />
        </div>
        <div className="form-group-mono">
          <label htmlFor="form-quantity">
            Quantidade em Estoque <span className="required-star">*</span>
          </label>
          <input
            type="number"
            id="form-quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0"
            required
          />
        </div>
      </div>

      <div className="form-group-mono image-urls-group-mono">
        <label>URLs das Imagens</label>
        {imageUrls.map((imgUrl, index) => (
          <div key={index} className="image-url-field-mono">
            <input
              type="url"
              placeholder={`URL da Imagem ${index + 1}`}
              value={imgUrl}
              onChange={(e) => handleImageChange(index, e.target.value)}
            />
            {(imageUrls.length > 1 ||
              (imageUrls.length === 1 && imageUrls[0] !== "")) && (
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
