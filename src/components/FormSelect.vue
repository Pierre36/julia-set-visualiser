<script>
export default {
  name: "FormSelect",
  props: {
    options: { type: Array, default: [] },
    selected: { type: String, default: null },
  },
  emits: ["update:selected"],
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    inputText() {
      if (this.selected == null) {
        return "";
      }
      try {
        return this.options.find((option) => option.id == this.selected).text;
      } catch (_) {
        return "";
      }
    },
    sortedOptions() {
      const sortedOptions = this.options.slice();
      sortedOptions.sort((optionA, optionB) => {
        if (optionA.id == this.selected) {
          return -1;
        } else if (optionB.id == this.selected) {
          return 1;
        } else {
          return 0;
        }
      });
      return sortedOptions;
    },
  },
  mounted() {
    document.addEventListener("click", this.closeMenuIfClickIsOutsideMenu);
  },
  methods: {
    closeMenuIfClickIsOutsideMenu(event) {
      if (this.isOpen) {
        this.isOpen =
          this.$refs.menu.contains(event.target) || this.$refs.select.contains(event.target);
      }
    },
    onClickOption(optionId) {
      this.$emit("update:selected", optionId);
      this.isOpen = false;
    },
  },
};
</script>

<template>
  <div class="wrapper">
    <button class="input select" ref="select" @click="isOpen = true">
      <span class="text">{{ inputText }}</span>
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" role="img">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M480-357q-6 0-11-2t-10-7L261-564q-8-8-7.5-21.5T262-607q10-10 21.5-8.5T304-606l176 176 176-176q8-8 21.5-9t21.5 9q10 8 8.5 21t-9.5 22L501-366q-5 5-10 7t-11 2Z"
        />
      </svg>
    </button>
    <ul ref="menu" class="dropdown menu" v-show="isOpen">
      <li
        v-for="option in sortedOptions"
        :key="option.id"
        :class="{ selected: option.id == selected }"
        @click="onClickOption(option.id)"
      >
        <span class="tick">
          <svg
            class="icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            role="img"
            v-if="option.id == selected"
          >
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M378-258q-6 0-11-2t-10-7L176-448q-9-9-9-22t9-22q9-9 21-9t21 9l160 160 363-363q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L399-267q-5 5-10 7t-11 2Z"
            />
          </svg>
        </span>
        <span>{{ option.text }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.wrapper {
  position: relative;
}

.select {
  display: flex;
  width: 100%;
  cursor: pointer;
  padding-left: 0.5rem;
  padding-block: 0.25rem;
}
.select .text {
  flex-grow: 1;
  margin: auto;
  overflow-x: auto;
}

.select .icon {
  min-width: 1.5rem;
  width: 1.5rem;
  margin: auto;
}

.dropdown {
  min-width: 100%;
  max-height: 20rem;
  overflow-y: auto;
  top: 0;
  left: 0;
  margin: 0;
}

.tick {
  visibility: hidden;
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 0.3rem;
}

.menu li.selected .tick {
  visibility: visible;
}
</style>
