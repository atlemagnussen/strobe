import "router-slot"
import { StrobeVr } from "./views/strobeVr/strobe"
import "./views/home"
import "./views/about"
import "./views/canvas/canvas"
import "./views/canvas/canvas.present"

customElements.whenDefined("router-slot").then(() => {
    const routerSlot = document.querySelector("router-slot")
    if (!routerSlot)
        return
    routerSlot.add([
        {
            path: "home",
            component: document.createElement("home-view")
        },
        {
            path: "xr",
            component: StrobeVr
        },
        {
            path: "canvas",
            component: document.createElement("strobe-canvas")
        },  
        {
            path: "about",
            component: document.createElement("about-view")
        },
        {
            "path": "present",
            component: document.createElement("canvas-present")
        },
        {
            path: "**",
            redirectTo: "home"
        }
    ])
})