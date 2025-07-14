# project-root/scripts/json_schema_def.py

json_schema = {
    "type": "object",
    "properties": {
        "HomePage": {
            "type": "object",
            "properties": {"title": {"type": "string"}, "subtitle": {"type": "string"}},
            "required": ["title", "subtitle"],
        },
        "Categories": {
            "type": "object",
            "properties": {
                "greetings": {"type": "string"},
                "transport": {"type": "string"},
                "hotel": {"type": "string"},
                "dining": {"type": "string"},
                "directions": {"type": "string"},
                "shopping": {"type": "string"},
                "emergency": {"type": "string"},
                "basics": {"type": "string"},
            },
            "required": [
                "greetings",
                "transport",
                "hotel",
                "dining",
                "directions",
                "shopping",
                "emergency",
                "basics",
            ],
        },
        "LocaleLayout": {
            "type": "object",
            "properties": {
                "title": {"type": "string"},
                "description": {"type": "string"},
            },
            "required": ["title", "description"],
        },
        "Phrases": {
            "type": "object",
            "patternProperties": {
                "^[a-zA-Z_]+$": {  # Allows any string key for categories like "greetings", "transport"
                    "type": "object",
                    "properties": {
                        "title": {"type": "string"},
                        "items": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "id": {"type": "integer"},  # IDs are numbers
                                    "key": {"type": "string"},
                                    "base": {"type": "string"},
                                },
                                "required": ["id", "key", "base"],
                            },
                        },
                    },
                    "required": ["title", "items"],
                }
            },
            "additionalProperties": False,  # Ensures only defined pattern properties are allowed at this level
        },
    },
    "required": ["HomePage", "Categories", "LocaleLayout", "Phrases"],
    "additionalProperties": False,  # Ensures only defined top-level properties are allowed
}
