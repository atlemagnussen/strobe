import "router-slot"
import { StrobeVr } from "./views/strobeVr/strobe"
import "./views/about"

customElements.whenDefined("router-slot").then(() => {
    const routerSlot = document.querySelector("router-slot")
    if (!routerSlot)
        return
    routerSlot.add([
        {
            path: "home",
            component: StrobeVr
        },
        {
            path: "about",
            component: document.createElement("about-view")
        },
        {
            path: "**",
            redirectTo: "home"
        }
    ])
})