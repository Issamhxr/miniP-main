/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_284738925")

  // remove field
  collection.fields.removeById("relation1879066578")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_284738925")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_178838402",
    "hidden": false,
    "id": "relation1879066578",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "ticket_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
