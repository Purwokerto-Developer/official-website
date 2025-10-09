import { Center, Resize, Text3D } from '@react-three/drei';

type BadgeTextureProps = {
  user: { firstName: string; lastName: string };
  resizeId: number;
};

export default function BadgeTexture({ user, resizeId }: BadgeTextureProps) {
  return (
    <>
      <color attach="background" args={['#000']} /> {/* Background hitam */}
      <Center bottom right>
        <Resize key={resizeId} scale={[0.925, 0.45, 1]}>
          <Text3D
            font="/font/Geist_Regular.json"
            bevelEnabled={false}
            bevelSize={0}
            height={0}
            rotation={[0, Math.PI, Math.PI]}
          >
            {user.firstName}
          </Text3D>
          <Text3D
            font="/font/Geist_Regular.json"
            bevelEnabled={false}
            bevelSize={0}
            height={0}
            position={[0, 1.4, 0]}
            rotation={[0, Math.PI, Math.PI]}
          >
            {user.lastName}
          </Text3D>
        </Resize>
      </Center>
    </>
  );
}
