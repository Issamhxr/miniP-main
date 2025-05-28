/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_178838402")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.userType = \"admin\"",
    "deleteRule": "@request.auth.userType = \"admin\"",
    "listRule": "@request.auth.userType = \"admin\"",
    "updateRule": "@request.auth.userType = \"admin\"",
    "viewRule": "@request.auth.userType = \"admin\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_178838402")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.userType = \"worker\"",
    "deleteRule": "@request.auth.userType = \"worker\"",
    "listRule": "@request.auth.userType = \"worker\"",
    "updateRule": "@request.auth.userType = \"worker\"",
    "viewRule": "@request.auth.userType = \"worker\""
  }, collection)

  return app.save(collection)
})
