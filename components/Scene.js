import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import React, {useEffect, useRef} from 'react'
import * as YUKA from 'yuka';
import * as THREE from 'three';


const Scene = () => {

    const coronaSafetyDistance = 4;

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

  let a = new THREE.Vector3();
  let b = new THREE.Vector3();

  let goal = new THREE.Object3D()
  let follow = new THREE.Object3D();

  let temp = new THREE.Vector3();
let dir = new THREE.Vector3();

useEffect(()=>{

goal.position.y = -coronaSafetyDistance;

goal.add(cameraRef.current);




vehicleRef.current.matrixAutoUpdate = false;
const vehicle = new YUKA.Vehicle();
vehicle.position.copy(path.current());
// vehicle.addS
vehicle.setRenderComponent(vehicleRef, sync);
vehicle.maxSpeed = 2
const pathFolloe = new YUKA.FollowPathBehavior(path, 4);
vehicle.steering.add(pathFolloe);
entityManager.add(vehicle)
},[])

const time = new YUKA.Time();

useFrame((state)=>{

    a.lerp(entityManager.entities[0].position, 0.4);
    b.copy(goal.position);

    dir.copy( a ).sub( b ).normalize();
    const dis = a.distanceTo( b ) - coronaSafetyDistance;
    goal.position.addScaledVector( dir, dis );
console.log(entityManager.entities[0].position.x)
state.camera.position.set(entityManager.entities[0].position.x, entityManager.entities[0].position.y+3, entityManager.entities[0].position.z)
    state.camera.lookAt(entityManager.entities[0].position.x, entityManager.entities[0].position.y, entityManager.entities[0].position.z);
    state.camera.updateProjectionMatrix();

    const d = time.update().getDelta();
    entityManager.update(d);
})

  return (
    <>
    <pointLight position={[50,10,4]}/>
    <ambientLight intensity={0.3} />
   <OrbitControls />
   <PerspectiveCamera ref={cameraRef} makeDefault position={[10,10,10]}/>
   <group ref={vehicleRef}>

    <mesh  position={[0,0.5,0]}>
        <boxGeometry args={[0.8,0.8, 1.2]} />
        <meshStandardMaterial color={'green'} />
    </mesh>
   </group>
    <mesh rotation={[ -Math.PI*0.5,0, 0]}>
        <planeGeometry args={[20,20]}/>
        <meshStandardMaterial color={'blue'}/>
    </mesh>
    </>
  )
}

export default Scene