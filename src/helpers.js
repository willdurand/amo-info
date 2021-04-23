export const getExperimentName = (key) => {
  // Experiments name follow this pattern: YYYYMMDD_id_of_experiment
  const [datetime, ...rest] = key.split('_');

  return rest.join(' ');
};
