import React, { useState, useEffect, useRef } from 'react';
import Listing from '../../components/listings/Listing';
import FilterManager from '../../components/landing/FilterManager';
import Pagination from 'rc-pagination';
import locale from 'rc-pagination';
import listingService from '../../services/listingService';
import './listings.css';
import { Col, Row } from 'react-bootstrap';
import { BsSearch } from 'react-icons/bs';
import toastr from 'toastr';

export default function Landing() {
  const currentRef = useRef(null);

  const [search, setSearch] = useState('');
  const [pageData, setPageData] = useState({
    pageIndex: 0,
    pageSize: 16,
    totalCount: 0,
    listings: {
      listings: [],
      mapped: [],
      filterListings: [],
      mappedFiltered: [],
      searchListings: [],
      mappedSearched: [],
    },
    formValues: {},
    pageCondition: 'default',
    effect: false,
  });

  useEffect(() => {
    pageData.pageCondition === 'search'
      ? listingService
          .searchPaginate(pageData.pageIndex, pageData.pageSize, search)
          .then(onGetAllSuccess)
          .catch(onGetAllError)
      : pageData.pageCondition === 'filter'
      ? listingService
          .filterPaginate(pageData.pageIndex, pageData.pageSize, pageData.formValues)
          .then(onGetAllSuccess)
          .catch(onGetAllError)
      : listingService.getAllPaginate(pageData.pageIndex, pageData.pageSize).then(onGetAllSuccess).catch(onGetAllError);
  }, [pageData.pageIndex, pageData.pageCondition, pageData.formValues, pageData.effect]);

  const onGetAllSuccess = (data) => {
    const listingData = data.item.pagedItems;

    pageData.pageCondition === 'search'
      ? setPageData((prevState) => {
          const newState = { ...prevState };
          newState.listings.searchListings = listingData;
          newState.listings.mappedSearched = listingData.map(mapListings);
          newState.totalCount = data.item.totalCount;
          return newState;
        })
      : pageData.pageCondition === 'filter'
      ? setPageData((prevState) => {
          const newState = { ...prevState };
          newState.listings.filterListings = listingData;
          newState.listings.mappedFiltered = listingData.map(mapListings);
          newState.totalCount = data.item.totalCount;
          return newState;
        }) && setSearch('')
      : setPageData((prevState) => {
          const newState = { ...prevState };
          newState.listings.listings = listingData;
          newState.listings.mapped = listingData.map(mapListings);
          newState.totalCount = data.item.totalCount;
          return newState;
        }) && setSearch('');

    if (pageData.pageCondition === 'search' || pageData.pageCondition === 'filter') {
      toastr.success(`Displaying ${data.item.totalCount} matching listings!`);
    }
  };

  const onGetAllError = (error) => {
    toastr.error('We couldn`t find anything like that!', error.message);
    setPageData((prevState) => {
      const newState = { ...prevState };
      newState.totalCount = 0;
      return newState;
    });
  };

  const onFormFieldChange = (e) => {
    setSearch(e.target.value);
  };

  const onChange = (page) => {
    window.scrollTo(0, 0);

    setPageData((prevState) => {
      let newState = { ...prevState };
      newState.pageIndex = page - 1;
      return newState;
    });
  };

  const onSearchClick = (e) => {
    e.preventDefault();
    search !== ''
      ? setPageData((prevState) => {
          const newState = { ...prevState };
          newState.pageIndex = 0;
          newState.pageCondition = 'search';
          newState.effect = !prevState.effect;
          return newState;
        })
      : toastr.error('Please enter your search before clicking');
  };

  const onFilterClick = (values) => {
    setPageData((prevState) => {
      const newState = { ...prevState };
      newState.pageIndex = 0;
      newState.formValues = values;
      newState.pageCondition = 'filter';
      newState.effect = !prevState.effect;
      return newState;
    });
  };

  const onResetClick = () => {
    setPageData((prevState) => {
      const newState = { ...prevState };
      newState.pageCondition = 'default';
      newState.formValues = {};
      return newState;
    });
    setSearch('');
  };

  const handleKeyEvent = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      currentRef.current.click();
    }
  };

  const mapListings = (listing) => {
    return <Listing key={`${pageData.totalCount}${listing.id}`} listing={listing} lgCol={3} mdCol={4} smCol={12} />;
  };

  return (
    <>
      <div className="container-fluid">
        <Row className="mt-2 d-flex">
          <Col>
            <Pagination
              onChange={onChange}
              current={pageData.pageIndex + 1}
              total={pageData.totalCount}
              pageSize={pageData.pageSize}
              locale={locale}
              className="pl-page-landing"
            />
          </Col>
          <Col className="d-flex justify-content-end">
            <input
              id="searchBar"
              type="text"
              placeholder="Quick Search"
              name="query"
              value={search}
              onChange={onFormFieldChange}
              onKeyUp={handleKeyEvent}
            />
            <button className="btn btn-secondary ms-1" type="submit" onClick={onSearchClick} ref={currentRef}>
              <BsSearch />
            </button>
            <FilterManager onSubmit={onFilterClick} />
            {pageData.pageCondition !== 'default' ? (
              <button className="btn btn-secondary ms-1" type="button" onClick={onResetClick}>
                Reset
              </button>
            ) : (
              <span />
            )}
          </Col>
        </Row>
        {
          <Row>
            {pageData.pageCondition === 'search'
              ? pageData.listings.mappedSearched
              : pageData.pageCondition === 'filter'
              ? pageData.listings.mappedFiltered
              : pageData.listings.mapped}
          </Row>
        }
        <Pagination
          onChange={onChange}
          current={pageData.pageIndex + 1}
          total={pageData.totalCount}
          pageSize={pageData.pageSize}
          locale={locale}
          className="mb-2 pl-page-landing"
        />
      </div>
    </>
  );
}
