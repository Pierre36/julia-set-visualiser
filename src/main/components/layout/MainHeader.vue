<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch, type ComputedRef, type Ref } from "vue";
import Configuration from "@/models/Configuration";
import ComboBox, { type ComboBoxOption } from "@/components/primitives/ComboBox.vue";
import NotificationToast from "@/components/primitives/NotificationToast.vue";

const LOCALE_STORAGE_KEY = "custom_configuration";

const configuration = defineModel<Configuration>("configuration", { required: true });

const configurations: Ref<Record<string, Configuration>> = ref({});
configurations.value["DEFAULT"] = Configuration.defaultConfiguration();
const selectedConfigurationId = ref("DEFAULT");
const doNotTriggerWatch = ref(false);

const saveToast = useTemplateRef<InstanceType<typeof NotificationToast>>("saveToast");
const downloadToast = useTemplateRef<InstanceType<typeof NotificationToast>>("downloadToast");

const configurationOptions: ComputedRef<ComboBoxOption<string>[]> = computed(() =>
  Object.values(configurations.value).map((configuration) => ({
    id: configuration.id,
    text: configuration.name,
  }))
);

watch(configuration, switchToCustomConfiguration, { deep: true });

onMounted(async () => {
  await importConfigurations();
  await loadLocalStorageConfiguration();
});

async function importConfigurations() {
  const { default: json } = await import("@/configurations.json");
  json
    .map(Configuration.fromJSON)
    .filter((config) => config !== undefined)
    .forEach((config) => (configurations.value[config.id] = config));
}

async function loadLocalStorageConfiguration() {
  console.debug("[>>] Loading the local storage configuration...");
  const localConfigurationString = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (localConfigurationString == null) {
    console.debug("[OK] No local storage found");
    return;
  }

  let localConfiguration;
  try {
    localConfiguration = Configuration.fromJSON(JSON.parse(localConfigurationString));
    if (localConfiguration === undefined) throw new Error("JSON configuration is invalid");
  } catch (error) {
    console.error(`[KO] Could not load the local storage configuration: ${error}`);
    localStorage.removeItem(LOCALE_STORAGE_KEY);
    return;
  }

  localConfiguration.id = "CUSTOM";
  localConfiguration.name = "Custom";
  configurations.value["CUSTOM"] = localConfiguration;

  selectConfiguration("CUSTOM");

  console.debug("[OK] Local storage configuration loaded");
}

function selectConfiguration(id: string) {
  selectedConfigurationId.value = id;
  doNotTriggerWatch.value = true;
  configuration.value = configurations.value[id].copy();
}

function switchToCustomConfiguration() {
  if (!doNotTriggerWatch.value) {
    configuration.value.id = "CUSTOM";
    configuration.value.name = "Custom";
    configurations.value["CUSTOM"] = configuration.value.copy();
    selectedConfigurationId.value = "CUSTOM";
  }
  doNotTriggerWatch.value = false;
}

function saveConfiguration() {
  localStorage.setItem(LOCALE_STORAGE_KEY, JSON.stringify(configuration.value.toJSON()));
  configurations.value["CUSTOM"] = configuration.value.copy();
  saveToast.value?.show();
}

function downloadConfiguration() {
  console.debug("[>>] Downloading the current custom configuration...");

  var fileContent = JSON.stringify(configuration.value.toJSON());
  var blob = new Blob([fileContent], { type: "application/json" });
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "custom_configuration.json";
  a.click();
  window.URL.revokeObjectURL(url);
  downloadToast.value?.show();

  console.debug("[OK] Configuration downloaded");
}
</script>

<template>
  <header>
    <img class="logo" src="@/static/images/logo.svg" alt="logo" />
    <h1>Julia Set Visualizer</h1>
    <ComboBox
      id="configuration-combobox"
      label="Configuration"
      :options="configurationOptions"
      :selected="selectedConfigurationId"
      @update:selected="selectConfiguration"
    />
    <button
      class="icon-button"
      @click="saveConfiguration"
      :disabled="selectedConfigurationId !== 'CUSTOM'"
    >
      <svg viewBox="0 -960 960 960" role="img">
        <title>Save</title>
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M840-683v503q0 24-18 42t-42 18H180q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h503l157 157Zm-60 27L656-780H180v600h600v-476ZM479.765-245Q523-245 553.5-275.265q30.5-30.264 30.5-73.5Q584-392 553.735-422.5q-30.264-30.5-73.5-30.5Q437-453 406.5-422.735q-30.5 30.264-30.5 73.5Q376-306 406.265-275.5q30.264 30.5 73.5 30.5ZM233-584h358v-143H233v143Zm-53-72v476-600 124Z"
        />
      </svg>
    </button>
    <button
      class="icon-button"
      @click="downloadConfiguration"
      :disabled="selectedConfigurationId !== 'CUSTOM'"
    >
      <svg viewBox="0 -960 960 960" role="img">
        <title>Download</title>
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M480-343.539q-7.231 0-13.461-2.308-6.231-2.307-11.846-7.923L330.309-478.153q-8.923-8.923-8.807-20.884.115-11.961 8.807-21.269 9.308-9.307 21.384-9.615 12.077-.308 21.385 9l76.923 76.923v-306.001q0-12.769 8.615-21.384 8.615-8.616 21.384-8.616t21.384 8.616q8.615 8.615 8.615 21.384v306.001l76.923-76.923q8.923-8.923 21.192-8.808 12.269.116 21.577 9.423 8.692 9.308 8.999 21.077.308 11.769-8.999 21.076L505.307-353.77q-5.615 5.616-11.846 7.923-6.23 2.308-13.461 2.308ZM252.309-180.001q-30.308 0-51.308-21t-21-51.308v-78.461q0-12.769 8.616-21.384 8.615-8.615 21.384-8.615t21.384 8.615Q240-343.539 240-330.77v78.461q0 4.616 3.846 8.463 3.847 3.846 8.463 3.846h455.382q4.616 0 8.463-3.846 3.846-3.847 3.846-8.463v-78.461q0-12.769 8.615-21.384t21.384-8.615q12.769 0 21.384 8.615 8.616 8.615 8.616 21.384v78.461q0 30.308-21 51.308t-51.308 21H252.309Z"
        />
      </svg>
    </button>
    <NotificationToast ref="saveToast" text="Custom configuration saved!" />
    <NotificationToast ref="downloadToast" text="Custom configuration downloaded!" />
  </header>
</template>

<style scoped>
header {
  height: var(--header-height);
  min-width: var(--page-min-width);
  background-color: var(--gray-400);
  display: grid;
  grid-template-columns: var(--sideNav-width) auto minmax(min-content, 15rem) max-content max-content;
  align-items: center;
  gap: 0.75rem;
  padding-right: 0.5rem;
}

.logo {
  max-height: var(--header-height);
  padding: 0.5rem;
}
</style>
