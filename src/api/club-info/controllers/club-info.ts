/**
 * club-info controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::club-info.club-info', ({ strapi }) => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: ctx.query.populate || { logo: true, socialLinks: true }
    };
    return super.find(ctx);
  }
}));
