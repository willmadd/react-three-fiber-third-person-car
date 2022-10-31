import React, { forwardRef } from "react";
import { useCylinder } from '@react-three/cannon'

const Wheel = ({ radius = 0.7, leftSide, ...props }, ref) => {

    useCylinder(() => ({ mass: 1, type: 'Kinematic', material: 'wheel', collisionFilterGroup: 0, args: [radius, radius, 0.5, 16], ...props }), ref)

  return (
    <mesh ref={ref}>
      <boxGeometry args={[3, 3, 1]} />
      <meshStandardMaterial color={"red"} />
    </mesh>
  );
};

export default forwardRef(Wheel);
