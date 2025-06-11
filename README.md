-----

# 🚀 TechNova E-Commerce

Bem-vindo ao TechNova\! Esta é uma plataforma full-stack de e-commerce que permite a visualização, compra e gerenciamento de produtos eletrônicos.

-----

## 📋 Índice

  - [Visão Geral do Projeto](https://www.google.com/search?q=%23-vis%C3%A3o-geral-do-projeto)
  - [Tecnologias Utilizadas](https://www.google.com/search?q=%23-tecnologias-utilizadas)
  - [Arquitetura da Aplicação](https://www.google.com/search?q=%23-arquitetura-da-aplica%C3%A7%C3%A3o)
      - [Backend (API)](https://www.google.com/search?q=%23-backend-api)
      - [Frontend (Cliente)](https://www.google.com/search?q=%23-frontend-cliente)
  - [Como Executar o Projeto](https://www.google.com/search?q=%23-como-executar-o-projeto)
      - [Pré-requisitos](https://www.google.com/search?q=%23-pr%C3%A9-requisitos)
      - [1. Configuração do Banco de Dados](https://www.google.com/search?q=%231-configura%C3%A7%C3%A3o-do-banco-de-dados)
      - [2. Executando o Backend](https://www.google.com/search?q=%232-executando-o-backend)
      - [3. Executando o Frontend](https://www.google.com/search?q=%233-executando-o-frontend)
  - [Endpoints da API](https://www.google.com/search?q=%23-endpoints-da-api)

-----

## 🌟 Visão Geral do Projeto

TechNova é uma aplicação completa que simula uma loja virtual de produtos de tecnologia. Ela foi construída com uma arquitetura moderna, dividida em três componentes principais:

1.  **Frontend:** Uma interface de usuário moderna e reativa construída com **React** e **Vite**.
2.  **Backend:** Uma API RESTful robusta desenvolvida com **Java** e **Spring Boot**.
3.  **Banco de Dados:** Um banco de dados relacional **MySQL** para persistência dos dados.

O sistema implementa funcionalidades de CRUD (Criar, Ler, Atualizar, Deletar) para produtos, um catálogo de loja virtual, carrinho de compras e um processo de finalização de compra que atualiza o estoque em tempo real.

-----

## 🛠️ Tecnologias Utilizadas

### Frontend

  - **React 19** com **Vite**
  - **React Router DOM** para roteamento
  - **Axios** para requisições HTTP
  - **SweetAlert2** para notificações e modais
  - CSS puro para estilização

### Backend

  - **Java 21**
  - **Spring Boot 3**
  - **Spring Data JPA** (Hibernate)
  - **Maven** para gerenciamento de dependências
  - **Lombok**

### Banco de Dados

  - **MySQL**

-----

## 🏗️ Arquitetura da Aplicação

A aplicação segue uma arquitetura de serviços desacoplada, onde o frontend consome a API RESTful fornecida pelo backend.

### ➤ Backend (API)

Localizado na pasta `hackaton-senai/`, o backend é responsável pela lógica de negócios e gerenciamento de dados. A estrutura segue o padrão **Controller-Service-Repository**:

  - **`Controller`**: Expõe os endpoints da API (`/api/products`).
  - **`Service`**: Contém a lógica de negócios e as regras de transação.
  - **`Repository`**: Abstrai o acesso aos dados usando Spring Data JPA.
  - **`Entity`**: Mapeia as tabelas do banco de dados.
  - **`DTO`**: Transfere dados de forma segura entre as camadas e o cliente.

### ➤ Frontend (Cliente)

Localizado na pasta `frontend/`, o cliente é uma **Single Page Application (SPA)** que oferece uma experiência de usuário rica e interativa.

  - **`components/`**: Componentes reutilizáveis (Header, formulários, etc.).
  - **`pages/`**: As principais telas da aplicação (Loja, Produto, Carrinho, Admin).
  - **`routes/`**: Configuração das rotas da aplicação.
  - **`services/`**: Camada que centraliza a comunicação com a API do backend.

-----

## ⚙️ Como Executar o Projeto

Siga os passos abaixo para configurar e executar a aplicação em seu ambiente local.

### ✅ Pré-requisitos

  - **Java JDK 21** ou superior
  - **Maven**
  - **Node.js** v18 ou superior
  - **NPM** ou **Yarn**
  - Um servidor de banco de dados **MySQL**

### 1\. Configuração do Banco de Dados

1.  Abra seu cliente MySQL e crie um novo banco de dados:
    ```sql
    CREATE DATABASE hackathon_db;
    ```
2.  Use o banco de dados recém-criado:
    ```sql
    USE hackathon_db;
    ```
3.  Execute o script `hackaton_db.sql` (localizado na raiz do repositório) para popular o banco com produtos de exemplo.

### 2\. Executando o Backend

1.  Navegue até o diretório do backend:
    ```bash
    cd hackaton-senai
    ```
2.  Verifique se as credenciais do banco de dados em `src/main/resources/application.properties` estão corretas para o seu ambiente.
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/hackathon_db
    spring.datasource.username=seu-usuario
    spring.datasource.password=sua-senha
    ```
3.  Execute a aplicação Spring Boot:
    ```bash
    mvn spring-boot:run
    ```
4.  O servidor backend estará rodando em `http://localhost:8080`.

### 3\. Executando o Frontend

1.  Em um novo terminal, navegue até o diretório do frontend:
    ```bash
    cd frontend
    ```
2.  Instale as dependências do projeto:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
4.  A aplicação estará acessível em `http://localhost:5173`.

-----

## 🔌 Endpoints da API

A URL base para todos os endpoints é `http://localhost:8080/api/products`.

| Método HTTP | Rota           | Descrição                                 |
| :---------- | :------------- | :---------------------------------------- |
| `GET`       | `/`            | Retorna uma lista de todos os produtos.   |
| `GET`       | `/{id}`        | Retorna um produto específico pelo ID.    |
| `POST`      | `/`            | Cria um novo produto.                     |
| `PUT`       | `/{id}`        | Atualiza um produto existente.            |
| `DELETE`    | `/{id}`        | Remove um produto pelo ID.                |
