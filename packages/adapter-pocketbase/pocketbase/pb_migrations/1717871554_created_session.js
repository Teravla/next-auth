/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "276sjwlrwfkufte",
    "created": "2024-06-08 18:32:34.022Z",
    "updated": "2024-06-08 18:32:34.022Z",
    "name": "session",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "6gfg5dmv",
        "name": "userId",
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
        "id": "xvark93j",
        "name": "sessionToken",
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
        "id": "cdtkrkhb",
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
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("276sjwlrwfkufte");

  return dao.deleteCollection(collection);
})
