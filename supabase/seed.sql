insert into public.categories (id, slug, name, wedding_required, sort_order) values
  ('10000000-0000-0000-0000-000000000001', 'venue', 'Площадка', true, 10),
  ('10000000-0000-0000-0000-000000000002', 'catering', 'Кейтеринг', true, 20),
  ('10000000-0000-0000-0000-000000000003', 'photo-video', 'Фото и видео', true, 30),
  ('10000000-0000-0000-0000-000000000004', 'decor', 'Декор и флористика', true, 40),
  ('10000000-0000-0000-0000-000000000005', 'host', 'Ведущий', true, 50),
  ('10000000-0000-0000-0000-000000000006', 'music', 'Музыка и DJ', true, 60),
  ('10000000-0000-0000-0000-000000000007', 'transport', 'Транспорт', false, 70),
  ('10000000-0000-0000-0000-000000000008', 'training', 'Тренинги и тимбилдинг', false, 80)
on conflict (id) do update set name = excluded.name, wedding_required = excluded.wedding_required, sort_order = excluded.sort_order;
