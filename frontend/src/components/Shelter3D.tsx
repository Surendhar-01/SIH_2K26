import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, ContactShadows, Edges, Environment, Float, Grid, Html, OrbitControls, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { fetchLiveLocation } from '../utils/geolocation';

type LocationStatus = 'idle' | 'loading' | 'ready' | 'blocked' | 'error' | 'unsupported';

type HomeLocation = {
  latitude: number;
  longitude: number;
};



function SensorNode({
  position,
  color,
  label,
  value,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  value: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1);
    }
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.15, 16, 16]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
      </Sphere>
      <Html distanceFactor={10} position={[0, 0.5, 0]} transform sprite>
        <div className="home-twin-label" style={{ borderColor: color }}>
          <strong>{label}</strong>
          <br />
          {value}
        </div>
      </Html>
    </group>
  );
}

function VentSystem({ position }: { position: [number, number, number] }) {
  const fanRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (fanRef.current) {
      fanRef.current.rotation.y += delta * 5;
    }
  });

  return (
    <group position={position}>
      <Cylinder args={[0.4, 0.4, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
      </Cylinder>
      <group ref={fanRef} rotation={[Math.PI / 2, 0, 0]}>
        {[0, 1, 2].map((i) => (
          <Box key={i} args={[0.1, 0.7, 0.02]} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
            <meshStandardMaterial color="#888" metalness={1} roughness={0} />
          </Box>
        ))}
      </group>
    </group>
  );
}

function estimateOutdoorFromLocation(latitude: number) {
  const hour = new Date().getHours();
  const dayCycle = Math.sin(((hour - 7) / 24) * Math.PI * 2) * 6;
  const latitudeCooling = Math.min(Math.abs(latitude) * 0.08, 4.5);
  return Math.round((22 + dayCycle - latitudeCooling) * 10) / 10;
}

export function Shelter3D({ length = 8, width = 4, height = 3 }) {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [homeLocation, setHomeLocation] = useState<HomeLocation | null>(null);
  const [placeName, setPlaceName] = useState('');

  const outdoorTemp = useMemo(
    () => (homeLocation ? estimateOutdoorFromLocation(homeLocation.latitude) : 15.8),
    [homeLocation],
  );
  const indoorTemp = Math.round((outdoorTemp + 4.2) * 10) / 10;

  const statusMessage =
    status === 'blocked'
      ? 'Location blocked. Allow browser permission.'
      : status === 'unsupported'
        ? 'Location not supported in this browser.'
        : status === 'error'
          ? 'Unable to detect current home location.'
          : homeLocation
            ? placeName || 'Finding live place name...'
            : 'Enable location to map your current home.';



  async function enableCurrentHomeLocation() {
    setStatus('loading');
    setPlaceName('Determining live location...');
    try {
      const loc = await fetchLiveLocation();
      setHomeLocation({
        latitude: loc.latitude,
        longitude: loc.longitude,
      });
      setPlaceName(loc.placeName || `Lat ${loc.latitude.toFixed(4)} / Long ${loc.longitude.toFixed(4)}`);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="home-twin-stage">
      <div className="home-twin-hud">
        <div>
          <h3>Current Location Home Twin</h3>
          {homeLocation && placeName ? (
            <>
              <span className="home-place-kicker">Live Place</span>
              <p className="home-place-name">{placeName}</p>
            </>
          ) : (
            <p className="home-location-status">{statusMessage}</p>
          )}
          {homeLocation && <span>Live location based thermal analysis</span>}
        </div>
        <button className="primary-button" disabled={status === 'loading'} onClick={enableCurrentHomeLocation} type="button">
          {status === 'loading' ? 'Detecting...' : homeLocation ? 'Refresh Home Location' : 'Enable Current Home Location'}
        </button>
      </div>

      <Canvas camera={{ position: [10, 8, 12], fov: 45 }}>
        <color attach="background" args={['#f1f3f5']} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#fff1e0" castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#dbeafe" />
        <Environment preset="city" />

        <OrbitControls
          makeDefault
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2 - 0.05}
          enableDamping
          dampingFactor={0.05}
        />

        <Grid infiniteGrid fadeDistance={40} sectionColor="#9aa5b1" sectionSize={3} cellColor="#cfd5dc" cellSize={1} />
        <ContactShadows position={[0, -0.01, 0]} opacity={0.8} scale={20} blur={2} far={4} color="#000" />

        <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.1}>
          <group position={[0, height / 2, 0]}>
            <Box args={[length, height, width]}>
              <meshPhysicalMaterial color="#dce3ea" metalness={0.9} roughness={0.1} transmission={0.6} thickness={0.5} transparent />
              <Edges scale={1.001} threshold={15} color="#344054" />
            </Box>

            <Box args={[1.5, 1, 0.1]} position={[0, 0, width / 2]}>
              <meshPhysicalMaterial color="#87CEEB" transmission={0.9} roughness={0} thickness={1} transparent />
              <Edges scale={1.01} color="#2563eb" />
            </Box>

            <Box args={[1, 2, 0.1]} position={[length / 4, -0.5, width / 2]}>
              <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
              <Edges scale={1.01} color="#fa541c" />
            </Box>

            <VentSystem position={[-length / 3, height / 2 - 0.5, width / 2 + 0.05]} />

            <SensorNode position={[length / 2, height / 2, width / 2]} color="#ff4d4f" label="Home Heat Loss" value="Heat Flux: 45W/m2" />
            <SensorNode position={[-length / 2.5, -height / 3, -width / 2]} color="#52c41a" label="PCM Core" value="Latent Storage Active" />
            <SensorNode position={[0, 0, 0]} color="#2563eb" label="Indoor Estimate" value={`Temp: ${indoorTemp} deg C`} />
            <SensorNode position={[-length / 2, height / 2, width / 2]} color="#06b6d4" label="Outdoor Ambient" value={`Temp: ${outdoorTemp} deg C`} />
          </group>
        </Float>
      </Canvas>
    </div>
  );
}
