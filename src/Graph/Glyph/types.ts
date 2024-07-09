type Alphabet = string[];

type Character<A extends Alphabet> = keyof A;

export type GlyphOptions<A extends Alphabet> = {
    dimensions: {
        height: number,
        width: number,
    },
    defaultAlphabet: Character<A>,
}

export type GlyphAlphabet = {
    name: string,
    edge?: boolean,
    color: string,
}

export type GlyphRule = {
    from: string,
    to: string,
}

export type GlyphRecipeInstruction = {
    rule: string,
    repeat?: number,
}

export type GlyphRecipe = GlyphRecipeInstruction[];

export type GlyphModule = {
    rules: Record<string, GlyphRule>,
    recipes: Record<string, GlyphRecipe>,
};

export type GlyphPipeline<A extends Alphabet> = {
    alphabet: Record<Character<A>, GlyphAlphabet>,
    options: GlyphOptions<A>,
    modules: Record<string, GlyphModule>
}