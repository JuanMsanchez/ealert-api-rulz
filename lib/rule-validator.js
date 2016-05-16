var _ = require("lodash");
var TRHOW_ERRORS = false;

module.exports = {
  filter: function(rule, defaults)
  {
    if(defaults)
      rule = _.defaults(rule, defaults);

    if(TRHOW_ERRORS && !rule.type)
      throw new Error("No rule type defined");

    var errors       = [];
    var filteredRule = {};
    var tmplt        = _.merge({}, BASE_RULE, RULE_TYPE[rule.type.toLowerCase()]);

    _.forEach(tmplt, function(value, key)
    {
      if(value.required && typeof rule[key] == 'undefined')
        errors.push("Required field " + key + " not found");
      else if(rule[key])
        filteredRule[key] = rule[key];
    });

    if(TRHOW_ERRORS && errors.length > 0)
      throw new Error(errors);

    return filteredRule;
  }
};

var BASE_RULE = {
  "es_host":{ required: true},
  "es_port":{ required: true},
  "index":{required: true},
  "name":{},
  "type": {required: true},
  "alert": {required: true},
  "email":{},
  "use_strftime_index":{},
  "use_ssl":{},
  "es_username":{},
  "es_password":{},
  "aggregation":{},
  "description": {required: true},
  "generate_kibana_link":{},
  "use_kibana_dashboard":{},
  "kibana_url":{},
  "use_kibana4_dashboard":{},
  "kibana4_start_timedelta":{},
  "kibana4_end_timedelta":{},
  "use_local_time":{},
  "realert":{},
  "exponential_realert":{},
  "match_enhancements":{},
  "top_count_number":{},
  "top_count_keys":{},
  "raw_count_keys":{},
  "include":{},
  "filter":{},
  "max_query_size":{},
  "query_delay":{},
  "buffer_time":{},
  "timestamp_type":{},
  "timestamp_format":{},
  "_source_enabled":{},
  "timestamp_field":{}
};

var RULE_TYPE = {
  any : {
    "query_key": {}
  },

  blacklist : {
    "compare_key": {required: true},
    "blacklist": {required: true}
  },

  whitelist : {
    "compare_key":{required: true},
    "whitelist":{required: true},
    "ignore_null":{required: true}
  },

  change : {
    "compare_key": {required: true},
    "ignore_null": {required: true},
    "query_key": {required: true},
    "timeframe": {}
  },

  frequency : {
    "query_key" :{},
    "timeframe" :{required: true},
    "num_events" :{required: true},
    "attach_related" :{},
    "use_count_query" :{},
    "doc_type" :{},
    "use_terms_query" :{},
    "terms_size" :{}
  },

  spike : {
    "query_key":{},
    "timeframe":{required: true},
    "spike_height":{required: true},
    "spike_type":{required: true},
    "use_count_query":{},
    "doc_type":{},
    "use_terms_query":{},
    "terms_size":{},
    "alert_on_new_data":{},
    "threshold_ref":{},
    "threshold_cur":{}
  },

  flatline : {
    "query_key":{},
    "timeframe":{required: true},
    "threshold":{required: true},
    "use_count_query":{},
    "doc_type":{}
  },

  newterm : {
    "query_key":{required: true},
    "fields":{required: true},
    "use_terms_query":{},
    "doc_type":{},
    "terms_size":{},
    "terms_window_size":{},
    "alert_on_missing_fields":{}
  },

  cardinality : {
    "query_key":{},
    "timeframe":{required: true},
    "cardinality_field":{required: true},
    "max_cardinality":{},
    "min_cardinality":{}
  }
};
