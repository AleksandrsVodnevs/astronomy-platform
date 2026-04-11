import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import './SolarSystem.css';

const BASE_SPEED = 0.45;

// ── Moon (separate from planet array, orbits Earth) ────────
const MOON_DATA = {
  id: 'moon',
  name: 'Mēness',
  color: '#c8c8c8',
  info: {
    diameter: '3 474 km',
    distanceLabel: 'Attālums no Zemes',
    distance: '384 400 km',
    moons: '-',
    orbit: '27,3 dienas',
    temp: '-173°C līdz +127°C',
    fact: 'Mēness ir vienīgā vieta ārpus Zemes, kur cilvēks ir staigājis.',
  },
};

const SUN_DATA = {
  id: 'sun',
  name: 'Saule',
  info: {
    diameter: '1 392 700 km',
    distanceLabel: 'Pozīcija',
    distance: 'Saules sistēmas centrs',
    moons: '-',
    orbit: '25-35 dienas (rotācija)',
    temp: '+5 500°C',
    fact: 'Saule satur 99,86% no visas Saules sistēmas masas un ir aptuveni 109× plašāka par Zemi.',
  },
};

// ── Planet definitions ─────────────────────────────────────
const PLANET_DATA = [
  {
    id: 'mercury',
    name: 'Merkurs',
    texture: '/textures/8k_mercury.jpg',
    color: '#b5b5b5',
    size: 0.40,
    orbitRadius: 9,
    orbitSpeed: 4.15,
    selfRotation: 0.5,
    info: {
      diameter: '4 879 km',
      distance: '57,9 milj. km',
      moons: '0',
      orbit: '88 dienas',
      temp: '-180°C līdz +430°C',
      fact: 'Merkurs ir mazākā planēta Saules sistēmā un tuvākā Saulei.',
    },
  },
  {
    id: 'venus',
    name: 'Venera',
    texture: '/textures/8k_venus_surface.jpg',
    color: '#e8cda0',
    size: 0.88,
    orbitRadius: 15,
    orbitSpeed: 1.62,
    selfRotation: 0.3,
    info: {
      diameter: '12 104 km',
      distance: '108,2 milj. km',
      moons: '0',
      orbit: '225 dienas',
      temp: '+462°C',
      fact: 'Venera ir karstākā planēta - karstāka par Merkuru, lai gan tālāk no Saules.',
    },
  },
  {
    id: 'earth',
    name: 'Zeme',
    texture: '/textures/8k_earth_daymap.jpg',
    color: '#4F8EF7',
    size: 0.95,
    orbitRadius: 22,
    orbitSpeed: 1.0,
    selfRotation: 1.0,
    info: {
      diameter: '12 756 km',
      distance: '149,6 milj. km',
      moons: '1',
      orbit: '365 dienas',
      temp: '-88°C līdz +58°C',
      fact: 'Zeme ir vienīgā zināmā planēta, uz kuras ir dzīvība.',
    },
  },
  {
    id: 'mars',
    name: 'Marss',
    texture: '/textures/8k_mars.jpg',
    color: '#c1440e',
    size: 0.53,
    orbitRadius: 31,
    orbitSpeed: 0.53,
    selfRotation: 0.97,
    info: {
      diameter: '6 792 km',
      distance: '227,9 milj. km',
      moons: '2',
      orbit: '687 dienas',
      temp: '-87°C līdz -5°C',
      fact: 'Marsā atrodas Olimpa kalns - augstākais vulkāns Saules sistēmā.',
    },
  },
  {
    id: 'jupiter',
    name: 'Jupiters',
    texture: '/textures/8k_jupiter.jpg',
    color: '#c88b3a',
    size: 2.8,
    orbitRadius: 50,
    orbitSpeed: 0.084,
    selfRotation: 2.4,
    info: {
      diameter: '142 984 km',
      distance: '778,5 milj. km',
      moons: '95',
      orbit: '12 gadi',
      temp: '-108°C',
      fact: 'Lielo Sarkano Plankumu vētra uz Jupitera ir lielāka par visu Zemi.',
    },
  },
  {
    id: 'saturn',
    name: 'Saturns',
    texture: '/textures/8k_saturn.jpg',
    color: '#e4d191',
    size: 2.3,
    orbitRadius: 70,
    orbitSpeed: 0.034,
    selfRotation: 2.2,
    hasRings: true,
    info: {
      diameter: '120 536 km',
      distance: '1 432 milj. km',
      moons: '146',
      orbit: '29 gadi',
      temp: '-138°C',
      fact: 'Saturna gredzeni sastāv no ledus un akmeņiem - daži gabali ir mikroskopiski mazi.',
    },
  },
  {
    id: 'uranus',
    name: 'Urāns',
    texture: '/textures/2k_uranus.jpg',
    color: '#7de8e8',
    size: 1.6,
    orbitRadius: 90,
    orbitSpeed: 0.012,
    selfRotation: 1.4,
    info: {
      diameter: '51 118 km',
      distance: '2 867 milj. km',
      moons: '27',
      orbit: '84 gadi',
      temp: '-195°C',
      fact: 'Urāns rotē uz sāniem - tā ass ir gandrīz paralēla orbītas plaknei.',
    },
  },
  {
    id: 'neptune',
    name: 'Neptūns',
    texture: '/textures/2k_neptune.jpg',
    color: '#3f54ba',
    size: 1.5,
    orbitRadius: 110,
    orbitSpeed: 0.006,
    selfRotation: 1.5,
    info: {
      diameter: '49 528 km',
      distance: '4 515 milj. km',
      moons: '16',
      orbit: '165 gadi',
      temp: '-200°C',
      fact: 'Neptūnā pūš spēcīgākie vēji Saules sistēmā - līdz 2100 km/h.',
    },
  },
];

// Radial gradient canvas → Sprite glow texture for the Sun
function makeSunGlowTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  const c = size / 2;
  const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
  grad.addColorStop(0.00, 'rgba(255, 255, 220, 1.0)');
  grad.addColorStop(0.15, 'rgba(255, 210,  60, 0.85)');
  grad.addColorStop(0.40, 'rgba(255, 140,   0, 0.45)');
  grad.addColorStop(0.70, 'rgba(255,  80,   0, 0.12)');
  grad.addColorStop(1.00, 'rgba(255,  60,   0, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

// Fix RingGeometry UVs so textures map radially (inside→outside)
function fixRingUVs(geo, innerR, outerR) {
  const pos = geo.attributes.position;
  const uv  = geo.attributes.uv;
  const v   = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const t = (v.length() - innerR) / (outerR - innerR);
    uv.setXY(i, t, 1);
  }
  uv.needsUpdate = true;
}

const SolarSystem = () => {
  const mountRef       = useRef(null);
  const rendererRef    = useRef(null);
  const animFrameRef   = useRef(null);
  const speedRef       = useRef(1);
  const hoveredRef     = useRef(null);
  // Exposed to React handlers for smooth zoom / reset
  const cameraRef      = useRef(null);
  const controlsRef    = useRef(null);
  const zoomTargetRef  = useRef(null);   // target camera distance, null = idle
  const resetActiveRef = useRef(false);  // smooth-reset in progress
  // Planet focus / follow
  const focusedRef     = useRef(null);   // { mesh, size, name } of focused body
  const focusTransRef  = useRef(false);  // true = transition in progress
  const unfocusRef     = useRef(false);  // flag: React → animation loop
  const lastFocusedNameRef = useRef(null); // tracks last name pushed to React state

  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [speed, setSpeed] = useState(1);
  const [panelOpen, setPanelOpen] = useState(false);
  const [focusedName, setFocusedName] = useState(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = container.clientWidth;
    const H = container.clientHeight;

    // ── Scene ──────────────────────────────────────────────
    const scene = new THREE.Scene();

    // ── Camera ─────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 30000);
    camera.position.set(0, 72, 108);
    camera.lookAt(0, 0, 0);

    // ── Renderer ───────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ── Controls ───────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping  = true;
    controls.dampingFactor  = 0.06;
    controls.minDistance    = 14;
    controls.maxDistance    = 1800;  // stay inside skybox sphere (r=15000)
    controls.maxPolarAngle  = Math.PI * 0.82;

    // Expose to React handlers
    cameraRef.current    = camera;
    controlsRef.current  = controls;

    // Pre-allocated helpers (avoid per-frame allocation)
    const _zoomDir    = new THREE.Vector3();
    const _followDelta = new THREE.Vector3();
    const INIT_POS  = new THREE.Vector3(0, 72, 108);
    const INIT_TGT  = new THREE.Vector3(0, 0, 0);

    // ── Texture loader ─────────────────────────────────────
    const loader = new THREE.TextureLoader();

    // ── Milky Way skybox ───────────────────────────────────
    const skyTex = loader.load('/textures/8k_stars_milky_way.jpg');
    skyTex.mapping    = THREE.EquirectangularReflectionMapping;
    skyTex.colorSpace = THREE.SRGBColorSpace;
    scene.background  = skyTex;

    // ── Lights ─────────────────────────────────────────────
    // Primary white-warm sun light — infinite range, no decay
    const sunLight = new THREE.PointLight(0xfff8e7, 3.0, 0, 0);
    scene.add(sunLight);
    // Secondary orange-tinted fill to warm up lit faces
    const sunLightOrange = new THREE.PointLight(0xFFA500, 1.5, 0, 0);
    scene.add(sunLightOrange);
    // Ambient so the dark side is never pure black
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    // ── Sun ────────────────────────────────────────────────
    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(4, 48, 48),
      new THREE.MeshBasicMaterial({ map: loader.load('/textures/8k_sun.jpg') })
    );
    scene.add(sunMesh);

    // ── Volumetric Sun glow (sprites, always face camera) ──
    const glowTex = makeSunGlowTexture();
    // Inner glow — 3.5× Sun diameter
    const sunGlowInner = new THREE.Sprite(new THREE.SpriteMaterial({
      map:        glowTex,
      blending:   THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    }));
    sunGlowInner.scale.set(28, 28, 1);
    scene.add(sunGlowInner);
    // Outer corona — 6.5× Sun diameter, very faint orange
    const sunGlowOuter = new THREE.Sprite(new THREE.SpriteMaterial({
      map:        glowTex,
      blending:   THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity:    0.15,
      color:      new THREE.Color(0xFF8800),
    }));
    sunGlowOuter.scale.set(52, 52, 1);
    scene.add(sunGlowOuter);

    // ── Planets ────────────────────────────────────────────
    const planetObjects = [];

    PLANET_DATA.forEach((data, idx) => {
      // Orbit ring
      const orbitGeo = new THREE.RingGeometry(
        data.orbitRadius - 0.07,
        data.orbitRadius + 0.07,
        160
      );
      const orbitRing = new THREE.Mesh(
        orbitGeo,
        new THREE.MeshBasicMaterial({
          color: 0x1e3a5f, side: THREE.DoubleSide,
          transparent: true, opacity: 0.5,
        })
      );
      orbitRing.rotation.x = -Math.PI / 2;
      scene.add(orbitRing);

      // Planet mesh — Earth uses a custom day/night shader; others use MeshPhongMaterial
      let mat;
      if (data.id === 'earth') {
        const dayTex   = loader.load(data.texture);
        const nightTex = loader.load('/textures/8k_earth_nightmap.jpg');
        mat = new THREE.ShaderMaterial({
          uniforms: {
            dayMap:   { value: dayTex },
            nightMap: { value: nightTex },
          },
          vertexShader: `
            varying vec2 vUv;
            varying vec3 vWorldNormal;
            varying vec3 vWorldPosition;
            void main() {
              vUv = uv;
              vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
              vWorldNormal = normalize(mat3(modelMatrix) * normal);
              gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPosition, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D dayMap;
            uniform sampler2D nightMap;
            varying vec2 vUv;
            varying vec3 vWorldNormal;
            varying vec3 vWorldPosition;
            void main() {
              vec3 toSun = normalize(-vWorldPosition);
              float NdotL = dot(vWorldNormal, toSun);
              float blend = smoothstep(-0.15, 0.15, NdotL);
              vec4 day = texture2D(dayMap, vUv);
              vec4 night = texture2D(nightMap, vUv);
              gl_FragColor = mix(night, day, blend);
            }
          `,
        });
      } else {
        mat = new THREE.MeshPhongMaterial({
          map:       loader.load(data.texture),
          emissive:  new THREE.Color(0, 0, 0),
          shininess: 15,
          specular:  new THREE.Color(0x333333),
        });
      }
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(data.size, 40, 40), mat);

      const startAngle = (idx / PLANET_DATA.length) * Math.PI * 2;
      mesh.position.x = Math.cos(startAngle) * data.orbitRadius;
      mesh.position.z = Math.sin(startAngle) * data.orbitRadius;
      scene.add(mesh);

      // Earth cloud layer — slightly larger sphere, non-raycastable
      let cloudMesh = null;
      if (data.id === 'earth') {
        const cloudTex = loader.load('/textures/8k_earth_clouds.jpg');
        cloudMesh = new THREE.Mesh(
          new THREE.SphereGeometry(data.size * 1.008, 40, 40),
          new THREE.MeshPhongMaterial({
            map:         cloudTex,
            alphaMap:    cloudTex,
            transparent: true,
            depthWrite:  false,
          })
        );
        cloudMesh.position.copy(mesh.position);
        cloudMesh.raycast = () => {}; // clicks pass through to Earth sphere
        scene.add(cloudMesh);
      }

      // Saturn rings with alpha texture + UV fix
      let saturnRing = null;
      if (data.hasRings) {
        const innerR = data.size * 1.45;
        const outerR = data.size * 2.55;
        const ringGeo = new THREE.RingGeometry(innerR, outerR, 128);
        fixRingUVs(ringGeo, innerR, outerR);

        saturnRing = new THREE.Mesh(
          ringGeo,
          new THREE.MeshBasicMaterial({
            map:         loader.load('/textures/8k_saturn_ring_alpha.png'),
            side:        THREE.DoubleSide,
            transparent: true,
            depthWrite:  false,
          })
        );
        saturnRing.rotation.x = -Math.PI / 2 + 0.18;
        saturnRing.position.copy(mesh.position);
        scene.add(saturnRing);
      }

      planetObjects.push({ mesh, ring: saturnRing, cloud: cloudMesh, orbitLine: orbitRing, data, angle: startAngle });
    });

    // ── Moon (orbits Earth) ────────────────────────────────
    const earthObj = planetObjects.find(p => p.data.id === 'earth');
    const MOON_ORBIT_R = earthObj.data.size * 3.2;  // ~3.04 units from Earth
    const MOON_SIZE    = earthObj.data.size * 0.27;  // ~0.257 units

    const moonMesh = new THREE.Mesh(
      new THREE.SphereGeometry(MOON_SIZE, 32, 32),
      new THREE.MeshPhongMaterial({
        map:       loader.load('/textures/8k_moon.jpg'),
        emissive:  new THREE.Color(0, 0, 0),
        shininess: 8,
        specular:  new THREE.Color(0x222222),
      })
    );
    scene.add(moonMesh);

    // Faint orbit ring around Earth for the Moon
    const moonOrbitRing = new THREE.Mesh(
      new THREE.RingGeometry(MOON_ORBIT_R - 0.025, MOON_ORBIT_R + 0.025, 64),
      new THREE.MeshBasicMaterial({
        color: 0x334466, side: THREE.DoubleSide,
        transparent: true, opacity: 0.3,
      })
    );
    moonOrbitRing.rotation.x = -Math.PI / 2;
    scene.add(moonOrbitRing);

    let moonAngle = Math.PI * 0.7;  // stagger from Earth's starting position

    // ── Asteroid belt (r 35–46, between Mars r=31 and Jupiter r=50) ─
    const BELT_COUNT = 2500;
    const beltPos = new Float32Array(BELT_COUNT * 3);
    for (let i = 0; i < BELT_COUNT; i++) {
      const angle  = Math.random() * Math.PI * 2;
      const radius = 35 + Math.random() * 11;
      beltPos[i * 3]     = Math.cos(angle) * radius;
      beltPos[i * 3 + 1] = (Math.random() - 0.5) * 2.5;
      beltPos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const beltGeo = new THREE.BufferGeometry();
    beltGeo.setAttribute('position', new THREE.BufferAttribute(beltPos, 3));
    const beltMat = new THREE.PointsMaterial({
      color: 0xaaaaaa,
      size: 0.18,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.75,
    });
    const beltPoints = new THREE.Points(beltGeo, beltMat);
    scene.add(beltPoints);

    // ── Orbit highlight helpers ────────────────────────────
    let hoveredOrbit = null;
    let focusedOrbit = null;
    const ORBIT_DEFAULT = { hex: 0x1e3a5f, op: 0.5 };
    const ORBIT_HOVER   = { hex: 0x3a7fff, op: 0.85 };
    const ORBIT_FOCUS   = { hex: 0x66b3ff, op: 1.0 };
    const applyOrbit = (mesh, style) => {
      if (!mesh) return;
      mesh.material.color.setHex(style.hex);
      mesh.material.opacity = style.op;
    };

    // ── Clock & Raycaster ──────────────────────────────────
    const clock    = new THREE.Clock();
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.1;
    const mouse = new THREE.Vector2();

    // Helper: all clickable meshes
    const allClickable = () => [...planetObjects.map(p => p.mesh), moonMesh, sunMesh];

    // ── Animation loop ─────────────────────────────────────
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const s = speedRef.current;

      // Planets orbit + self-rotate
      planetObjects.forEach(p => {
        p.angle += p.data.orbitSpeed * BASE_SPEED * delta * s;
        p.mesh.position.x = Math.cos(p.angle) * p.data.orbitRadius;
        p.mesh.position.z = Math.sin(p.angle) * p.data.orbitRadius;
        p.mesh.rotation.y += (p.data.selfRotation || 1) * 0.5 * delta * Math.max(s, 0.1);
        if (p.ring) p.ring.position.copy(p.mesh.position);
        if (p.cloud) {
          p.cloud.position.copy(p.mesh.position);
          p.cloud.rotation.y += 0.55 * 0.5 * delta * Math.max(s, 0.1);
        }
      });

      beltPoints.rotation.y += 0.008 * BASE_SPEED * delta * Math.max(s, 0.1);

      // Moon orbits Earth; tidal lock keeps same face toward Earth
      moonAngle += 2.0 * BASE_SPEED * delta * s;
      const ex = earthObj.mesh.position.x;
      const ez = earthObj.mesh.position.z;
      moonMesh.position.set(
        ex + Math.cos(moonAngle) * MOON_ORBIT_R,
        0,
        ez + Math.sin(moonAngle) * MOON_ORBIT_R
      );
      moonMesh.rotation.y = moonAngle + Math.PI; // tidally locked
      moonOrbitRing.position.set(ex, 0, ez);

      // ── Unfocus if requested (ESC / back button / reset) ──
      if (unfocusRef.current) {
        unfocusRef.current    = false;
        focusedRef.current    = null;
        focusTransRef.current = false;
        controls.enabled      = true;
        controls.minDistance  = 14;
        controls.maxDistance  = 1800;
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI * 0.82;        // restore global limit
        resetActiveRef.current = true;
        applyOrbit(focusedOrbit, ORBIT_DEFAULT);
        focusedOrbit = null;
      }

      // ── Sync focused name to React state ──────────────────
      // Driven from the ref so switching planets mid-follow always updates the button.
      const _newName = focusedRef.current ? focusedRef.current.name : null;
      if (_newName !== lastFocusedNameRef.current) {
        lastFocusedNameRef.current = _newName;
        setFocusedName(_newName);
      }

      // ── Planet focus: transition in then follow ────────────
      if (focusedRef.current && !resetActiveRef.current) {
        const { mesh, size } = focusedRef.current;
        const pos = mesh.position;

        if (focusTransRef.current) {
          // Disable user controls while flying toward the planet
          controls.enabled = false;

          // Camera target: sun-facing side, slightly above.
          // Special case: the Sun itself sits at origin — use a fixed approach angle.
          const viewDist = Math.max(size * 5, 4);
          let desired;
          if (pos.length() < 0.1) {
            desired = new THREE.Vector3(size * 1.5, size * 2, size * 5);
          } else {
            const toSun = new THREE.Vector3().copy(pos).negate().normalize();
            desired = new THREE.Vector3()
              .copy(pos)
              .add(toSun.multiplyScalar(viewDist))
              .add(new THREE.Vector3(0, Math.max(size * 1.5, 2), 0));
          }

          const lf = 1 - Math.exp(-3.5 * delta);
          camera.position.lerp(desired, lf);
          camera.lookAt(pos);
          controls.target.copy(pos);

          // Close enough? — end transition and hand control back
          if (camera.position.distanceTo(desired) < Math.max(size * 0.15, 0.3)) {
            focusTransRef.current = false;
            camera.position.copy(desired);
            controls.target.copy(pos);
            controls.update();                          // sync OrbitControls state
            controls.enabled      = true;
            controls.minDistance  = Math.max(size * 0.6, 0.2);
            controls.maxDistance  = Math.max(size * 70,  50);
            controls.minPolarAngle = 0;
            controls.maxPolarAngle = Math.PI;           // full vertical freedom when focused
          }
        } else {
          // Following mode: translate camera by the same delta the planet moved so
          // OrbitControls sees unchanged spherical coords and doesn't fight the movement.
          _followDelta.subVectors(pos, controls.target);
          camera.position.add(_followDelta);
          controls.target.copy(pos);
        }
      }

      // Smooth zoom toward zoomTargetRef
      if (zoomTargetRef.current !== null) {
        const curDist = camera.position.distanceTo(controls.target);
        const tgt     = zoomTargetRef.current;
        const newDist = THREE.MathUtils.lerp(curDist, tgt, 0.1);
        if (Math.abs(newDist - tgt) < 0.2) {
          zoomTargetRef.current = null;
        }
        _zoomDir.subVectors(camera.position, controls.target).normalize();
        camera.position.copy(controls.target).addScaledVector(_zoomDir, newDist);
      }

      // Smooth reset to initial view
      if (resetActiveRef.current) {
        camera.position.lerp(INIT_POS, 0.07);
        controls.target.lerp(INIT_TGT, 0.07);
        if (camera.position.distanceTo(INIT_POS) < 0.8) {
          camera.position.copy(INIT_POS);
          controls.target.copy(INIT_TGT);
          resetActiveRef.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ── NDC helper ─────────────────────────────────────────
    const getNDC = (e) => {
      const r = container.getBoundingClientRect();
      return {
        x:  ((e.clientX - r.left) / r.width)  *  2 - 1,
        y: -((e.clientY - r.top)  / r.height) *  2 + 1,
      };
    };

    // ── Click ──────────────────────────────────────────────
    const handleClick = (e) => {
      const { x, y } = getNDC(e);
      mouse.set(x, y);
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(allClickable());
      if (hits.length > 0) {
        const hitMesh  = hits[0].object;
        const isSunHit  = hitMesh === sunMesh;
        const isMoonHit = hitMesh === moonMesh;
        const obj  = (isSunHit || isMoonHit) ? null : planetObjects.find(p => p.mesh === hitMesh);
        const data = isSunHit ? SUN_DATA : isMoonHit ? MOON_DATA : obj?.data;
        const sz   = isSunHit ? 4 : isMoonHit ? MOON_SIZE : obj?.data.size;

        if (data) {
          setSelectedPlanet(data);
          // Highlight focused planet's orbit ring
          applyOrbit(focusedOrbit, ORBIT_DEFAULT);
          focusedOrbit = isSunHit ? null : isMoonHit ? moonOrbitRing : obj?.orbitLine || null;
          applyOrbit(focusedOrbit, ORBIT_FOCUS);
          // Start zoom-in to the clicked body
          focusedRef.current    = { mesh: hitMesh, size: sz, name: data.name };
          focusTransRef.current = true;
          zoomTargetRef.current = null;          // cancel any pending zoom
          return;
        }
      }
      setSelectedPlanet(null);
    };

    // ── Hover ──────────────────────────────────────────────
    const handleMouseMove = (e) => {
      const { x, y } = getNDC(e);
      mouse.set(x, y);
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(allClickable());

      // Reset previous glow (guard: MeshBasicMaterial has no emissive)
      if (hoveredRef.current) {
        if (hoveredRef.current.material.emissive)
          hoveredRef.current.material.emissive.setHex(0x000000);
        hoveredRef.current = null;
      }
      // Restore hovered orbit unless it's the focused one
      if (hoveredOrbit && hoveredOrbit !== focusedOrbit) {
        applyOrbit(hoveredOrbit, ORBIT_DEFAULT);
      }
      hoveredOrbit = null;

      if (hits.length > 0) {
        const hitMesh = hits[0].object;
        const isSun   = hitMesh === sunMesh;
        const isMoon  = hitMesh === moonMesh;
        const obj     = (isSun || isMoon) ? null : planetObjects.find(p => p.mesh === hitMesh);
        const data    = isSun ? SUN_DATA : isMoon ? MOON_DATA : obj?.data;

        if (data) {
          container.style.cursor = 'pointer';
          hoveredRef.current = hitMesh;
          if (hitMesh.material.emissive)
            hitMesh.material.emissive.setHex(0x222233);
          // Highlight orbit if not already focused
          const hoverOrbit = isMoon ? moonOrbitRing : obj?.orbitLine || null;
          if (hoverOrbit && hoverOrbit !== focusedOrbit) {
            applyOrbit(hoverOrbit, ORBIT_HOVER);
            hoveredOrbit = hoverOrbit;
          }
          setTooltip({ name: data.name, x: e.clientX, y: e.clientY });
          return;
        }
      }

      container.style.cursor = 'grab';
      setTooltip(null);
    };

    // ── Resize ─────────────────────────────────────────────
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    // ── ESC to unfocus ─────────────────────────────────────
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && focusedRef.current) {
        unfocusRef.current = true;
        setSelectedPlanet(null);
      }
    };

    container.addEventListener('click', handleClick);
    container.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    // ── Cleanup ────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      controls.dispose();
      scene.background = null;
      skyTex.dispose();
      beltGeo.dispose();
      beltMat.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (obj.material.map)      obj.material.map.dispose();
          if (obj.material.alphaMap) obj.material.alphaMap.dispose();
          obj.material.dispose();
        }
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleSpeedChange = (e) => {
    const val = parseFloat(e.target.value);
    setSpeed(val);
    speedRef.current = val;
  };

  const handleZoomIn = () => {
    const cam  = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    const cur = cam.position.distanceTo(ctrl.target);
    zoomTargetRef.current = Math.max(ctrl.minDistance, cur * 0.8);
  };

  const handleZoomOut = () => {
    const cam  = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    const cur = cam.position.distanceTo(ctrl.target);
    zoomTargetRef.current = Math.min(ctrl.maxDistance, cur * 1.25);
  };

  const handleUnfocus = () => {
    unfocusRef.current = true;   // animation loop clears focus + triggers reset
    setSelectedPlanet(null);
  };

  const handleReset = () => {
    unfocusRef.current     = true;  // also exits any planet focus
    resetActiveRef.current = true;
    zoomTargetRef.current  = null;
    setSpeed(1);
    speedRef.current = 1;
  };

  // Determine label for the distance row
  const distanceLabel = selectedPlanet?.info?.distanceLabel || 'Attālums no Saules';

  return (
    <div className="ss-page">
      <div ref={mountRef} className="ss-canvas" />

      {/* Back button — shown while focused on a planet */}
      {focusedName && (
        <button className="ss-back-btn" onClick={handleUnfocus}>
          ← {focusedName}
        </button>
      )}

      {/* Hover tooltip */}
      {tooltip && (
        <div className="ss-tooltip" style={{ left: tooltip.x + 14, top: tooltip.y - 32 }}>
          {tooltip.name}
        </div>
      )}

      {/* Planet / Moon info panel */}
      <div className={`ss-panel${selectedPlanet ? ' ss-panel--open' : ''}`}>
        {selectedPlanet && (
          <>
            <button
              className="ss-panel-close"
              onClick={() => setSelectedPlanet(null)}
              aria-label="Aizvērt"
            >
              ✕
            </button>
            <h2 className="ss-panel-name">{selectedPlanet.name}</h2>
            <div className="ss-panel-divider" />
            <ul className="ss-stats">
              <li className="ss-stat">
                <span className="ss-stat-label">Diametrs</span>
                <span className="ss-stat-value">{selectedPlanet.info.diameter}</span>
              </li>
              <li className="ss-stat">
                <span className="ss-stat-label">{distanceLabel}</span>
                <span className="ss-stat-value">{selectedPlanet.info.distance}</span>
              </li>
              {selectedPlanet.info.moons !== '-' && (
                <li className="ss-stat">
                  <span className="ss-stat-label">Pavadoņi</span>
                  <span className="ss-stat-value">{selectedPlanet.info.moons}</span>
                </li>
              )}
              <li className="ss-stat">
                <span className="ss-stat-label">Orbītas periods</span>
                <span className="ss-stat-value">{selectedPlanet.info.orbit}</span>
              </li>
              <li className="ss-stat">
                <span className="ss-stat-label">Temperatūra</span>
                <span className="ss-stat-value">{selectedPlanet.info.temp}</span>
              </li>
            </ul>
            <div className="ss-fact">
              <span className="ss-fact-label">Interesants fakts</span>
              <p className="ss-fact-text">{selectedPlanet.info.fact}</p>
            </div>
          </>
        )}
      </div>

      {/* Left control panel */}
      <div className={`ss-ctrl-panel${panelOpen ? ' ss-ctrl-panel--open' : ''}`}>
        <button
          className="ss-ctrl-toggle"
          onClick={() => setPanelOpen(o => !o)}
          aria-label={panelOpen ? 'Aizvērt paneli' : 'Atvērt paneli'}
        >
          {panelOpen ? '‹' : '›'}
        </button>

        <div className="ss-ctrl-content">
          {/* Speed */}
          <div className="ss-ctrl-section">
            <div className="ss-ctrl-label">
              Ātrums
              <span className="ss-ctrl-value">
                {speed === 0 ? 'Pauze' : `${speed.toFixed(1)}×`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={speed}
              onChange={handleSpeedChange}
              className="ss-slider"
              style={{ '--fill': `${(speed / 5) * 100}%` }}
              aria-label="Simulācijas ātrums"
            />
          </div>

          {/* Zoom */}
          <div className="ss-ctrl-section">
            <div className="ss-ctrl-label">Tālummaiņa</div>
            <div className="ss-ctrl-zoom">
              <button className="ss-ctrl-btn" onClick={handleZoomIn} aria-label="Tuvināt">
                +
              </button>
              <button className="ss-ctrl-btn" onClick={handleZoomOut} aria-label="Tālināt">
                −
              </button>
            </div>
          </div>

          {/* Reset */}
          <div className="ss-ctrl-section">
            <button className="ss-ctrl-btn ss-ctrl-btn--full" onClick={handleReset}>
              Atiestatīt skatu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarSystem;
