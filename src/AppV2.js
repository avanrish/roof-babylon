import { useCallback, useEffect, useRef, useState } from 'react';
import earcut from 'earcut';

import './App.css';
import polygonJSON from './polygon.json';
import { Engine, Scene } from 'react-babylonjs';
import { Vector3 } from '@babylonjs/core';
import merc from 'mercator-projection';

function App() {
  const [coords, setCoords] = useState(polygonJSON.features[0].geometry.coordinates);
  const [val, setVal] = useState('');
  const [polygon, setPolygon] = useState({ vectors: [], holes: [] });
  const cameraRef = useRef(null);

  useEffect(() => {
    let [cornersArray, ...holesArray] = coords;

    const trimmer = (n) => (n * 100 - Math.floor(n * 100)) * 200;

    const convert = (point) => {
      const [x, y] = point;
      const pt = merc.fromLatLngToPoint({ lat: y, lng: x });
      return [pt.y, pt.x];
    };

    const corners = cornersArray.map((c) => {
      const [x, y] = convert(c);
      return new Vector3(trimmer(x), 0, trimmer(y));
    });
    const holes = holesArray?.map((h) =>
      h.map((c) => {
        const [x, y] = convert(c);
        return new Vector3(trimmer(x), 0, trimmer(y));
      })
    );

    setPolygon({ vectors: corners, holes: holes });
  }, [coords]);

  const handleClick = () => {
    try {
      const str = val.replace(/\\|('|")\s*$|^('|")/g, '');
      const { coordinates } = JSON.parse(str);
      setCoords(coordinates);
    } catch (err) {
      console.log(err);
    }
  };

  const onCameraChange = useCallback((node) => {
    if (node === null) {
      cameraRef.current = null;
    } else {
      cameraRef.current = node;
      console.log(node);
    }
  }, []);

  const onRefChange = useCallback((node) => {
    if (node === null) {
      console.log('No NODE');
    } else {
      cameraRef.current.lockedTarget = node.getBoundingInfo().boundingBox.center;
    }
  }, []);

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
        {/* <button onClick={() => console.log(polygonRef.current._boundingInfo.boundingBox.center)}>
          Info
        </button> */}
      </div>
      <Engine antialias style={{ maxHeight: 846 }}>
        <Scene>
          <arcRotateCamera
            name="camera1"
            ref={onCameraChange}
            alpha={-Math.PI / 2}
            beta={Math.PI / 4}
            radius={15}
            target={Vector3.Zero()}
          />
          <hemisphericLight name="light1" intensity={0.7} direction={Vector3.Up()} />
          {polygon.vectors.length && (
            <extrudePolygon
              key={`shape-${JSON.stringify(coords)}`}
              ref={onRefChange}
              updatable
              shape={polygon.vectors}
              holes={polygon.holes}
              name="poly"
              earcutInjection={earcut}
            />
          )}
        </Scene>
      </Engine>
    </div>
  );
}

export default App;
