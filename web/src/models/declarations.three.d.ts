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
