CREATE TABLE users
(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name varchar(255) NOT NULL CONSTRAINT users_name_unique UNIQUE,
    balance NUMERIC (15,5) NOT NULL CHECK (balance >= 0)

);

comment on table users is 'Users holding Tocos';

ALTER TABLE users
    owner to postgres;

CREATE TABLE transactions
(
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   amount NUMERIC(15,5) NOT NULL CHECK (amount >= 0),
   date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
   recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
   sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);


comment on table transactions is 'Transactions that can be done between users to exchange Tocos';


ALTER TABLE transactions
    owner to postgres;
