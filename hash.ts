import { hash } from "bcryptjs";
import * as bcrypt from "bcryptjs";

// deepcode ignore HardcodedSecret: this is number of round, not fixed salt
const ROUND = 12;

export function hashPassword(password: string): Promise<string> {
  return hash(password, ROUND);
}

export async function comparePassword(password: string, password_hash: string) {
  const isMatched: boolean = await bcrypt.compare(password, password_hash);
  return isMatched;
}
//
//export async function demo() {  demo from tutor beeno only for looping the has ten 10 times
//  for (let i = 0; i < 10; i++) {
//    console.time("hash once");
//    let hash = await hashPassword("password");
//    console.timeEnd("hash once");
//
//    console.log("length:", hash.length);

// console.time('compare once')
// let matched = await comparePassword({
//   password: 'password',
//   password_hash: hash,
// })
// console.timeEnd('compare once')

// console.log('matched?', matched)
// console.log('hash:', hash)
//  }
//}

//async function migrate() {
//  let result = await client.query(/* sql */ `
//select id, password
//from users
//where password_hash is null
//`)
//
//  for (let row of result.rows) {
//    let password_hash = await hashPassword(row.password)
//    await client.query(
//      /* sql */ `
//update users
//set password_hash = $1
//where id = $2
//`,
//      [password_hash, row.id],
//    )
//  }
//
//  await client.end()
//
//  console.log('done.')
//}
//
//// migrate().catch(e => console.error(e))
//
