import React, { useContext, useEffect } from "react";
import { Table } from "flowbite-react";
import toast from "react-hot-toast";
import { ConfigContext } from "../context/ContextConfig";

import { useFetch } from "usehooks-ts";
import { Transaction, User } from "../schema";
import { TransactionModal } from "../components/TransactionModal";
import { Endpoints, serverURL } from "../constants";

export const Transactions = () => {
  const { data: transactions, error } = useFetch<Transaction[]>(
    `${serverURL}${Endpoints.TRANSACTIONS}`,
  );

  const { data: users } = useFetch<User[]>(`${serverURL}${Endpoints.USERS}`);

  const { title } = useContext(ConfigContext);

  useEffect(() => {
    document.title = `${title} - Users`;
    if (error) {
      toast.error(` Error loading! ${error.message}`);
    }
  });

  if (!transactions || !users) return <p>Loading...</p>;

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Transactions
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6"></div>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <span className="hidden sm:block">
            <TransactionModal users={users} />
          </span>
        </div>
      </div>

      <Table className="mt-5">
        <Table.Head>
          <Table.HeadCell>ID</Table.HeadCell>
          <Table.HeadCell>Amount</Table.HeadCell>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>sender</Table.HeadCell>
          <Table.HeadCell>recipient</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {transactions.map(({ id, amount, date, senderId, recipientId }) => (
            <Table.Row
              key={id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="break-all font-medium text-gray-900 dark:text-white">
                {id}
              </Table.Cell>
              <Table.Cell className="break-all font-medium text-gray-900 dark:text-white">
                {amount}
              </Table.Cell>
              <Table.Cell className="break-all font-medium text-gray-900 dark:text-white">
                {date}
              </Table.Cell>
              <Table.Cell className="break-all font-medium text-gray-900 dark:text-white">
                {users?.find((user) => user.id === senderId)!.name}
              </Table.Cell>
              <Table.Cell className="break-all font-medium text-gray-900 dark:text-white">
                {users?.find((user) => user.id === recipientId)!.name}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
