import React, { useState, useEffect } from 'react';
import AddrAutocomplete from '../locations/AddrAutocomplete';
import AmenitySelect from './AmenitySelect';
import { Card, Col, Row, Form } from 'react-bootstrap';
import { addListingFilterFormSchema } from '../../schemas/addListingFilterFormSchema';
import toastr from 'toastr';
import listingService from '../../services/listingService';
import lookUpService from '../../services/lookUpService';
import { Field, withFormik } from 'formik';
import '../listings/listings.css';
import PropTypes from 'prop-types';

function ListingFilterForm(props) {
  const [filterData, setFilterData] = useState({
    access: [],
    housing: [],
    amenities: [],
    states: [],
    sortColumns: [],
  });
  const { values, onSubmit, toggleModal, setFormData } = props;
  const formikSubmit = () => {
    onSubmit(values);
    toggleModal();
  };

  useEffect(() => {
    lookUpService.LookUp(['AccessTypes', 'HousingTypes', 'Amenities']).then(onGetTypesSuccess).catch(onGetAllError) &&
      lookUpService.LookUp3Col(['States']).then(onGetStatesSuccess).catch(onGetAllError);
  }, []);

  const onGetTypesSuccess = (response) => {
    setFilterData((prevState) => {
      let newState = { ...prevState };
      newState.access = response?.item?.accessTypes || [];
      newState.housing = response?.item?.housingTypes || [];
      newState.amenities = response?.item?.amenities || [];
      newState.sortColumns = listingService.listingSortColumns;
      return newState;
    });
  };

  const onGetStatesSuccess = (response) => {
    setFilterData((prevState) => {
      const newState = { ...prevState };
      newState.states = response?.items || [];
      return newState;
    });
  };

  const onGetAllError = (error) => {
    toastr.error(error);
  };

  const mapOptions = (item) => {
    return (
      <option value={item.id} key={`LFO${item.id}`}>
        {item.name}
      </option>
    );
  };

  const mapAmenitiesOptions = (option) => {
    return { value: option.id, label: option.name };
  };

  const setPoint = (point) => {
    setFormData((prevState) => {
      return { ...prevState, ...point };
    });
  };

  return !filterData ? (
    <div className="listings-filter-spinner text-secondary filter-spinner-size" />
  ) : (
    <React.Fragment>
      <Card.Header className="text-center mt-1">
        <div className="mb-3 mb-lg-0">
          <h5 className="fw-bold">Filters</h5>
        </div>
      </Card.Header>
      <Form className="pb-1" onSubmit={formikSubmit}>
        <Row className="mt-3 mb-3 d-flex justify-content-center">
          <Col className="form-group " lg={8} md={10} sm={12}>
            <Row className="pb-2">
              <label htmlFor="locationFilter" className="mt-2 form-label">
                Filter By Location
              </label>
              <Col className="align-content-end d-grid">
                <h6>Region</h6>
                <AddrAutocomplete
                  className="form-control"
                  placeholder="Start typing for suggestions"
                  states={filterData.states}
                  setPoint={setPoint}></AddrAutocomplete>
              </Col>
              {values.latitude !== 0 && (
                <Col className="col-2 p-0">
                  <h6>Within (miles)</h6>
                  <Field
                    placeholder="Miles"
                    className="form-control"
                    title="Distance In Miles"
                    type="number"
                    name="distance"
                    min={0}
                  />
                </Col>
              )}
            </Row>
            <Row className="pb-2">
              <label htmlFor="minMaxPrice" className="mt-2 form-label">
                Price Range
              </label>
              <Col>
                <h6>Min Price</h6>
                <Field className="form-control" title="Min Price" type="number" name="minPrice" min={0} />
              </Col>
              <Col>
                <h6>Max Price</h6>
                <Field className="form-control" title="Max Price" type="number" name="maxPrice" min={0} />
              </Col>
              <Col>
                <h6>Price Type</h6>
                <Field as="select" name="priceRange" className="form-control">
                  <option value="CostPerNight">Cost Per Night</option>
                  <option value="CostPerWeek">Cost Per Week</option>
                </Field>
              </Col>
            </Row>
            <Row className="pb-2">
              <Col>
                <label htmlFor="accessType" className="mt-2 form-label">
                  Listing Access
                </label>
                <Field component="select" name="accessType" className="form-control">
                  <option value="0">Select...</option>
                  {filterData.access.map(mapOptions)}
                </Field>
              </Col>
              <Col className="col-4">
                <label htmlFor="bedrooms" className="mt-2 form-label">
                  Bedrooms
                </label>
                <Field className="form-control" title="Bedrooms" type="number" name="bedrooms" />
              </Col>
            </Row>
            <Row className="pb-2">
              <Col>
                <label htmlFor="housingType" className="mt-2 form-label">
                  Housing Type
                </label>
                <Field component="select" name="housingType" className="form-control">
                  <option value="0">Select...</option>
                  {filterData.housing.map(mapOptions)}
                </Field>
              </Col>
            </Row>
            <Row className="pb-2">
              <label htmlFor="amenities" className="mt-2 form-label">
                Amenities
              </label>
              <Field
                name="amenities"
                component={AmenitySelect}
                options={filterData.amenities.map(mapAmenitiesOptions)}
              />
            </Row>
            <Row className="pb-2">
              <label htmlFor="minMaxPrice" className="mt-2 form-label">
                Sort By
              </label>
              <Col className="col-8">
                <Field as="select" name="sortColumn" className="form-control">
                  <option value="1" key="DateCreated">
                    Sort By
                  </option>
                  <option value="2" key="AccessType">
                    Access Type
                  </option>
                  <option value="3" key="HousingType">
                    Housing Type
                  </option>
                  <option value="4" key="CostPerNight">
                    Cost Per Night
                  </option>
                </Field>
              </Col>
              <Col className="col-4">
                <Field as="select" name="sortDirection" className="form-control">
                  <option value="ASC">Ascending</option>
                  <option value="DESC">Descending</option>
                </Field>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      <Card.Footer>
        <Row className="justify-content-end">
          <button onClick={formikSubmit} type="submit" className="listing-loki-actions btn btn-secondary">
            Filter Listings
          </button>
        </Row>
      </Card.Footer>
    </React.Fragment>
  );
}

export default withFormik({
  enableReinitialize: true,
  validateOnMount: true,
  mapPropsToValues: (props) => ({
    amenities: props.filter.amenities,
    sortColumn: props.filter.sortColumn,
    sortDirection: props.filter.sortDirection,
    accessType: props.filter.accessType,
    housingType: props.filter.housingType,
    priceRange: props.filter.priceRange,
    bedrooms: props.filter.bedrooms,
    minPrice: props.filter.minPrice,
    maxPrice: props.filter.maxPrice,
    latitude: props.filter.latitude,
    longitude: props.filter.longitude,
    distance: props.filter.distance,
  }),
  validationSchema: addListingFilterFormSchema,
  handleSubmit: function (values, { props }) {
    props.onSubmit(values);
  },
})(ListingFilterForm);

ListingFilterForm.propTypes = {
  values: PropTypes.shape({
    amenities: PropTypes.arrayOf(PropTypes.number),
    sortColumn: PropTypes.string,
    sortDirection: PropTypes.string,
    accessType: PropTypes.string,
    housingType: PropTypes.string,
    priceRange: PropTypes.string,
    bedrooms: PropTypes.number,
    minPrice: PropTypes.number,
    maxPrice: PropTypes.number,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    distance: PropTypes.number,
  }),
  filter: PropTypes.shape({
    amenities: PropTypes.arrayOf(PropTypes.number),
    sortColumn: PropTypes.string,
    sortDirection: PropTypes.string,
    accessType: PropTypes.string,
    housingType: PropTypes.string,
    priceRange: PropTypes.string,
    bedrooms: PropTypes.number,
    minPrice: PropTypes.number,
    maxPrice: PropTypes.number,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    distance: PropTypes.number,
  }),
  onSubmit: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired,
  setFormData: PropTypes.func.isRequired,
};
