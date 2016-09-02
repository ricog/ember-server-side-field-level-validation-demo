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

    function usernameExists(username, schema) {
      let hasMatchingUsers = schema.users.where(function(user) {
        return user.data.attributes.username === username;
      }).models.length;
      return (hasMatchingUsers || username === 'not unique');
    }
}
