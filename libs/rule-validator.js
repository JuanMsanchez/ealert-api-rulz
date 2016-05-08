var _ = require("lodash");
var TRHOW_ERRORS = false;

module.exports = {
  filter: function(rule, defaults)
  {
    if(defaults)
      rule = _.defaults(rule, defaults);

    if(!rule.type)
      throw new Error("No rule type defined");

    var errors       = [];
    var filteredRule = {};
    var tmplt        = _.assign(BASE_RULE, RULE_TYPE[rule.type.toLowerCase()]);
    _.forEach(tmplt, function(value, key)
    {
      if(value.required && typeof rule[value.name] == 'undefined')
        errors.push("Required field " + value.name + " not found");
      else
        filteredRule[value.name] = rule[value.name];
    });

    if(TRHOW_ERRORS && errors.length > 0)
      throw new Error(errors);

    return filteredRule;
  }
};

var BASE_RULE = [
  { name :"es_host", required: true},
  { name :"es_port", required: true},
  { name :"index", required: true},
  { name :"name" },
  { name :"type", required: true},
  { name :"alert", required: true},
  { name :"use_strftime_index"},
  { name :"use_ssl"},
  { name :"es_username"},
  { name :"es_password"},
  { name :"aggregation"},
  { name :"description", required: true},
  { name :"generate_kibana_link"},
  { name :"use_kibana_dashboard"},
  { name :"kibana_url"},
  { name :"use_kibana4_dashboard"},
  { name :"kibana4_start_timedelta"},
  { name :"kibana4_end_timedelta"},
  { name :"use_local_time"},
  { name :"realert"},
  { name :"exponential_realert"},
  { name :"match_enhancements"},
  { name :"top_count_number"},
  { name :"top_count_keys"},
  { name :"raw_count_keys"},
  { name :"include"},
  { name :"filter"},
  { name :"max_query_size"},
  { name :"query_delay"},
  { name :"buffer_time"},
  { name :"timestamp_type"},
  { name :"timestamp_format"},
  { name :"_source_enabled"}
];

var RULE_TYPE = {
  any : [
    { name :"query_key"}
  ],

  blacklist : [
    { name : "compare_key", required: true},
    { name : "blacklist", required: true}
  ],

  whitelist : [
    { name : "compare_key", required: true},
    { name : "whitelist", required: true},
    { name : "ignore_null", required: true}
  ],

  change : [
    { name : "compare_key", required: true},
    { name : "ignore_null", required: true},
    { name : "query_key", required: true},
    { name : "timeframe"}
  ],

  frequency : [
    { name :"query_key"},
    { name :"timeframe", required: true},
    { name :"num_events", required: true},
    { name :"attach_related"},
    { name :"use_count_query"},
    { name :"doc_type"},
    { name :"use_terms_query"},
    { name :"query_key"},
    { name :"terms_size"}
  ],

  spike : [
    { name :"query_key"},
    { name :"timeframe", required: true},
    { name :"spike_height", required: true},
    { name :"spike_type", required: true},
    { name :"use_count_query"},
    { name :"doc_type"},
    { name :"use_terms_query"},
    { name :"query_key"},
    { name :"terms_size"},
    { name :"alert_on_new_data"},
    { name :"threshold_ref"},
    { name :"threshold_cur"}
  ],

  flatline : [
    { name :"query_key"},
    { name :"timeframe", required: true},
    { name :"threshold", required: true},
    { name :"use_count_query"},
    { name :"doc_type"}
  ],

  newterm : [
    { name :"query_key", required: true},
    { name :"fields", required: true},
    { name :"use_terms_query"},
    { name :"doc_type"},
    { name :"query_key"},
    { name :"terms_size"},
    { name :"terms_window_size"},
    { name :"alert_on_missing_fields"}
  ],

  cardinality : [
    { name :"query_key"},
    { name :"timeframe", required: true},
    { name :"cardinality_field", required: true},
    { name :"max_cardinality"},
    { name :"min_cardinality"}
  ]
};
