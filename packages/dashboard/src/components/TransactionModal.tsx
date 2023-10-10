import React, { useState } from "react";
import { Button, Label, Modal, Select, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { Transaction, User } from "../schema";
import { Endpoints, serverURL } from "../constants";

interface IFormValues extends Omit<Transaction, "id" | "date"> {}

export const TransactionModal = (props: { users: User[] }) => {
  const [show, setModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {
      amount: 0,
      recipientId: "",
      senderId: "",
    },
  });

  const add = async (data: IFormValues) => {
    await fetch(`${serverURL}${Endpoints.TRANSACTIONS}`, {
      method: "POST",
      headers: [["Content-Type", "application/json"]],
      body: JSON.stringify(data),
    });

    window.location.reload();
  };

  const close = () => {
    setModal(false);
    reset();
  };

  const getDropdownItems = () => {
    return props.users.map((user) => (
      <option key={user.id} value={user.id}>
        {user.name}
      </option>
    ));
  };

  return (
    <>
      <Button onClick={() => setModal(true)}>Add Transaction</Button>
      <Modal show={show} onClose={close} dismissible={true}>
        <form onSubmit={handleSubmit(add)} name="user">
          <Modal.Body>
            <div className="space-y-6">
              <div className="mb-2 block">
                <Label htmlFor="name" value="Sender *" />
              </div>
              <Select id="name" {...register("senderId", { required: true })}>
                {getDropdownItems()}
              </Select>

              <div className="mb-2 block">
                <Label htmlFor="name" value="Recipiennt *" />
              </div>
              <Select
                id="name"
                {...register("recipientId", { required: true })}
              >
                {getDropdownItems()}
              </Select>
            </div>
            <div className="space-y-6">
              <div className="mb-2 block">
                <Label htmlFor="balance" value="Amount to transfer *" />
              </div>
              <TextInput
                type={"number"}
                id="balance"
                {...register("amount", {
                  required: true,
                  valueAsNumber: true,
                  min: 0,
                  max: 999999,
                })}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit">Add</Button>
            <Button color="gray" onClick={close}>
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};
