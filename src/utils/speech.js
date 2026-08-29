export function speak(text, lang = "ar-SA", rate = 0.85) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find((v) => v.lang?.startsWith(lang.split("-")[0]));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

export function speakArabic(text) {
  speak(text, "ar-SA");
}

export function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  const chunks = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.start();
  return {
    recorder,
    stop: () =>
      new Promise((resolve) => {
        recorder.onstop = () => {
          stream.getTracks().forEach((t) => t.stop());
          const blob = new Blob(chunks, { type: "audio/webm" });
          resolve(URL.createObjectURL(blob));
        };
        recorder.stop();
      }),
  };
}
