import {emojify} from 'node-emoji'
import {Emoji, IEmoji} from './emoji'
import {EmojiParser} from './emojiParser'
import {getLogger} from './logging'
import {n2es} from './utils'

const log = getLogger('string')

export type MapCallback<T, U = any> = (value: T, index: number, array: T[]) => U

export class EmojiString implements IEmoji, Iterable<Emoji> {

    private emojis: Emoji[]

    constructor(emojis: Emoji[]) {
        this.emojis = emojis
    }

    get length() {
        return this.emojis.length
    }

    public static parse(emoji?: string, limit: number = -1) {
        return new EmojiParser(emoji, limit).parse()
    }

    public static emojify(text: string,
                          includeVariation: boolean = Emoji.INCLUDE_VARIATION,
                          includeFitzpatrick: boolean = Emoji.INCLUDE_FITZPATRICK) {
        // TODO: Add custom emoji using emojilib as not all emoji names are equal
        return emojify(
            text,
            (name) => `:${name}:`,
            (code, name) => Emoji.parse(code).toString(
                'utf8',
                includeVariation,
                includeFitzpatrick,
            ),
        )
    }

    public static fromNumber(number: number) {
        return EmojiString.parse(EmojiString.emojify(n2es(number)))
    }

    public map<U = any>(cb: MapCallback<Emoji, U>, thisArg?: any): U[] {
        return this.emojis.map((cb), thisArg)
    }

    public [Symbol.iterator](): Iterator<Emoji> {
        let pointer = 0
        const emojis = this.emojis

        return {
            next(): IteratorResult<Emoji> {
                if (pointer < emojis.length) {
                    return {
                        done: false,
                        value: emojis[pointer++],
                    }
                } else {
                    return {
                        done: true,
                        value: null as any,
                    }
                }
            },
        }
    }

    public emojiAt(i: number) {
        if (i < 0 || i >= this.emojis.length) {
            throw Error('Array index out of bounds excpetion')
        }
        return this.emojis[i]
    }

    public equals(emoji: IEmoji,
                  includeVariation: boolean = Emoji.INCLUDE_VARIATION,
                  includeFitzpatrick: boolean = Emoji.INCLUDE_FITZPATRICK): boolean {
        return this.toBuffer(includeVariation, includeFitzpatrick).equals(emoji.toBuffer(includeVariation, includeFitzpatrick))
    }

    public toBuffer(includeVariation: boolean = Emoji.INCLUDE_VARIATION,
                    includeFitzpatrick: boolean = Emoji.INCLUDE_FITZPATRICK): Buffer {
        return this.emojis
            .map((emoji: Emoji) => emoji.toBuffer(includeVariation, includeFitzpatrick))
            .reduce((prev, buf: Buffer) => Buffer.concat([prev, buf]),
                Buffer.from(''),
            )
    }

    public toString(encoding: 'utf8' | 'utf16' | 'hex' = 'utf8',
                    includeVariation: boolean = Emoji.INCLUDE_VARIATION,
                    includeFitzpatrick: boolean = Emoji.INCLUDE_FITZPATRICK): string {
        return this.toBuffer(includeVariation, includeFitzpatrick).toString(encoding)
    }
}
