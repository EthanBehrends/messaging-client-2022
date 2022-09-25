import { faker } from "@faker-js/faker"

const generateFakeUser = () => ({
    name: faker.name.findName(),
    email: faker.internet.email()
})

export function generateFakeUsers(num = 1) {
    console.log(num)
    return Array.from({length: num}).map(generateFakeUser)
}

const generateFakeMessageContent = () => faker.lorem.sentences()

export const generateFakeMessage = () => ({
    user: generateFakeUser(),
    content: generateFakeMessageContent(),
    date: new Date(Date.now() - faker.random.numeric(7))
})