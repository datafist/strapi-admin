"use strict";
/**
 * news controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::news-article.news-article', ({ strapi }) => ({
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
