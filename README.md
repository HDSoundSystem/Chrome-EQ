# 🎧 Audio EQ & Visualizer

A powerful and lightweight Chrome extension to sculpt your sound experience in real-time on any tab (YouTube, Spotify Web, Netflix, and more).

## 🚀 Installation (Developer Mode)

Since this extension is currently in development, it must be installed manually in Chrome:

1.  **Download the extension files** into a folder on your computer (e.g., `Documents/Audio-EQ-Extension`).
2.  Open Google Chrome and navigate to the extensions page by typing `chrome://extensions/` in the address bar.
3.  Enable **"Developer mode"** by toggling the switch in the top right corner.
4.  Click the **"Load unpacked"** button in the top left.
5.  Select the folder containing the extension files.
6.  The extension icon should appear in your toolbar (click the puzzle icon 🧩 to pin it).

---

## 🛠 Features

### 🎛 3-Band Equalizer
Fine-tune frequencies for a custom listening experience:
* **BASS:** Boost or cut low-end frequencies (250Hz).
* **MID:** Control middle frequencies, perfect for vocal clarity (1000Hz).
* **TREBLE:** Adjust the brilliance and detail of high frequencies (4000Hz).
* **RST Buttons:** Each slider has its own quick reset button.

### 📈 Dynamic Frequency Curve
A visualization screen (Canvas) displays the response curve of your equalizer in real-time. See exactly how you are shaping the audio signal.

### 🔊 Volume Control (Gain Boost)
A horizontal slider manages the tab's overall volume.
* **0% to 100%:** Volume reduction.
* **100% to 200%:** Volume boost for content that is too quiet.

### ⚡ Quick Functions
* **LOUDNESS:** An automatic mode that applies a **+6dB** boost to both bass and treble for a richer sound at lower volumes.
* **BYPASS:** Instantly disable all effects to compare original vs. processed sound without losing your slider settings.
* **START/STOP EQ:** Enable or disable tab audio capture with a single click.

### 🪟 Pop-out Mode ⇱
Click the icon in the top right to open the equalizer in a **standalone floating window**. This allows you to browse other tabs while keeping your audio controls always visible and accessible.

---

## ⚠️ Important Notes
* **Refresh:** After installing or updating the extension, refresh the audio tab (e.g., your YouTube video) so the capture can initialize.
* **Privacy:** This extension uses the `tabCapture` API. The audio stream is processed locally in your browser; no data is collected or transmitted to external servers.

---

## 📂 Project Structure
* `manifest.json`: Extension configuration.
* `popup.html`: User interface.
* `popup.js`: UI logic and curve rendering.
* `background.js`: Extension manager.
* `offscreen.html/js`: Audio processing engine (Web Audio API).
* `icons/`: Contains application and cursor icons.
