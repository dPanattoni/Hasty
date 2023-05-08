import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import * as userService from '../../services/userService';
import toastr from 'toastr';
import defaultAvatar from '../../assets/images/generic/generic-avatar.jpg';

export default function UserRecord(props) {
  const { user, index, pageData } = props;
  const currentStatus = getLabel(pageData.mappedOptions);
  let selectedStatus = '';

  function getLabel(array) {
    const currentStatus = array?.find((option) => {
      return option.value === user.statusId;
    });
    const currentLabel = currentStatus?.label;
    return currentLabel;
  }

  const onStatusUpdate = (selection) => {
    const id = user.id;
    const statusId = selection.value;
    selectedStatus = selection.label;

    userService.updateUserStatus(id, statusId).then(onUpdateSuccess).catch(onUpdateError);
  };

  const onUpdateSuccess = (response) => {
    toastr.success(
      `${user.firstName} ${user.lastName}'s status was successfully updated to ${selectedStatus}!`,
      response
    );
  };

  const onUpdateError = (error) => {
    toastr.error(error.message);
  };

  const addDefaultImage = (e) => {
    e.target.src = defaultAvatar;
  };

  return (
    <tr className="align-baseline card-highlighted">
      <th scope="row">
        {pageData.pageIndex === 0
          ? index + 1
          : index + 1 === 10
          ? (pageData.pageIndex + 1) * 10
          : `${pageData.pageIndex}${index + 1}`}
      </th>
      <td>
        <img onError={addDefaultImage} src={user.avatarUrl} alt="User profile avatar" />
      </td>
      <td>
        {user.firstName} {user.mi} {user.lastName}
      </td>
      <td>{user.email}</td>
      <td className="col-2">
        <Select
          name="statusId"
          placeholder={currentStatus ? currentStatus : 'No Options'}
          options={pageData.mappedOptions}
          onChange={onStatusUpdate}
        />
      </td>
    </tr>
  );
}

UserRecord.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    isConfirmed: PropTypes.bool.isRequired,
    statusId: PropTypes.number.isRequired,
    dateCreated: PropTypes.string.isRequired,
    dateModified: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    mi: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  pageData: PropTypes.shape({
    mappedOptions: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
    pageIndex: PropTypes.number.isRequired,
  }).isRequired,
};
