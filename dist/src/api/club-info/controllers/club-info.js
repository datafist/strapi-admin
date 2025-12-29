"use strict";
/**
 * club-info controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::club-info.club-info', ({ strapi }) => ({
    async find(ctx) {
        ctx.query = {
            ...ctx.query,
            populate: ctx.query.populate || { logo: true, socialLinks: true }
        };
        return super.find(ctx);
    }
}));
