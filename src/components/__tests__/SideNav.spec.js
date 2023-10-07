import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";

import SideNav from "../SideNav.vue";

describe("Render", () => {
  let props;
  let navItemHeight;
  let navHeight;

  beforeEach(() => {
    // Prepare props
    props = {
      currentPanel: "PANEL1",
      panels: [
        { id: "PANEL0", name: "Panel 0", icon: "icon0" },
        { id: "PANEL1", name: "Panel 1", icon: "icon1" },
        { id: "PANEL2", name: "Panel 2", icon: "icon2" },
      ],
      sidePanelCollapsed: false,
      label: "label",
    };

    // Mock clientHeight
    navItemHeight = 10;
    navHeight = 100;
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(() => navHeight);
    vi.spyOn(HTMLLIElement.prototype, "clientHeight", "get").mockImplementation(
      () => navItemHeight
    );
  });

  it("displays the nav correctly", () => {
    // Mount SideNav
    const sidenav = mount(SideNav, { props: props });

    // Find DOM elements
    const nav = sidenav.find("nav");
    const firstUL = nav.find("ul:nth-of-type(1)");

    // Check nav renders correctly
    expect(nav.attributes()["aria-label"]).toBe(props.label);
    expect(nav.attributes()["aria-orientation"]).toBe("vertical");
    expect(nav.attributes().tabindex).toBe("0");
    expect(firstUL.classes()).toContain("panels-expanded");
  });

  it("has nav items with role 'tab'", async () => {
    // Mount SideNav
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const listItems = nav.findAll("li:not(.more)");

    // Check each list item except moreListItem has a role of tab
    listItems.forEach((item) => {
      expect(item.attributes().role).toBe("tab");
    });
  });

  it("displays correctly all the tabs", async () => {
    // Mount SideNav
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const tabs = nav.findAll("[role='tab']");

    // Check the tabs are rendered correctly
    expect(tabs.length).toBe(props.panels.length);
    tabs.forEach((tab, index) => {
      expect(tab.attributes()["aria-selected"]).toBe((index === 1).toString());
      expect(tab.attributes()["aria-controls"]).toBe("#" + props.panels[index].id);
    });
  });

  it("displays correctly tab nav items", async () => {
    // Mount SideNav
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const tabs = nav.findAll("[role='tab']");

    // Check the tabs nav items are rendered correctly
    let button;
    let svg;
    tabs.forEach((tab, index) => {
      button = tab.find("button");
      expect(button.attributes().tabindex).toBe("-1");
      svg = button.find("svg");
      expect(svg.find("title").text()).toBe(props.panels[index].name);
      expect(svg.find("path").attributes().d).toBe(props.panels[index].icon);
    });
  });

  it("displays correctly the more button", async () => {
    // Mount SideNav
    navHeight = 0;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const moreButton = sidenav.find({ ref: "moreButton" });

    // Check the moreButton is displayed
    expect(moreButton.exists()).toBe(true);
    expect(moreButton.attributes().tabindex).toBe("-1");
    expect(moreButton.find("svg").find("title").text()).toBe("More");
  });

  it("displays correctly tab popup items", async () => {
    // Mount SideNav
    navHeight = 0;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const tabs = nav.findAll("[role='tab']");

    // Check the tabs popup items are rendered correctly
    tabs.forEach((tab, index) => {
      expect(tab.attributes()["aria-selected"]).toBe((index === 1).toString());
      expect(tab.attributes()["aria-controls"]).toBe("#" + props.panels[index].id);
      expect(tab.text()).toBe(props.panels[index].name);
    });
  });

  it("displays correctly when all tabs can be shown", async () => {
    // Mount SideNav
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const tabs = nav.findAll("[role='tab']");
    const moreListItem = sidenav.find({ ref: "moreListItem" });

    // Check the more list item is not visible
    expect(moreListItem.classes()).toContain("hidden");

    // Check all tabs are visible and nav items
    tabs.forEach((tab) => {
      expect(tab.isVisible()).toBe(true);
      expect(tab.classes()).toContain("nav-item");
    });
  });

  it("displays correctly when only some tabs can be shown", async () => {
    // Mount SideNav
    const nbVisibleTabs = 1;
    navHeight = (nbVisibleTabs + 1) * navItemHeight;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const navTabs = nav.findAll("[role='tab'].nav-item");
    const popupTabs = nav.findAll("[role='tab']:not(.nav-item)");
    const moreListItem = sidenav.find({ ref: "moreListItem" });

    // Check the more list item is visible
    expect(moreListItem.classes()).not.toContain("hidden");

    // Check the number of tabs in the nav and in the popup are correct
    expect(navTabs.length).toBe(nbVisibleTabs);
    expect(popupTabs.length).toBe(props.panels.length - nbVisibleTabs);
  });
});

describe("Interactions", () => {
  let props;
  let navItemHeight;
  let navHeight;

  beforeEach(() => {
    // Prepare props
    props = {
      currentPanel: "PANEL1",
      panels: [
        { id: "PANEL0", name: "Panel 0", icon: "icon0" },
        { id: "PANEL1", name: "Panel 1", icon: "icon1" },
        { id: "PANEL2", name: "Panel 2", icon: "icon2" },
      ],
      sidePanelCollapsed: false,
      label: "label",
    };

    // Mock clientHeight
    navItemHeight = 10;
    navHeight = 100;
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(() => navHeight);
    vi.spyOn(HTMLLIElement.prototype, "clientHeight", "get").mockImplementation(
      () => navItemHeight
    );
  });

  it("handles window resize properly", async () => {
    // Mount SideNav
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Simulate a window resize
    const newNbVisibleTabs = 2;
    navHeight = (newNbVisibleTabs + 1) * navItemHeight;
    window.dispatchEvent(new Event("resize"));
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const navTabs = nav.findAll("[role='tab'].nav-item");
    const popupTabs = nav.findAll("[role='tab']:not(.nav-item)");
    const moreListItem = sidenav.find({ ref: "moreListItem" });

    // Check the more list item is visible
    expect(moreListItem.classes()).not.toContain("hidden");

    // Check the number of tabs in the nav and in the popup are correct
    expect(navTabs.length).toBe(newNbVisibleTabs);
    expect(popupTabs.length).toBe(props.panels.length - newNbVisibleTabs);
  });

  it("displays the popup when clicking the moreButton", async () => {
    // Mount SideNav
    navHeight = 0;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const moreButton = sidenav.find({ ref: "moreButton" });
    const popup = nav.find(".popup");

    // Click the more button and check the popup is visible
    await moreButton.trigger("click");
    expect(popup.isVisible()).toBe(true);
  });

  it("emits an event when clicking on a tab", async () => {
    // Mount SideNav
    const nbVisibleTabs = 2;
    navHeight = (nbVisibleTabs + 1) * navItemHeight;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const navTabs = nav.findAll("[role='tab'].nav-item");
    const popupTabs = nav.findAll("[role='tab']:not(.nav-item)");

    // Click one of the nav tabs and check the event is emitted
    const clickedNavTab = 0;
    await navTabs[clickedNavTab].find("button").trigger("click");
    const expectedEvent = [[props.panels[clickedNavTab].id]];
    expect(sidenav.emitted()["update:currentPanel"]).toEqual(expectedEvent);

    // Click one of the popup tabs and check the event is emitted
    const clickedPopupTab = 0;
    await popupTabs[clickedPopupTab].trigger("click");
    expectedEvent.push([props.panels[nbVisibleTabs + clickedPopupTab].id]);
    expect(sidenav.emitted()["update:currentPanel"]).toEqual(expectedEvent);
  });

  it("emits an event when the side panels should be collapsed or expanded", async () => {
    // Mount SideNav with expanded side panels
    let sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    let nav = sidenav.find("nav");
    let tabs = nav.findAll("[role='tab']");

    // Click the selected nav tab and check the event is emitted
    await tabs[1].find("button").trigger("click");
    expect(sidenav.emitted()["update:sidePanelCollapsed"]).toEqual([[]]);

    // Mount SideNav with collapsed side panels
    props.sidePanelCollapsed = true;
    sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    nav = sidenav.find("nav");
    tabs = nav.findAll("[role='tab']");

    // Click a tab and check the event is emitted
    await tabs[0].find("button").trigger("click");
    expect(sidenav.emitted()["update:sidePanelCollapsed"]).toEqual([[]]);
  });

  it("focuses the selected element when focused in", async () => {
    // Mount SideNav
    const nbVisibleTabs = 2;
    navHeight = (nbVisibleTabs + 1) * navItemHeight;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const navTabs = nav.findAll("[role='tab'].nav-item");

    // Mock matches focus-visible
    const originalMatches = nav.element.matches;
    nav.element.matches = vi.fn((selectors) => {
      if (selectors == ":focus-visible") {
        return true;
      } else {
        return originalMatches(selectors);
      }
    });

    // Focus in and check the correct tab is focused
    await nav.trigger("focusin");
    expect(navTabs[1].classes()).toContain("focused");
  });

  it("does not focus the selected element when focused in if already in focus", async () => {
    // Mount SideNav
    const nbVisibleTabs = 2;
    navHeight = (nbVisibleTabs + 1) * navItemHeight;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const navTabs = nav.findAll("[role='tab'].nav-item");

    // Mock matches focus-visible
    const originalMatches = nav.element.matches;
    nav.element.matches = vi.fn((selectors) => {
      if (selectors == ":focus-visible") {
        return true;
      } else {
        return originalMatches(selectors);
      }
    });

    // Focus in
    await nav.trigger("focusin");

    // Change tab, focus in again and check the focus element is not the selected
    await nav.trigger("keyup.up");
    await nav.trigger("focusin");
    expect(navTabs[0].classes()).toContain("focused");
  });

  it("does not focus on the selected element when focused in without focus-visible", async () => {
    // Mount SideNav
    const nbVisibleTabs = 2;
    navHeight = (nbVisibleTabs + 1) * navItemHeight;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const navTabs = nav.findAll("[role='tab'].nav-item");

    // Mock matches focus-visible
    const originalMatches = nav.element.matches;
    nav.element.matches = vi.fn((selectors) => {
      if (selectors == ":focus-visible") {
        return false;
      } else {
        return originalMatches(selectors);
      }
    });

    // Focus in and check the correct tab is focused
    await nav.trigger("focusin");
    expect(navTabs[1].classes()).not.toContain("focused");
  });

  it("moves the focus up when pressing 'up'", async () => {
    // Mount SideNav
    const nbVisibleTabs = 2;
    navHeight = (nbVisibleTabs + 1) * navItemHeight;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const navTabs = nav.findAll("[role='tab'].nav-item");
    const popupTabs = nav.findAll("[role='tab']:not(.nav-item)");

    // Mock matches focus-visible
    const originalMatches = nav.element.matches;
    nav.element.matches = vi.fn((selectors) => {
      if (selectors == ":focus-visible") {
        return true;
      } else {
        return originalMatches(selectors);
      }
    });

    // Focus in
    await nav.trigger("focusin");

    // Press key "up" and check the focus is correct
    await nav.trigger("keyup.up");
    expect(navTabs[0].classes()).toContain("focused");
    await nav.trigger("keyup.up");
    expect(popupTabs[0].classes()).toContain("focused");
    await nav.trigger("keyup.up");
    expect(navTabs[1].classes()).toContain("focused");
  });

  it("moves the focus down when pressing 'down'", async () => {
    // Mount SideNav
    const nbVisibleTabs = 2;
    navHeight = (nbVisibleTabs + 1) * navItemHeight;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const navTabs = nav.findAll("[role='tab'].nav-item");
    const popupTabs = nav.findAll("[role='tab']:not(.nav-item)");

    // Mock matches focus-visible
    const originalMatches = nav.element.matches;
    nav.element.matches = vi.fn((selectors) => {
      if (selectors == ":focus-visible") {
        return true;
      } else {
        return originalMatches(selectors);
      }
    });

    // Focus in
    await nav.trigger("focusin");

    // Press key "down" and check the focus is correct
    await nav.trigger("keyup.down");
    expect(popupTabs[0].classes()).toContain("focused");
    await nav.trigger("keyup.down");
    expect(navTabs[0].classes()).toContain("focused");
    await nav.trigger("keyup.down");
    expect(navTabs[1].classes()).toContain("focused");
  });

  it("moves focus to first tab when pressing 'home'", async () => {
    // Mount SideNav
    const nbVisibleTabs = 2;
    navHeight = (nbVisibleTabs + 1) * navItemHeight;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const navTabs = nav.findAll("[role='tab'].nav-item");

    // Mock matches focus-visible
    const originalMatches = nav.element.matches;
    nav.element.matches = vi.fn((selectors) => {
      if (selectors == ":focus-visible") {
        return true;
      } else {
        return originalMatches(selectors);
      }
    });

    // Focus in
    await nav.trigger("focusin");

    // Press key "home" and check the focus is correct
    await nav.trigger("keyup.home");
    expect(navTabs[0].classes()).toContain("focused");
  });

  it("moves focus to last tab when pressing 'end'", async () => {
    // Mount SideNav
    const nbVisibleTabs = 2;
    navHeight = (nbVisibleTabs + 1) * navItemHeight;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const popupTabs = nav.findAll("[role='tab']:not(.nav-item)");

    // Mock matches focus-visible
    const originalMatches = nav.element.matches;
    nav.element.matches = vi.fn((selectors) => {
      if (selectors == ":focus-visible") {
        return true;
      } else {
        return originalMatches(selectors);
      }
    });

    // Focus in
    await nav.trigger("focusin");

    // Press key "end" and check the focus is correct
    await nav.trigger("keyup.end");
    expect(popupTabs[0].classes()).toContain("focused");
  });

  it("closes the popup when clicking outside of it", async () => {
    // Mount SideNav
    navHeight = 0;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const moreButton = sidenav.find({ ref: "moreButton" });
    const popup = nav.find(".popup");

    // Show popup
    await moreButton.trigger("click");

    // Click outside popup and check the popup is hidden
    document.dispatchEvent(new Event("click", { target: document }));
    await sidenav.vm.$nextTick();
    expect(popup.isVisible()).toBe(false);
  });

  it("closes the popup when leaving the sidenav", async () => {
    // Mount SideNav
    const nbVisibleTabs = 2;
    navHeight = (nbVisibleTabs + 1) * navItemHeight;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const popup = nav.find(".popup");

    // Mock matches focus-visible and focus-within
    const originalMatches = nav.element.matches;
    nav.element.matches = vi.fn((selectors) => {
      if (selectors == ":focus-visible") {
        return true;
      } else if (selectors == ":focus-within") {
        return false;
      } else {
        return originalMatches(selectors);
      }
    });

    // Focus in and focus last element
    await nav.trigger("focusin");
    await nav.trigger("keyup.end");

    // Focus out and check the popup is hidden
    await nav.trigger("focusout");
    expect(popup.isVisible()).toBe(false);
  });

  it("does not close the popup when focusing out the sidenav while still having focus within it", async () => {
    // Mount SideNav
    const nbVisibleTabs = 2;
    navHeight = (nbVisibleTabs + 1) * navItemHeight;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");
    const popup = nav.find(".popup");

    // Mock matches focus-visible and focus-within
    const originalMatches = nav.element.matches;
    nav.element.matches = vi.fn((selectors) => {
      if (selectors == ":focus-visible") {
        return true;
      } else if (selectors == ":focus-within") {
        return true;
      } else {
        return originalMatches(selectors);
      }
    });

    // Focus in and focus last element
    await nav.trigger("focusin");
    await nav.trigger("keyup.end");

    // Focus out and check the popup is hidden
    await nav.trigger("focusout");
    expect(popup.isVisible()).toBe(true);
  });

  it("emits an event when pressing 'enter' on a tab", async () => {
    // Mount SideNav
    const nbVisibleTabs = 2;
    navHeight = (nbVisibleTabs + 1) * navItemHeight;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");

    // Mock matches focus-visible
    const originalMatches = nav.element.matches;
    nav.element.matches = vi.fn((selectors) => {
      if (selectors == ":focus-visible") {
        return true;
      } else {
        return originalMatches(selectors);
      }
    });

    // Focus in and focus a nav tab
    await nav.trigger("focusin");
    await nav.trigger("keyup.home");

    // Press key 'enter' and check an event is emitted
    await nav.trigger("keyup.enter");
    expect(sidenav.emitted()["update:currentPanel"]).toEqual([[props.panels[0].id]]);
  });

  it("emits an event when pressing 'space' on a tab", async () => {
    // Mount SideNav
    const nbVisibleTabs = 2;
    navHeight = (nbVisibleTabs + 1) * navItemHeight;
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Find DOM elements
    const nav = sidenav.find("nav");

    // Mock matches focus-visible
    const originalMatches = nav.element.matches;
    nav.element.matches = vi.fn((selectors) => {
      if (selectors == ":focus-visible") {
        return true;
      } else {
        return originalMatches(selectors);
      }
    });

    // Focus in and focus a nav tab
    await nav.trigger("focusin");
    await nav.trigger("keyup.home");

    // Press key 'enter' and check an event is emitted
    await nav.trigger("keyup.space");
    expect(sidenav.emitted()["update:currentPanel"]).toEqual([[props.panels[0].id]]);
  });

  it("leaves no listeners on elements when unmounted", async () => {
    // Spy addEventListener for window and document
    const documentEventListeners = [];
    vi.spyOn(document, "addEventListener").mockImplementation((event, listener) => {
      documentEventListeners.push({ event: event, listener: listener });
    });
    const windowEventListeners = [];
    vi.spyOn(window, "addEventListener").mockImplementation((event, listener) => {
      windowEventListeners.push({ event: event, listener: listener });
    });

    // Mount SideNav
    const sidenav = mount(SideNav, { props: props });
    await sidenav.vm.$nextTick();

    // Spy removeEventListener for window and document
    const documentRemoveListener = vi.spyOn(document, "removeEventListener");
    const windowRemoveListener = vi.spyOn(window, "removeEventListener");

    // Unmount SideNav
    sidenav.unmount();

    // Check all events have been removed
    documentEventListeners.forEach((eventListener) => {
      expect(documentRemoveListener).toHaveBeenCalledWith(
        eventListener.event,
        eventListener.listener
      );
    });
    windowEventListeners.forEach((eventListener) => {
      expect(windowRemoveListener).toHaveBeenCalledWith(
        eventListener.event,
        eventListener.listener
      );
    });
  });
});
