import { Response } from 'ember-cli-mirage';

export default function() {

    this.get('/users');
    this.post('/users', (schema, request) => {
      let params = JSON.parse(request.requestBody);
      let username = params.data.attributes.username;

      if (usernameExists(username, schema)) {
        return new Response(422, {}, {
          "errors": [
            {
              "status": "422",
              "source": { "pointer": "/data/attributes/username" },
              "title":  "Attribute Not Unique",
              "detail": "Username must be unique. (from ember-data)"
            }
          ]
        });
      } else {
        return schema.users.create(params);
      }
    });

    this.get('/validations/:property', (schema, request) => {
      let property = request.params.property;
      let params = request.queryParams;
      switch (property) {
        case 'user-username':
          return validateUserUsername(property, params, schema);
        default:
          return validateDefault(property, params);
      }
    });

    function validateUserUsername(property, params, schema) {
      let username = params['filter[value]'];

      if (usernameExists(username, schema)) {
        return new Response(422, {}, {
          "errors": [
          {
            "status": "422",
            "source": { "pointer": "/data/attributes/username" },
            "title":  "Invalid Attribute",
            "detail": "Username must be unique. (from validation service)"
          }
          ]
        });
      } else {
        return validateDefault(property, params);
      }
    }

    function validateDefault(property, params) {
      let field = property.split('-').pop();
      let attributes = {
        [field]: params['filter[value]'],
      };
      return validationSuccess(property, attributes);
    }

    function validationSuccess(property, attributes) {
      return {
        "data": {
          "id": property,
          "type": "validations",
          "attributes": attributes,
        },
      };
    }

    function usernameExists(username, schema) {
      let hasMatchingUsers = schema.users.where(function(user) {
        return user.data.attributes.username === username;
      }).models.length;
      return (hasMatchingUsers || username === 'not unique');
    }
}
