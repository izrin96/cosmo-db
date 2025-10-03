module.exports = class Data1759485989133 {
  name = "Data1759485989133";

  async up(db) {
    // clean up duplicate key
    await db.query(
      `drop index if exists "IDX_collection_id";`
    );
    await db.query(
      `drop index if exists "idx_transfer_objekt_id";`
    );
    await db.query(
      `drop index if exists "idx_transfer_collection_id";`
    );
  }

  async down(db) {
  }
};
