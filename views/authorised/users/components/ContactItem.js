import React from "react";
import User from "./User";

export default function ContactItem({ contact, addContact }) {
  return (
    <User contact={contact} addContact={() => addContact(contact.user_id)} />
  );
}
