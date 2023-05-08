import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import ListingFilterForm from './ListingFilterForm';
import PropTypes from 'prop-types';
import './landing.css';

function FilterManager(props) {
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    amenities: [],
    sortColumn: '1',
    sortDirection: 'DESC',
    accessType: '0',
    housingType: '0',
    priceRange: 'CostPerNight',
    bedrooms: 0,
    minPrice: 0,
    maxPrice: 0,
    latitude: 0,
    longitude: 0,
    distance: 0,
  });

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <>
      <Button onClick={toggle} className="btn btn-secondary ms-1">
        Filters
      </Button>
      <Modal show={modal} onHide={toggle}>
        <ListingFilterForm onSubmit={props.onSubmit} toggleModal={toggle} filter={formData} setFormData={setFormData} />
      </Modal>
    </>
  );
}

FilterManager.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default FilterManager;
