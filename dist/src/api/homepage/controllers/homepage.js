"use strict";
/**
 * homepage controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::homepage.homepage', ({ strapi }) => ({
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
