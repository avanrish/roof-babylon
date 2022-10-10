const pointCommandsToSVGPoints = (pointCommands) =>
  pointCommands.map((v, i) => (i % 2 === 1 ? ',' : ' ') + v).join('');

export default pointCommandsToSVGPoints;
