import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest&{permissions:string[]} {
  return {
    name: 'Next.js App',
    description: 'Next.js App',
    start_url: '/',
    permissions:["history"]
  }
}