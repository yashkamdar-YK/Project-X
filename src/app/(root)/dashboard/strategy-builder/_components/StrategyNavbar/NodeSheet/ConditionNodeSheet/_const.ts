export const ALLOWED_OPERATIONS = {
  candleData: [
    "is_above",
    "is_below",
    "greater_than",
    "less_than",
    "above_or_equal",
    "below_or_equal",
    "equals",
    "cross_above",
    "cross_below",
  ],
  indicator: [
    "is_above",
    "is_below",
    "greater_than",
    "less_than",
    "above_or_equal",
    "below_or_equal",
    "equals",
    "cross_above",
    "cross_below",
  ],
  candleTime: [
    "greater_than",
    "less_than",
    "above_or_equal",
    "below_or_equal",
    "equals",
  ],
  dte: [
    "greater_than",
    "less_than",
    "above_or_equal",
    "below_or_equal",
    "equals",
  ],
  day_of_week: ["equals"],
  mtm: [
    "greater_than",
    "less_than",
    "above_or_equal",
    "below_or_equal",
    "equals",
  ],
};

const TIME = ["09:30", "10:00", "10:30", "11:00", "11:30"];

const VALID_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
