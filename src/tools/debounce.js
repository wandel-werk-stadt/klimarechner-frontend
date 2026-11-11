import deferred from './deferred'

// 'a task : (...any -> 'a)
//
// debounce : ('a task, int) -> ('a task, cancel)
export default function debounce(task, ms) {
    let t = { promise: null, cancel: (_) => void 0 }
    return {
        fn: async (...args) => {
            try {
                t.cancel()
                t = deferred(ms)
                await t.promise
                await task(...args)
            } catch (_) {
                /* prevent memory leak */
            }
        },
        cancel: (_) => t.cancel(),
    }
}

// function debounce(func, delay) {
//     let timeoutId;
//     return function(...args) {
//         clearTimeout(timeoutId);
//         timeoutId = setTimeout(() => {
//             func.apply(this, args);
//         }, delay);
//     };
// }
