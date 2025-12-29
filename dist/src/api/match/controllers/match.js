"use strict";
/**
 * match controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::match.match', ({ strapi }) => ({
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
