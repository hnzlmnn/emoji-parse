import {Emoji} from './emoji'
import {getLogger} from './logging'
import {EmojiString} from './emojiString'

const log = getLogger('parser')

export interface EmojiComponent {
    symbol: Buffer,
    fitzpatrick?: Buffer,
    variation?: Buffer,
    needsJoiner?: boolean,
}

export type EmojiStruct = EmojiComponent[]

export class EmojiParser {

    private chars: Buffer[]
    private limit: number;

    private result?: Emoji[]
    private char: EmojiStruct = []
    private isVariation: boolean = false
    private isJoiner: boolean = false
    private wasJoiner: boolean = false

    constructor(text?: string, limit: number = 0) {
        this.chars = [...(text || '')].map((e) => Buffer.from(e, 'utf8'))
        this.limit = limit
    }

    public parse(): EmojiString {
        if (this.result !== undefined) {
            return new EmojiString(this.result)
        }
        this.result = []
        let i = 0
        while (i < this.chars.length) {
            if (this.chars[i].equals(Emoji.VARIATION_SELECTOR)) {
                this.onVariation(i > 0 ? this.chars[i - 1] : undefined, i + 1 < this.chars.length ? this.chars[i + 1] : undefined)
            } else if (this.chars[i].equals(Emoji.ZERO_WIDTH_JOINER)) {
                this.onJoiner()
            } else if (this.chars[i].equals(Emoji.FITZPATRICK_T1_2)
                || this.chars[i].equals(Emoji.FITZPATRICK_T3)
                || this.chars[i].equals(Emoji.FITZPATRICK_T4)
                || this.chars[i].equals(Emoji.FITZPATRICK_T5)
                || this.chars[i].equals(Emoji.FITZPATRICK_T6)
            ) {
                this.onFitzpatrick(this.chars[i])
            } else {
                if (this.onChar(this.chars[i])) break
            }
            i += 1
        }
        this.onEnd()
        return new EmojiString(this.result)
    }

    private onChar(char: Buffer) {
        log('onChar', this.isJoiner, this.wasJoiner, this.isVariation, char.toString('hex'), this.char)
        this.wasJoiner = false
        if (this.char.length === 0) {
            this.char.push({symbol: char})
        } else if (this.isVariation) {
            this.char[this.char.length - 1].variation = char
            this.char[this.char.length - 1].needsJoiner = this.isJoiner
            this.isVariation = false
            this.isJoiner = false
            this.wasJoiner = false
        } else if (!this.isJoiner) {
            this.result!.push(new Emoji(this.char))
            if (this.limit > 0 && this.result!.length) return true
            this.char = [{symbol: char}]
        } else if (this.isJoiner) {
            this.char.push({symbol: char})
            this.isJoiner = false
            this.wasJoiner = true
        }
        return false
    }

    private onFitzpatrick(char: Buffer) {
        log('onFitzpatrick', this.isJoiner, this.wasJoiner, this.isVariation)
        if (this.char.length === 0) {
            return
        }
        this.char[this.char.length - 1].fitzpatrick = char
    }

    private onVariation(prev?: Buffer, next?: Buffer) {
        log('onVariation', this.isJoiner, this.wasJoiner, this.isVariation)
        if (this.char.length > 1 && this.wasJoiner) {
            this.char[this.char.length - 2].variation = this.char[this.char.length - 1].symbol
            this.char.splice(this.char.length - 1, 1)
        } else {
            this.isVariation = true
        }
    }

    private onJoiner() {
        log('onJoiner', this.isJoiner, this.wasJoiner, this.isVariation)
        this.isJoiner = true
    }

    private onEnd() {
        log('onEnd', this.isJoiner, this.wasJoiner, this.isVariation)
        if (this.char.length === 0) {
            return
        }
        if (this.isVariation) {
            this.char[this.char.length - 1]
        }
        this.result!.push(new Emoji(this.char))
    }

}
