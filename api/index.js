const strapi = require('@strapi/strapi');
const fs = require('fs');
const path = require('path');

let instance;

async function initStrapi() {
  if (!instance) {
    try {
      instance = strapi({ 
        distDir: path.resolve(__dirname, '../dist'),
        autoReload: false,
        serveAdminPanel: true
      });
      await instance.load();
      await instance.server.mount();
    } catch (error) {
      console.error('Error initializing Strapi:', error);
      throw error;
    }
  }
  return instance;
}

module.exports = async (req, res) => {
  try {
    const strapiInstance = await initStrapi();
    strapiInstance.server.app(req, res);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
};
