import {expect} from 'chai'
import 'mocha'
import {Emoji} from './emoji'
import {EmojiString} from "./emojiString";

describe('Emoji class', () => {

    it('should strip the variation modifier', () => {
        expect(
            Emoji.get('woman_shrugging').toString('utf8', false),
        ).to.equal(
            Emoji.get('man_shrugging').toString('utf8', false),
        )
    })

    it('should convert numbers correctly', () => {
        expect(
            EmojiString.fromNumber(42).toString('utf8', false),
        ).to.equal(
            '42',
        )
    })

})
