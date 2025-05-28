/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_284738925")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.userType = \"worker\"",
    "deleteRule": "@request.auth.userType = \"worker\"",
    "listRule": "@request.auth.userType = \"worker\"",
    "updateRule": "@request.auth.userType = \"worker\"",
    "viewRule": "@request.auth.userType = \"worker\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_284738925")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
