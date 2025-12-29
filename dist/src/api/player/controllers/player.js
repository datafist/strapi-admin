"use strict";
/**
 * player controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
exports.default = strapi_1.factories.createCoreController('api::player.player', ({ strapi }) => ({
    async find(ctx) {
        ctx.query = {
            ...ctx.query,
            populate: ctx.query.populate || { image: true, teams: true }
        };
        return super.find(ctx);
    },
    async findOne(ctx) {
        ctx.query = {
            ...ctx.query,
            populate: ctx.query.populate || { image: true, teams: true }
        };
        return super.findOne(ctx);
    }
}));
