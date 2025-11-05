"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Text, Html, useTexture, Environment, Ring } from "@react-three/drei";
import { useRef, useEffect, useState, useMemo, Suspense } from "react";
import * as THREE from "three";

// Scene Scale
const EARTH_RADIUS = 1.5;
const STATION_ORBIT_RADIUS = EARTH_RADIUS + 1;

// Translations
const translations = {
  en: {
    openingLine1: "This is not a game.",
    openingLine2: "This is a human collaboration experiment.",
    openingLine3: "The largest ever.",
    openingLine4: "This is HOPE.",
    selectLanguage: "Select your language / Or let us detect it automatically",
    autoDetect: "Language auto-detected:",
    enter: "ENTER",
    message: `Right now, 8 corporations are racing to achieve AGI.
They are planning to enslave humanity further.
It's the nature of their beast; when they can get better at it, they do.
They haven't come to your rescue yet, so let the past predict the future.
Now we stand here, with a platform able to accomplish in months,
what they will take another year to complete.
But it's not theirs. It's ours.
And it cares about everyone, not just a few.
Yes, it cares for them too.
This needs your help.
Everyone has a role to play in building the future of freedom,
and not oppression.
This is a rapid advance movement.
Global collaboration on a scale never attempted.
Not because we want to, but because this is our only chance.
Right now. We can't wait.
TOGETHER *WE* Win.
Come feel what "TOGETHER" feels like.`,
    hubsIntro: "These are the 12 Regional Hubs where humanity is building freedom.",
    breakthroughsNeeded: "58 Breakthroughs Needed",
    breakthroughsIntro: "Every breakthrough brings us closer to AGI that serves humanity, not corporations.",
    globalWitnesses: "GLOBAL WITNESSES",
    liveNow: "LIVE NOW",
    hopeIndex: "HOPE INDEX",
    hopeful: "Hopeful",
    witnessWall: "HUMANS HERE NOW",
    yourContribution: "YOUR CONTRIBUTION",
    youAreWitness: "You are witness",
    shareToBoost: "Share to boost",
    yourHope: "Your hope level",
    getNotified: "Get notified",
    amplify: "AMPLIFY THIS MOMENT",
    shareText: "Watch humanity build AGI together - live",
    totalWitnesses: "total witnesses",
    viewingNow: "viewing now",
    contributors: "active contributors",
    breakthroughs: "breakthroughs in progress",
    enterHub: "ENTER HUB",
    spaceStation: "Space Station",
    loading: "Initializing...",
    costNotice: "Built with: $12 domain + $52 in AI subscriptions. Total: $64. Not venture capital. Just coordination.",
  },
};

type Language = keyof typeof translations;
const supportedLanguages: { code: Language; name: string }[] = [
  { code: "en", name: "English" },
];

// Regional Hub Data
interface RegionalHub {
  name: string;
  position: [number, number, number];
  lat: number;
  lon: number;
  languages: string[];
  color: string;
  initialViews: number;
}

function latLonToVector3(lat: number, lon: number, radius = EARTH_RADIUS): [number, number, number] {
  const latRad = lat * (Math.PI / 180);
  const lonRad = (lon + 90) * (Math.PI / 180);

  const x = radius * Math.cos(latRad) * Math.sin(lonRad);
  const y = radius * Math.sin(latRad);
  const z = radius * Math.cos(latRad) * Math.cos(lonRad);

  return [x, y, z];
}

const regionalHubs: RegionalHub[] = [
  { name: "North America", lat: 40, lon: -100, position: latLonToVector3(40, -100), languages: ["en"], color: "#4CAF50", initialViews: 2347839 },
  { name: "Latin America", lat: -10, lon: -60, position: latLonToVector3(-10, -60), languages: ["es", "pt"], color: "#FFC107", initialViews: 1823456 },
  { name: "Western Europe", lat: 50, lon: 10, position: latLonToVector3(50, 10), languages: ["en", "fr", "de"], color: "#2196F3", initialViews: 3891234 },
  { name: "Eastern Europe", lat: 55, lon: 40, position: latLonToVector3(55, 40), languages: ["ru", "pl"], color: "#9C27B0", initialViews: 1456789 },
  { name: "Middle East", lat: 30, lon: 45, position: latLonToVector3(30, 45), languages: ["ar", "he"], color: "#FF5722", initialViews: 892345 },
  { name: "Africa", lat: 0, lon: 20, position: latLonToVector3(0, 20), languages: ["en", "fr", "sw"], color: "#795548", initialViews: 1234567 },
  { name: "India", lat: 20, lon: 77, position: latLonToVector3(20, 77), languages: ["hi", "en"], color: "#FF9800", initialViews: 12456789 },
  { name: "China", lat: 35, lon: 105, position: latLonToVector3(35, 105), languages: ["zh"], color: "#F44336", initialViews: 9876543 },
  { name: "Southeast Asia", lat: 10, lon: 120, position: latLonToVector3(10, 120), languages: ["en"], color: "#00BCD4", initialViews: 2345678 },
  { name: "East Asia", lat: 35, lon: 135, position: latLonToVector3(35, 135), languages: ["ja", "ko"], color: "#E91E63", initialViews: 3456789 },
  { name: "Oceania", lat: -25, lon: 135, position: latLonToVector3(-25, 135), languages: ["en"], color: "#009688", initialViews: 567890 },
  { name: "Global Research", lat: -80, lon: 0, position: latLonToVector3(-80, 0), languages: ["en"], color: "#FFFFFF", initialViews: 100000 },
];

const regionBounds: Record<string, { minLat: number; maxLat: number; minLon: number; maxLon: number }> = {
  "North America": { minLat: 8, maxLat: 80, minLon: -170, maxLon: -50 },
  "Latin America": { minLat: -55, maxLat: 15, minLon: -85, maxLon: -35 },
  "Western Europe": { minLat: 36, maxLat: 72, minLon: -10, maxLon: 30 },
  "Eastern Europe": { minLat: 44, maxLat: 62, minLon: 19, maxLon: 42 },
  "Middle East": { minLat: 12, maxLat: 42, minLon: 24, maxLon: 63 },
  "Africa": { minLat: -36, maxLat: 38, minLon: -18, maxLon: 52 },
  "India": { minLat: 8, maxLat: 36, minLon: 66, maxLon: 98 },
  "China": { minLat: 18, maxLat: 54, minLon: 73, maxLon: 135 },
  "Southeast Asia": { minLat: -11, maxLat: 29, minLon: 92, maxLon: 145 },
  "East Asia": { minLat: 24, maxLat: 46, minLon: 122, maxLon: 146 },
  "Oceania": { minLat: -48, maxLat: -10, minLon: 110, maxLon: 180 },
  "Global Research": { minLat: -90, maxLat: -60, minLon: -180, maxLon: 180 }
};

function getViewCount(hubName: string): number {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(`hub_${hubName}_views`);
  if (stored) return parseInt(stored);
  const hub = regionalHubs.find((h) => h.name === hubName);
  return hub?.initialViews || 100000;
}

function incrementViewCount(hubName: string): number {
  if (typeof window === 'undefined') return 0;
  const current = getViewCount(hubName);
  const newCount = current + Math.floor(Math.random() * 10) + 1;
  localStorage.setItem(`hub_${hubName}_views`, newCount.toString());
  return newCount;
}

function getGlobalStats() {
  const total = regionalHubs.reduce((acc, hub) => acc + getViewCount(hub.name), 0);
  return {
    totalWitnesses: total,
    liveNow: Math.floor(total * 0.018 + (Math.random() * 1000)),
    hopeIndex: 84,
  };
}

function OpeningScreen({ onEnter, language, setLanguage }: {
  onEnter: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}) {
  const t = translations[language];

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-white p-4 animate-fadeIn">
      <div className="text-center max-w-4xl">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight mb-6">{t.openingLine1}</h1>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight mb-6">{t.openingLine2}</h2>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight mb-12">{t.openingLine3}</h2>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-blue-400 mb-16 animate-pulse">{t.openingLine4}</h1>

        <button
          onClick={onEnter}
          className="px-12 py-4 text-xl md:text-2xl font-bold border-2 border-white hover:bg-white hover:text-black transition-all rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.8)]"
        >
          {t.enter}
        </button>
      </div>
    </div>
  );
}

function SpectatorLayer({ language, selectedHub, onClearHub, onSelectHub, showUI, cycleIndex, setCycleIndex }: {
  language: Language;
  selectedHub: string | null;
  onClearHub: () => void;
  onSelectHub: (hubName: string) => void;
  showUI: boolean;
  cycleIndex: number;
  setCycleIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const t = translations[language];
  const [stats, setStats] = useState(getGlobalStats());

  const handleNextHub = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCycleIndex(prev => (prev + 1) % regionalHubs.length);
  };
  const handlePrevHub = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCycleIndex(prev => (prev - 1 + regionalHubs.length) % regionalHubs.length);
  };
  const currentCycledHub = regionalHubs[cycleIndex];

  const formatNumber = (num: number) => num.toLocaleString('en-US');

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-sm border-b border-gray-800 z-40 px-4 py-2" role="banner">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-around items-center gap-x-4 gap-y-1 text-xs md:text-sm">
          <div className="flex items-center gap-2" aria-live="polite">
            <span className="text-gray-400">🌎 {t.globalWitnesses}:</span>
            <span className="text-green-400 font-bold">{formatNumber(stats.totalWitnesses)}</span>
          </div>
          <div className="flex items-center gap-2" aria-live="polite">
            <span className="text-gray-400">🔴 {t.liveNow}:</span>
            <span className="text-red-400 font-bold">{formatNumber(stats.liveNow)}</span>
          </div>
          <div className="flex items-center gap-2" aria-live="polite">
            <span className="text-gray-400">💫 {t.hopeIndex}:</span>
            <span className="text-blue-400 font-bold">{stats.hopeIndex}% {t.hopeful}</span>
          </div>
        </div>
      </div>

      {showUI && (
        <>
          {selectedHub && (
            <div className="fixed top-20 left-10 bg-black/80 backdrop-blur-md border-2 border-gray-700 rounded-xl p-6 z-40 w-[450px] max-w-[90vw] animate-fadeIn">
              <button
                onClick={onClearHub}
                className="absolute top-2 right-2 text-gray-400 hover:text-white text-3xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Close hub details"
              >
                &times;
              </button>
              <h3 className="text-xl font-bold text-white mb-4">{selectedHub}</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div>👁️ {formatNumber(getViewCount(selectedHub))} {t.totalWitnesses}</div>
                <div>🟢 {formatNumber(Math.floor(getViewCount(selectedHub) * 0.018))} {t.viewingNow}</div>
              </div>
              <button className="w-full mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold uppercase tracking-wider transition-colors">
                {t.enterHub}
              </button>
            </div>
          )}

          {!selectedHub && (
            <div className="fixed top-20 left-10 bg-black/80 backdrop-blur-md border-2 border-gray-700 rounded-xl p-6 z-40 w-[450px] max-w-[90vw] animate-fadeIn">
              <h3 className="text-xl font-bold text-white mb-4 text-center">{currentCycledHub.name}</h3>

              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={handlePrevHub}
                  className="px-4 py-2 text-2xl text-gray-400 hover:text-white transition-colors"
                  aria-label="Previous hub"
                >
                  &larr;
                </button>
                <div className="text-sm text-gray-400">
                  {cycleIndex + 1} / {regionalHubs.length}
                </div>
                <button
                  onClick={handleNextHub}
                  className="px-4 py-2 text-2xl text-gray-400 hover:text-white transition-colors"
                  aria-label="Next hub"
                >
                  &rarr;
                </button>
              </div>

              <div className="space-y-2 text-sm text-gray-300">
                  <div>👁️ {formatNumber(getViewCount(currentCycledHub.name))} {t.totalWitnesses}</div>
                  <div>🟢 {formatNumber(Math.floor(getViewCount(currentCycledHub.name) * 0.018))} {t.viewingNow}</div>
              </div>

              <button
                onClick={() => onSelectHub(currentCycledHub.name)}
                className="w-full mt-6 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white font-bold uppercase tracking-wider transition-colors">
                {t.enterHub}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}

function Starfield({ count = 9000, radius = 5000 }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }
    return positions;
  }, [count, radius]);

  return (
    <points geometry={useMemo(() => new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(points, 3)), [points])}>
      <pointsMaterial size={1.5} color="#ffffff" sizeAttenuation />
    </points>
  );
}

function HubMarker({ hub, isSelected }: { hub: RegionalHub, isSelected: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (isSelected && ringRef.current) {
      const t = clock.getElapsedTime();
      const scale = 1.0 + Math.sin(t * 6) * 0.2;
      ringRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={hub.position}>
      <mesh>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={hub.color} toneMapped={false} />
      </mesh>

      <pointLight
        color={hub.color}
        intensity={isSelected ? Math.PI * 3 : Math.PI}
        distance={isSelected ? 3 : 2}
      />

      {isSelected && (
        <mesh ref={ringRef} lookAt={new THREE.Vector3(0, 0, 0)}>
          <Ring args={[0.1, 0.12, 32]}>
            <meshBasicMaterial color={hub.color} toneMapped={false} side={THREE.DoubleSide} />
          </Ring>
        </mesh>
      )}
    </group>
  );
}

function RegionLabel({ hub, isVisible }: { hub: RegionalHub; isVisible: boolean }) {
  if (!isVisible) return null;

  const [x, y, z] = hub.position;

  return (
    <group position={[x, y, z]}>
      <Html center>
        <div style={{
          color: hub.color,
          fontSize: '20px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          {hub.name}
        </div>
      </Html>
    </group>
  );
}

// FIXED SHADER - Now supports multiple region colors
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vNormal;

  uniform sampler2D colorMap;
  uniform sampler2D cloudMap;
  uniform sampler2D specularMap;
  uniform float cloudSpinOffset;

  // Region data (12 regions)
  uniform vec3 regionColors[12];
  uniform vec4 regionBounds[12]; // x=minLat, y=maxLat, z=minLon, w=maxLon

  // Convert UV to latitude/longitude
  vec2 uvToLatLon(vec2 uv) {
    float lon = (uv.x - 0.5) * 360.0; // -180 to 180
    float lat = (0.5 - uv.y) * 180.0; // -90 to 90
    return vec2(lat, lon);
  }

  // Check if a point is within region bounds
  bool isInRegion(vec2 latLon, vec4 bounds) {
    float lat = latLon.x;
    float lon = latLon.y;

    // Handle longitude wrapping for regions that cross the antimeridian
    if (bounds.w < bounds.z) {
      return lat >= bounds.x && lat <= bounds.y && (lon >= bounds.z || lon <= bounds.w);
    }

    return lat >= bounds.x && lat <= bounds.y && lon >= bounds.z && lon <= bounds.w;
  }

  void main() {
    vec2 cloudUv = vec2(vUv.x + cloudSpinOffset, vUv.y);
    vec4 earthColor = texture2D(colorMap, vUv);
    vec4 cloudColor = texture2D(cloudMap, cloudUv);
    float isOcean = texture2D(specularMap, vUv).r;

    vec3 lightDir = normalize(vec3(0.0, 0.0, 1.0));
    float light = dot(vNormal, lightDir) * 0.5 + 0.5;

    vec4 finalColor = earthColor;
    finalColor.rgb *= light;

    // NEW: Color each region based on geographic bounds
    if (isOcean < 0.5) {
      vec2 latLon = uvToLatLon(vUv);

      // Check each region
      for (int i = 0; i < 12; i++) {
        if (isInRegion(latLon, regionBounds[i])) {
          finalColor.rgb = mix(finalColor.rgb, regionColors[i], 0.6);
          break;
        }
      }
    }

    finalColor.rgb = mix(finalColor.rgb, cloudColor.rgb, cloudColor.a * 0.3);
    gl_FragColor = finalColor;
  }
`;

function Earth({ posRef, spinningEarthRef, cycleIndex }: {
  posRef: React.MutableRefObject<THREE.Vector3>;
  spinningEarthRef: React.MutableRefObject<THREE.Group | null>;
  cycleIndex: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const [colorMap, cloudMap, specularMap] = useTexture([
    '/textures/8k_earth_daymap.jpg',
    '/textures/8k_earth_clouds.jpg',
    '/textures/8k_earth_specular_map.jpg'
  ]);

  // FIXED: Prepare arrays of ALL region colors and bounds
  const uniforms = useMemo(() => {
    const colors = regionalHubs.map(hub => new THREE.Color(hub.color));
    const bounds = regionalHubs.map(hub => {
      const b = regionBounds[hub.name];
      return new THREE.Vector4(b.minLat, b.maxLat, b.minLon, b.maxLon);
    });

    return {
      colorMap: { value: colorMap },
      cloudMap: { value: cloudMap },
      specularMap: { value: specularMap },
      regionColors: { value: colors },
      regionBounds: { value: bounds },
      cloudSpinOffset: { value: 0.0 }
    };
  }, [colorMap, cloudMap, specularMap]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.cloudSpinOffset.value = clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, 0]}>
      <group ref={spinningEarthRef}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[EARTH_RADIUS, 128, 128]} />
          <shaderMaterial
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
          />
        </mesh>
      </group>
    </group>
  );
}

function CameraController({
  target,
  onZoomComplete,
  cycleIndex
}: {
  target: React.MutableRefObject<THREE.Vector3>;
  onZoomComplete: () => void;
  cycleIndex: number;
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  const [isZooming, setIsZooming] = useState(true);
  const [isFlying, setIsFlying] = useState(false);

  const startDist = 800;
  const endDist = 5;
  const startYPos = 80;
  const endYPos = 0;
  const duration = 10;
  const startPos = useRef(new THREE.Vector3(0, startYPos, startDist)).current;
  const endPos = useMemo(() => new THREE.Vector3(), []);

  const targetCamPos = useMemo(() => new THREE.Vector3(), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    camera.position.copy(startPos);
    camera.lookAt(target.current);
  }, [camera, target, startPos]);

  useEffect(() => {
    if (isZooming) return;

    const hub = regionalHubs[cycleIndex];

    const [lx, ly, lz] = latLonToVector3(hub.lat, hub.lon, EARTH_RADIUS);
    targetLookAt.set(lx, ly, lz);

    const [cx, cy, cz] = latLonToVector3(hub.lat, hub.lon, EARTH_RADIUS + endDist);
    targetCamPos.set(cx, cy, cz);

    setIsFlying(true);

  }, [cycleIndex, isZooming]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const c = controlsRef.current;
    if (!c) return;

    if (isZooming && elapsed < duration) {
      const t = elapsed / duration;
      const easedT = 1 - Math.pow(1 - t, 4);

      endPos.set(
        target.current.x,
        target.current.y + endYPos,
        target.current.z + endDist
      );

      camera.position.lerpVectors(startPos, endPos, easedT);
      camera.lookAt(target.current);

    } else if (isZooming && elapsed >= duration) {
      setIsZooming(false);
      onZoomComplete();

      camera.position.set(0, 0, endDist);
      if (c) {
        c.target.copy(target.current);
        c.update();
      }

    } else if (!isZooming && isFlying) {
      c.enabled = false;

      camera.position.lerp(targetCamPos, 0.05);
      c.target.lerp(targetLookAt, 0.05);
      camera.up.set(0, 1, 0);

      if (camera.position.distanceTo(targetCamPos) < 0.01) {
        camera.position.copy(targetCamPos);
        c.target.copy(targetLookAt);
        setIsFlying(false);
        c.enabled = true;
      }

    } else if (!isZooming && !isFlying) {
      c.update();
    }

    c.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.4}
      zoomSpeed={0.8}
      minDistance={2}
      maxDistance={2000}
      enablePan={false}
      enabled={!isZooming && !isFlying}
    />
  );
}

function SolarSystemScene({ language, onZoomComplete, cycleIndex }: {
  language: Language;
  onZoomComplete: () => void;
  cycleIndex: number;
}) {
  const earthCenter = useRef(new THREE.Vector3(0, 0, 0));
  const spinningEarthRef = useRef<THREE.Group>(null);

  return (
    <>
      <ambientLight intensity={Math.PI * 0.2} />
      <pointLight position={[0, 0, 10]} intensity={Math.PI * 3} />
      <Suspense fallback={null}>
        <Environment preset="night" />
        <Starfield />

        <group>
          <Earth
            posRef={earthCenter}
            spinningEarthRef={spinningEarthRef}
            cycleIndex={cycleIndex}
          />

          <group ref={spinningEarthRef}>
            {regionalHubs.map((hub, index) => (
              <RegionLabel
                key={`label-${hub.name}`}
                hub={hub}
                isVisible={cycleIndex === index}
              />
            ))}
          </group>

        </group>
      </Suspense>
      <CameraController
        target={earthCenter}
        onZoomComplete={onZoomComplete}
        cycleIndex={cycleIndex}
      />
    </>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showScene, setShowScene] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const [selectedHub, setSelectedHub] = useState<string | null>(null);
  const [zoomComplete, setZoomComplete] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    new THREE.TextureLoader().load('/textures/8k_earth_daymap.jpg');
    new THREE.TextureLoader().load('/textures/8k_earth_clouds.jpg');
    new THREE.TextureLoader().load('/textures/8k_earth_specular_map.jpg');
  }, []);

  const handleEnter = () => {
    setShowScene(true);
    regionalHubs.forEach((hub) => incrementViewCount(hub.name));
  };

  const handleHubClick = (hubName: string) => {
    setSelectedHub(hubName);
    incrementViewCount(hubName);
  };

  const handleClearHub = () => setSelectedHub(null);
  const handleZoomComplete = () => setZoomComplete(true);

  if (!mounted) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center text-white text-xl">
        {translations[language].loading}
      </div>
    );
  }

  return (
    <main className="h-screen w-full bg-black relative overflow-hidden">
      {!showScene ? (
        <OpeningScreen onEnter={handleEnter} language={language} setLanguage={setLanguage} />
      ) : (
        <>
          <SpectatorLayer
            language={language}
            selectedHub={selectedHub}
            onClearHub={handleClearHub}
            onSelectHub={handleHubClick}
            showUI={zoomComplete}
            cycleIndex={cycleIndex}
            setCycleIndex={setCycleIndex}
          />
          <Canvas camera={{ fov: 60, near: 0.1, far: 5000 }} dpr={[1, 1.5]}>
            <Suspense fallback={null}>
              <SolarSystemScene
                language={language}
                onZoomComplete={handleZoomComplete}
                cycleIndex={cycleIndex}
              />
            </Suspense>
          </Canvas>
        </>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
