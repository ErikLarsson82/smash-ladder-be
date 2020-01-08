DROP TABLE players;
DROP TABLE schedule;
DROP TABLE matches;

CREATE TABLE players (
    id              serial PRIMARY KEY,
    name            text,
    playerslug      text,
    main            text,
    secondary       text,
    trend           integer,
    qc              integer[],
    rank            integer
);

INSERT INTO players (name, playerslug, main, secondary, trend, qc, rank)
  VALUES
('Mikael Carlen', 'mikael-carlen', 'Corrin', NULL, 0, '{}', 16),
('Viktor Kraft', 'viktor-kraft', 'Peach', 'Daisy', 0, '{3}', 21),
('Alexander Batsis', 'alexander-batsis', 'Pikachu', 'Lucina', 0, '{}', 2),
('Pontus Fransson', 'pontus-fransson', 'Young Link', NULL, 0, '{}', 1),
('Patrik Beijar', 'patrik-beijar', 'Cloud', 'Pit', 0, '{}', 6),
('Markus Hedvall', 'markus-hedvall', 'Ness', NULL, 0, '{}', 9),
('David Forssell', 'david-forssell', 'Roy', 'Captain Falcon', 0, '{}', 15),
('Mattias%20B%E4ckstr%F6m', 'mattias-backstrom', 'Shulk', 'Lucas', 0, '{1}', 10),
('Erik Larsson', 'erik-larsson', 'Mega Man', NULL, 0, '{}', 8),
('Dimitris Thanasis', 'dimitris-thanasis', 'Corrin', NULL, 0, '{}', 3),
('Victor Tuomola', 'victor-tuomola', 'Joker', NULL, 0, '{}', 18),
('Mikael Stenberg', 'mikael-stenberg', 'Ike', 'Random', 0, '{}', 14),
('Kalle Lindblom', 'kalle-lindblom', 'Mario', NULL, 0, '{}', 12),
('Emil Westenius', 'emil-westenius', 'Yoshi', 'Lucina', 0, '{}', 17),
('Martin Kustvall', 'martin-kustvall', 'Link', NULL, 0, '{}', 4),
('Victor%20L%F6vgren', 'victor-lovgren', 'Young Link', NULL, 0, '{}', 19),
('Baran Hiwakader', 'baran-hiwakader', 'Ridly', NULL, 0, '{}', 13),
('Jonas Johansson', 'jonas-johansson', 'Bowser', 'King K. Rool', 0, '{}', 11),
('Stefan Nygren', 'stefan-nygren', 'Palutena', NULL, 0, '{}', 20),
('Jimmy Hytonen', 'jimmy-hytonen', 'Joker', 'Bowser', 0, '{2}', 7),
('Ebba Palenius', 'ebba-palenius', 'Young Link', NULL, 0, '{}', 5);

CREATE TABLE schedule (
    id              serial PRIMARY KEY,
    p1slug         text,
    p2slug         text,
    date            text
);

CREATE TABLE matches (
    id serial PRIMARY KEY,
    p1slug text,
    p2slug text,
    date text,
    result text[],
    p1trend integer,
    p2trend integer,
    p1prerank integer,
    p2prerank integer
);
