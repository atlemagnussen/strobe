interface VRButton {
    createButton: (renderer: any) => HTMLButtonElement
}
declare module "three/addons/webxr/VRButton.js" {
    export const VRButton: VRButton
}

declare module "three/addons/webxr/XRPlanes.js" {
    export class XRPlanes {
        constructor(renderer: any)
    }
}

declare module "three/addons/capabilities/WebGPU.js" {
    export function isAvailable(): boolean
}

declare module "three/addons/renderers/webgpu/WebGPURenderer.js" {
    export default class WebGPURenderer {
        constructor(parameters: any)
    }
}