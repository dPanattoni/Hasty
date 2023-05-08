import React from 'react';
import PropTypes from 'prop-types';
import './users.css';

export default function UsersTable(props) {
  const { users } = props;

  return (
    <>
      <table className="table react-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th>Avatar</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="users-admin-avatar">{users}</tbody>
        <tfoot></tfoot>
      </table>
    </>
  );
}

UsersTable.propTypes = {
  users: PropTypes.arrayOf(PropTypes.element).isRequired,
};
