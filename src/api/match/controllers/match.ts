/**
 * match controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::match.match', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: ctx.query.populate || { homeTeam: true, awayTeam: true, gallery: true }
    };
    return super.find(ctx);
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: ctx.query.populate || { homeTeam: true, awayTeam: true, gallery: true }
    };
    return super.findOne(ctx);
  }
}));
