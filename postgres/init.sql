--
-- PostgreSQL database dump
--
-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
SET
    statement_timeout = 0;

SET
    lock_timeout = 0;

SET
    idle_in_transaction_session_timeout = 0;

SET
    client_encoding = 'UTF8';

SET
    standard_conforming_strings = on;

SELECT
    pg_catalog.set_config('search_path', '', false);

SET
    check_function_bodies = false;

SET
    xmloption = content;

SET
    client_min_messages = warning;

SET
    row_security = off;

--
-- Name: update_product_likes_count(); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION public.update_product_likes_count() RETURNS trigger LANGUAGE plpgsql AS $ $ BEGIN IF TG_OP = 'INSERT' THEN
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

$ $;

ALTER FUNCTION public.update_product_likes_count() OWNER TO postgres;

SET
    default_tablespace = '';

SET
    default_table_access_method = heap;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.cart_items (
    id bigint NOT NULL,
    cart_id bigint NOT NULL,
    product_id bigint NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    price numeric(10, 2) NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT cart_items_quantity_check CHECK ((quantity > 0))
);

ALTER TABLE
    public.cart_items OWNER TO postgres;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.cart_items_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.cart_items_id_seq OWNER TO postgres;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.carts (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    session_id character varying(255),
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE
    public.carts OWNER TO postgres;

--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.carts_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.carts_id_seq OWNER TO postgres;

--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.categories (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    image character varying(255),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE
    public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.categories_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.order_items (
    id bigint NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    product_name character varying(255) NOT NULL,
    product_price numeric(10, 2) NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT order_items_quantity_check CHECK ((quantity > 0))
);

ALTER TABLE
    public.order_items OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.order_items_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.order_items_id_seq OWNER TO postgres;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.orders (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    order_number character varying(255) NOT NULL,
    total_amount numeric(10, 2) NOT NULL,
    status character varying(50) DEFAULT 'pending' :: character varying NOT NULL,
    customer_name character varying(255) NOT NULL,
    customer_email character varying(255) NOT NULL,
    customer_phone character varying(20),
    delivery_address text,
    notes text,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT orders_status_check CHECK (
        (
            (status) :: text = ANY (
                (
                    ARRAY ['pending'::character varying, 'confirmed'::character varying, 'preparing'::character varying, 'ready'::character varying, 'delivered'::character varying, 'cancelled'::character varying]
                ) :: text []
            )
        )
    )
);

ALTER TABLE
    public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.orders_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;

--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);

ALTER TABLE
    public.password_reset_tokens OWNER TO postgres;

--
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name text NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);

ALTER TABLE
    public.personal_access_tokens OWNER TO postgres;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.personal_access_tokens_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNER TO postgres;

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;

--
-- Name: product_likes; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.product_likes (
    id bigint NOT NULL,
    product_id bigint NOT NULL,
    user_id bigint NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE
    public.product_likes OWNER TO postgres;

--
-- Name: product_likes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.product_likes_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.product_likes_id_seq OWNER TO postgres;

--
-- Name: product_likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.product_likes_id_seq OWNED BY public.product_likes.id;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.products (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    price numeric(10, 2) NOT NULL,
    category character varying(255) NOT NULL,
    category_id bigint,
    stock integer DEFAULT 0 NOT NULL,
    is_available boolean DEFAULT true NOT NULL,
    images jsonb,
    slug character varying(255),
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp(0) without time zone,
    likes_count integer DEFAULT 0 NOT NULL
);

ALTER TABLE
    public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.products_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    role character varying(10) DEFAULT 'user' :: character varying NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    phone character varying(20),
    address text,
    CONSTRAINT users_role_check CHECK (
        (
            (role) :: text = ANY (
                (
                    ARRAY ['admin'::character varying, 'user'::character varying]
                ) :: text []
            )
        )
    )
);

ALTER TABLE
    public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--
CREATE SEQUENCE public.users_id_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;

ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.cart_items
ALTER COLUMN
    id
SET
    DEFAULT nextval('public.cart_items_id_seq' :: regclass);

--
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.carts
ALTER COLUMN
    id
SET
    DEFAULT nextval('public.carts_id_seq' :: regclass);

--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.categories
ALTER COLUMN
    id
SET
    DEFAULT nextval('public.categories_id_seq' :: regclass);

--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.order_items
ALTER COLUMN
    id
SET
    DEFAULT nextval('public.order_items_id_seq' :: regclass);

--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.orders
ALTER COLUMN
    id
SET
    DEFAULT nextval('public.orders_id_seq' :: regclass);

--
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.personal_access_tokens
ALTER COLUMN
    id
SET
    DEFAULT nextval('public.personal_access_tokens_id_seq' :: regclass);

--
-- Name: product_likes id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.product_likes
ALTER COLUMN
    id
SET
    DEFAULT nextval('public.product_likes_id_seq' :: regclass);

--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.products
ALTER COLUMN
    id
SET
    DEFAULT nextval('public.products_id_seq' :: regclass);

--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.users
ALTER COLUMN
    id
SET
    DEFAULT nextval('public.users_id_seq' :: regclass);

--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--
COPY public.cart_items (
    id,
    cart_id,
    product_id,
    quantity,
    price,
    created_at,
    updated_at
)
FROM
    stdin;

\.--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--
COPY public.carts (id, user_id, session_id, created_at, updated_at)
FROM
    stdin;

\.--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--
COPY public.categories (
    id,
    name,
    description,
    image,
    is_active,
    created_at,
    updated_at
)
FROM
    stdin;

1 Pasteles Deliciosos pasteles para toda ocasión pasteles - category.jpg t 2025 -11 -12 00 :03 :27 2025 -11 -12 00 :03 :27 2 Cupcakes Pequeños y deliciosos cupcakes cupcakes - category.jpg t 2025 -11 -12 00 :03 :27 2025 -11 -12 00 :03 :27 3 Galletas Galletas artesanales y crujientes galletas - category.jpg t 2025 -11 -12 00 :03 :27 2025 -11 -12 00 :03 :27 4 Postres Individuales Postres individuales para disfrutar postres - category.jpg t 2025 -11 -12 00 :03 :27 2025 -11 -12 00 :03 :27 \.--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--
COPY public.order_items (
    id,
    order_id,
    product_id,
    product_name,
    product_price,
    quantity,
    created_at
)
FROM
    stdin;

\.--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--
COPY public.orders (
    id,
    user_id,
    order_number,
    total_amount,
    status,
    customer_name,
    customer_email,
    customer_phone,
    delivery_address,
    notes,
    created_at,
    updated_at
)
FROM
    stdin;

\.--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--
COPY public.password_reset_tokens (email, token, created_at)
FROM
    stdin;

\.--
-- Data for Name: personal_access_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--
COPY public.personal_access_tokens (
    id,
    tokenable_type,
    tokenable_id,
    name,
    token,
    abilities,
    last_used_at,
    expires_at,
    created_at,
    updated_at
)
FROM
    stdin;

1 App \ \ Models \ \ User 1 test - token 459d5d9e4ea79ec1adbf8225c6b4588af5f3770a3173593524ba07a3e2d70654 ["*"] \ N \ N 2025 -11 -21 04 :13 :46 2025 -11 -21 04 :13 :46 2 App \ \ Models \ \ User 5 auth_token 5d867a6868d47c0f7e466b4836542c2eef978fdaec537a3f0d1689dfa00642e9 ["*"] \ N \ N 2025 -11 -21 10 :22 :25 2025 -11 -21 10 :22 :25 3 App \ \ Models \ \ User 5 auth_token 676d3e042c7d7f455b61ea6619d1a7163e17aac6a2df5ed5ac7ab213aec63564 ["*"] \ N \ N 2025 -11 -22 20 :23 :42 2025 -11 -22 20 :23 :42 4 App \ \ Models \ \ User 6 auth_token e1ea2f4b847d129b4c82bb6c05553c18937a4216ae54027b4389179eb34421a8 ["*"] \ N \ N 2025 -11 -22 20 :58 :36 2025 -11 -22 20 :58 :36 17 App \ \ Models \ \ User 6 auth_token acbc3cb4da956362f3a9003875ea86a5d0f5cdce4c0089ca19795b82af49cebd ["*"] 2025 -11 -30 05 :15 :02 \ N 2025 -11 -27 19 :49 :48 2025 -11 -30 05 :15 :02 50 App \ \ Models \ \ User 8 auth_token d896814ed7910f2944be4785167965028a64e646ca3484bd979a8ab7997cfece ["*"] 2025 -11 -30 06 :41 :43 \ N 2025 -11 -30 06 :41 :30 2025 -11 -30 06 :41 :43 9 App \ \ Models \ \ User 6 auth_token 6f95c3dd5546e036ed075ca0b3f05ecf9a66c4596674020a5e6bd76f978f4ebb ["*"] 2025 -11 -25 07 :07 :38 \ N 2025 -11 -24 07 :01 :32 2025 -11 -25 07 :07 :38 10 App \ \ Models \ \ User 6 auth_token 711c8bc353254df89647b84c358e37ecf091888257f65cdec2e2945e6eea2a25 ["*"] \ N \ N 2025 -11 -25 10 :44 :21 2025 -11 -25 10 :44 :21 11 App \ \ Models \ \ User 6 auth_token e4df3a7c7cc401038b9d51697f3ecb6f58cc2c4322014504bf730849c9ac1c23 ["*"] \ N \ N 2025 -11 -25 10 :44 :33 2025 -11 -25 10 :44 :33 12 App \ \ Models \ \ User 7 auth_token 2069d43969fa5cc5913391f4af95bb64f7a7c2522e5ec018add3c98841fa1cf0 ["*"] \ N \ N 2025 -11 -25 10 :45 :25 2025 -11 -25 10 :45 :25 51 App \ \ Models \ \ User 11 auth_token 314ef564f73e27fa4261eb4f9ba8cf80963c36a858dfaab558edd3360f65940f ["*"] \ N \ N 2025 -11 -30 06 :45 :42 2025 -11 -30 06 :45 :42 52 App \ \ Models \ \ User 6 auth_token a3177b32d1a428ce918a7f5222bf3193927535758e24122f9bfee1f204121ccd ["*"] \ N \ N 2025 -11 -30 07 :01 :46 2025 -11 -30 07 :01 :46 53 App \ \ Models \ \ User 6 auth_token e5345c3614900c3c66c84ad28185d97631795359614b4350b0369f9737850644 ["*"] \ N \ N 2025 -11 -30 07 :02 :25 2025 -11 -30 07 :02 :25 54 App \ \ Models \ \ User 6 auth_token 29a7f04c11c38b9b67954914ede67c265360be234056c708fdaeb2408bd6c3c8 ["*"] \ N \ N 2025 -11 -30 07 :57 :22 2025 -11 -30 07 :57 :22 55 App \ \ Models \ \ User 11 auth_token 1da26e535ffab72033e55c5451585b72094169e23d1a9020dbf8ea7354540dd3 ["*"] \ N \ N 2025 -11 -30 07 :57 :45 2025 -11 -30 07 :57 :45 5 App \ \ Models \ \ User 6 auth_token bb26c469d4bea9224903f5528632c2dd3988ced49d3fcf0459c91886d86f4766 ["*"] 2025 -11 -24 06 :26 :28 \ N 2025 -11 -23 21 :11 :32 2025 -11 -24 06 :26 :28 56 App \ \ Models \ \ User 11 auth_token 94969f6db88871734c95f4d60c597ed611ef263af9adf600c803ca2000764a04 ["*"] 2025 -11 -30 08 :22 :18 \ N 2025 -11 -30 08 :22 :11 2025 -11 -30 08 :22 :19 6 App \ \ Models \ \ User 6 auth_token cd6b041dc5b9cbdabb61da5b291cc0242745df2365e097d96eec4a1f2b35fd41 ["*"] 2025 -11 -24 06 :51 :53 \ N 2025 -11 -24 06 :49 :59 2025 -11 -24 06 :51 :53 7 App \ \ Models \ \ User 6 auth_token b5b4916159f73be9cb8a5a3b63fcbf67ada5dff3b7c14ef6b643fb1615a9c527 ["*"] \ N \ N 2025 -11 -24 06 :53 :22 2025 -11 -24 06 :53 :22 8 App \ \ Models \ \ User 6 auth_token c70d1f45a5b1b87b958a6904609a886557737d7926f6e7d527f04e2a661eefd2 ["*"] \ N \ N 2025 -11 -24 06 :53 :29 2025 -11 -24 06 :53 :29 57 App \ \ Models \ \ User 6 auth_token c470869908ea15d94961e2cf45689541a0523ed815404e8ccf273fc1836f41e6 ["*"] \ N \ N 2025 -11 -30 08 :35 :50 2025 -11 -30 08 :35 :50 58 App \ \ Models \ \ User 6 auth_token 6d6301ca08cf0dfee3b13cf4b4f02beef4b6171ad90f835205cc261236df6352 ["*"] \ N \ N 2025 -11 -30 08 :36 :00 2025 -11 -30 08 :36 :00 59 App \ \ Models \ \ User 6 auth_token 16a268029028c04addae510365b2ffe34b4326cbe076c4f8617dc2be7d580b00 ["*"] \ N \ N 2025 -11 -30 08 :36 :52 2025 -11 -30 08 :36 :52 60 App \ \ Models \ \ User 12 auth_token 7318428c02f65726d11b7cdca170d2b47daf51bc52effe948e9c643bb3de9737 ["*"] \ N \ N 2025 -11 -30 10 :43 :50 2025 -11 -30 10 :43 :50 13 App \ \ Models \ \ User 6 auth_token ff9268f838d93b2be5d30e60c3432098a354379ea937510620ee73d2e44fa463 ["*"] 2025 -11 -26 07 :40 :52 \ N 2025 -11 -25 20 :52 :22 2025 -11 -26 07 :40 :52 14 App \ \ Models \ \ User 8 auth_token 9f36a9977905d4683f8a65438ba9797e9e08e289df6c0847897239932dd56665 ["*"] \ N \ N 2025 -11 -27 18 :58 :57 2025 -11 -27 18 :58 :57 15 App \ \ Models \ \ User 9 auth_token 7a975546bb9fddb00a271bb5ad58080e13e4dcc71cc43e7dbd0e89459fa29bde ["*"] 2025 -11 -27 19 :05 :13 \ N 2025 -11 -27 19 :03 :34 2025 -11 -27 19 :05 :13 16 App \ \ Models \ \ User 10 auth_token 61108604d85a3370996760b294a10cdcbeea27e0fb4f523cbaa6f410b6284556 ["*"] \ N \ N 2025 -11 -27 19 :11 :21 2025 -11 -27 19 :11 :21 \.--
-- Data for Name: product_likes; Type: TABLE DATA; Schema: public; Owner: postgres
--
COPY public.product_likes (id, product_id, user_id, created_at, updated_at)
FROM
    stdin;

9 9 9 2025 -11 -27 13 :05 :14 2025 -11 -27 13 :05 :14 16 9 8 2025 -11 -30 00 :41 :43 2025 -11 -30 00 :41 :43 17 9 11 2025 -11 -30 02 :22 :19 2025 -11 -30 02 :22 :19 \.--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--
COPY public.products (
    id,
    name,
    description,
    price,
    category,
    category_id,
    stock,
    is_available,
    images,
    slug,
    created_at,
    updated_at,
    deleted_at,
    likes_count
)
FROM
    stdin;

6 Pastel de prueba 1 asdas 1212.00 1 1 12 t ["products/iJ2gLa5HXhCBMDF6mj61TD34tnuP3Lzx.jpg"] \ N 2025 -11 -24 06 :43 :05 2025 -11 -24 07 :06 :04 2025 -11 -24 07 :06 :04 0 11 Mousse de Maracuyá Mousse ligero y refrescante de maracuyá.78.00 4 4 10 t ["products/zSm6t5BYKi1ViSCIRSQUtMh3Mcptpg0q.jpg"] \ N 2025 -11 -24 18 :33 :35 2025 -11 -24 18 :33 :35 \ N 0 12 Brownies Brownies de chocolate intenso y húmedo.100.00 2 2 15 t ["products/kqRlSooQaX8qlYWUgsD4v6Yb5uHHPwJc.jpg"] \ N 2025 -11 -24 18 :35 :11 2025 -11 -24 18 :35 :11 \ N 0 13 Torta de Cumpleaños Torta de cumpleaños personalizada 480.00 1 1 8 t ["products/9jojB4yQhmZ8cHjAhFeqPqlZdespK0o3.jpg"] \ N 2025 -11 -24 18 :36 :27 2025 -11 -24 18 :36 :27 \ N 0 14 Flan de Vainilla Flan cremoso con sabor a vainilla.120.00 4 4 12 t ["products/hm8ki6HrfrfnHXNVsXdY9IddTcJ9tiep.jpg"] \ N 2025 -11 -24 18 :39 :06 2025 -11 -24 18 :39 :06 \ N 0 15 Galletas de Chocolate (paquete) Galletas crujientes con chips de chocolate.132.00 3 3 12 t ["products/5UocVFRcFfjc0Cb081hIibUoQ9TnqjAZ.jpg"] \ N 2025 -11 -24 18 :40 :37 2025 -11 -24 18 :40 :37 \ N 0 16 Panna Cotta Panna cotta cremosa con frutas frescas.270.00 4 4 10 t ["products/epEzbkGFyPssjQ7yadI0Dy9micFcxbPt.jpg"] \ N 2025 -11 -24 18 :45 :16 2025 -11 -24 18 :45 :16 \ N 0 17 Torta de Red Velvet Torta de terciopelo rojo con queso crema.450.00 1 1 10 t ["products/2zEhrks0cDWGLqMxDjtmNSu1f4WPlQNV.jpg"] \ N 2025 -11 -24 18 :46 :27 2025 -11 -24 18 :46 :27 \ N 0 19 Torta de Limón Tenga fresco y esponjoso.200.00 1 1 10 t ["products/xRki3OP5kSrlCcfFkzbbm7dpZQbhXPNt.jpg"] \ N 2025 -11 -24 18 :50 :16 2025 -11 -24 18 :50 :16 \ N 0 1 Pastel de Chocolate Clásico Delicioso pastel de chocolate con crema de mantequilla y decorado con fresas frescas 350.00 Pasteles 1 15 t ["pastel-chocolate.jpg", "pastel-chocolate-2.jpg"] \ N 2025 -11 -12 00 :03 :27 2025 -11 -25 07 :07 :26 2025 -11 -25 07 :07 :26 0 2 Cupcakes de Vainilla Esponjosos cupcakes de vainilla con frosting de crema y sprinkles coloridos 25.00 Cupcakes 2 30 t ["cupcakes-vainilla.jpg"] \ N 2025 -11 -12 00 :03 :27 2025 -11 -25 07 :07 :30 2025 -11 -25 07 :07 :30 0 3 Galletas de Mantequilla Crujientes galletas de mantequilla con chispas de chocolate 15.00 Galletas 3 50 t ["galletas-mantequilla.jpg"] \ N 2025 -11 -12 00 :03 :27 2025 -11 -25 07 :07 :32 2025 -11 -25 07 :07 :32 0 4 Pastel de Tres Leches Suave pastel bañado en mezcla de tres leches con topping de merengue 280.00 Pasteles 1 12 t ["pastel-tres-leches.jpg"] \ N 2025 -11 -12 00 :03 :27 2025 -11 -25 07 :07 :35 2025 -11 -25 07 :07 :35 0 5 Cheesecake de Fresa Crema de queso suave con base de galleta y cubierta de fresas naturales 320.00 Pasteles 1 8 t ["cheesecake-fresa.jpg"] \ N 2025 -11 -12 00 :03 :27 2025 -11 -25 07 :07 :38 2025 -11 -25 07 :07 :38 0 20 Pastel ejemplo Prueba de muestra 299.00 1 1 10 t ["products/MtFZ35oGGA5uaWsvo1IcbwdR1qbFgRL7.jpg"] \ N 2025 -11 -25 20 :53 :21 2025 -11 -25 20 :53 :21 \ N 0 8 Cheesecake de Fresa Cheesecake cremoso con fresas frescas 325.00 1 1 10 t ["products/uI6VLAAYnPbk7KHLtAyn1w21YgCYyevL.jpg"] \ N 2025 -11 -24 18 :28 :49 2025 -11 -24 18 :28 :49 \ N 0 7 Tarta de chocolate Tarta de chocolate intenso con nueces 250.00 1 1 12 t ["products/04fnSUgc7NQurXq9nComwZlZLLIEFmQv.jpg"] \ N 2025 -11 -24 18 :27 :50 2025 -11 -24 18 :27 :50 \ N 0 10 Torta de Zanahoria Torta húmeda con zanahoria y nueces.330.00 1 1 13 t ["products/oXichjCTmWsSL6RGB82pDao8WjjjxEZ0.jpg"] \ N 2025 -11 -24 18 :32 :14 2025 -11 -24 18 :32 :14 \ N 0 18 Churros (Paquete) Churros crujientes con azúcar y chocolate.56.00 4 4 10 t ["products/6r3LkJvkLUktJQ9JHG5fH6WD5DK75Wb8.jpg"] \ N 2025 -11 -24 18 :48 :55 2025 -11 -24 18 :48 :55 \ N 0 9 Crema Catalana Crema pastelera caramelizada 179.00 4 4 10 t ["products/AzRQElGl2Rh6pLovCCR8VYDGZAEcqNzR.jpg"] \ N 2025 -11 -24 18 :31 :05 2025 -11 -24 18 :31 :05 \ N 3 \.--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--
COPY public.users (
    id,
    name,
    email,
    email_verified_at,
    password,
    role,
    remember_token,
    created_at,
    updated_at,
    phone,
    address
)
FROM
    stdin;

1 Administrador Encanto admin @encanto.com \ N $ 2y $ 12 $ QcLZzZ8Z8Z8Z8Z8Z8Z8Z8uZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8 admin \ N 2025 -11 -12 00 :03 :27 2025 -11 -12 18 :17 :04 123456789 Dirección de prueba 2 julian probando1 @tecvalles.mx \ N $ 2y $ 12 $ 4t78UvSszTkGYZuqeQKtbOOEHq61BBH.DyBr7laOMnUjadYFEzCrW user \ N 2025 -11 -13 10 :41 :44 2025 -11 -13 10 :41 :44 4811140821 Mi hogar jsjs 3 probando2 probando2 @tecvalles.mx \ N $ 2y $ 12 $ 7QPWH32HxTISHze9ZVHjhOe3PNisUrEX0VJ02qUdn33YmnlqA9h.6 user \ N 2025 -11 -13 11 :05 :09 2025 -11 -13 11 :05 :09 4811140821 Mi casona 4 Administrador admin1 @tecvalles.mx \ N $ 2y $ 10 $ 92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC /.og / at2.uheWG / igi admin \ N 2025 -11 -20 12 :11 :42 2025 -11 -20 12 :11 :42 \ N \ N 5 Valeria valeria @tecvalles.mx \ N $ 2y $ 12 $ EAcLrMbbt.1vX38Mt3PQcOzCThH3gLXyRP2LNQFAQqZ / F2UybhEeK user \ N 2025 -11 -21 10 :22 :25 2025 -11 -21 10 :22 :25 4811140821 Mi casononona 6 Administrador Definitivo administrador.definitivo @tecvalles.mx \ N $ 2y $ 12 $ oeb4Pjc5oc2EeXJAohHNWe50HanQo2TwvqX8XOy4BJQBHGoKOJ1qy admin \ N 2025 -11 -22 20 :57 :29 2025 -11 -22 20 :57 :29 4421234567 Querétaro,
México 7 prueba importante prueba.importante @tecvalles.mx \ N $ 2y $ 12 $ Za3eMZEjG / 08ZS306xPCGOUJT15DEd7laNZ / iY / 9t0BMUxHyTpduK user \ N 2025 -11 -25 10 :45 :25 2025 -11 -25 10 :45 :25 4811140821 Mi prueba 8 Flora flor @tecvalles.mx \ N $ 2y $ 12 $ dGd0s / Zr.ySJoIsBvYQB6eE9DCIa6HPNbHV0bH1gv9qWtUswvPXqu admin \ N 2025 -11 -27 18 :58 :57 2025 -11 -27 18 :58 :57 4811140821 Mi casa 9 prueba777 prueba777 @tecvalles.xm \ N $ 2y $ 12 $ 7zKCIODzmqcZt8Cwc9MDsepqd31JjZIe4BmPzw9kGWpCG6QmYOEx2 user \ N 2025 -11 -27 19 :03 :34 2025 -11 -27 19 :03 :34 4811140821 Mi casa 10 pruebaejemplo pruebaejemplo @tecvalles.mx \ N $ 2y $ 12 $ zKUXykvaIC0Q160qsPEAnOJL.4UwO0oqMgP2C1nR / Kb6hIUOKWrbK admin \ N 2025 -11 -27 19 :11 :21 2025 -11 -27 19 :11 :21 4811140821 Mi casa 11 patricia patricia @tecvalles.mx \ N $ 2y $ 12 $ x.jSoNaZ9JzHJR9L5pWY2O1.dxTdF3eZb02OV4Lmzd6tQZr7xXirG user \ N 2025 -11 -30 06 :45 :42 2025 -11 -30 06 :45 :42 4811140821 Mi casita 12 linda linda @tecvalles.mx \ N $ 2y $ 12 $ 10imKDSS0qxKAXIm.IjQuOS2RLQdjW5dlPv.EJt4YP6ZzH3 /.v8da user \ N 2025 -11 -30 10 :43 :50 2025 -11 -30 10 :43 :50 4811140821 Mi casonona \.--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
SELECT
    pg_catalog.setval('public.cart_items_id_seq', 1, false);

--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
SELECT
    pg_catalog.setval('public.carts_id_seq', 1, false);

--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
SELECT
    pg_catalog.setval('public.categories_id_seq', 4, true);

--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
SELECT
    pg_catalog.setval('public.order_items_id_seq', 1, false);

--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
SELECT
    pg_catalog.setval('public.orders_id_seq', 1, false);

--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
SELECT
    pg_catalog.setval('public.personal_access_tokens_id_seq', 60, true);

--
-- Name: product_likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
SELECT
    pg_catalog.setval('public.product_likes_id_seq', 17, true);

--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
SELECT
    pg_catalog.setval('public.products_id_seq', 20, true);

--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--
SELECT
    pg_catalog.setval('public.users_id_seq', 12, true);

--
-- Name: cart_items cart_items_cart_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.cart_items
ADD
    CONSTRAINT cart_items_cart_id_product_id_key UNIQUE (cart_id, product_id);

--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.cart_items
ADD
    CONSTRAINT cart_items_pkey PRIMARY KEY (id);

--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.carts
ADD
    CONSTRAINT carts_pkey PRIMARY KEY (id);

--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.categories
ADD
    CONSTRAINT categories_name_key UNIQUE (name);

--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.categories
ADD
    CONSTRAINT categories_pkey PRIMARY KEY (id);

--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.order_items
ADD
    CONSTRAINT order_items_pkey PRIMARY KEY (id);

--
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.orders
ADD
    CONSTRAINT orders_order_number_key UNIQUE (order_number);

--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.orders
ADD
    CONSTRAINT orders_pkey PRIMARY KEY (id);

--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.password_reset_tokens
ADD
    CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);

--
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.personal_access_tokens
ADD
    CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);

--
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.personal_access_tokens
ADD
    CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);

--
-- Name: product_likes product_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.product_likes
ADD
    CONSTRAINT product_likes_pkey PRIMARY KEY (id);

--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.products
ADD
    CONSTRAINT products_pkey PRIMARY KEY (id);

--
-- Name: products products_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.products
ADD
    CONSTRAINT products_slug_key UNIQUE (slug);

--
-- Name: product_likes unique_user_product_like; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.product_likes
ADD
    CONSTRAINT unique_user_product_like UNIQUE (product_id, user_id);

--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.users
ADD
    CONSTRAINT users_email_key UNIQUE (email);

--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.users
ADD
    CONSTRAINT users_pkey PRIMARY KEY (id);

--
-- Name: cart_items_cart_id_index; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX cart_items_cart_id_index ON public.cart_items USING btree (cart_id);

--
-- Name: cart_items_product_id_index; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX cart_items_product_id_index ON public.cart_items USING btree (product_id);

--
-- Name: carts_user_id_index; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX carts_user_id_index ON public.carts USING btree (user_id);

--
-- Name: categories_is_active_index; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX categories_is_active_index ON public.categories USING btree (is_active);

--
-- Name: idx_product_likes_both; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_product_likes_both ON public.product_likes USING btree (product_id, user_id);

--
-- Name: idx_product_likes_product_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_product_likes_product_id ON public.product_likes USING btree (product_id);

--
-- Name: idx_product_likes_user_id; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_product_likes_user_id ON public.product_likes USING btree (user_id);

--
-- Name: idx_products_likes_count; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX idx_products_likes_count ON public.products USING btree (likes_count DESC);

--
-- Name: orders_order_number_index; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX orders_order_number_index ON public.orders USING btree (order_number);

--
-- Name: orders_status_index; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX orders_status_index ON public.orders USING btree (status);

--
-- Name: orders_user_id_index; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX orders_user_id_index ON public.orders USING btree (user_id);

--
-- Name: personal_access_tokens_expires_at_index; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX personal_access_tokens_expires_at_index ON public.personal_access_tokens USING btree (expires_at);

--
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);

--
-- Name: products_category_id_index; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX products_category_id_index ON public.products USING btree (category_id);

--
-- Name: products_category_is_available_index; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX products_category_is_available_index ON public.products USING btree (category, is_available);

--
-- Name: products_deleted_at_index; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX products_deleted_at_index ON public.products USING btree (deleted_at);

--
-- Name: products_price_index; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX products_price_index ON public.products USING btree (price);

--
-- Name: products_slug_index; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX products_slug_index ON public.products USING btree (slug);

--
-- Name: users_email_index; Type: INDEX; Schema: public; Owner: postgres
--
CREATE INDEX users_email_index ON public.users USING btree (email);

--
-- Name: product_likes trigger_update_likes_count; Type: TRIGGER; Schema: public; Owner: postgres
--
CREATE TRIGGER trigger_update_likes_count
AFTER
INSERT
    OR DELETE ON public.product_likes FOR EACH ROW EXECUTE FUNCTION public.update_product_likes_count();

--
-- Name: cart_items fk_cart_items_cart; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.cart_items
ADD
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE;

--
-- Name: cart_items fk_cart_items_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.cart_items
ADD
    CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

--
-- Name: carts fk_carts_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.carts
ADD
    CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

--
-- Name: order_items fk_order_items_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.order_items
ADD
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

--
-- Name: order_items fk_order_items_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.order_items
ADD
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES public.products(id);

--
-- Name: orders fk_orders_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.orders
ADD
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

--
-- Name: product_likes fk_product_likes_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.product_likes
ADD
    CONSTRAINT fk_product_likes_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

--
-- Name: product_likes fk_product_likes_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.product_likes
ADD
    CONSTRAINT fk_product_likes_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

--
-- Name: products fk_products_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE
    ONLY public.products
ADD
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES public.categories(id);

--
-- PostgreSQL database dump complete
--