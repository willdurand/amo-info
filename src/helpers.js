export const getExperimentName = (key) => {
  // Experiments name follow this pattern: YYYYMMDD_id_of_experiment
  // eslint-disable-next-line no-unused-vars
  const [datetime, ...rest] = key.split('_');

  return rest.join(' ');
};
