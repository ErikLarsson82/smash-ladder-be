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
('Mikael Carlen', 'mikael-carlen', 'Corrin', NULL, 0, '{}', 1),
('Viktor Kraft', 'viktor-kraft', 'Peach', 'Daisy', 0, '{3}', 2),
('Alexander Batsis', 'alexander-batsis', 'Pikachu', 'Lucina', 0, '{}', 3),
('Pontus Fransson', 'pontus-fransson', 'Young Link', NULL, 0, '{}', 4),
('Patrik Beijar', 'patrik-beijar', 'Cloud', 'Pit', 0, '{}', 5),
('Markus Hedvall', 'markus-hedvall', 'Ness', NULL, 0, '{}', 6),
('David Forssell', 'david-forssell', 'Roy', 'Captain Falcon', 0, '{}', 7),
('Mattias%20B%E4ckstr%F6m', 'mattias-backstrom', 'Shulk', 'Lucas', 0, '{1}', 8),
('Erik Larsson', 'erik-larsson', 'Mega Man', NULL, 0, '{}', 9),
('Dimitris Thanasis', 'dimitris-thanasis', 'Corrin', NULL, 0, '{}', 10),
('Victor Tuomola', 'victor-tuomola', 'Joker', NULL, 0, '{}', 11),
('Mikael Stenberg', 'mikael-stenberg', 'Ike', 'Random', 0, '{}', 12),
('Kalle Lindblom', 'kalle-lindblom', 'Mario', NULL, 0, '{}', 13),
('Emil Westenius', 'emil-westenius', 'Yoshi', 'Lucina', 0, '{}', 14),
('Martin Kustvall', 'martin-kustvall', 'Link', NULL, 0, '{}', 15),
('Victor%20L%F6vgren', 'victor-lovgren', 'Young Link', NULL, 0, '{}', 16),
('Baran Hiwakader', 'baran-hiwakader', 'Ridly', NULL, 0, '{}', 17),
('Jonas Johansson', 'jonas-johansson', 'Bowser', 'King K. Rool', 0, '{}', 18),
('Stefan Nygren', 'stefan-nygren', 'Palutena', NULL, 0, '{}', 19),
('Jimmy%20Hyt%F6nen', 'jimmy-hytonen', 'Young Link', 'Joker', 0, '{2}', 20);

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
