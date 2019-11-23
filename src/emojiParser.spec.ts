import {expect} from 'chai'
import 'mocha'
import {EmojiString} from "./emojiString";

describe('Emoji parser validity', () => {

    [
        {
            should: 'parse normal emojis',
            hex: 'f09fa684',
        },
        {
            should: 'parse joined emojis',
            hex: 'f09f91a8e2808df09f91a9e2808df09f91a7e2808df09f91a7',
        },
        {
            should: 'parse gendered emojis',
            hex: 'f09fa4bce2808de29980efb88f',
        },
        {
            should: 'parse gendered emojis followed by other emojis',
            hex: 'f09fa4bce2808de29980efb88ff09fa684',
        },
        {
            should: 'parse flag emojis',
            hex: 'f09f8fb3efb88fe2808df09f8c88',
        },
        {
            should: 'parse fitzpatrick emojis',
            hex: 'f09f918cf09f8fbb',
        },
    ].forEach(config => {
        it(`should ${config.should}`, () => {
            expect(
                EmojiString.parse(Buffer.from(config.hex, 'hex').toString('utf8')).toString('utf8', true),
            ).to.equal(
                Buffer.from(config.hex, 'hex').toString('utf8'),
            )
        })
    })

})
