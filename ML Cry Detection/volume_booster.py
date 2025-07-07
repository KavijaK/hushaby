from pydub import AudioSegment
import numpy as np

# ===== CONFIG =====
INPUT_FILE = "esp32_audio.wav"   # Your input file
OUTPUT_FILE = "10x_LOUDER.wav"   # Output file (10x volume)
# ==================

def boost_volume(input_file, output_file, gain=10):
    # Load audio
    audio = AudioSegment.from_wav(input_file)
    
    # Convert to numpy array (int16)
    samples = np.array(audio.get_array_of_samples(), dtype=np.int16)
    
    # Calculate original stats
    max_orig = np.max(np.abs(samples))
    print(f"🔊 Original max amplitude: {max_orig} / 32767")
    
    # Apply 10x gain (with clipping protection)
    boosted_samples = samples * gain
    boosted_samples = np.clip(boosted_samples, -32768, 32767).astype(np.int16)
    
    # Verify new stats
    max_new = np.max(np.abs(boosted_samples))
    print(f"🔊 New max amplitude: {max_new} / 32767")
    print(f"🔊 Applied gain: {gain}x (Actual: {max_new / max_orig:.1f}x)")
    
    # Save boosted audio
    boosted_audio = AudioSegment(
        boosted_samples.tobytes(),
        frame_rate=audio.frame_rate,
        sample_width=2,  # 16-bit
        channels=1       # Mono
    )
    boosted_audio.export(output_file, format="wav")
    print(f"✅ Volume 10x BOOSTED! Saved to: {output_file}")

if __name__ == "__main__":
    boost_volume(INPUT_FILE, OUTPUT_FILE, gain=10)