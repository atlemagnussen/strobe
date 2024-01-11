import { BehaviorSubject } from "rxjs"

let localStorageAvailable = (typeof localStorage !== 'undefined') 

let initialValue: ConfigStore = { flickerHz: 7.83, lightColor: "#AAA" }

if (localStorageAvailable) {
    const savedConfig = localStorage.getItem("config")
    if (savedConfig) {
        try {
            const confParsed = JSON.parse(savedConfig)
            Object.assign(initialValue, confParsed)
        }
        catch(err) {}
    }
}

interface ConfigStore {
    flickerHz: number
    lightColor: string
}

const configSubject = new BehaviorSubject<ConfigStore>(initialValue)
export const config = configSubject.asObservable()

export function getCurrentConfig() {
    const current = configSubject.value
    return current
}

export function setFlickerHz(flicker: number) {
    const newConfig = configSubject.value
    newConfig.flickerHz = flicker
    configSubject.next(newConfig)
    saveConfig()
}
export function setLightColor(color: string) {
    const newConfig = configSubject.value
    newConfig.lightColor = color
    configSubject.next(newConfig)
    saveConfig()
}


function saveConfig() {
    if (!localStorageAvailable)
        return
    const valueStr = JSON.stringify(configSubject.value)
    localStorage.setItem("config", valueStr)
}