/**
 * homepage controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::homepage.homepage', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: ctx.query.populate || { 
        heroImage: true, 
        featuredTeams: true, 
        featuredNews: true,
        seo: true 
      }
    };
    return super.find(ctx);
  }
}));
