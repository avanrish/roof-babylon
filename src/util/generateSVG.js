import { interpolateInferno, scaleSequential } from 'd3';
import { geoMercator, geoPath } from 'd3-geo';

const generateSVG = (geoJSON) => {
  const width = 600,
    length = 600;
  const projection = geoMercator().fitSize([width, length], geoJSON);
  const render = geoPath().projection(projection);
  const color = scaleSequential(interpolateInferno).domain([0, geoJSON.features.length - 1]);
  const paths = geoJSON.features.map(
    (feature, i) =>
      `<path d="${render(feature)}" stroke="${color(i)}" fill="none" stroke-width="1" />`
  );
  return `<svg width="${width}" height="${length}">
      ${paths.join('\n')}
      </svg>`;
};

export default generateSVG;
