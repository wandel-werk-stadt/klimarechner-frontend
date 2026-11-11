// cancel : () -> void
//
// waiting : {
//   promise: void promise,
//   cancel: cancel
// }
//
// deferred : int -> waiting
export default function deferred(ms) {
    let cancel
    const promise = new Promise((resolve, reject) => {
        cancel = reject
        setTimeout(resolve, ms)
    })
    return { promise, cancel }
}
