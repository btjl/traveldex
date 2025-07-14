# project-root/scripts/generatelocale.py

import os
import json
import argparse
from pathlib import Path
from google import genai
from google.genai import types, Client


from dotenv import load_dotenv

load_dotenv()

# Import the json_schema_def from the same directory
from json_schema_def import json_schema

# Define paths relative to the script's location
I18N_LOCALES_DIR = (
    Path(__file__).parent / ".." / "src" / "i18n" / "locales"
)  # Correct path for en.json


def get_source_content():
    """Reads and returns the content of en.json."""
    en_file_path = I18N_LOCALES_DIR / "en.json"
    if not en_file_path.exists():
        raise FileNotFoundError(f"Source content file not found: {en_file_path}")
    with open(en_file_path, "r", encoding="utf-8") as f:
        return json.load(f)


def construct_prompt(source_content: dict, target_language: str) -> str:
    """Constructs the prompt for the Generative AI model."""
    prompt = f"""You are a highly accurate and precise translator.

    Your task is to translate only the string values at these keys in the provided JSON:

    - HomePage: translate the values of "title" and "subtitle".
    - Categories: translate all string values.
    - LocaleLayout: translate the values of "title" and "description".
    - Phrases: for each phrase group (e.g., "greetings", "hotel"), translate:
      - the value of "title"
      - the "base" field inside each item in the "items" array

    Maintain the exact JSON structure, keys, and numeric IDs unchanged.

    Only translate the string values at the above keys.

    The translation should be in the target language: {target_language}

    Here is the JSON to translate:
    {json.dumps(source_content, indent=2, ensure_ascii=False)}
    """

    return prompt


async def translate_content(target_language: str):
    """
    Connects to Google GenAI, sends the translation prompt,
    and returns the translated JSON content.
    """
    api_key = os.getenv("GENAI_API_KEY")
    if not api_key:
        raise ValueError("GENAI_API_KEY environment variable is not set.")

    try:
        source_content_to_translate = get_source_content()
    except FileNotFoundError as e:
        print(f"Error: {e}")
        return None
    except json.JSONDecodeError:
        print(
            f"Error: Could not parse {I18N_LOCALES_DIR / 'en.json'}. Ensure it's valid JSON."
        )
        return None

    prompt = construct_prompt(source_content_to_translate, target_language)

    try:
        response = genai.Client(api_key=api_key).models.generate_content(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
            contents=[prompt],
        )
        # Accessing the text attribute of the content part
        translated_content_string = response.text
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return None

    if not translated_content_string:
        print("Translation failed: No response from model.")
        return None

    # Clean up markdown code block if present
    translated_content_string = translated_content_string.strip()
    if translated_content_string.startswith(
        "```json"
    ) and translated_content_string.endswith("```"):
        translated_content_string = translated_content_string[
            len("```json") : -len("```")
        ].strip()

    try:
        parsed_translated_content = json.loads(translated_content_string)
        return parsed_translated_content
    except json.JSONDecodeError as e:
        print(f"Error: Model returned invalid JSON. Could not parse response: {e}")
        print(f"Raw model response:\n{translated_content_string}")
        return None


def save_translated_content(translated_content: dict, target_language: str):
    """Saves the translated content to a JSON file."""
    output_file_path = I18N_LOCALES_DIR / f"{target_language}.json"

    with open(output_file_path, "w", encoding="utf-8") as f:
        json.dump(translated_content, f, indent=2, ensure_ascii=False)
    print(f"Successfully generated: {output_file_path}")


async def main():
    parser = argparse.ArgumentParser(
        description="Translate en.json content to a target language using Google Gemini API."
    )
    parser.add_argument(
        "target_language", help="The target language code (e.g., 'es', 'cn')."
    )
    args = parser.parse_args()

    print(f"Attempting to translate to: {args.target_language}")
    translated_content = await translate_content(args.target_language)

    if translated_content:
        save_translated_content(translated_content, args.target_language)
    else:
        print("Translation process failed.")


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
