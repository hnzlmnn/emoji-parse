import * as emojilib from 'emojilib'
import {EmojiComponent, EmojiStruct} from './emojiParser'
import {EmojiString} from './emojiString'
import {getLogger} from './logging'

const log = getLogger('emoji')

export interface EmojiVariation {
    symbol: Buffer
    variation?: Buffer
    needsJoiner?: boolean
}

export interface IEmoji {
    toBuffer(includeVariation: boolean,
             includeFitzpatrick: boolean): Buffer

    toString(encoding: 'utf8' | 'utf16' | 'hex',
             includeVariation: boolean,
             includeFitzpatrick: boolean): string

    equals(emoji: IEmoji,
           includeVariation: boolean,
           includeFitzpatrick: boolean): boolean
}

export class Emoji implements IEmoji {

    public static INCLUDE_VARIATION: boolean = true
    public static INCLUDE_FITZPATRICK: boolean = true

    public static readonly ZERO_WIDTH_JOINER = Buffer.from('e2808d', 'hex')
    public static readonly VARIATION_SELECTOR = Buffer.from('efb88f', 'hex')
    public static readonly FITZPATRICK_T1_2 = Buffer.from('f09f8fbb', 'hex')
    public static readonly FITZPATRICK_T3 = Buffer.from('f09f8fbc', 'hex')
    public static readonly FITZPATRICK_T4 = Buffer.from('f09f8fbd', 'hex')
    public static readonly FITZPATRICK_T5 = Buffer.from('f09f8fbe', 'hex')
    public static readonly FITZPATRICK_T6 = Buffer.from('f09f8fbf', 'hex')
    private symbols: EmojiStruct

    constructor(symbols: EmojiStruct) {
        this.symbols = symbols
    }

    public static toBuffer(emoji: EmojiComponent,
                           includeVariation: boolean = Emoji.INCLUDE_VARIATION,
                           includeFitzpatrick: boolean = Emoji.INCLUDE_FITZPATRICK) {
        if (emoji === undefined) {
            return Buffer.from('')
        }
        const data = [
            emoji.symbol,
        ]
        if (includeFitzpatrick && emoji.fitzpatrick !== undefined) {
            data.push(emoji.fitzpatrick)
        }
        if (emoji.variation === undefined || (!includeVariation && emoji.variation.length > 0)) {
            // Do nothing
        } else if (emoji.variation.length === 0) {
            data.push(Emoji.VARIATION_SELECTOR)
        } else if (!!emoji.needsJoiner) {
            data.push(Emoji.VARIATION_SELECTOR)
            data.push(Emoji.ZERO_WIDTH_JOINER)
            data.push(emoji.variation as Buffer)
        } else {
            data.push(Emoji.ZERO_WIDTH_JOINER)
            data.push(emoji.variation as Buffer)
            data.push(Emoji.VARIATION_SELECTOR)
        }
        return Buffer.concat(data)
    }

    public static get(name: string): Emoji {
        const unicode = (emojilib as any).lib[name]
        if (unicode === undefined) {
            return new Emoji([])
        }
        return Emoji.parse(unicode.char)
    }

    public static parse(emoji?: string) {
        return (EmojiString.parse(emoji, 1)).emojiAt(0)
    }

    public toBuffer(includeVariation: boolean = Emoji.INCLUDE_VARIATION,
                    includeFitzpatrick: boolean = Emoji.INCLUDE_FITZPATRICK): Buffer {
        return this.symbols
            .map((symbol: EmojiComponent) => Emoji.toBuffer(symbol, includeVariation))
            .reduce((prev, buf: Buffer) => Buffer.concat(prev.length === 0 ? [buf] : [prev, Emoji.ZERO_WIDTH_JOINER, buf]),
                Buffer.from(''),
            )
    }

    public toString(encoding: 'utf8' | 'utf16' | 'hex' = 'utf8',
                    includeVariation: boolean = Emoji.INCLUDE_VARIATION,
                    includeFitzpatrick: boolean = Emoji.INCLUDE_FITZPATRICK): string {
        return this.toBuffer(includeVariation).toString(encoding)
    }

    public equals(emoji: Emoji,
                  includeVariation: boolean = Emoji.INCLUDE_VARIATION,
                  includeFitzpatrick: boolean = Emoji.INCLUDE_FITZPATRICK): boolean {
        return this.toBuffer(includeVariation, includeFitzpatrick)
            .equals(emoji.toBuffer(includeVariation, includeFitzpatrick))
    }
}
