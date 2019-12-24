CREATE TABLE players (
    name            text,
    playerslug      text,
    main            text,
    secondary       text,
    trend           integer,
    qc              integer[]
);

INSERT INTO players (name, playerslug, main, secondary, trend, qc)
  VALUES
('Mikael Carlen', 'mikael-carlen', 'Corrin', NULL, 0, '{}'),
('Viktor Kraft', 'viktor-kraft', 'Peach', 'Daisy', 0, '{}'),
('Alexander Batsis', 'alexander-batsis', 'Pikachu', 'Lucina', 0, '{}'),
('Pontus Fransson', 'pontus-fransson', 'Young Link', NULL, 0, '{}'),
('Patrik Beijar', 'patrik-beijar', 'Cloud', 'Pit', 0, '{}'),
('Markus Hedvall', 'markus-hedvall', 'Ness', NULL, 0, '{}'),
('David Forssell', 'david-forssell', 'Roy', 'Captain Falcon', 0, '{}'),
('Mattias Bäckström', 'mattias-backstrom', 'Shulk', 'Lucas', 0, '{}'),
('Erik Larsson', 'erik-larsson', 'Mega Man', NULL, 0, '{}'),
('Dimitris Thanasis', 'dimitris-thanasis', 'Corrin', NULL, 0, '{}'),
('Victor Tuomola', 'victor-tuomola', 'Joker', NULL, 0, '{}'),
('Mikael Stenberg', 'mikael-stenberg', 'Ike', 'Random', 0, '{}'),
('Kalle Lindblom', 'kalle-lindblom', 'Mario', NULL, 0, '{}'),
('Emil Westenius', 'emil-westenius', 'Yoshi', 'Lucina', 0, '{}'),
('Martin Kustvall', 'martin-kustvall', 'Link', NULL, 0, '{}'),
('Victor Lövgren', 'victor-lovgren', 'Young Link', NULL, 0, '{}'),
('Baran Hiwakader', 'baran-hiwakader', 'Ridly', NULL, 0, '{}'),
('Jonas Johansson', 'jonas-johansson', 'Bowser', 'King K. Rool', 0, '{}'),
('Stefan Nygren', 'stefan-nygren', 'Palutena', NULL, 0, '{}'),
('Jimmy Hytonen', 'jimmy-hytonen', 'Joker', 'Bowser', 0, '{}'),
('Ebba Palenius', 'ebba-palenius', 'Young Link', NULL, 0, '{}');


CREATE TABLE schedule (
    ps1slug         text,
    ps2slug         text,
    date            text
);

[{"p1slug":"markus-hedvall","p2slug":"patrik-beijar","date":"2019-12-24T20:48:41.892Z"}]
