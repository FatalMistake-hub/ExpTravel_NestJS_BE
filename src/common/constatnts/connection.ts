export const connection: Connection = {
  CONNECTION_STRING: 'postgres://postgres:password@localhost:5432',
  DB: 'postgres',
  DBNAME: 'ExpTravel',
};
export type Connection = {
  CONNECTION_STRING: string;
  DB: string;
  DBNAME: string;
};
