import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const Scene = ({ children }) => {
    return (
        <Canvas
            camera={{
                position: [0, 0, 10],
            }}
        >
            <color attach="background" args={['#9dd0f1']} />
            <ambientLight intensity={2} />
            <directionalLight position={[-4, 3, 10]} intensity={5} />
            {children}
            <OrbitControls />
        </Canvas>
    );
};

export default Scene