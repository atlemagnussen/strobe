declare module "*.css" {
    const content: Record<string, string>;
    export default content;
}

declare module "*.css&inline" {
    const content: Record<string, string>;
    export default content;
}

declare module "@thednp/color-picker/dist/css/color-picker.css?inline" {
    const content: string
    export default content
}