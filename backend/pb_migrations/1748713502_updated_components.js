/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_284738925")

  // update collection data
  unmarshal({
    "deleteRule": ""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_284738925")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.userType = \"admin\""
  }, collection)

  return app.save(collection)
})
