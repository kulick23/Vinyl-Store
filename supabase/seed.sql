insert into public.genres (id, name) values
  (1, 'Rock'),
  (2, 'Jazz'),
  (3, 'Classical'),
  (4, 'Pop'),
  (5, 'Hip Hop'),
  (6, 'Electronic'),
  (7, 'Folk'),
  (8, 'Blues')
on conflict (id) do update set name = excluded.name;

insert into public.artists (id, name) values
  (1, 'The Beatles'),
  (2, 'Pink Floyd'),
  (3, 'Miles Davis'),
  (4, 'Mozart'),
  (5, 'Led Zeppelin'),
  (6, 'Daft Punk'),
  (7, 'Bob Dylan'),
  (8, 'B.B. King'),
  (9, 'Michael Jackson'),
  (10, 'Radiohead')
on conflict (id) do update set name = excluded.name;

insert into public.releases
  (id, title, year, artist_id, genre_id, image_url)
values
  (1, 'Abbey Road', 1969, 1, 1, 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg'),
  (2, 'Sgt. Pepper''s Lonely Hearts Club Band', 1967, 1, 1, 'https://upload.wikimedia.org/wikipedia/en/5/50/Sgt._Pepper%27s_Lonely_Hearts_Club_Band.jpg'),
  (3, 'The Dark Side of the Moon', 1973, 2, 1, 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png'),
  (4, 'The Wall', 1979, 2, 1, 'https://upload.wikimedia.org/wikipedia/en/1/13/PinkFloydWallCoverOriginalNoText.jpg'),
  (5, 'Kind of Blue', 1959, 3, 2, 'https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg'),
  (6, 'Bitches Brew', 1970, 3, 2, 'https://upload.wikimedia.org/wikipedia/en/0/0b/Bitches_brew.jpg'),
  (7, 'Symphony No. 40', 1788, 4, 3, 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Mozart_Symphony_40_score.jpg/512px-Mozart_Symphony_40_score.jpg'),
  (8, 'Led Zeppelin IV', 1971, 5, 1, 'https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg'),
  (9, 'Random Access Memories', 2013, 6, 6, 'https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg'),
  (10, 'Discovery', 2001, 6, 6, 'https://upload.wikimedia.org/wikipedia/en/2/27/Daft_Punk_-_Discovery.jpg'),
  (11, 'Highway 61 Revisited', 1965, 7, 7, 'https://upload.wikimedia.org/wikipedia/en/7/7a/Bob_Dylan_-_Highway_61_Revisited.jpg'),
  (12, 'Thriller', 1982, 9, 4, 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png')
on conflict (id) do update set
  title = excluded.title,
  year = excluded.year,
  artist_id = excluded.artist_id,
  genre_id = excluded.genre_id,
  image_url = excluded.image_url;

insert into public.seller_profiles
  (id, display_name, description, rating)
values
  (1, 'Vinyl Market Store', 'Demo inventory for the Supabase catalog.', 4.80)
on conflict (id) do update set
  display_name = excluded.display_name,
  description = excluded.description,
  rating = excluded.rating;

insert into public.inventory_items
  (id, release_id, seller_id, price, quantity, condition, notes, created_at)
values
  (1, 1, 1, 29.99, 3, 0, 'Demo copy in Mint condition', now() - interval '2 days'),
  (2, 2, 1, 31.49, 2, 1, 'Demo copy in Near Mint condition', now() - interval '5 days'),
  (3, 3, 1, 39.99, 4, 0, 'Demo copy in Mint condition', now() - interval '1 day'),
  (4, 4, 1, 19.99, 2, 3, 'Demo copy in Very Good condition', now() - interval '9 days'),
  (5, 5, 1, 35.99, 3, 2, 'Demo copy in VG+ condition', now() - interval '4 days'),
  (6, 6, 1, 44.99, 1, 1, 'Demo copy in Near Mint condition', now() - interval '7 days'),
  (7, 7, 1, 16.99, 2, 4, 'Demo copy in Good condition', now() - interval '12 days'),
  (8, 8, 1, 54.99, 1, 0, 'Demo copy in Mint condition', now() - interval '3 days'),
  (9, 9, 1, 38.69, 4, 1, 'Demo copy in Near Mint condition', now() - interval '6 days'),
  (10, 10, 1, 30.39, 3, 2, 'Demo copy in VG+ condition', now() - interval '10 days'),
  (11, 11, 1, 29.69, 2, 1, 'Demo copy in Near Mint condition', now() - interval '8 days'),
  (12, 12, 1, 59.99, 2, 0, 'Demo copy in Mint condition', now() - interval '1 day')
on conflict (id) do update set
  release_id = excluded.release_id,
  seller_id = excluded.seller_id,
  price = excluded.price,
  quantity = excluded.quantity,
  condition = excluded.condition,
  notes = excluded.notes,
  created_at = excluded.created_at;

select setval(pg_get_serial_sequence('public.genres', 'id'), (select max(id) from public.genres));
select setval(pg_get_serial_sequence('public.artists', 'id'), (select max(id) from public.artists));
select setval(pg_get_serial_sequence('public.releases', 'id'), (select max(id) from public.releases));
select setval(pg_get_serial_sequence('public.seller_profiles', 'id'), (select max(id) from public.seller_profiles));
select setval(pg_get_serial_sequence('public.inventory_items', 'id'), (select max(id) from public.inventory_items));
