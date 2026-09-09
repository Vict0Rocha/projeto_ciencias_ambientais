/**
 * Efeitos sonoros de acerto/erro, sintetizados via Web Audio API — sem arquivos de áudio
 * externos, coerente com "nenhuma chamada de rede é feita pelo app" (ver app/README.md).
 * Quem chama decide se toca ou não (checar `somLigado` é responsabilidade de cada tela).
 */

type AudioContextCtor = typeof AudioContext;

function getAudioContextCtor(): AudioContextCtor | undefined {
  return window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
}

let ctx: AudioContext | undefined;

function getContext(): AudioContext | undefined {
  const Ctor = getAudioContextCtor();
  if (!Ctor) return undefined;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

/** Toca uma sequência de notas (arpejo) com envelope curto — cada nota some antes da próxima. */
function tocarArpejo(frequencias: number[], duracaoTotal: number, tipo: OscillatorType) {
  const audioCtx = getContext();
  if (!audioCtx) return;

  const agora = audioCtx.currentTime;
  const duracaoPorNota = duracaoTotal / frequencias.length;

  frequencias.forEach((frequencia, indice) => {
    const oscilador = audioCtx.createOscillator();
    const ganho = audioCtx.createGain();
    oscilador.type = tipo;
    oscilador.frequency.value = frequencia;

    const inicio = agora + indice * duracaoPorNota;
    const fim = inicio + duracaoPorNota;
    ganho.gain.setValueAtTime(0, inicio);
    ganho.gain.linearRampToValueAtTime(0.2, inicio + 0.01);
    ganho.gain.exponentialRampToValueAtTime(0.0001, fim);

    oscilador.connect(ganho);
    ganho.connect(audioCtx.destination);
    oscilador.start(inicio);
    oscilador.stop(fim);
  });
}

/** Arpejo maior ascendente (Dó5–Mi5–Sol5) — feedback de resposta certa. */
export function tocarAcerto(): void {
  tocarArpejo([523.25, 659.25, 783.99], 0.3, 'sine');
}

/** Duas notas curtas descendentes — feedback de resposta errada, sem ser agressivo. */
export function tocarErro(): void {
  tocarArpejo([311.13, 233.08], 0.26, 'triangle');
}
