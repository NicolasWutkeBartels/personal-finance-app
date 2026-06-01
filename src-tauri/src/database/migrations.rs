use rusqlite::Connection;
use rusqlite_migration::{Migrations, M};

pub fn apply(conn: &mut Connection) -> rusqlite_migration::Result<()> {
  migrations().to_latest(conn)
}

fn migrations() -> Migrations<'static> {
  Migrations::new(vec![
    M::up(include_str!("migrations/001_create_app.up.sql"))
  ])
}
