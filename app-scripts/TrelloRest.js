function TrelloRest(app_key, token) {
  
  if (app_key == undefined) {
    this.app_key = get_config("app_key");
    this.token = get_config("token");
  }
  else
  {
    this.app_key = app_key;
    this.token = token;
  }
    
  if(this.app_key == "") {
    throw("App Key not found");
  }  
  if((this.token == "") || this.token == undefined) {
    throw("Token not found");
  }  
}
TrelloRest.prototype = Object.create(Object.prototype, {
  app_key: {
    value: null,
    enumerate: true,
    configurable: false,
    writable: true
  },
  token: {
    value: null,
    enumerate: true,
    configurable: false,
    writable: true
  },
  base_url: {
    value: "https://trello.com/1/",
    enumerate: true,
    configurable: false,
    writable: false
  },
  _build_url: {
    value: function (rel_path, params) {
      var rest_url = "";
      if (params == undefined) {
        params = "";
      }
      else
      {
        params = "&"+params;
      }
      rest_url = this.base_url+rel_path+"?key="+this.app_key+"&token="+this.token+params;
      return rest_url;
    },
    enumerate: true,
    configurable: false,
    writable: false
  },
  _trello_call: {
    value: function (method, rel_path, payload, params) {
      var values = [];
      var rest_url = this._build_url(rel_path, params);
      var response;
      var fetch_dict = {"method": method};
      if (payload != undefined) {
        fetch_dict["payload"] = payload;
      };
      response = UrlFetchApp.fetch(rest_url, fetch_dict);

      if (response.getResponseCode() == 200) {
        values = JSON.parse(response.getContentText());
      }
      return values;
    },
    enumerate: true,
    configurable: false,
    writable: false
  },
  _trello_get: {
    value: function (rel_path, params) {
      return this._trello_call("get", rel_path, undefined, params);
    },
    enumerate: true,
    configurable: false,
    writable: false
  },
  _trello_post: {
    value: function (rel_path, payload, params) {
      return this._trello_call("post", rel_path, payload, params);
    },
    enumerate: true,
    configurable: false,
    writable: false
  },
  _trello_put: {
    value: function (rel_path, payload, params) {
      return this._trello_call("put", rel_path, payload, params);
    },
    enumerate: true,
    configurable: false,
    writable: false
  }
});
TrelloRest.prototype.constructor = TrelloRest;
