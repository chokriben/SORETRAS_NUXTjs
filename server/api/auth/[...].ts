// // file: ~/server/api/auth/[...].ts
// import CredentialsProvider from 'next-auth/providers/credentials'
// import { NuxtAuthHandler } from '#auth'
// export default NuxtAuthHandler({
//     // A secret string you define, to ensure correct encryption
//     secret: 'your-secret-here',
//     providers: [
//         // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
//         CredentialsProvider.default({
//             // The name to display on the sign in form (e.g. 'Sign in with...')
//             name: 'Credentials',
//             // The credentials is used to generate a suitable form on the sign in page.
//             // You can specify whatever fields you are expecting to be submitted.
//             // e.g. domain, username, password, 2FA token, etc.
//             // You can pass any HTML attribute to the <input> tag through the object.
//             // credentials: {
//             //     username: { label: 'Username', type: 'text', placeholder: '(hint: jsmith)' },
//             //     password: { label: 'Password', type: 'password', placeholder: '(hint: hunter2)' }
//             // },
//             async authorize(credentials: any, req: any) {

//                 const user = { id: '1', name: 'J Smith', email: 'firas@gmail.com', password: '21753762' }
//                 if (credentials?.email == user.email && credentials?.password == user.password) {
//                     return user
//                 } else {
//                     console.error('Warning: Malicious login attempt registered, bad credentials provided')
//                     return null
//                 }


//                 // let user = {
//                 //     email: credentials.email,
//                 //     password: credentials.password
//                 // };

//                 // const res = await fetch('https://api.srtk.com.tn/api/admin/login', {
//                 //     method: 'post',
//                 //     body: JSON.stringify(user)
//                 // })
//                 // let result = await res;
//                 // //console.log(result);
//                 // return result

//             }
//         })
//     ]
// })