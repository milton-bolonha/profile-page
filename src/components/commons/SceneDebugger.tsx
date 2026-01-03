import React, { useState, useEffect } from 'react';
import { FaCamera, FaLightbulb, FaCube, FaEye, FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface SceneDebuggerProps {
    onUpdateCamera: (params: any) => void;
    onUpdateLights: (params: any) => void;
    onUpdateMaterial: (params: any) => void;
    onUpdateMesh: (params: any) => void;
    initialValues: any;
}

export const SceneDebugger: React.FC<SceneDebuggerProps> = ({
    onUpdateCamera,
    onUpdateLights,
    onUpdateMaterial,
    onUpdateMesh,
    initialValues
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'camera' | 'lights' | 'material' | 'mesh'>('camera');
    const [values, setValues] = useState(initialValues);

    useEffect(() => {
        setValues(initialValues);
    }, [initialValues]);

    const handleChange = (category: string, key: string, value: number | boolean) => {
        const newValues = {
            ...values,
            [category]: {
                ...values[category],
                [key]: value
            }
        };
        setValues(newValues);

        if (category === 'camera') onUpdateCamera(newValues.camera);
        if (category === 'lights') onUpdateLights(newValues.lights);
        if (category === 'material') onUpdateMaterial(newValues.material);
        if (category === 'mesh') onUpdateMesh(newValues.mesh);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 left-4 z-[200] bg-black/80 text-white p-3 rounded-full border border-white/20 hover:bg-white/20 transition-all shadow-lg"
            >
                <FaCube />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 left-4 z-[200] w-80 bg-black/90 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl overflow-hidden text-xs font-mono text-white/80">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
                <span className="font-bold uppercase tracking-wider text-green-400">Scene Debugger</span>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:text-white"
                >
                    <FaChevronDown />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setActiveTab('camera')}
                    className={`flex-1 p-2 flex items-center justify-center gap-2 hover:bg-white/5 ${activeTab === 'camera' ? 'text-white bg-white/10 border-b-2 border-green-500' : ''}`}
                >
                    <FaCamera /> Cam
                </button>
                <button
                    onClick={() => setActiveTab('lights')}
                    className={`flex-1 p-2 flex items-center justify-center gap-2 hover:bg-white/5 ${activeTab === 'lights' ? 'text-white bg-white/10 border-b-2 border-yellow-500' : ''}`}
                >
                    <FaLightbulb /> Lit
                </button>
                <button
                    onClick={() => setActiveTab('material')}
                    className={`flex-1 p-2 flex items-center justify-center gap-2 hover:bg-white/5 ${activeTab === 'material' ? 'text-white bg-white/10 border-b-2 border-blue-500' : ''}`}
                >
                    <FaCube /> Mat
                </button>
                <button
                    onClick={() => setActiveTab('mesh')}
                    className={`flex-1 p-2 flex items-center justify-center gap-2 hover:bg-white/5 ${activeTab === 'mesh' ? 'text-white bg-white/10 border-b-2 border-red-500' : ''}`}
                >
                    <FaEye /> Mesh
                </button>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[400px] overflow-y-auto space-y-4">

                {/* CAMERA */}
                {activeTab === 'camera' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label>Free Camera Control</label>
                            <input
                                type="checkbox"
                                checked={values.camera.isFree}
                                onChange={(e) => handleChange('camera', 'isFree', e.target.checked)}
                            />
                        </div>
                        {values.camera.isFree && (
                            <div className="text-white/50 italic p-2 bg-white/5 rounded">
                                Use Left Mouse to Rotate, Right to Pan, Scroll to Zoom.
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="flex justify-between">FOV <span>{values.camera.fov}</span></label>
                            <input
                                type="range" min="10" max="120" value={values.camera.fov}
                                onChange={(e) => handleChange('camera', 'fov', Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>
                )}

                {/* LIGHTS */}
                {activeTab === 'lights' && (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="flex justify-between text-yellow-200">Ambient Intensity <span>{values.lights.ambientIntensity}</span></label>
                            <input
                                type="range" min="0" max="10" step="0.1" value={values.lights.ambientIntensity}
                                onChange={(e) => handleChange('lights', 'ambientIntensity', Number(e.target.value))}
                                className="w-full accent-yellow-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="flex justify-between text-blue-200">Dir Light Intensity <span>{values.lights.dirIntensity}</span></label>
                            <input
                                type="range" min="0" max="10" step="0.1" value={values.lights.dirIntensity}
                                onChange={(e) => handleChange('lights', 'dirIntensity', Number(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="flex justify-between text-orange-200">Warm Light Intensity <span>{values.lights.warmIntensity}</span></label>
                            <input
                                type="range" min="0" max="20" step="0.1" value={values.lights.warmIntensity}
                                onChange={(e) => handleChange('lights', 'warmIntensity', Number(e.target.value))}
                                className="w-full accent-orange-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="flex justify-between text-white">Point Light (Flash) <span>{values.lights.pointIntensity}</span></label>
                            <input
                                type="range" min="0" max="20" step="0.1" value={values.lights.pointIntensity}
                                onChange={(e) => handleChange('lights', 'pointIntensity', Number(e.target.value))}
                                className="w-full accent-white"
                            />
                        </div>
                    </div>
                )}

                {/* MATERIAL */}
                {activeTab === 'material' && (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="flex justify-between text-gray-300">Metalness <span>{values.material.metalness}</span></label>
                            <input
                                type="range" min="0" max="1" step="0.05" value={values.material.metalness}
                                onChange={(e) => handleChange('material', 'metalness', Number(e.target.value))}
                                className="w-full accent-gray-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="flex justify-between text-gray-300">Roughness <span>{values.material.roughness}</span></label>
                            <input
                                type="range" min="0" max="1" step="0.05" value={values.material.roughness}
                                onChange={(e) => handleChange('material', 'roughness', Number(e.target.value))}
                                className="w-full accent-gray-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="flex justify-between text-blue-300">Opacity (Transparency) <span>{values.material.opacity}</span></label>
                            <input
                                type="range" min="0" max="1" step="0.05" value={values.material.opacity}
                                onChange={(e) => handleChange('material', 'opacity', Number(e.target.value))}
                                className="w-full accent-blue-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="flex justify-between text-red-300">Emissive Intensity <span>{values.material.emissiveIntensity}</span></label>
                            <input
                                type="range" min="0" max="5" step="0.1" value={values.material.emissiveIntensity}
                                onChange={(e) => handleChange('material', 'emissiveIntensity', Number(e.target.value))}
                                className="w-full accent-red-500"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label>Wireframe</label>
                            <input
                                type="checkbox"
                                checked={values.material.wireframe}
                                onChange={(e) => handleChange('material', 'wireframe', e.target.checked)}
                            />
                        </div>
                    </div>
                )}

                {/* MESH */}
                {activeTab === 'mesh' && (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="flex justify-between text-red-300">Rotation Y <span>{values.mesh?.rotationY?.toFixed(2)}</span></label>
                            <input
                                type="range" min="-3.14" max="3.14" step="0.01" value={values.mesh?.rotationY || 0}
                                onChange={(e) => handleChange('mesh', 'rotationY', Number(e.target.value))}
                                className="w-full accent-red-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="flex justify-between text-red-300">Position X <span>{values.mesh?.positionX?.toFixed(2)}</span></label>
                            <input
                                type="range" min="-10" max="10" step="0.1" value={values.mesh?.positionX || 0}
                                onChange={(e) => handleChange('mesh', 'positionX', Number(e.target.value))}
                                className="w-full accent-red-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="flex justify-between text-red-300">Position Y <span>{values.mesh?.positionY?.toFixed(2)}</span></label>
                            <input
                                type="range" min="-10" max="10" step="0.1" value={values.mesh?.positionY || 0}
                                onChange={(e) => handleChange('mesh', 'positionY', Number(e.target.value))}
                                className="w-full accent-red-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="flex justify-between text-red-300">Position Z <span>{values.mesh?.positionZ?.toFixed(2)}</span></label>
                            <input
                                type="range" min="-10" max="10" step="0.1" value={values.mesh?.positionZ || 0}
                                onChange={(e) => handleChange('mesh', 'positionZ', Number(e.target.value))}
                                className="w-full accent-red-500"
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
