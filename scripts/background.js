const sounds = [
    '../sounds/21.wav',
    '../sounds/bababooey.wav',
    '../sounds/deeznuts.wav',
    '../sounds/error.wav',
    '../sounds/fart.wav',
    '../sounds/hamburger.wav',
    '../sounds/megalovania.wav',
    '../sounds/ominous_music.wav',
    '../sounds/ping.wav',
    '../sounds/plug.wav',
    '../sounds/rickroll.wav',
    '../sounds/sticky.wav',
    '../sounds/thwomp.wav',
    '../sounds/unplug.wav',
    '../sounds/villager.wav',
    '../sounds/vine_boom.wav',
    '../sounds/waa.wav',
    '../sounds/what_the_dog_doing.wav'
];

let curTimeout = null;

let enabled = true;
let maxInterval = 60000;
let volume = 0.5;

const storageCache = { };
const initStorageCache = chrome.storage.sync.get().then((items) => {
    Object.assign(storageCache, items);
    if (storageCache.options) {
        if (storageCache.options.interval != null) {
            maxInterval = storageCache.options.interval * 1000;
        }
        if (storageCache.options.volume != null) {
            volume = storageCache.options.volume / 100;
        }

        if (!storageCache.options.enable) {
            enabled = false;
            if (curTimeout)
                clearTimeout(curTimeout);
        } else {
            IntervalFunc();
        }
    } else {
        IntervalFunc();
    }
});

async function playSound(source, volume = 1) {
    try {
        await createOffScreen();
    } catch (e) {
        console.log("Offscreen already exists - continuing.")
    }
    await chrome.runtime.sendMessage({ play: { source, volume }});
}

async function createOffScreen() {
    if (await chrome.offscreen.hasDocument()) return;
    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'play audio'
    });
}

function playRandomSound() {
    let pick = sounds[Math.floor(Math.random() * sounds.length)];
    playSound(pick, volume);
}

function IntervalFunc() {
    if (!enabled) return;
    playRandomSound();
    console.log(volume);
    if (!enabled) return;
    console.log(maxInterval);
    curTimeout = setTimeout(() => {
        IntervalFunc();
    }, Math.floor(Math.random() * maxInterval));
}

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.options?.newValue) {
        enabled = Boolean(changes.options.newValue.enable);
        maxInterval = Number(changes.options.newValue.interval * 1000);
        volume = Number(changes.options.newValue.volume / 100);
        if (curTimeout != null) {
            clearTimeout(curTimeout);
            curTimeout = null
        }
        if (enabled) {
            IntervalFunc()
        }
    }
})

const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();