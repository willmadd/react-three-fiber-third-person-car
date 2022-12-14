import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useRaycastVehicle } from "@react-three/cannon";
import { useControls } from "./useControls";
import { Wheel } from "./models/Wheel3";
import { CarBody } from "./models/CarOneBody";
// import Beetle from './Beetle'
import * as THREE from 'three';
function Vehicle({
  radius = 0.7,
  width = 0.7,
  height = -0.04,
  front = 0.79,
  back = -0.79,
  steer = 0.75,
  force = 6000,
  maxBrake = 1e5,
  ...props
}) {
  const chassis = useRef();
  const wheel1 = useRef();
  const wheel2 = useRef();
  const wheel3 = useRef();
  const wheel4 = useRef();
  const controls = useControls();

  const wheelInfo = {
    radius,
    directionLocal: [0, -1, 0],
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    maxSuspensionForce: 1e4,
    maxSuspensionTravel: 0.3,
    dampingRelaxation: 10,
    dampingCompression: 4.4,
    axleLocal: [-1, 0, 0],
    chassisConnectionPointLocal: [1, 0, 1],
    useCustomSlidingRotationalSpeed: true,
    customSlidingRotationalSpeed: -30,
    frictionSlip: 2,
  };

  const wheelInfo1 = {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [-width, height, front],
  };
  const wheelInfo2 = {
    ...wheelInfo,
    isFrontWheel: true,
    chassisConnectionPointLocal: [width, height, front],
  };
  const wheelInfo3 = {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [-width, height, back],
  };
  const wheelInfo4 = {
    ...wheelInfo,
    isFrontWheel: false,
    chassisConnectionPointLocal: [width, height, back],
  };

  const [vehicle, api] = useRaycastVehicle(() => ({
    chassisBody: chassis,
    wheels: [wheel1, wheel2, wheel3, wheel4],
    wheelInfos: [wheelInfo1, wheelInfo2, wheelInfo3, wheelInfo4],
    indexForwardAxis: 2,
    indexRightAxis: 0,
    indexUpAxis: 1,
  }));
  


  const calculateOffset = ({ position, rotation }, x, y, z) => {
    const offSet = new THREE.Vector3(x, y, z);
    offSet.applyQuaternion(rotation);
    offSet.add(position);
    return offSet;
  };



  useFrame((state, delta) => {
    // console.log('1234', props.camera);
    const { forward, backward, left, right, brake, reset } = controls.current;
    for (let e = 2; e < 4; e++)
      api.applyEngineForce(
        forward || backward ? force * (forward && !backward ? -1 : 1) : 0,
        2
      );
    for (let s = 0; s < 2; s++)
      api.setSteeringValue(
        left || right ? steer * (left && !right ? 1 : -1) : 0,
        s
      );
    for (let b = 2; b < 4; b++) api.setBrake(brake ? maxBrake : 0, b);
    if (reset) {
      chassis.current.api.position.set(0, 0.5, 0);
      chassis.current.api.velocity.set(0, 0, 0);
      chassis.current.api.angularVelocity.set(0, 0.5, 0);
      chassis.current.api.rotation.set(0, -Math.PI / 4, 0);
    }

   

  });




  return (
    <group ref={vehicle} position={[0, 0, 0]}>
      <CarBody
        ref={chassis}
        // rotation={props.rotation}
        position={props.position}
        angularVelocity={props.angularVelocity}
        scale={0.5}
        camera={'props.camera'}
      />
      <Wheel ref={wheel1} radius={radius} leftSide scale={0.5}/>
      <Wheel ref={wheel2} radius={radius}  scale={0.5} />
      <Wheel ref={wheel3} radius={radius} leftSide  scale={0.5} />
      <Wheel ref={wheel4} radius={radius}  scale={0.5}/>
    </group>
  );
}

export default Vehicle;
