drop database if exists bd_mundo ;
create database bd_mundo;
use bd_mundo;

create table tb_paises (
	cd_pais int primary key auto_increment,
    nome varchar(90) not null unique,
    continente varchar(20) not null,
    populacao bigint not null,
    idioma varchar(50) not null
);

create table tb_cidades (
	cd_cidade int primary key auto_increment,
    nome varchar(100) not null ,
    populacao bigint not null,
    id_pais int not null,
    foreign key (id_pais) references tb_paises(cd_pais)
);



insert into tb_paises (nome, continente, populacao, idioma) values
('Brasil', 'América do Sul', 214000000, 'Português'),
('Argentina', 'América do Sul', 46000000, 'Espanhol'),
('Chile', 'América do Sul', 19500000, 'Espanhol'),
('Colômbia', 'América do Sul', 52000000, 'Espanhol'),
('Peru', 'América do Sul', 34000000, 'Espanhol');

insert into tb_cidades (nome, populacao, id_pais) values
('São Paulo', 12000000, 1),
('Rio de Janeiro', 6700000, 1),
('Brasília', 3100000, 1),
('Salvador', 2900000, 1),
('Fortaleza', 2700000, 1),

('Buenos Aires', 3000000, 2),
('Córdoba', 1500000, 2),
('Rosário', 1300000, 2),
('Mendoza', 900000, 2),
('La Plata', 700000, 2),

('Santiago', 5600000, 3),
('Valparaíso', 300000, 3),
('Concepción', 900000, 3),
('Antofagasta', 400000, 3),
('Temuco', 300000, 3),

('Bogotá', 7700000, 4),
('Medellín', 2500000, 4),
('Cali', 2400000, 4),
('Barranquilla', 1200000, 4),
('Cartagena', 1000000, 4),

('Lima', 9700000, 5),
('Cusco', 430000, 5),
('Arequipa', 1000000, 5),
('Trujillo', 900000, 5),
('Chiclayo', 600000, 5);

-- =====================================
-- 🌎 AMÉRICA DO NORTE
-- =====================================
insert into tb_paises (nome, continente, populacao, idioma) values
('Estados Unidos', 'América do Norte', 333000000, 'Inglês'),
('Canadá', 'América do Norte', 39000000, 'Inglês e Francês'),
('México', 'América do Norte', 128000000, 'Espanhol'),
('Cuba', 'América do Norte', 11000000, 'Espanhol'),
('Guatemala', 'América do Norte', 18000000, 'Espanhol');

insert into tb_cidades (nome, populacao, id_pais) values
('Nova York', 8500000, 6),
('Los Angeles', 4000000, 6),
('Chicago', 2700000, 6),
('Houston', 2300000, 6),
('Miami', 470000, 6),

('Toronto', 3000000, 7),
('Vancouver', 675000, 7),
('Montreal', 1700000, 7),
('Calgary', 1300000, 7),
('Ottawa', 1000000, 7),

('Cidade do México', 9200000, 8),
('Guadalajara', 1500000, 8),
('Monterrey', 1100000, 8),
('Puebla', 1500000, 8),
('Tijuana', 2000000, 8),

('Havana', 2100000, 9),
('Santiago de Cuba', 510000, 9),
('Camagüey', 320000, 9),
('Holguín', 350000, 9),
('Guantánamo', 220000, 9),

('Cidade da Guatemala', 3000000, 10),
('Mixco', 500000, 10),
('Villa Nueva', 450000, 10),
('Quetzaltenango', 180000, 10),
('Escuintla', 160000, 10);

-- =====================================
-- 🌍 EUROPA
-- =====================================
insert into tb_paises (nome, continente, populacao, idioma) values
('Alemanha', 'Europa', 83000000, 'Alemão'),
('França', 'Europa', 68000000, 'Francês'),
('Itália', 'Europa', 60000000, 'Italiano'),
('Espanha', 'Europa', 47000000, 'Espanhol'),
('Reino Unido', 'Europa', 67000000, 'Inglês');

insert into tb_cidades (nome, populacao, id_pais) values
('Berlim', 3600000, 11),
('Munique', 1500000, 11),
('Hamburgo', 1800000, 11),
('Colônia', 1100000, 11),
('Frankfurt', 750000, 11),

('Paris', 2200000, 12),
('Marselha', 870000, 12),
('Lyon', 520000, 12),
('Toulouse', 480000, 12),
('Nice', 340000, 12),

('Roma', 2800000, 13),
('Milão', 1400000, 13),
('Nápoles', 950000, 13),
('Turim', 870000, 13),
('Palermo', 650000, 13),

('Madri', 3300000, 14),
('Barcelona', 1600000, 14),
('Valência', 800000, 14),
('Sevilha', 700000, 14),
('Bilbao', 350000, 14),

('Londres', 8900000, 15),
('Manchester', 550000, 15),
('Liverpool', 500000, 15),
('Birmingham', 1100000, 15),
('Leeds', 790000, 15);

-- =====================================
-- 🌍 ÁFRICA
-- =====================================
insert into tb_paises (nome, continente, populacao, idioma) values
('Nigéria', 'África', 220000000, 'Inglês'),
('Egito', 'África', 110000000, 'Árabe'),
('África do Sul', 'África', 60000000, 'Inglês'),
('Quênia', 'África', 56000000, 'Inglês e Suaíli'),
('Marrocos', 'África', 38000000, 'Árabe e Francês');

insert into tb_cidades (nome, populacao, id_pais) values
('Lagos', 9000000, 16),
('Abuja', 3600000, 16),
('Kano', 4000000, 16),
('Ibadan', 3000000, 16),
('Port Harcourt', 2500000, 16),

('Cairo', 9500000, 17),
('Alexandria', 5200000, 17),
('Gizé', 3700000, 17),
('Luxor', 500000, 17),
('Assuã', 320000, 17),

('Joanesburgo', 5800000, 18),
('Cidade do Cabo', 4600000, 18),
('Pretória', 2500000, 18),
('Durban', 3700000, 18),
('Bloemfontein', 250000, 18),

('Nairóbi', 4500000, 19),
('Mombaça', 1200000, 19),
('Kisumu', 800000, 19),
('Nakuru', 600000, 19),
('Eldoret', 500000, 19),

('Casablanca', 3400000, 20),
('Rabat', 1700000, 20),
('Fez', 1300000, 20),
('Marrakech', 1000000, 20),
('Tânger', 900000, 20);

-- =====================================
-- 🌏 ÁSIA
-- =====================================
insert into tb_paises (nome, continente, populacao, idioma) values
('China', 'Ásia', 1410000000, 'Mandarim'),
('Índia', 'Ásia', 1400000000, 'Hindi e Inglês'),
('Japão', 'Ásia', 125000000, 'Japonês'),
('Coreia do Sul', 'Ásia', 52000000, 'Coreano'),
('Indonésia', 'Ásia', 276000000, 'Indonésio');

insert into tb_cidades (nome, populacao, id_pais) values
('Pequim', 21500000, 21),
('Xangai', 26000000, 21),
('Cantão', 15000000, 21),
('Shenzhen', 13000000, 21),
('Chongqing', 16000000, 21),

('Nova Délhi', 32000000, 22),
('Mumbai', 20000000, 22),
('Bangalore', 13000000, 22),
('Chennai', 11000000, 22),
('Hyderabad', 10000000, 22),

('Tóquio', 37000000, 23),
('Osaka', 2700000, 23),
('Yokohama', 3700000, 23),
('Nagoya', 2300000, 23),
('Sapporo', 1900000, 23),

('Seul', 9600000, 24),
('Busan', 3400000, 24),
('Incheon', 3000000, 24),
('Daegu', 2400000, 24),
('Daejeon', 1500000, 24),

('Jacarta', 10500000, 25),
('Surabaia', 2900000, 25),
('Bandung', 2600000, 25),
('Medan', 2200000, 25),
('Semarang', 1600000, 25);

-- =====================================
-- 🌏 OCEANIA
-- =====================================
insert into tb_paises (nome, continente, populacao, idioma) values
('Austrália', 'Oceania', 26000000, 'Inglês'),
('Nova Zelândia', 'Oceania', 5200000, 'Inglês'),
('Fiji', 'Oceania', 930000, 'Inglês e Fijiano'),
('Papua-Nova Guiné', 'Oceania', 9800000, 'Inglês e Tok Pisin'),
('Samoa', 'Oceania', 220000, 'Samoano e Inglês');

insert into tb_cidades (nome, populacao, id_pais) values
('Sydney', 5300000, 26),
('Melbourne', 5100000, 26),
('Brisbane', 2500000, 26),
('Perth', 2100000, 26),
('Adelaide', 1400000, 26),

('Auckland', 1600000, 27),
('Wellington', 215000, 27),
('Christchurch', 380000, 27),
('Hamilton', 180000, 27),
('Dunedin', 120000, 27),

('Suva', 95000, 28),
('Lautoka', 71000, 28),
('Nadi', 42000, 28),
('Ba', 18000, 28),
('Labasa', 28000, 28),

('Port Moresby', 400000, 29),
('Lae', 200000, 29),
('Madang', 80000, 29),
('Mount Hagen', 46000, 29),
('Kimbe', 27000, 29),

('Apia', 37000, 30),
('Vaitele', 8500, 30),
('Faleula', 8000, 30),
('Siusega', 7000, 30),
('Leulumoega', 6000, 30);