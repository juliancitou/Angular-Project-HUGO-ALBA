-- =============================================
-- BASE DE DATOS: ENCANTO REPOSTERÍA
-- =============================================
-- Crear base de datos (opcional - comentado)
-- CREATE DATABASE encanto_db;
-- Conectar a la base de datos encanto_db
-- \c encanto_db;
-- =============================================
-- TABLAS PRINCIPALES (sin dependencias)
-- =============================================
-- TABLA: users (primero porque muchas tablas dependen de ella)
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

-- TABLA: categories (antes de products)
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    image VARCHAR(255) NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: products (depende de categories)
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    -- Mantenemos por compatibilidad
    category_id BIGINT NULL,
    -- Nueva columna para relación
    stock INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT true,
    images JSONB NULL,
    slug VARCHAR(255) NULL UNIQUE,
    created_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP(0) NULL
);

-- =============================================
-- TABLAS DE CARRITO Y PEDIDOS (dependen de users y products)
-- =============================================
-- TABLA: carts (depende de users)
CREATE TABLE carts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_id VARCHAR(255) NULL,
    -- Para usuarios no logueados
    created_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: cart_items (depende de carts y products)
CREATE TABLE cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL,
    -- Precio al momento de agregar
    created_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: orders (depende de users)
CREATE TABLE orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_number VARCHAR(255) UNIQUE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'confirmed',
            'preparing',
            'ready',
            'delivered',
            'cancelled'
        )
    ),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NULL,
    delivery_address TEXT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TABLA: order_items (depende de orders y products)
CREATE TABLE order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    -- Nombre en el momento del pedido
    product_price NUMERIC(10, 2) NOT NULL,
    -- Precio en el momento del pedido
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLAS DE LARAVEL (para autenticación y jobs)
-- =============================================
CREATE TABLE password_reset_tokens (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(0) NULL
);

CREATE TABLE failed_jobs (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL,
    connection TEXT NOT NULL,
    queue TEXT NOT NULL,
    payload TEXT NOT NULL,
    exception TEXT NOT NULL,
    failed_at TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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
    updated_at TIMESTAMP(0) NULL
);

CREATE TABLE job_batches (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    total_jobs INTEGER NOT NULL,
    pending_jobs INTEGER NOT NULL,
    failed_jobs INTEGER NOT NULL,
    failed_job_ids TEXT NOT NULL,
    options TEXT NULL,
    cancelled_at INTEGER NULL,
    created_at INTEGER NOT NULL,
    finished_at INTEGER NULL
);

CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    queue VARCHAR(255) NOT NULL,
    payload TEXT NOT NULL,
    attempts INTEGER NOT NULL,
    reserved_at INTEGER NULL,
    available_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE TABLE cache (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    expiration INTEGER NOT NULL
);

CREATE TABLE cache_locks (
    key VARCHAR(255) PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    expiration INTEGER NOT NULL
);

CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    payload TEXT NOT NULL,
    last_activity INTEGER NOT NULL
);

-- =============================================
-- CONSTRAINTS Y FOREIGN KEYS (después de crear todas las tablas)
-- =============================================
-- Foreign keys para products
ALTER TABLE
    products
ADD
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id);

-- Foreign keys para carts
ALTER TABLE
    carts
ADD
    CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Foreign keys para cart_items
ALTER TABLE
    cart_items
ADD
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE;

ALTER TABLE
    cart_items
ADD
    CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

ALTER TABLE
    cart_items
ADD
    UNIQUE (cart_id, product_id);

-- Foreign keys para orders
ALTER TABLE
    orders
ADD
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Foreign keys para order_items
ALTER TABLE
    order_items
ADD
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE
    order_items
ADD
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id);

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================
CREATE INDEX users_email_index ON users (email);

CREATE INDEX categories_is_active_index ON categories (is_active);

CREATE INDEX products_category_is_available_index ON products (category, is_available);

CREATE INDEX products_price_index ON products (price);

CREATE INDEX products_deleted_at_index ON products (deleted_at);

CREATE INDEX products_category_id_index ON products (category_id);

CREATE INDEX products_slug_index ON products (slug);

CREATE INDEX carts_user_id_index ON carts (user_id);

CREATE INDEX cart_items_cart_id_index ON cart_items (cart_id);

CREATE INDEX cart_items_product_id_index ON cart_items (product_id);

CREATE INDEX orders_user_id_index ON orders (user_id);

CREATE INDEX orders_status_index ON orders (status);

CREATE INDEX orders_order_number_index ON orders (order_number);

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON personal_access_tokens (tokenable_type, tokenable_id);

CREATE INDEX jobs_queue_index ON jobs (queue);

-- =============================================
-- DATOS INICIALES
-- =============================================
-- Usuario Administrador
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
        'admin@encanto.com',
        '$2y$12$QcLZzZ8Z8Z8Z8Z8Z8Z8Z8uZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8',
        'admin',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

-- Categorías
INSERT INTO
    categories (name, description, image)
VALUES
    (
        'Pasteles',
        'Deliciosos pasteles para toda ocasión',
        'pasteles-category.jpg'
    ),
    (
        'Cupcakes',
        'Pequeños y deliciosos cupcakes',
        'cupcakes-category.jpg'
    ),
    (
        'Galletas',
        'Galletas artesanales y crujientes',
        'galletas-category.jpg'
    ),
    (
        'Postres Individuales',
        'Postres individuales para disfrutar',
        'postres-category.jpg'
    );

-- Productos de Ejemplo
INSERT INTO
    products (
        name,
        description,
        price,
        category,
        category_id,
        stock,
        is_available,
        images,
        created_at,
        updated_at
    )
VALUES
    (
        'Pastel de Chocolate Clásico',
        'Delicioso pastel de chocolate con crema de mantequilla y decorado con fresas frescas',
        350.00,
        'Pasteles',
        1,
        15,
        true,
        '["pastel-chocolate.jpg", "pastel-chocolate-2.jpg"]',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Cupcakes de Vainilla',
        'Esponjosos cupcakes de vainilla con frosting de crema y sprinkles coloridos',
        25.00,
        'Cupcakes',
        2,
        30,
        true,
        '["cupcakes-vainilla.jpg"]',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Galletas de Mantequilla',
        'Crujientes galletas de mantequilla con chispas de chocolate',
        15.00,
        'Galletas',
        3,
        50,
        true,
        '["galletas-mantequilla.jpg"]',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Pastel de Tres Leches',
        'Suave pastel bañado en mezcla de tres leches con topping de merengue',
        280.00,
        'Pasteles',
        1,
        12,
        true,
        '["pastel-tres-leches.jpg"]',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'Cheesecake de Fresa',
        'Crema de queso suave con base de galleta y cubierta de fresas naturales',
        320.00,
        'Pasteles',
        1,
        8,
        true,
        '["cheesecake-fresa.jpg"]',
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );

-- =============================================
-- ACTUALIZAR CONTRASEÑAS REALES
-- =============================================
-- NOTA: Ejecutar estos comandos después para establecer contraseñas reales
-- UPDATE users SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'admin@encanto.com'; -- password