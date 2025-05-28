/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_178838402")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_284738925",
    "hidden": false,
    "id": "relation3997758973",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "components",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_178838402")

  // remove field
  collection.fields.removeById("relation3997758973")

  return app.save(collection)
})
