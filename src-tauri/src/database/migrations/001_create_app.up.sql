CREATE TABLE situacoes (
    sit_uuid TEXT PRIMARY KEY NOT NULL,
    sit_descricao TEXT NOT NULL
);

INSERT INTO situacoes (sit_uuid, sit_descricao) VALUES ('00000000-0000-0000-0000-000000000001', 'ATIVO');
INSERT INTO situacoes (sit_uuid, sit_descricao) VALUES ('00000000-0000-0000-0000-000000000002', 'INATIVO');
INSERT INTO situacoes (sit_uuid, sit_descricao) VALUES ('00000000-0000-0000-0000-000000000003', 'EXCLUIDO');

CREATE TABLE usuarios (
    usu_uuid TEXT PRIMARY KEY NOT NULL,
    sit_uuid TEXT NOT NULL,

    usu_nome TEXT NOT NULL,
    usu_email TEXT,
    usu_telefone TEXT,

    FOREIGN KEY (sit_uuid)
        REFERENCES situacoes(sit_uuid)
);

INSERT INTO usuarios (usu_uuid, sit_uuid, usu_nome, usu_email, usu_telefone)
VALUES ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000001', 'Administrador', NULL, NULL);

CREATE TABLE despesa_tipos (
    dest_uuid TEXT PRIMARY KEY NOT NULL,
    sit_uuid TEXT NOT NULL,

    dest_descricao TEXT NOT NULL,

    FOREIGN KEY (sit_uuid)
        REFERENCES situacoes(sit_uuid)
);

INSERT INTO despesa_tipos (dest_uuid, sit_uuid, dest_descricao)
VALUES ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'RECEITA');

INSERT INTO despesa_tipos (dest_uuid, sit_uuid, dest_descricao)
VALUES ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'DESPESA');

CREATE TABLE categorias (
    cat_uuid TEXT PRIMARY KEY NOT NULL,
    usu_uuid TEXT NOT NULL,
    sit_uuid TEXT NOT NULL,

    cat_descricao TEXT NOT NULL,

    FOREIGN KEY (usu_uuid)
        REFERENCES usuarios(usu_uuid),

    FOREIGN KEY (sit_uuid)
        REFERENCES situacoes(sit_uuid)
);

CREATE TABLE despesas (
    des_uuid TEXT PRIMARY KEY NOT NULL,

    usu_uuid TEXT NOT NULL,
    sit_uuid TEXT NOT NULL,
    cat_uuid TEXT NOT NULL,
    dest_uuid TEXT NOT NULL,

    des_descricao TEXT NOT NULL,
    des_valor INTEGER NOT NULL,
    des_observacao TEXT,

    des_data TEXT NOT NULL,
    des_hora TEXT NOT NULL,

    FOREIGN KEY (usu_uuid)
        REFERENCES usuarios(usu_uuid),

    FOREIGN KEY (sit_uuid)
        REFERENCES situacoes(sit_uuid),

    FOREIGN KEY (cat_uuid)
        REFERENCES categorias(cat_uuid),

    FOREIGN KEY (dest_uuid)
        REFERENCES despesa_tipos(dest_uuid)
);

CREATE TABLE recorrentes (
    rec_uuid TEXT PRIMARY KEY NOT NULL,

    usu_uuid TEXT NOT NULL,
    sit_uuid TEXT NOT NULL,
    cat_uuid TEXT NOT NULL,
    dest_uuid TEXT NOT NULL,

    rec_descricao TEXT NOT NULL,
    rec_valor INTEGER NOT NULL,

    rec_dia INTEGER NOT NULL,
    rec_hora TEXT NOT NULL,

    rec_observacao TEXT,

    FOREIGN KEY (usu_uuid)
        REFERENCES usuarios(usu_uuid),

    FOREIGN KEY (sit_uuid)
        REFERENCES situacoes(sit_uuid),

    FOREIGN KEY (cat_uuid)
        REFERENCES categorias(cat_uuid),

    FOREIGN KEY (dest_uuid)
        REFERENCES despesa_tipos(dest_uuid)
);
