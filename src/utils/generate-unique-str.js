import { customAlphabet } from "nanoid";

const generateuniquestring=(length)=>{

    const nanoid=customAlphabet("1234axez",length || 13)
    return nanoid()
}

export default generateuniquestring