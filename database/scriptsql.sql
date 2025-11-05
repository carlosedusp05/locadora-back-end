CREATE DATABASE db_locadora_filme_ds2t_25_2;

USE db_locadora_filme_ds2t_25_2;

CREATE TABLE tbl_filme(
 id int auto_increment primary key,
 nome varchar(100) NOT NULL,
 sinopse text,
 data_lancamento date,
 duracao time NOT NULL,
 orcamento decimal NOT NULL,
 trailer varchar(200),
 capa varchar(200)
);

ALTER TABLE tbl_filme
MODIFY COLUMN orcamento decimal(15,2) NOT NULL;

INSERT INTO tbl_filme(nome, sinopse, data_lancamento, duracao, orcamento, trailer, capa)
VALUES('Vingadores: Ultimato', 'Em Vingadores: Ultimato, após Thanos eliminar metade das criaturas vivas em Vingadores: Guerra Infinita, os heróis precisam lidar com a dor da perda de amigos e seus entes queridos. Com Tony Stark (Robert Downey Jr.) vagando perdido no espaço sem água nem comida, o Capitão América/Steve Rogers (Chris Evans) e a Viúva Negra/Natasha Romanov (Scarlett Johansson) precisam liderar a resistência contra o titã louco.',
'2015-04-25', '3:01:00', 400000000.00, 'https://www.youtube.com/watch?v=PgrmbRID0eY', 'https://br.web.img2.acsta.net/c_310_420/pictures/19/04/26/17/30/2428965.jpg');

INSERT INTO tbl_filme(nome, sinopse, data_lancamento, duracao, orcamento, trailer, capa)
VALUES('O Rei Leão: Live action', 'Live action do clássico da Disney, em O Rei Leão, Simba (Donald Glover) é um jovem leão cujo destino é se tornar o rei da selva. Entretanto, uma armadilha elaborada por seu tio Scar (Chiwetel Ejiofor) faz com que Mufasa (James Earl Jones), o atual rei, morra ao tentar salvar o filhote. Consumido pela culpa, Simba deixa o reino rumo a um local distante, onde encontra amigos que o ensinam a mais uma vez ter prazer pela vida.',
'2019-07-18', '1:58:00', 260000000.00, 'https://www.youtube.com/watch?v=7cj1SGaeYMY', 'https://br.web.img3.acsta.net/c_310_420/medias/nmedia/18/87/84/28/19962110.jpg');

CREATE TABLE tbl_genero(
 id int auto_increment primary key,
 nome varchar(100) NOT NULL
);

INSERT INTO tbl_genero(nome) VALUES('comédia');
INSERT INTO tbl_genero(nome) VALUES('ação');
INSERT INTO tbl_genero(nome) VALUES('drama');
INSERT INTO tbl_genero(nome) VALUES('ficção científica');
INSERT INTO tbl_genero(nome) VALUES('terror');

CREATE TABLE tbl_ator(
 id int auto_increment primary key,
 nome varchar(100) NOT NULL,
 biografia varchar(2000),
 data_nascimento date NOT NULL,
 data_falecimento date,
 is_ativo boolean NOT NULL,
 idade int NOT NULL,
 foto varchar(200)
);

INSERT INTO tbl_ator(nome, biografia, data_nascimento, data_falecimento, is_ativo, idade, foto)
 VALUES('Gaspar', 'Ator mexicano que fez uma rosa ficar azul na novela', '1981-07-12', null, true, 44, 'https://br.web.img2.acsta.net/c_310_420/pictures/14/11/28/14/14/213480.jpg');
 
INSERT INTO tbl_ator(nome, biografia, data_nascimento, data_falecimento, is_ativo, idade, foto)
VALUES('Marina Silva', 'Atriz brasileira famosa por papéis dramáticos no cinema nacional.', '1975-03-20', null, true, 50, 'https://www.camara.leg.br/internet/deputado/bandep/220637.jpgmaior.jpg');

INSERT INTO tbl_ator(nome, biografia, data_nascimento, data_falecimento, is_ativo, idade, foto)
VALUES('Alfred Hitchcock', 'Cineasta e produtor britânico, mestre do suspense.', '1899-08-13', '1980-04-29', false, 80, 'https://br.web.img2.acsta.net/c_310_420/pictures/15/02/25/20/43/378174.jpg');

CREATE TABLE tbl_diretor(
 id int auto_increment primary key,
 nome varchar(100) NOT NULL,
 biografia varchar(2000),
 data_nascimento date NOT NULL,
 data_falecimento date,
 is_ativo boolean NOT NULL,
 idade int,
 foto varchar(200)
);
 
 INSERT INTO tbl_diretor(nome, biografia, data_nascimento, data_falecimento, is_ativo, idade, foto)
VALUES('Greta Gerwig', 'Diretora americana famosa pelos filmes Lady Bird e Barbie.', '1983-08-04', null, true, 42, 'https://br.web.img3.acsta.net/pictures/19/10/18/03/17/2925410.jpg');

INSERT INTO tbl_diretor(nome, biografia, data_nascimento, data_falecimento, is_ativo, idade, foto)
VALUES('Stanley Kubrick', 'Cineasta americano, mestre em ficção científica e suspense.', '1928-07-26', '1999-03-07', false, 70, 'https://br.web.img3.acsta.net/medias/nmedia/18/85/93/27/19813127.jpeg');

INSERT INTO tbl_ator(nome, biografia, data_nascimento, data_falecimento, is_ativo, idade, foto)
 VALUES('Tim Burton', 'Diretor do filme Alice nos país e Edward mao', '1958-08-25', null, true, 67, 'https://upload.wikimedia.org/wikipedia/commons/9/95/Tim_Burton-63605.jpg');

CREATE TABLE tbl_produtora(
 id_produtora int auto_increment primary key,
 nome varchar(100) NOT NULL,
 biografia varchar(2000),
 data_fundacao date NOT NULL,
 data_fechamento date,
 is_ativo boolean NOT NULL,
 logo varchar(200)
);

INSERT INTO tbl_produtora(nome, biografia, data_fundacao, data_fechamento, is_ativo, logo)
VALUES('20th Century Fox Film Corporation', 'Estúdio clássico de Hollywood conhecido por filmes como Star Wars (originalmente), Alien e Titanic.', '1935-05-31', '2020-01-17', false, 'URL_DO_LOGO_FOX_ANTIGO');

INSERT INTO tbl_produtora(nome, biografia, data_fundacao, data_fechamento, is_ativo, logo)
VALUES(
    'Warner Bros. Pictures', 'Um dos maiores e mais antigos estúdios de cinema dos Estados Unidos (Big Five), fundada pelos irmãos Warner.', '1923-04-04', NULL, TRUE, 'URL_DO_LOGO_WARNER_BROS'
);

INSERT INTO tbl_produtora(nome, biografia, data_fundacao, data_fechamento, is_ativo, logo)
VALUES(
    'Paramount Pictures','Um estúdio cinematográfico americano, conhecido por ter sido uma das primeiras grandes produtoras de Hollywood. Produziu O Poderoso Chefão e a franquia Missão Impossível.', '1912-05-08', NULL, TRUE, 'URL_DO_LOGO_PARAMOUNT');



CREATE TABLE tbl_pais(
 id int auto_increment primary key,
 nome varchar(100) NOT NULL
);

INSERT INTO tbl_pais (nome)
VALUES ('Portugal'),('Inglaterra'),('Espanha');


CREATE TABLE tbl_filme_genero (
	id      int not null primary key auto_increment,
    id_filme  int not null,
    id_genero int not null,
    
    constraint FK_FILME_FILME_GENERO
    foreign key (id_filme)
    references tbl_filme(id),
    
    constraint FK_GENERO_FILME_GENERO
    foreign key (id_genero)
    references tbl_genero(id)
)