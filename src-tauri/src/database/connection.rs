use std::path::Path;
use std::time::Duration;

use rusqlite::{Connection, Result};

pub fn open(path: impl AsRef<Path>) -> Result<Connection> {
  let conn = Connection::open(path)?;

  conn.busy_timeout(Duration::from_secs(5))?;
  conn.pragma_update(None, "foreign_keys", "ON")?;
  conn.pragma_update(None, "journal_mode", "WAL")?;

  Ok(conn)
}
