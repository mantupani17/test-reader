require('./Test')(['PROMISE'])
// setTimeout(() => {
//     console.log('Timeout 1 happened')
//     setTimeout(() => {
//       console.log('Timeout 2 happened')
//     }, 0)
//     console.log('Registered timeout 2')
//   }, 0)
//   console.log('Registered timeout 1')

// clearTimeout(
//     setTimeout(() => {
//       console.log('Timeout happened')
//     }, 0)
//   )
//   console.log('Registered timeout')

Promise.resolve()
console.log('Registered Promise.resolve')