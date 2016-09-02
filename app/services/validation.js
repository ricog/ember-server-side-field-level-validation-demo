import Ember from 'ember';
import $ from 'jquery';

export default Ember.Service.extend({
  store: Ember.inject.service(),
  baseURL: '/',

  check(model, fieldName, value) {
    let { modelName } = model.constructor;
    let params = {
      model: modelName,
      field: fieldName,
      value,
    };

    return this._apiCall(params).then((response) => {
      return { state: 'success', response: this._successResponse(response) };
    }, (response) => {
      return { state: 'error', response: this._errorResponse(response) };
    });
  },

  _apiCall(params) {
    let url = this._apiUrl(params);
    return Ember.RSVP.resolve($.getJSON(url));
  },
  _apiUrl(params) {
    return this.baseURL + 'validations/' +
      params.model + '-' + params.field + '?filter[value]=' + params.value;
  },

  _successResponse(response) {
    return response;
  },

  _errorResponse(response) {
    let errors = response.responseJSON.errors;
    errors.forEach(function(item, index, errors) {
      errors[index] = {
        attribute: '',
        message: item.detail,
      };
    });

    return errors;
  },
});
