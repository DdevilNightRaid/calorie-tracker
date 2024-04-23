import { createRouteHandler } from 'uploadthing/next';
import { ourFileRouter } from './core';
// Resource: https://docs.uploadthing.com/nextjs/appdir#create-a-nextjs-api-route-using-the-filerouter
// Copy paste (be careful with imports)



// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});