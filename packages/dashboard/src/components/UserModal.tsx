import React, { useState } from "react";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { User } from "../schema";
import { Endpoints, serverURL } from "../constants";

interface IFormValues extends Omit<User, "id"> {}

export const UserModal = () => {
  const [show, setModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {
      name: "",
      balance: 0,
    },
  });

  const add = async (data: IFormValues) => {
    await fetch(`${serverURL}${Endpoints.USERS}`, {
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

  return (
    <>
      <Button onClick={() => setModal(true)}>Add User</Button>
      <Modal show={show} onClose={close} dismissible={true}>
        <form onSubmit={handleSubmit(add)} name="user">
          <Modal.Body>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Add User
              </h3>
              <div className="mb-2 block">
                <Label htmlFor="name" value="User name *" />
              </div>
              <TextInput
                id="name"
                {...register("name", { required: true, maxLength: 150 })}
              />
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.name && <span>This field is required</span>}
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                Balance
              </h3>
              <div className="mb-2 block">
                <Label htmlFor="balance" value="Balance *" />
              </div>
              <TextInput
                type={"number"}
                id="balance"
                {...register("balance", {
                  required: true,
                  valueAsNumber: true,
                  min: 0,
                  max: 999999,
                })}
              />
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                {errors.name && <span>This field is required</span>}
              </p>
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
