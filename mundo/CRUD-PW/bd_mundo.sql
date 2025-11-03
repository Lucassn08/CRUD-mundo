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



select 
nome,
continente
 from tb_paises;