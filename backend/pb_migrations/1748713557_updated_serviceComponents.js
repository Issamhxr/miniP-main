/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_701789547")

  // update collection data
  unmarshal({
    "name": "components"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_701789547")

  // update collection data
  unmarshal({
    "name": "serviceComponents"
  }, collection)

  return app.save(collection)
})
