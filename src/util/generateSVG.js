import { interpolateInferno, scaleSequential } from 'd3';
import { geoMercator, geoPath } from 'd3-geo';

const generateSVG = (geoJSON, width, length) => {
  // const width = 600,
  //   length = 600;
  const projection = geoMercator()
    .rotate([0, 0, -21.25])
    .fitSize([length * 20, width * 20], geoJSON);
  const render = geoPath().projection(projection);
  const color = scaleSequential(interpolateInferno).domain([0, geoJSON.features.length - 1]);
  const paths = geoJSON.features.map(
    (feature, i) =>
      `<path d="${render(feature)}" stroke="${color(i)}" fill="none" stroke-width="1" />`
  );
  return `<svg width="${length * 20}" height="${width * 20}">
      ${paths.join('\n')}
      </svg>`;
};

export default generateSVG;
