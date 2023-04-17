import React from 'react';
import ContactsList from './components/ContactList';
export default function BlockedContacts() {
  return (
    <>
      <ContactsList contactType={'blocked'} />
    </>
  );
}
