import React from "react";
import User from "./User";

export default function ContactItem({ contact, addContact, type }) {
  return (
    <User
      contact={contact}
      addContact={() => addContact(contact.user_id)}
      type={type}
    />
  );
}
