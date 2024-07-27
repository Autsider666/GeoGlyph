export type ViewPointModifiers = {
    insideAlpha?:number,
    outsideAlpha?:number,
}

export interface ViewPoint {
    drawViewPoint(ctx: CanvasRenderingContext2D, modifiers:ViewPointModifiers): void;
}