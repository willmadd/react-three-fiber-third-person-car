import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as YUKA from "yuka";
import * as THREE from "three";

const SceneTwo = () => {
  const vehicleRef = useRef(null);

  const cameraRef = useRef(null);

  const entityManager = new YUKA.EntityManager();

  const path = new YUKA.Path();

  path.add(new YUKA.Vector3(8, 0, 8));
  path.add(new YUKA.Vector3(-8, 0, 8));
  path.add(new YUKA.Vector3(-8, 0, -8));
  path.add(new YUKA.Vector3(8, 0, -8));

  path.loop = true;

  const sync = (entity, renderComponent) => {
    renderComponent.current.matrix.copy(entity.worldMatrix);
  };

  useEffect(() => {
    vehicleRef.current.matrixAutoUpdate = false;
    const vehicle = new YUKA.Vehicle();
    vehicle.position.copy(path.current());
    // vehicle.addS
    vehicle.setRenderComponent(vehicleRef, sync);
    vehicle.maxSpeed = 4;
    vehicle.mass = 0.2;
    const pathFolloe = new YUKA.FollowPathBehavior(path, 2);
    vehicle.steering.add(pathFolloe);
    entityManager.add(vehicle);
  }, []);

  const time = new YUKA.Time();

  let currentPosition = new THREE.Vector3();
  let currentLookAt = new THREE.Vector3();

  const calculateOffset = ({ position, rotation }, x, y, z) => {
    console.log(rotation)
    const offSet = new THREE.Vector3(x, y, z);
    offSet.applyQuaternion(rotation);
    offSet.add(position);
    return offSet;
  };

  useFrame((state, delta) => {
    let cameraPositionOffset = calculateOffset(
      entityManager.entities[0],
      0,
      2,
      -4
    );
    let cameraFocusOffset  = calculateOffset(entityManager.entities[0], 0, 1, 2);
    const t = 1.0 - Math.pow(0.0025, delta);
    currentPosition.lerp(cameraPositionOffset, t);

    currentLookAt.copy(cameraFocusOffset, t);

    cameraRef.current.position.copy(currentPosition);

    state.camera.lookAt(currentLookAt);
    state.camera.updateProjectionMatrix();

    const d = time.update().getDelta();
    entityManager.update(d);
  });

  return (
    <>
      <pointLight position={[50, 10, 4]} />
      <ambientLight intensity={0.3} />
      <OrbitControls />
      <PerspectiveCamera ref={cameraRef} makeDefault position={[10, 10, 10]} />
      <group ref={vehicleRef}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.8, 0.8, 1.2]} />
          <meshStandardMaterial color={"yellow"} />
        </mesh>
      </group>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color={"blue"} />
      </mesh>
    </>
  );
};

export default SceneTwo;
