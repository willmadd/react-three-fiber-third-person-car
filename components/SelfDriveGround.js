import React, { useRef, useMemo } from "react";
import { Physics, useCylinder, usePlane } from "@react-three/cannon";
import {
  OrbitControls,
  PerspectiveCamera,
  Sky,
  Stars,
} from "@react-three/drei";
import Vehicle from "./Vehicle";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Tree } from "./models/Tree";

const SelfDriveGround = () => {
  const Plane = (props) => {
    const [ref] = usePlane(() => ({
      type: "Static",
      material: "ground",
      ...props,
    }));
    return (
      <group ref={ref}>
        <mesh receiveShadow>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </group>
    );
  };

  const treeSeed = useMemo(() => {
    const trees = [];
    for (let i = 0; i < 100; i++) {
      const rndPos = [
        Math.floor(Math.random() * 200) - 100,
        0,
        Math.floor(Math.random() * 200) - 100,
      ];
      trees.push({ pos: rndPos, rotation: Math.floor(Math.random() * 200) });
    }
    return trees;
  });

  return (
    <>
      <Sky />
      {/* <Stars /> */}
      <Plane rotation={[-Math.PI / 2, 0, 0]} userData={{ id: "floor" }} />
      {treeSeed.map((tree) => {
        return <Tree position={tree.pos} rotation-y={tree.rotation} />;
      })}
    </>
  );
};

export default SelfDriveGround;
