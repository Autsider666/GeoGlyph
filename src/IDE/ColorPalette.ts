import {Color} from "excalibur";

export class ColorPalette {
    static readonly backgroundDark: string = '#27393f';
    static readonly backgroundDarkColor: Color = Color.fromHex(this.backgroundDark);
    static readonly backgroundLight: string = '#649092';
    static readonly backgroundLightColor: Color = Color.fromHex(this.backgroundLight);
    static readonly accentDark: string = '#6f535b';
    static readonly accentDarkColor: Color = Color.fromHex(this.accentDark);
    static readonly accentLight: string = '#cfc89d';
    static readonly accentLightColor: Color = Color.fromHex(this.accentLight);
}