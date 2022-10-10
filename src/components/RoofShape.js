import { Vector3 } from '@babylonjs/core';
import earcut from 'earcut';

export default function RoofShape({ vectors }) {
  return (
    <babylon-polygon
      updatable
      shape={vectors}
      name="poly"
      earcutInjection={earcut}
      scaling={new Vector3(0.3, 0.3, 0.3)}
      position={new Vector3(0, -250, 0)}
    />
  );
}
