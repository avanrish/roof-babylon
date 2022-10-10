/* eslint-disable no-undef */
function pathToPoints(segments) {
  const count = segments.numberOfItems;
  let result = [],
    segment,
    x,
    y;
  for (var i = 0; i < count; i++) {
    segment = segments.getItem(i);
    switch (segment.pathSegType) {
      case SVGPathSeg.PATHSEG_MOVETO_ABS:
      case SVGPathSeg.PATHSEG_LINETO_ABS:
      case SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS:
      case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS:
      case SVGPathSeg.PATHSEG_ARC_ABS:
      case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS:
      case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS:
        x = segment.x;
        y = segment.y;
        break;

      case SVGPathSeg.PATHSEG_MOVETO_REL:
      case SVGPathSeg.PATHSEG_LINETO_REL:
      case SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL:
      case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL:
      case SVGPathSeg.PATHSEG_ARC_REL:
      case SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL:
      case SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL:
        x = segment.x;
        y = segment.y;
        if (result.length > 0) {
          x += result[result.length - 2];
          y += result[result.length - 1];
        }
        break;

      case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS:
        x = segment.x;
        y = result[result.length - 1];
        break;
      case SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL:
        x = result[result.length - 2] + segment.x;
        y = result[result.length - 1];
        break;

      case SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS:
        x = result[result.length - 2];
        y = segment.y;
        break;
      case SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL:
        x = result[result.length - 2];
        y = segment.y + result[result.length - 1];
        break;
      case SVGPathSeg.PATHSEG_CLOSEPATH:
        return result;
      default:
        console.log('unknown path command: ', segment.pathSegTypeAsLetter);
    }
    result.push(x, y);
  }
  return result;
}

export default pathToPoints;
