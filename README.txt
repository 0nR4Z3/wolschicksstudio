WOLSCHICKS STUDIO — Estrutura do Projeto
=========================================

wolschicks/
│
├── index.html              ← Página principal
│
├── assets/                 ← Imagens, SVGs, logos
│   ├── logo.png
│   ├── ebaaaafahth.svg
│   └── heroback.svg
│
├── css/
│   ├── global.css          ← Base compartilhada (navbar, footer, botões, inputs)
│   ├── index.css           ← Estilos exclusivos da home
│   ├── auth.css            ← Login e Sign Up
│   ├── account.css         ← Painel do usuário
│   └── shop.css            ← Shop, Categories, Product
│
├── js/
│   └── main.js             ← Carrosséis, navbar, qty, account nav, toast
│
└── html/
    ├── auth/
    │   ├── login.html      ← Página de login
    │   └── signup.html     ← Criar conta
    │
    ├── account/
    │   └── account.html    ← Painel: overview, orders, downloads, wishlist, profile, settings
    │
    └── shop/
        ├── categories.html ← Browse categories (grid + lista)
        ├── shop.html       ← Loja com sidebar de filtros + grid de produtos
        └── product.html    ← Página de produto individual + relacionados

