import React, { useRef } from 'react'
import { Physics, useCylinder, usePlane } from '@react-three/cannon'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import Vehicle from './Vehicle';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three'
import SelfDriveGround from './SelfDriveGround';


const SelfDriveScene = () => {


  return (
    <>
    <pointLight position={[1,12,0]}/>
    <ambientLight />
    <OrbitControls />
    {/* <PerspectiveCamera ref={cameraRef} makeDefault position={[0,50,-50]}/> */}
    {/* <Plane rotation={[-Math.PI / 2, 0, 0]} userData={{ id: 'floor' }}  /> */}
    <SelfDriveGround />
    <Vehicle/>
    {/* <CarBody /> */}
    </>
  )
}

export default SelfDriveScene