export const ALLOWED_OPERATIONS = {
  candleData: [
    {
      label: ">",
      value: "is_above",
    },
    {
      label: "<",
      value: "is_below",
    },
    {
      label: ">=",
      value: "above_or_equal",
    },
    {
      label: "<=",
      value: "below_or_equal",
    },
    {
      label: "=",
      value: "equals",
    },
    {
      label: () => <CrossBelowIcon />,
      value: "cross_below",
    },
    {
      label: () => <CrossAboveIcon />,
      value: "cross_above",
    },
  ],
  indicators:[
    {
      label: ">",
      value: "is_above",
    },
    {
      label: "<",
      value: "is_below",
    },
    {
      label: ">=",
      value: "above_or_equal",
    },
    {
      label: "<=",
      value: "below_or_equal",
    },
    {
      label: "=",
      value: "equals",
    },
    {
      label: () => <CrossBelowIcon />,
      value: "cross_below",
    },
    {
      label: () => <CrossAboveIcon />,
      value: "cross_above",
    },
  ],
  candleTime:[
    {
      label: ">",
      value: "is_above",
    },
    {
      label: "<",
      value: "is_below",
    },
    {
      label: ">=",
      value: "above_or_equal",
    },
    {
      label: "<=",
      value: "below_or_equal",
    },
    {
      label: "=",
      value: "equals",
    },
  ],
  dte:[
    {
      label: ">",
      value: "is_above",
    },
    {
      label: "<",
      value: "is_below",
    },
    {
      label: ">=",
      value: "above_or_equal",
    },
    {
      label: "<=",
      value: "below_or_equal",
    },
    {
      label: "=",
      value: "equals",
    },
  ],
  day_of_week:[
    {
      label: "=",
      value: "equals",
    },
  ],
  mtm:[
    {
      label: ">",
      value: "is_above",
    },
    {
      label: "<",
      value: "is_below",
    },
    {
      label: ">=",
      value: "above_or_equal",
    },
    {
      label: "<=",
      value: "below_or_equal",
    },
    {
      label: "=",
      value: "equals",
    },
  ],
  action:[
    {
      label: "=",
      value: "equals",
    },
  ]
};

export const VALID_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const DEFAULT_OPTIONS = [
  "day_mtm",
  "mtm_from_first_open_pos",
  "open_mtm",
  "candle_time",
  "candle_close_time",
  "day_of_week",
];
const CrossBelowIcon = () => (
  <svg
    viewBox="0 0 43 40"
    className="w-6 h-6 dark:stroke-white stroke-gray-800"
  >
    <path
      d="M26.6831 25.2162L16.637 15.1702"
      className="stroke-gray-800 dark:stroke-white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M40.7238 20.4299L2.5964 19.4749"
      className="stroke-gray-300 dark:stroke-gray-600"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="6 6"
    />
    <path
      d="M30.8529 29.641L30.853 20.2209L21.4329 29.641H30.8529Z"
      className="fill-gray-800 stroke-gray-800 dark:fill-white dark:stroke-white"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const CrossAboveIcon = () => (
  <svg
    viewBox="0 0 43 39"
    className="w-6 h-6 dark:stroke-white stroke-gray-800"
  >
    <path
      d="M13.2621 24.6819L23.3081 14.6358"
      className="stroke-gray-800 dark:stroke-white"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M40.7238 20.1364L2.5964 19.1814"
      className="stroke-gray-300 dark:stroke-gray-600"
      strokeWidth="4"
      strokeLinecap="round"
      strokeDasharray="6 6"
    />
    <path
      d="M29.0382 8.94885L19.6181 8.94879L29.0382 18.3689V8.94885Z"
      className="fill-gray-800 stroke-gray-800 dark:fill-white dark:stroke-white"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);