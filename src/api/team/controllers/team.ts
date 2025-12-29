/**
 * team controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::team.team', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: ctx.query.populate || { image: true, players: true, coaches: true }
    };
    return super.find(ctx);
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: ctx.query.populate || { image: true, players: true, coaches: true }
    };
    return super.findOne(ctx);
  }
}));
