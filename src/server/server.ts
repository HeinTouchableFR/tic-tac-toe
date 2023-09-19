import Fastify from 'fastify'
import FastifyStatic from '@fastify/static'
import FastifyWebsocket from '@fastify/websocket'
import FastifyView from '@fastify/view'
import {resolve} from "path";
import ejs from 'ejs'
import {readFileSync} from "node:fs";

const env = process.env.NODE_ENV as 'dev' | 'prod'
let manifest = {}

try {
    const manifestData = readFileSync('./public/assets/manifest.json')
    manifest = JSON.parse(manifestData.toLocaleString())
} catch (err) {
    console.log(err)
}

const fastify = Fastify({logger: true})
fastify.register(FastifyStatic, {
    root: resolve('./public')
})
fastify.register(FastifyView, {
    engine: {
        ejs: ejs
    }
})
fastify.register(FastifyWebsocket)

fastify.get('/', (_, res) => {
    res.view('/templates/index.ejs', {manifest, env})
})

fastify.listen({
    port: process.env.PORT ? parseInt(process.env.PORT) :  8000,
    host: '0.0.0.0'
}).catch((err) => {
    fastify.log.error(err)
    process.exit(1)
}).then(() => {
    fastify.log.info('Le serveur est démarré')
})