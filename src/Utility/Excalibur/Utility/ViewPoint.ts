export type ViewPointModifiers = {
    getInsideAlpha?:()=>number,
    getOutsideAlpha?:()=>number,
    getAngle?: () => number,
    getRange?: () => number,
    getFalloff?: () => number,
}

export interface ViewPoint {
    drawViewPoint(ctx: CanvasRenderingContext2D, modifiers:ViewPointModifiers): void;
}