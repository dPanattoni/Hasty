import { useField } from 'formik';
import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import debug from 'hasty-debug';
const _logger = debug.extend('AmenitySelect');

export default function AmenitySelect(props) {
  const [field, meta, helpers] = useField(props.field);

  const onChange = (options) => {
    helpers.setValue(options.map((option) => option.value));
  };

  return <Select {...props} isMulti={true} onChange={onChange} onBlur={field.onBlur} />;
}

AmenitySelect.propTypes = {
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(PropTypes.number.isRequired),
  }).isRequired,
  meta: PropTypes.shape({
    error: PropTypes.string.isRequired,
    initialValue: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    value: PropTypes.arrayOf(PropTypes.number.isRequired),
  }).isRequired,
  helpers: PropTypes.shape({
    setError: PropTypes.func.isRequired,
    setTouched: PropTypes.func.isRequired,
    setValue: PropTypes.func.isRequired,
  }).isRequired,
};
