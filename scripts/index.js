const options = {
  enable: true,
  interval: 60,
  volume: 50
};
const optionsForm = document.getElementById("optionsForm");

optionsForm.enable.addEventListener("change", (event) => {
  options.enable = event.target.checked;
  chrome.storage.sync.set({ options });
});

optionsForm.interval.addEventListener("change", (event) => {
  options.interval = event.target.value;
  chrome.storage.sync.set({ options });
});

optionsForm.volume.addEventListener("change", (event) => {
  if (event.target.value > 100)
    event.target.value = 100;
  options.volume = event.target.value;
  chrome.storage.sync.set({ options });
});

const data = await chrome.storage.sync.get("options");
Object.assign(options, data.options);

chrome.storage.sync.set({ options });

optionsForm.enable.checked = Boolean(options.enable);
optionsForm.interval.value = Number(options.interval);
optionsForm.volume.value = Number(options.volume);
