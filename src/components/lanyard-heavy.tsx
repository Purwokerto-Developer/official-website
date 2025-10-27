'use client';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Environment, Lightformer, useGLTF, useTexture, Text } from '@react-three/drei';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  RigidBodyProps,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  user?: {
    firstName: string;
    username?: string;
  };
  cardColor?: string;
  cardTexture?: any;
}

export default function HeavyLanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  user,
  cardColor = '#2a5ad7',
  cardTexture,
}: LanyardProps) {
  useEffect(() => {
    try {
      import('@react-three/drei').then((drei) => {
        try {
          (drei as any).useGLTF?.preload?.('/3d/tag.gltf');
          (drei as any).useTexture?.preload?.('/3d/texture.png');
        } catch (e) {
          // ignore
        }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  // detect mobile at wrapper level to adjust container height/padding
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <div
      className="relative z-0 flex w-full items-center justify-center px-4"
      style={{ height: 500 }}
    >
      <Canvas
        camera={{ position, fov }}
        gl={{ alpha: transparent, antialias: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={1 / 60}>
          <Band user={user} cardColor={cardColor} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  user?: {
    firstName: string;
    username?: string;
  };
  cardColor?: string;
  cardTexture?: any;
}

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  user,
  cardColor = '#2a5ad7',
  cardTexture,
}: BandProps) {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vecRef = useRef(new THREE.Vector3());
  const angRef = useRef(new THREE.Vector3());
  const rotRef = useRef(new THREE.Vector3());
  const dirRef = useRef(new THREE.Vector3());

  const segmentProps: any = {
    type: 'dynamic' as RigidBodyProps['type'],
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF('/3d/tag.gltf') as any;
  const texture = useTexture('/3d/texture.png');
  const curve = useRef(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]),
  ).current;
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  const [isSmall, setIsSmall] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });
  const isTablet = useMediaQuery('(max-width: 1080px)');
  const isMobile = useMediaQuery('(max-width: 640px)');
  useEffect(() => {
    const handleResize = (): void => {
      requestAnimationFrame(() => setIsSmall(window.innerWidth < 1024));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return (): void => window.removeEventListener('resize', handleResize);
  }, []);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    const vec = vecRef.current;
    const dir = dirRef.current;
    const ang = angRef.current;
    const rot = rotRef.current;

    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped)
          ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())),
        );
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  const [resizeId, setResizeId] = useState(0);

  useEffect(() => {
    // misalnya kalau nama user berubah, reset Resize
    setResizeId((prev) => prev + 1);
  }, [user?.firstName, user?.username]);

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type={'fixed' as RigidBodyProps['type']} />
        <RigidBody
          position={[0.5, 0, 0]}
          ref={j1}
          {...segmentProps}
          type={'dynamic' as RigidBodyProps['type']}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1, 0, 0]}
          ref={j2}
          {...segmentProps}
          type={'dynamic' as RigidBodyProps['type']}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1.5, 0, 0]}
          ref={j3}
          {...segmentProps}
          type={'dynamic' as RigidBodyProps['type']}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={
            dragged
              ? ('kinematicPosition' as RigidBodyProps['type'])
              : ('dynamic' as RigidBodyProps['type'])
          }
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vecRef.current.copy(card.current.translation())),
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              {/* Layer 1: base color */}
              <meshPhysicalMaterial
                color={cardColor}
                map={cardTexture}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={16}
                transparent={true}
                opacity={1}
                color={'#fff'}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            {user &&
              (() => {
                const name = user.firstName;
                const username = user.username || '';

                let fontSize = 0.05;
                const maxWidth = 0.45;

                const estimatedNameLines = Math.ceil(name.length / 14);
                if (estimatedNameLines > 2) fontSize = 0.04;

                const nameHeight = fontSize * estimatedNameLines;
                const usernameHeight = username ? fontSize * 0.7 : 0;
                const gap = fontSize * 0.5;

                const totalBlockHeight = nameHeight + gap + usernameHeight;

                const blockCenterY = 0.26;
                const startY = blockCenterY + totalBlockHeight / 2;

                const x = -0.32;

                return (
                  <>
                    <Text
                      position={[x, startY, 0.06]}
                      fontSize={fontSize}
                      color="white"
                      anchorX="left"
                      anchorY="top"
                      maxWidth={maxWidth}
                      fontWeight={700}
                    >
                      {name}
                    </Text>

                    {username && (
                      <Text
                        position={[x, startY - nameHeight - gap, 0.06]}
                        fontSize={fontSize * 0.7}
                        color="white"
                        anchorX="left"
                        anchorY="top"
                        maxWidth={maxWidth}
                        fontWeight={500}
                      >
                        {username}
                      </Text>
                    )}
                  </>
                );
              })()}

            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isSmall ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-2.5, 1]}
          lineWidth={isMobile ? 0.85 : isTablet ? 0.48 : 1.5}
        />
      </mesh>
    </>
  );
}
