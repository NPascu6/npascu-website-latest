import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import App from "../../components/app/App";
import { Provider } from "react-redux";
import store from "../../store/store";
import { HashRouter } from "react-router-dom";

describe("<App />", () => {
  const wrapper = render(
    <HashRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter>
  );

  test("App mounts properly", () => {
    expect(wrapper).toBeTruthy();
  });

  test("App has a top bar", () => {
    const topBar = wrapper.getByTestId("top-bar-test");
    expect(topBar).toBeTruthy();
  });
});
