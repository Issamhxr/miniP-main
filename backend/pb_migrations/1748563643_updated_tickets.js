/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_178838402")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select3466037259",
    "maxSelect": 1,
    "name": "niveu",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Moenne",
      "Elvée",
      "Fable"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_178838402")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select3466037259",
    "maxSelect": 1,
    "name": "niveu",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "fable",
      "moyenne",
      "elvee"
    ]
  }))

  return app.save(collection)
})
