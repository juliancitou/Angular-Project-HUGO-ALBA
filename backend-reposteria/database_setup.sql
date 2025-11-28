-- =============================================
-- BASE DE DATOS: ENCANTO REPOSTERÍA
-- Versión FINAL limpia y profesional (2025)
-- Incluye: usuarios, categorías, productos, likes y carrito
-- =============================================
-- Eliminar base de datos si existe (opcional, descomenta si quieres empezar de cero)
-- DROP DATABASE IF EXISTS encanto_db;
-- CREATE DATABASE encanto_db;
-- \c encanto_db;
-- =============================================
-- 1. TABLA USUARIOS
-- =============================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP(0) NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 2. TABLA CATEGORÍAS
-- =============================================
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    image VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 3. TABLA PRODUCTOS
-- =============================================
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    -- para compatibilidad con frontend
    category_id BIGINT NULL REFERENCES categories(id),
    stock INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT true,
    images JSONB NULL,
    slug VARCHAR(255) NULL UNIQUE,
    likes_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP(0) NULL
);

-- =============================================
-- 4. TABLA LIKES (1 like por usuario por producto)
-- =============================================
CREATE TABLE product_likes (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_product_like UNIQUE (product_id, user_id)
);

-- =============================================
-- 5. CARRITO DE COMPRAS (para usuarios logueados y no logueados)
-- =============================================
CREATE TABLE carts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NULL,
    -- para usuarios no logueados
    created_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price_at_add NUMERIC(10, 2) NOT NULL,
    -- precio al momento de agregar
    created_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cart_id, product_id)
);

-- =============================================
-- ÍNDICES PARA RENDIMIENTO
-- =============================================
CREATE INDEX idx_products_category_id ON products(category_id);

CREATE INDEX idx_products_is_available ON products(is_available);

CREATE INDEX idx_products_likes_count ON products(likes_count DESC);

CREATE INDEX idx_product_likes_product_id ON product_likes(product_id);

CREATE INDEX idx_product_likes_user_id ON product_likes(user_id);

CREATE INDEX idx_carts_user_id ON carts(user_id);

CREATE INDEX idx_carts_session_id ON carts(session_id);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);

-- =============================================
-- TRIGGER: Contador automático de likes
-- =============================================
CREATE
OR REPLACE FUNCTION update_product_likes_count() RETURNS TRIGGER AS $ $ BEGIN IF TG_OP = 'INSERT' THEN
UPDATE
    products
SET
    likes_count = likes_count + 1
WHERE
    id = NEW.product_id;

ELSIF TG_OP = 'DELETE' THEN
UPDATE
    products
SET
    likes_count = GREATEST(likes_count - 1, 0)
WHERE
    id = OLD.product_id;

END IF;

RETURN NULL;

END;

$ $ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_likes_count ON product_likes;

CREATE TRIGGER trigger_update_likes_count
AFTER
INSERT
    OR DELETE ON product_likes FOR EACH ROW EXECUTE FUNCTION update_product_likes_count();

-- =============================================
-- TABLAS REQUERIDAS POR LARAVEL SANCTUM
-- =============================================
CREATE TABLE personal_access_tokens (
    id BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) UNIQUE NOT NULL,
    abilities TEXT NULL,
    last_used_at TIMESTAMP(0) NULL,
    expires_at TIMESTAMP(0) NULL,
    created_at TIMESTAMP(0) NULL,
    updated_at TIMESTAMP(0) NULL,
    INDEX(tokenable_type, tokenable_id)
);

CREATE TABLE password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(0) NULL
);

-- =============================================
-- USUARIO ADMIN POR DEFECTO
-- Correo: admin.definitivo@tecvalles.mx
-- Contraseña: admin123
-- =============================================
INSERT INTO
    users (
        name,
        email,
        password,
        role,
        created_at,
        updated_at
    )
VALUES
    (
        'Administrador Encanto',
        'admin.definitivo@tecvalles.mx',
        '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        -- contraseña: admin123
        'admin',
        NOW(),
        NOW()
    ) ON CONFLICT (email) DO NOTHING;

-- =============================================
-- ¡BASE DE DATOS LISTA PARA TU TIENDA PROFESIONAL!
-- =============================================
-- Ahora puedes:
-- → Entrar como admin con admin.definitivo@tecvalles.mx / admin123
-- → Crear categorías y productos desde el panel
-- → Tener likes funcionales
-- → Implementar el carrito cuando quieras (tablas ya listas)
-- =============================================