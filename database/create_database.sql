-- Script completo para crear la base de datos desde cero
-- Ejecutar este script si prefieres recrear la base de datos

DROP DATABASE IF EXISTS univol;
CREATE DATABASE univol CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE univol;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(255) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    rol ENUM('postulante', 'organizacion') NOT NULL,
    telefono VARCHAR(30),
    avatar_url VARCHAR(500),
    activo INT DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL,
    INDEX idx_correo (correo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de organizaciones
CREATE TABLE organizaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL UNIQUE,
    nombre VARCHAR(200) NOT NULL,
    nombre_corto VARCHAR(120),
    descripcion TEXT,
    direccion VARCHAR(500),
    ciudad VARCHAR(100) DEFAULT 'Huancayo',
    nombre_contacto VARCHAR(200),
    telefono_contacto VARCHAR(30),
    sitio_web VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_id_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de postulantes
CREATE TABLE postulantes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT NOT NULL UNIQUE,
    nombres VARCHAR(120),
    apellidos VARCHAR(120),
    fecha_nacimiento DATETIME,
    ciudad VARCHAR(100) DEFAULT 'Huancayo',
    telefono VARCHAR(30),
    educacion VARCHAR(255),
    biografia TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_id_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de eventos
CREATE TABLE eventos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_organizacion BIGINT NOT NULL,
    titulo VARCHAR(250) NOT NULL,
    descripcion TEXT,
    descripcion_corta VARCHAR(500),
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    ubicacion VARCHAR(500),
    imagen_url VARCHAR(500),
    cupo_maximo INT,
    estado ENUM('borrador', 'publicado', 'cancelado', 'completado') DEFAULT 'borrador',
    fecha_publicacion TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_organizacion) REFERENCES organizaciones(id) ON DELETE CASCADE,
    INDEX idx_id_organizacion (id_organizacion),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de postulaciones
CREATE TABLE postulaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_evento BIGINT NOT NULL,
    id_postulante BIGINT NOT NULL,
    mensaje TEXT,
    estado ENUM('postulado', 'revision', 'aceptado', 'rechazado', 'cancelado') DEFAULT 'postulado',
    fecha_postulacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP NULL,
    nota_respuesta TEXT,
    FOREIGN KEY (id_evento) REFERENCES eventos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_postulante) REFERENCES postulantes(id) ON DELETE CASCADE,
    INDEX idx_id_evento (id_evento),
    INDEX idx_id_postulante (id_postulante),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


