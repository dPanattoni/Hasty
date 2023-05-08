import React from 'react';
import PropTypes from 'prop-types';
import UsersTable from './UsersTable';
import Pagination from 'rc-pagination';
import locale from 'rc-pagination';
import { Col, Container, Row } from 'react-bootstrap';

export default function UserManager(props) {
  const { pageData, setPageData } = props;

  const onChange = (page) => {
    window.scrollTo(0, 0);

    setPageData((prevState) => {
      const newState = { ...prevState };
      newState.pageIndex = page - 1;
      return newState;
    });
  };

  const onSearchFieldChange = (e) => {
    setPageData((prevState) => {
      const newState = { ...prevState };
      newState.pageIndex = 0;
      newState.query = e.target.value;
      return newState;
    });
  };

  const onResetClick = () => {
    setPageData((prevState) => {
      const newState = { ...prevState };
      newState.query = '';
      newState.effect = !prevState.effect;
      return newState;
    });
  };

  return (
    <Container>
      <Row>
        <Col className="d-flex p-0">
          <input
            id="searchBar"
            className="form-control w-auto ms-1"
            type="text"
            placeholder="Search All Users"
            name="query"
            value={pageData.query}
            onChange={onSearchFieldChange}
          />
          {pageData.query.length > 0 ? (
            <button className="btn btn-secondary ms-1" onClick={onResetClick}>
              Reset
            </button>
          ) : (
            <span />
          )}
        </Col>
      </Row>
      <UsersTable users={pageData.mappedUserRecords} />
      <Pagination
        onChange={onChange}
        current={pageData.pageIndex + 1}
        pageSize={pageData.pageSize}
        total={pageData.totalCount}
        locale={locale}
      />
    </Container>
  );
}

UserManager.propTypes = {
  pageData: PropTypes.shape({
    pageIndex: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    totalCount: PropTypes.number.isRequired,
    query: PropTypes.string.isRequired,
    statusOptions: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.number.isRequired,
        label: PropTypes.string.isRequired,
      }).isRequired
    ).isRequired,
    allUsers: PropTypes.arrayOf(
      PropTypes.shape({
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
      }).isRequired
    ).isRequired,
    mappedUserRecords: PropTypes.arrayOf(PropTypes.element).isRequired,
  }).isRequired,
  setPageData: PropTypes.func.isRequired,
};
