/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "z9aszv5rcl3fh80",
    "created": "2024-06-08 19:02:01.275Z",
    "updated": "2024-06-08 19:02:01.275Z",
    "name": "token",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "0kpirokf",
        "name": "identifier",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "hnmt8hfk",
        "name": "token",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "oyab75pi",
        "name": "expires",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("z9aszv5rcl3fh80");

  return dao.deleteCollection(collection);
})
