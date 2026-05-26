import { useRef, useEffect, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

const ANIM_MAP = {
    IDLE: 'humanf@bowidle01',
    WALK_FORWARD: 'humanf@Run01_Forward',
};

const Player = () => {
    const group = useRef();
    const { scene, animations } = useGLTF('/models/character/character.glb');
    const { actions } = useAnimations(animations, group);
    
    const [, get] = useKeyboardControls();
    
    const [currentAction, setCurrentAction] = useState(ANIM_MAP.IDLE);
    const speed = 7.5;
    const rotationSpeed = 15;
    
    const velocity = useRef(new THREE.Vector3());

    // Helper to robustly find an animation by name or fallback
    const getActionName = useCallback((targetName) => {
        if (!actions) return null;
        if (actions[targetName]) return targetName;
        // Fallback: search for partial match
        const key = Object.keys(actions).find(k => k.toLowerCase().includes(targetName.toLowerCase()));
        return key || Object.keys(actions)[0];
    }, [actions]);

    // Enable shadows for the character
    useEffect(() => {
        scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene]);

    // Handle Animation transitions
    useEffect(() => {
        if (!actions) return;
        
        const animName = getActionName(currentAction);
        if (animName && actions[animName]) {
            actions[animName].reset().fadeIn(0.2).play();
            return () => {
                actions[animName]?.fadeOut(0.2);
            };
        }
    }, [currentAction, actions, getActionName]);

    useFrame((state, delta) => {
        if (!group.current) return;

        const { forward, backward, left, right } = get();

        // Calculate input direction relative to the world
        const inputDir = new THREE.Vector3(0, 0, 0);
        if (forward) inputDir.z -= 1;
        if (backward) inputDir.z += 1;
        if (left) inputDir.x -= 1;
        if (right) inputDir.x += 1;

        if (inputDir.lengthSq() > 0) {
            inputDir.normalize();

            // Calculate velocity
            velocity.current.copy(inputDir).multiplyScalar(speed * delta);
            
            // Apply position
            group.current.position.add(velocity.current);

            // Calculate target rotation to face movement direction
            const targetRotation = Math.atan2(inputDir.x, inputDir.z);
            
            // Smoothly rotate the character towards movement direction
            let diff = targetRotation - group.current.rotation.y;
            // Normalize angle to be between -PI and PI
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            
            group.current.rotation.y += diff * Math.min(rotationSpeed * delta, 1);

            if (currentAction !== ANIM_MAP.WALK_FORWARD) {
                setCurrentAction(ANIM_MAP.WALK_FORWARD);
            }
        } else {
            if (currentAction !== ANIM_MAP.IDLE) {
                setCurrentAction(ANIM_MAP.IDLE);
            }
        }
    });

    return (
        <group ref={group} position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
            <primitive object={scene} scale={1.5} />
            
            {/* Halo Ground Effect */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                <planeGeometry args={[1.2, 1.2]} />
                <meshBasicMaterial 
                    color="#006699" 
                    transparent 
                    depthWrite={false} 
                    blending={THREE.AdditiveBlending} 
                    opacity={0.6} 
                />
            </mesh>
        </group>
    );
};

useGLTF.preload('/models/character/character.glb');

export default Player;
