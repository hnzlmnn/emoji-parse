import {EmojiString} from './emojiString'

export function choice(list: any[]) {
    return list[Math.floor(Math.random() * list.length)]
}

export function isEmoji(s: string) {

}

/***
 * Number to emoji string
 * @param {number} number The number
 * @return {string} A string representing the number using emoji names
 */
export function n2es(number: number) {
    return number.toString(10).split('').map((i) => {
        switch (i) {
            case '-':
                return ':heavy_minus_sign:'
            case '0':
                return ':zero:'
            case '1':
                return ':one:'
            case '2':
                return ':two:'
            case '3':
                return ':three:'
            case '4':
                return ':four:'
            case '5':
                return ':five:'
            case '6':
                return ':six:'
            case '7':
                return ':seven:'
            case '8':
                return ':eight:'
            case '9':
                return ':nine:'
            default:
                return i
        }
    }).join('')
}

/***
 * String to emoji string
 * @param {string} text The text
 * @return {string} A string representing the text using emoji names
 */
export function s2es(text: string) {
    return text.split('').map((i) => {
        switch (i.toLowerCase()) {
            case '-':
                return ':heavy_minus_sign:'
            case '+':
                return ':heavy_plus_sign:'
            case '*':
                return ':heavy_multiplication_x:'
            case '/':
                return ':heavy_division_sign:'
            case '0':
                return ':zero:'
            case '1':
                return ':one:'
            case '2':
                return ':two:'
            case '3':
                return ':three:'
            case '4':
                return ':four:'
            case '5':
                return ':five:'
            case '6':
                return ':six:'
            case '7':
                return ':seven:'
            case '8':
                return ':eight:'
            case '9':
                return ':nine:'
            case 'a':
            case 'b':
                return `:${i}:`
            default:
                return i
        }
    }).join('')
}

/**
 * Converts some emojis back to textual representation
 * @param {EmojiString} text The emoji string
 * @return {string} A string with known emojis replaced
 */
export function e2s(text: EmojiString) {
    return text.map<string>(emoji => {
        const c = emoji.toString('hex', false, false)
        switch (c) {
            // +
            case 'e29e95':
                return '2b'
            // -
            case 'e29e96':
                return '2d'
            // *
            case 'e29c96':
                return '2a'
            // /
            case 'e29e97':
                return '2f'
            // a
            case 'f09f85b0':
                return '61'
            // a
            case 'f09f85b1':
                return '62'
            default:
                return c
        }
    })
}


/**
 * Removes all non ascci charaters from parsed EmojiString and joins to string
 * @param chars
 */
export function eascii(chars: string[]) {
    const ascii = chars.map(c => parseInt(c, 16)).filter(c => c > 31 && c < 127)
    return String.fromCharCode(...ascii)
}

export function equation(text: string) {
    let parts
    if (text.includes('+')) {
        parts = text.split('+')
        return Number(parts[0]) + Number(parts[1])
    } else if (text.includes('-')) {
        parts = text.split('-')
        return Number(parts[0]) - Number(parts[1])
    } else if (text.includes('*')) {
        parts = text.split('*')
        return Number(parts[0]) * Number(parts[1])
    } else {
        return Number(text)
    }
}
