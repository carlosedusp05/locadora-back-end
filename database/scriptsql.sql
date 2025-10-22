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