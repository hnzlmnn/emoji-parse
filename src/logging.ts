import debug from 'debug'

export function getLogger(module: string) {
    const namespace = `emojisock${module && module.length > 0 ? ':' : ''}${module}`
    return debug(namespace)
}
