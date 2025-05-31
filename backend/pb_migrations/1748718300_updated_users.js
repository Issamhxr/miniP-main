/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "select2703567427",
    "maxSelect": 1,
    "name": "verify",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "oui",
      "non"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("select2703567427")

  return app.save(collection)
})
