import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import Header from '../../../components/elements/Header';
import UserManager from '../../../components/users/UserManager';
import UserRecord from '../../../components/users/UserRecord';
import * as userService from '../../../services/userService';
import lookUpService from '../../../services/lookUpService';
import toastr from 'toastr';

export default function UserAdmin() {
  const crumbs = [{ name: 'Dashboard', path: '/dashboard' }];

  const [pageData, setPageData] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
    query: '',
    statuses: [],
    mappedOptions: [],
    allUsers: [],
    mappedUserRecords: [],
  });

  useEffect(() => {
    if (pageData.statuses.length === 0) {
      lookUpService.LookUp(['StatusTypes']).then(onGetStatusSuccess).catch(onGetError);
    }
  }, []);

  useEffect(() => {
    pageData.query.length > 0
      ? userService
          .getSearchUsers(pageData.pageIndex, pageData.pageSize, pageData.query)
          .then(onGetSuccess)
          .catch(onGetError)
      : userService.getAllUsers(pageData.pageIndex, pageData.pageSize).then(onGetSuccess).catch(onGetError);
  }, [pageData.pageIndex, pageData.statuses, pageData.query]);

  const onGetStatusSuccess = (response) => {
    setPageData((prevState) => {
      const newState = { ...prevState };
      newState.statuses = response.item.statusTypes;
      newState.mappedOptions = response.item.statusTypes.map(mapStatusOptions);
      return newState;
    });
  };

  const onGetSuccess = (response) => {
    setPageData((prevState) => {
      const newState = { ...prevState };
      newState.totalCount = response.item.totalCount;
      newState.allUsers = response.item.pagedItems;
      newState.mappedUserRecords = newState.allUsers.map(mapUserRow);
      return newState;
    });
  };

  const onGetError = (error) => {
    toastr.error('Items Not Found', error);
  };

  const mapStatusOptions = (status) => {
    return { value: status.id, label: status.name };
  };

  const mapUserRow = (user, i) => {
    return <UserRecord user={user} index={i} pageData={pageData} key={`TI${user.id}`} />;
  };

  return (
    <>
      <Row>
        <Col>
          <Header title={'Users Management Dashboard'} crumbs={crumbs} />
        </Col>
      </Row>
      <Container>
        <Card>
          <Card.Body>
            <UserManager pageData={pageData} setPageData={setPageData} />
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
