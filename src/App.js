import { useEffect, useState } from 'react';
import earcut from 'earcut';
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';

import './App.css';
import polygonJSON from './polygon.json';
import crunch from './util/crunch';
import generateSVG from './util/generateSVG';
import { Engine, Scene } from 'react-babylonjs';
import { Vector3 } from '@babylonjs/core';

function App() {
  const [json, setJson] = useState({ shape: polygonJSON, holes: [] });
  const [val, setVal] = useState('');
  const [polygon, setPolygon] = useState({ vectors: [], holes: [] });
  const [svg, setSvg] = useState('<svg />');

  useEffect(() => {
    const { shape, holes } = json;
    // Main shape first
    // generateSVG(shape, width = Bredde, length = Lengde)
    const mainShape = generateSVG(shape, 35.59000015258789, 29.600000381469727);
    setSvg(mainShape);
    const mainShapeCoords = crunch(mainShape);
    const vectors = mainShapeCoords[0].split(', ').map((cords) => {
      cords = cords.split(' ').map((val) => parseFloat(val));
      return new Vector3(cords[0], 0, cords[1]);
    });
    // Then drill holes
    const holeCoordsArray = [];
    uniqWith(holes, isEqual).forEach((data) => {
      const holeJSON = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: shape.features[0].geometry.type, coordinates: [data] },
          },
        ],
      };
      const holeShape = generateSVG(holeJSON, 2.9000000953674316, 2.1700000762939453);
      const holeShapeCoords = crunch(holeShape);
      holeCoordsArray.push(holeShapeCoords);
    });
    const holeVectors = [];
    holeCoordsArray.forEach((_c) => {
      const [c] = _c;
      const row = [];
      c.split(', ').forEach((_cords) => {
        const cords = _cords.split(' ').map((v) => parseFloat(v));
        row.push(new Vector3(cords[0], 0, cords[1]));
      });
      holeVectors.push(row);
    });
    setPolygon({ vectors, holes: holeVectors });
  }, [json]);

  const handleClick = () => {
    try {
      const str = val.replace(/\\|('|")\s*$|^('|")/g, '');
      const { type, coordinates } = JSON.parse(str);
      const newJson = {
        type: 'FeatureCollection',
        // features: [{ type: 'Feature', geometry: { type, coordinates: [coordinates[0]] } }],
        features: [{ type: 'Feature', geometry: { type, coordinates } }],
      };
      const [, ...holes] = coordinates;
      setJson({ shape: newJson, holes });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 300,
          height: 120,
          zIndex: 10,
          backgroundColor: '#ffffff',
          padding: 5,
        }}
      >
        <textarea
          style={{ width: '100%', height: 80 }}
          value={val}
          onChange={({ target }) => setVal(target.value)}
        />
        <button onClick={handleClick}>Submit</button>
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
      <Engine antialias style={{ maxHeight: 846 }}>
        <Scene useRightHandedSystem>
          <arcRotateCamera
            name="camera1"
            alpha={1.2}
            beta={Math.PI / 4}
            radius={5}
            target={new Vector3(100, 70, 220)}
          />
          <hemisphericLight name="light1" intensity={0.7} direction={Vector3.Up()} />
          {polygon.vectors.length && (
            <extrudePolygon
              key={`shape-${JSON.stringify(json)}`}
              updatable
              shape={polygon.vectors}
              // holes={polygon.holes}
              name="poly"
              earcutInjection={earcut}
              scaling={new Vector3(0.3, 0.3, 0.3)}
              position={new Vector3(10, 0, 0)}
              depth={5}
            />
          )}
          {polygon.holes.length && (
            <extrudePolygon
              key={`hole-${JSON.stringify(json)}`}
              updatable
              shape={polygon.holes[0]}
              // holes={polygon.holes}
              name="poly"
              earcutInjection={earcut}
              scaling={new Vector3(0.3, 0.3, 0.3)}
              position={new Vector3(10, 0, 0)}
              depth={5}
            />
          )}
        </Scene>
      </Engine>
    </div>
  );
}

export default App;
