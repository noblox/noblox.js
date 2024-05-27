// Includes
const http = require("../util/http.js").func;

// Args
exports.required = ["universeId"];
exports.optional = ["page", "pageSize", "jar"];

// Docs
/**
 * 🔐 Returns the existing developer products in a specified game.
 * @category Game
 * @alias getDeveloperProducts
 * @param {number} universeId - The ID of the universe where you want to get the developer products
 * @param {number} [page=1] - Which page of developer products to return (pageSize is 50)
 * @param {number} [pageSize=50] - The amount of developer products to return per page
 * @returns {Promise<DeveloperProductsResult>}
 */

function getDeveloperProducts(jar, universeId, page, pageSize) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: `//apis.roblox.com/developer-products/v1/universes/${universeId}/developerproducts?pageNumber=${page}&pageSize=${pageSize}`,
      options: {
        method: "GET",
        jar,
        resolveWithFullResponse: true,
      },
    };
    return http(httpOpt)
      .then(function (res) {
        if (res.statusCode === 200) {
          const products = JSON.parse(res.body);
          if (products.length === 0) {
            reject(new Error("No developer products found"));
          }

          resolve({
            DeveloperProducts: products,
            PageSize: products.length,
          });
        } else {
          const body = res.body || {};
          if (body.errors && body.errors.length > 0) {
            const errors = body.errors.map((e) => {
              return e.message;
            });
            reject(new Error(`${res.statusCode} ${errors.join(", ")}`));
          } else {
            reject(
              new Error(
                `${res.statusCode} An error has occurred ${
                  res.body ? res.body : ""
                }`
              )
            );
          }
        }
      })
      .catch((error) => reject(error));
  });
}

// Define
exports.func = function (args) {
  return getDeveloperProducts(
    args.jar,
    args.universeId,
    args.page || 1,
    args.pageSize || 50
  );
};
