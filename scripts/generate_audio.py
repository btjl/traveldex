# project-root/scripts/generate_tts_audio.py

import os
import json
import asyncio
from pathlib import Path
from google.cloud import texttospeech
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

# --- Configuration ---
# Paths are relative to the script's location
SCRIPT_DIR = Path(__file__).parent
I18N_LOCALES_DIR = Path(__file__).parent / ".." / "src" / "i18n" / "locales"
PUBLIC_AUDIO_DIR = SCRIPT_DIR.parent / "public" / "audio"

# Define the supported locales based on your i18n setup and existing message files
# This list should match the locales for which you want to generate audio.
SUPPORTED_LOCALES = ["en", "cn", "ms", "ta"]  # Add or remove locales as needed

# Initialize Google Cloud Text-to-Speech Client
tts_client = texttospeech.TextToSpeechClient()

# --- Voice Mapping ---
# Map your locale codes to appropriate Google Cloud Text-to-Speech language codes and voice names.
# You can find a list of available voices here:
# https://cloud.google.com/text-to-speech/docs/voices
# We will target LINEAR16 (WAV) audio encoding for consistency with your front-end.
VOICE_MAP = {
    "en": {
        "language_code": "en-US",
        "voice_name": "en-US-Chirp3-HD-Erinome",
        "audio_encoding": texttospeech.AudioEncoding.LINEAR16,
    },
    "cn": {
        "language_code": "cmn-CN",
        "voice_name": "cmn-CN-Chirp3-HD-Erinome",
        "audio_encoding": texttospeech.AudioEncoding.LINEAR16,
    },
    "ms": {  # Malay (ms - ISO 639-1 code)
        "language_code": "ms-MY",  # Malay (Malaysia)
        "voice_name": "ms-MY-Wavenet-A",
        "audio_encoding": texttospeech.AudioEncoding.LINEAR16,
    },
    "ta": {  # Tamil (ta - ISO 639-1 code)
        "language_code": "ta-IN",  # Tamil (India)
        "voice_name": "ta-IN-Chirp3-HD-Erinome",
        "audio_encoding": texttospeech.AudioEncoding.LINEAR16,
    },
}


async def generate_audio_for_phrase(
    text: str,
    locale: str,
    category_slug: str,
    item_key: str,
):
    """
    Generates TTS audio for a given text using Google Cloud Text-to-Speech
    and saves it to the specified path. Skips if the file already exists.
    """
    category_audio_dir = PUBLIC_AUDIO_DIR / locale / category_slug
    category_audio_dir.mkdir(
        parents=True, exist_ok=True
    )  # Ensure category directory exists

    audio_file_name = f"{item_key}.wav"  # Output will be .wav
    audio_file_path = category_audio_dir / audio_file_name

    # Check if file already exists
    if audio_file_path.exists():
        print(
            f"Skipping existing audio: {audio_file_path.relative_to(PUBLIC_AUDIO_DIR)}"
        )
        return

    # Get voice configuration for the current locale
    voice_config = VOICE_MAP.get(locale)
    if not voice_config:
        print(
            f"Warning: No voice configuration found for locale '{locale}'. Skipping TTS for '{text}'.",
            file=os.sys.stderr,
        )
        return

    try:
        print(
            f'Generating audio for: "{text}" ({locale}/{category_slug}/{item_key})...'
        )

        # Configure the input text
        synthesis_input = texttospeech.SynthesisInput(text=text)

        # Configure the voice parameters
        voice_params = texttospeech.VoiceSelectionParams(
            language_code=voice_config["language_code"],
            name=voice_config["voice_name"],
        )

        # Configure the audio output
        audio_config = texttospeech.AudioConfig(
            audio_encoding=voice_config["audio_encoding"],
        )

        # Perform the speech synthesis
        response = tts_client.synthesize_speech(
            input=synthesis_input,
            voice=voice_params,
            audio_config=audio_config,
        )

        # The response's audio_content is binary data
        with open(audio_file_path, "wb") as out_file:
            out_file.write(response.audio_content)

        print(
            f"Successfully generated: {audio_file_path.relative_to(PUBLIC_AUDIO_DIR)}"
        )

    except Exception as e:
        print(
            f'Failed to generate TTS for "{text}" ({locale}/{category_slug}/{item_key}): {e}',
            file=os.sys.stderr,
        )


async def main():
    """
    Main function to orchestrate TTS audio generation for all locales and phrases.
    """
    print("Starting batch TTS audio generation...")

    # Ensure the base public/audio directory exists
    PUBLIC_AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    tasks = []
    for locale in SUPPORTED_LOCALES:
        message_file_path = I18N_LOCALES_DIR / f"{locale}.json"
        if not message_file_path.exists():
            print(
                f"Warning: Message file not found for locale {locale}: {message_file_path}. Skipping.",
                file=os.sys.stderr,
            )
            continue

        try:
            with open(message_file_path, "r", encoding="utf-8") as f:
                messages = json.load(f)
        except json.JSONDecodeError:
            print(
                f"Error: Could not parse {message_file_path}. Ensure it's valid JSON. Skipping.",
                file=os.sys.stderr,
            )
            continue

        phrases = messages.get("Phrases")

        if not phrases:
            print(
                f"Warning: No 'Phrases' section found in {locale}.json. Skipping TTS for this locale.",
                file=os.sys.stderr,
            )
            continue

        for category_slug, category_data in phrases.items():
            if not isinstance(category_data, dict) or not isinstance(
                category_data.get("items"), list
            ):
                print(
                    f"Warning: Category '{category_slug}' in {locale}.json does not have a valid 'items' array. Skipping.",
                    file=os.sys.stderr,
                )
                continue

            for item in category_data["items"]:
                if (
                    not isinstance(item, dict)
                    or "key" not in item
                    or "base" not in item
                    or not isinstance(item["base"], str)
                ):
                    print(
                        f"Warning: Skipping malformed item in {locale}/{category_slug}: {item}",
                        file=os.sys.stderr,
                    )
                    continue

                # Only synthesize the 'base' foreign language text
                tasks.append(
                    generate_audio_for_phrase(
                        item["base"],
                        locale,
                        category_slug,
                        item["key"],
                    )
                )

    # Run all tasks concurrently
    await asyncio.gather(*tasks)

    print("Batch TTS audio generation complete.")


if __name__ == "__main__":
    asyncio.run(main())
