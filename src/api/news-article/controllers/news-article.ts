/**
 * news controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::news-article.news-article', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: ctx.query.populate || { coverImage: true, seo: true }
    };
    return super.find(ctx);
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: ctx.query.populate || { coverImage: true, seo: true }
    };
    return super.findOne(ctx);
  }
}));
