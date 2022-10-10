const pointCommandsToCSSPoints = (pointCommands, settings) =>
  pointCommands
    .map(
      (v, i, a) =>
        (v / (i % 2 === 0 ? settings.divideXBy : settings.divideYBy)).toFixed(settings.precision) +
        settings.units +
        (i % 2 === 1 && i < a.length - 1 ? ',' : '')
    )
    .join(' ');

export default pointCommandsToCSSPoints;
