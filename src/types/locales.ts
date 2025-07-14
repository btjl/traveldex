export const jsonSchema = {
  "type": "object",
  "properties": {
    "HomePage": {
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "subtitle": { "type": "string" }
      },
      "required": ["title", "subtitle"]
    },
    "Categories": {
      "type": "object",
      "properties": {
        "greetings": { "type": "string" },
        "transport": { "type": "string" },
        "hotel": { "type": "string" },
        "dining": { "type": "string" },
        "directions": { "type": "string" },
        "shopping": { "type": "string" },
        "emergency": { "type": "string" },
        "basics": { "type": "string" }
      },
      "required": [
        "greetings",
        "transport",
        "hotel",
        "dining",
        "directions",
        "shopping",
        "emergency",
        "basics"
      ]
    },
    "LocaleLayout": {
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "description": { "type": "string" }
      },
      "required": ["title", "description"]
    },
    "Phrases": {
      "type": "object",
      "properties": {
        "greetings": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": { "type": "integer" },
                  "key": { "type": "string" },
                  "base": { "type": "string" }
                },
                "required": ["id", "key", "base"]
              }
            }
          },
          "required": ["title", "items"]
        },
        "transport": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": { "type": "integer" },
                  "key": { "type": "string" },
                  "base": { "type": "string" }
                },
                "required": ["id", "key", "base"]
              }
            }
          },
          "required": ["title", "items"]
        },
        "hotel": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": { "type": "integer" },
                  "key": { "type": "string" },
                  "base": { "type": "string" }
                },
                "required": ["id", "key", "base"]
              }
            }
          },
          "required": ["title", "items"]
        },
        "dining": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": { "type": "integer" },
                  "key": { "type": "string" },
                  "base": { "type": "string" }
                },
                "required": ["id", "key", "base"]
              }
            }
          },
          "required": ["title", "items"]
        },
        "directions": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": { "type": "integer" },
                  "key": { "type": "string" },
                  "base": { "type": "string" }
                },
                "required": ["id", "key", "base"]
              }
            }
          },
          "required": ["title", "items"]
        },
        "shopping": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": { "type": "integer" },
                  "key": { "type": "string" },
                  "base": { "type": "string" }
                },
                "required": ["id", "key", "base"]
              }
            }
          },
          "required": ["title", "items"]
        },
        "emergency": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": { "type": "integer" },
                  "key": { "type": "string" },
                  "base": { "type": "string" }
                },
                "required": ["id", "key", "base"]
              }
            }
          },
          "required": ["title", "items"]
        },
        "basics": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "items": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": { "type": "integer" },
                  "key": { "type": "string" },
                  "base": { "type": "string" }
                },
                "required": ["id", "key", "base"]
              }
            }
          },
          "required": ["title", "items"]
        }
      },
      "required": [
        "greetings",
        "transport",
        "hotel",
        "dining",
        "directions",
        "shopping",
        "emergency",
        "basics"
      ]
    }
  },
  "required": ["HomePage", "Categories", "LocaleLayout", "Phrases"]
}
