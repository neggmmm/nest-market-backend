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
    },
    aws:{
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION,
        bucket: process.env.AWS_S3_BUCKET,
        productsPrefix: process.env.AWS_S3_PRODUCTS_PREFIX || 'products',
    }
})
