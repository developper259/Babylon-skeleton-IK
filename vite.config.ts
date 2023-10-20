import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'

import basicSsl from '@vitejs/plugin-basic-ssl'
import fs from 'fs';
export default defineConfig(({ mode }) => {
    return {
        plugins: [react(), basicSsl()],
        https: {
            key: fs.readFileSync('./secrets/server.key'),
            cert: fs.readFileSync('./secrets/server.cer')
        },
        resolve: {
            alias: {
                'babylonjs': mode === 'development' ? 'babylonjs/babylon.max' : 'babylonjs'
            }
        },
        server: {
            port: 443,
            https: true,
            // Uncomment to allow access from network
            // (or use `npm run dev -- -- host=0.0.0.0`)
            host: '0.0.0.0',
            proxy: {
                '/mqtt': {
                    target: 'ws://localhost:8083', changeOrigin: true, secure: false,
                    ws: true,
                },
                '/avatar':
                    { target: 'https://localhost:3443', changeOrigin: true, secure: false },
                '/link':
                    { target: 'https://localhost:3443', changeOrigin: true, secure: false },
                '/demo':
                    { target: 'https://localhost:3443', changeOrigin: true, secure: false }

            }

        },

    }
})

/*export default defineConfig(({ command, mode }) => {
    return {
        plugins: [react()],
        resolve: {
            alias: {
                'babylonjs': mode === 'development' ? 'babylonjs/babylon.max' : 'babylonjs'
            }
        },
        server: {
            port: 3444,
            https: false,
            // Uncomment to allow access from network
            // (or use `npm run dev -- -- host=0.0.0.0`)
            //host: '0.0.0.0',
        },
        // plugins: [nodePolyfills()]

    };
});*/

