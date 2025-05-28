/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_178838402")

  // update collection data
  unmarshal({
    "name": "tickets"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_178838402")

  // update collection data
  unmarshal({
    "name": "Tickets"
  }, collection)

  return app.save(collection)
})
