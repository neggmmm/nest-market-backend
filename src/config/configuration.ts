export default()=> ({
    port: process.env.PORT!,
    database:{
        host: process.env.DATABASE_HOST!,
        port: parseInt(process.env.DATABASE_PORT!, 10),
        username: process.env.DATABASE_USERNAME!,
        password: process.env.DATABASE_PASSWORD!,
        name: process.env.DATABASE_NAME!
    },
    jwt:{
        secretKey: process.env.JWT_SECRET_KEY!,
    }
})