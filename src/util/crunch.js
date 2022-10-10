import pathToPoints from './pathToPoints';
import pointCommandsToCSSPoints from './pointCommandsToCSSPoints';
import pointCommandsToSVGPoints from './pointCommandsToSVGPoints';

const settings = {
  divideXBy: 1,
  divideYBy: 1,
  units: '',
  precision: 3,
};

function crunch(svg) {
  const div = document.createElement('div');
  div.innerHTML = svg;
  svg = div.childNodes[0];
  let viewPort = svg.getAttribute('viewBox');
  if (!viewPort)
    viewPort =
      'x:' +
      svg.getAttribute('x') +
      ' y:' +
      svg.getAttribute('y') +
      ' width:' +
      svg.getAttribute('width') +
      ' height:' +
      svg.getAttribute('height');
  const paths = Array.from(svg.childNodes).filter((c) => c.nodeName === 'path');
  const cssPolygons = [];
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const points = pathToPoints(path.pathSegList);
    const polygonSVGPoints = pointCommandsToSVGPoints(points);

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttributeNS(null, 'fill', '#cecece');
    polygon.setAttributeNS(null, 'points', polygonSVGPoints);
    path.parentNode.replaceChild(polygon, path);

    cssPolygons.push(pointCommandsToCSSPoints(points, settings));
  }
  return cssPolygons;
}

export default crunch;
